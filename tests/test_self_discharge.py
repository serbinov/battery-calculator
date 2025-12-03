import math
from battery_test_utils import calculate


def almost_equal(a, b, tol=1e-6):
    if math.isfinite(a) and math.isfinite(b):
        return abs(a - b) <= tol
    return a == b


def test_zero_self_discharge():
    # if self-discharge is 0, life_with should equal life_without
    r = calculate(capacity_mAh=1000, voltage_start=1.2, voltage_end=1.0, r_percent_per_month=0.0,
                  active_time=1, active_time_unit='s', active_current=1, active_current_unit='ma',
                  sleep_time=1, sleep_time_unit='s', sleep_current=1, sleep_current_unit='ma')

    assert almost_equal(r['battery_life_hours_without'], r['battery_life_hours_with'])


def test_tiny_load_high_self_discharge():
    # very small load should be limited by self-discharge
    r = calculate(capacity_mAh=1000, voltage_start=1.2, voltage_end=1.0, r_percent_per_month=6.0,
                  active_time=1, active_time_unit='s', active_current=0.001, active_current_unit='ma',
                  sleep_time=1, sleep_time_unit='s', sleep_current=0.001, sleep_current_unit='ma')

    # Without self-discharge life would be enormous; with self-discharge it must be reasonable (< 1000 months)
    # with the new staged behaviour 'without' can now include normal self-discharge and
    # post-shelf accelerated self-discharge, so it should be greater or equal to the 'with' result
    assert r['battery_life_hours_without'] >= r['battery_life_hours_with']
    assert r['battery_life_hours_with'] < 1000 * 24 * 30


def test_high_load_low_self_discharge():
    # with high load the life is dominated by load
    r = calculate(capacity_mAh=2500, voltage_start=1.5, voltage_end=1.2, r_percent_per_month=0.166,
                  active_time=10, active_time_unit='min', active_current=50, active_current_unit='ma',
                  sleep_time=24*60-10, sleep_time_unit='min', sleep_current=0.1, sleep_current_unit='ma')

    # Life with and without should be close because self-discharge small relative to load
    without_months = r['battery_life_hours_without'] / 24 / 30
    with_months = r['battery_life_hours_with'] / 24 / 30
    assert abs(without_months - with_months) < 0.2  # within ~0.2 months


def test_zero_capacity():
    # Zero capacity -> immediate death
    r = calculate(capacity_mAh=0, voltage_start=1.5, voltage_end=1.0, r_percent_per_month=1,
                  active_time=1, active_time_unit='s', active_current=1, active_current_unit='ma',
                  sleep_time=1, sleep_time_unit='s', sleep_current=1, sleep_current_unit='ma')

    assert r['battery_life_hours_without'] == 0
    assert r['battery_life_hours_with'] == 0


def test_negative_self_discharge_rate():
    # negative self-discharge (invalid) treated as zero (shouldn't decrease life)
    r = calculate(capacity_mAh=1000, voltage_start=3.0, voltage_end=2.5, r_percent_per_month=-5,
                  active_time=1, active_time_unit='s', active_current=1, active_current_unit='ma',
                  sleep_time=1, sleep_time_unit='s', sleep_current=1, sleep_current_unit='ma')

    # treat negative as zero - life_with should be approximately equal to life_without
    assert almost_equal(r['battery_life_hours_without'], r['battery_life_hours_with'])


def test_user_case_aaa_low_current():
    # replicates the user's example: AAA 1000mAh with ~5 uA average current
    r = calculate(capacity_mAh=1000, voltage_start=1.5, voltage_end=1.2, r_percent_per_month=0.166,
                  active_time=5, active_time_unit='us', active_current=5, active_current_unit='ua',
                  sleep_time=5, sleep_time_unit='us', sleep_current=5, sleep_current_unit='ua')

    # with self-discharge lifetime should never be greater than without
    assert r['battery_life_hours_with'] <= r['battery_life_hours_without']


def test_without_is_pure_load():
    # pure-load check: avg_current = 1 mA -> life_without should equal capacity (hours)
    r = calculate(capacity_mAh=100, voltage_start=1.5, voltage_end=1.2, r_percent_per_month=0.0,
                  active_time=1, active_time_unit='s', active_current=1, active_current_unit='ma',
                  sleep_time=1, sleep_time_unit='s', sleep_current=1, sleep_current_unit='ma',
                  shelf_life_years=5)

    assert r['battery_life_hours_without'] == 100.0


def test_staged_without_field_present():
    # when pure-load life exceeds shelf life, staged field should be present and > shelf
    r = calculate(capacity_mAh=1000, voltage_start=1.5, voltage_end=1.2, r_percent_per_month=0.166,
                  active_time=1, active_time_unit='s', active_current=0.001, active_current_unit='ma',
                  sleep_time=1, sleep_time_unit='s', sleep_current=0.001, sleep_current_unit='ma',
                  shelf_life_years=3)

    assert 'battery_life_hours_without_staged' in r
    assert r['battery_life_hours_without_staged'] >= 3 * 24 * 365


def test_with_self_discharge_staged_breakdown():
    # When shelf life is 5 years and the device would otherwise last longer,
    # the 'with' calculation must be two-stage: up to shelf life with normal self-discharge,
    # then post-shelf accelerated self-discharge (20%/month).
    r = calculate(capacity_mAh=1000, voltage_start=1.5, voltage_end=1.2, r_percent_per_month=0.166,
                  active_time=5, active_time_unit='us', active_current=5, active_current_unit='ua',
                  sleep_time=5, sleep_time_unit='us', sleep_current=5, sleep_current_unit='ua',
                  shelf_life_years=5)

    # calculation should be marked as capped by shelf and include some post-shelf months
    assert r['capped_by_shelf'] is True
    assert r['post_shelf_months'] is not None
    assert r['post_shelf_months'] > 0
    # total lifetime should exceed shelf life hours
    assert r['battery_life_hours_with'] > 5 * 24 * 365
