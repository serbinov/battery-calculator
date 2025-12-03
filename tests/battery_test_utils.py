import math
from math import isfinite


def convert_time_to_seconds(time, unit):
    mapping = {
        'us': time / 1_000_000,
        'ms': time / 1000,
        's': time,
        'min': time * 60,
        'h': time * 3600
    }
    return mapping.get(unit, time)


def convert_current_to_ma(current, unit):
    if unit == 'ua':
        return current / 1000.0
    if unit == 'ma':
        return current
    if unit == 'a':
        return current * 1000.0
    return current


def calculate(capacity_mAh, voltage_start, voltage_end, r_percent_per_month,
              active_time, active_time_unit, active_current, active_current_unit,
              sleep_time, sleep_time_unit, sleep_current, sleep_current_unit,
              calendar_fade_percent_per_year=0.0, internal_resistance_ohm=0.0, shelf_life_years=100):
    avg_voltage = (voltage_start + voltage_end) / 2.0

    active_sec = convert_time_to_seconds(active_time, active_time_unit)
    sleep_sec = convert_time_to_seconds(sleep_time, sleep_time_unit)
    total_time = active_sec + sleep_sec

    active_current_ma = convert_current_to_ma(active_current, active_current_unit)
    sleep_current_ma = convert_current_to_ma(sleep_current, sleep_current_unit)

    if total_time == 0:
        raise ValueError('total_time (active + sleep) must be > 0')

    avg_current_ma = (active_current_ma * active_sec + sleep_current_ma * sleep_sec) / total_time

    # energy per cycle (Wh)
    active_energy_wh = (active_current_ma / 1000.0) * avg_voltage * (active_sec / 3600.0)
    sleep_energy_wh = (sleep_current_ma / 1000.0) * avg_voltage * (sleep_sec / 3600.0)
    total_energy_cycle_wh = active_energy_wh + sleep_energy_wh

    # Some helpers / constants used for simulation
    hours_per_month = 24.0 * 30.0
    max_hours = shelf_life_years * 24.0 * 365.0

    # battery life WITHOUT self-discharge should be the pure-load estimate (C / Iavg)
    # keep the previous staged behaviour available in battery_life_hours_without_staged
    # for backwards compatibility / analysis.
    if avg_current_ma <= 0:
        battery_life_hours_without = float('inf')
    else:
        battery_life_hours_without = capacity_mAh / avg_current_ma
    battery_life_hours_without_staged = battery_life_hours_without
    # if pure-load lifetime exceeds shelf life, run the staged simulation
    if battery_life_hours_without >= max_hours:
            # normal self-discharge uses r_percent_per_month
            r_normal = max(0.0, r_percent_per_month) / 100.0
            lam_normal = -math.log(1.0 - r_normal) / hours_per_month if r_normal > 0 else 0.0

            rem = capacity_mAh
            elapsed = 0.0
            dt_h = 1.0
            # simulate up to shelf life
            while elapsed < max_hours:
                if lam_normal > 0:
                    rem *= math.exp(-lam_normal * dt_h)
                rem -= avg_current_ma * dt_h
                elapsed += dt_h
                if rem <= 0:
                    rem = 0
                    break

            if rem <= 0:
                battery_life_hours_without_staged = min(elapsed, max_hours)
            else:
                # switch to post-shelf accelerated self-discharge (default 20%/month)
                post_rate = 20.0
                r_post = max(0.0, post_rate) / 100.0
                lam_post = -math.log(1.0 - r_post) / hours_per_month if r_post > 0 else 0.0
                th = 0.0
                safety_hours = 24.0 * 365.0 * 100.0
                dtp = 24.0
                while rem > 0 and th < safety_hours:
                    if lam_post > 0:
                        rem *= math.exp(-lam_post * dtp)
                    rem -= avg_current_ma * dtp
                    th += dtp
                    if rem <= 0:
                        rem = 0
                        break
                battery_life_hours_without_staged = max_hours + th

    # energies for without (pure-load)
    cycles_without = battery_life_hours_without * 3600.0 / total_time if isfinite(battery_life_hours_without) else float('inf')
    active_energy_total_without_wh = active_energy_wh * cycles_without if isfinite(cycles_without) else float('inf')
    sleep_energy_total_without_wh = sleep_energy_wh * cycles_without if isfinite(cycles_without) else float('inf')
    total_energy_life_without_wh = (capacity_mAh / 1000.0) * avg_voltage

    # with self-discharge - use daily step simulation including optional calendar fade and internal resistance
    r_fraction = max(0.0, r_percent_per_month) / 100.0  # clamp negative rates to zero
    hours_per_month = 24.0 * 30.0

    # exponential continuous self-discharge per hour
    lam_self = -math.log(1.0 - r_fraction) / hours_per_month if r_fraction > 0 else 0.0
    lam_calendar = -math.log(1.0 - max(0.0, calendar_fade_percent_per_year) / 100.0) if calendar_fade_percent_per_year > 0 else 0.0

    # simulate in hourly steps (dt_hours) for better accuracy
    dt_hours = 1.0
    max_hours = shelf_life_years * 24.0 * 365.0
    if capacity_mAh <= 0:
        battery_life_hours_with = 0
        capacity_with_mAh = 0
        total_energy_life_with_wh = 0
        cycles_with = 0
        active_energy_total_with_wh = 0
        sleep_energy_total_with_wh = 0
        return {
            'avg_voltage': avg_voltage,
            'avg_current_ma': avg_current_ma,
            'battery_life_hours_without': battery_life_hours_without,
            'battery_life_hours_with': battery_life_hours_with,
            'total_energy_life_without_wh': total_energy_life_without_wh,
            'total_energy_life_with_wh': total_energy_life_with_wh,
            'active_energy_total_with_wh': active_energy_total_with_wh,
            'sleep_energy_total_with_wh': sleep_energy_total_with_wh,
            'total_energy_cycle_wh': total_energy_cycle_wh
        }
    remaining = capacity_mAh
    initial_capacity = capacity_mAh
    t_hours = 0.0
    max_hours = shelf_life_years * 24.0 * 365.0

    def ocv_from_soc(soc):
        return voltage_end + soc * (voltage_start - voltage_end)

    while True:
        if not math.isfinite(t_hours) or t_hours >= max_hours:
            t_hours = max_hours
            break
        if lam_self > 0:
            remaining *= math.exp(-lam_self * dt_hours)
        if lam_calendar > 0:
            remaining *= math.exp(-lam_calendar * (dt_hours / (24.0 * 365.0)))
        remaining -= avg_current_ma * dt_hours
        if remaining <= 0:
            remaining = 0
            t_hours += dt_hours
            break
        soc = remaining / initial_capacity
        ocv = ocv_from_soc(max(0.0, min(1.0, soc)))
        loaded_voltage = ocv - (avg_current_ma / 1000.0) * internal_resistance_ohm
        if loaded_voltage <= voltage_end:
            t_hours += dt_hours
            break
        t_hours += dt_hours

    battery_life_hours_with = t_hours

    # if capped by shelf life, continue simulating post-shelf depletion using accelerated self-discharge
    capped_by_shelf = battery_life_hours_with >= max_hours - 1e-9
    post_shelf_months = None
    if capped_by_shelf:
        rem = remaining
        dt_h = 24.0
        th = 0.0
        safety_hours = 24.0 * 365.0 * 100.0
        post_rate = 20.0
        r_post = max(0.0, post_rate) / 100.0
        lam_post = -math.log(1.0 - r_post) / hours_per_month if r_post > 0 else 0.0
        if rem > 0 and lam_post > 0:
            while rem > 0 and th < safety_hours:
                # Apply accelerated post-shelf self-discharge
                rem *= math.exp(-lam_post * dt_h)
                # Also subtract the device load during the post-shelf period to match the
                # 'without' path — both paths should account for active device consumption.
                rem -= avg_current_ma * dt_h
                th += dt_h
                if rem <= 0:
                    rem = 0
                    break
            post_shelf_months = th / 24.0 / 30.0
            battery_life_hours_with = max_hours + th
        elif rem <= 0:
            post_shelf_months = 0.0

    capacity_with_mAh = min(capacity_mAh, avg_current_ma * battery_life_hours_with) if isfinite(battery_life_hours_with) else capacity_mAh
    total_energy_life_with_wh = (capacity_with_mAh / 1000.0) * avg_voltage

    cycles_with = battery_life_hours_with * 3600.0 / total_time if isfinite(battery_life_hours_with) else float('inf')
    active_energy_total_with_wh = active_energy_wh * cycles_with if isfinite(cycles_with) else float('inf')
    sleep_energy_total_with_wh = sleep_energy_wh * cycles_with if isfinite(cycles_with) else float('inf')

    return {
        'avg_voltage': avg_voltage,
        'avg_current_ma': avg_current_ma,
        'battery_life_hours_without': battery_life_hours_without,
        'battery_life_hours_without_staged': battery_life_hours_without_staged,
        'battery_life_hours_with': battery_life_hours_with,
        'total_energy_life_without_wh': total_energy_life_without_wh,
        'total_energy_life_with_wh': total_energy_life_with_wh,
        'active_energy_total_with_wh': active_energy_total_with_wh,
        'sleep_energy_total_with_wh': sleep_energy_total_with_wh,
        'total_energy_cycle_wh': total_energy_cycle_wh,
        'capped_by_shelf': capped_by_shelf,
        'post_shelf_months': post_shelf_months
    }
