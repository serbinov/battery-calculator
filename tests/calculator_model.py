import math

# Battery data ported from script.js
BATTERY_DATA = {
    'CR1220': { 'capacity': 35, 'voltageStart': 3, 'voltageEnd': 2, 'type': 'Lithium', 'chemistry': 'Lithium', 'internalResistanceOhm': 0.933333, 'peukert': 1.02, 'selfDischargeRate': 0.166, 'calendarFadePercentPerYear': 0.5, 'shelfLifeYears': 10 },
    'CR1616': { 'capacity': 50, 'voltageStart': 3, 'voltageEnd': 2, 'type': 'Lithium', 'chemistry': 'Lithium', 'internalResistanceOhm': 0.933333, 'peukert': 1.02, 'selfDischargeRate': 0.166, 'calendarFadePercentPerYear': 0.5, 'shelfLifeYears': 10 },
    'CR2032': { 'capacity': 220, 'voltageStart': 3, 'voltageEnd': 2, 'type': 'Lithium', 'chemistry': 'Lithium', 'internalResistanceOhm': 4.0, 'peukert': 1.02, 'selfDischargeRate': 0.166, 'calendarFadePercentPerYear': 0.5, 'shelfLifeYears': 10 },
    'CR-P2': { 'capacity': 1400, 'voltageStart': 6.0, 'voltageEnd': 4.0, 'type': 'Lithium', 'chemistry': 'Lithium', 'internalResistanceOhm': 4.0, 'peukert': 1.02, 'selfDischargeRate': 0.166, 'calendarFadePercentPerYear': 2.0, 'shelfLifeYears': 7 },
    'AAA': { 'capacity': 1000, 'voltageStart': 1.5, 'voltageEnd': 1.0, 'type': 'Alkaline', 'chemistry': 'Alkaline', 'internalResistanceOhm': 0.2072, 'peukert': 1.02, 'selfDischargeRate': 0.166, 'calendarFadePercentPerYear': 1.0, 'shelfLifeYears': 5 },
    'AA': { 'capacity': 2500, 'voltageStart': 1.5, 'voltageEnd': 1.0, 'type': 'Alkaline', 'chemistry': 'Alkaline', 'internalResistanceOhm': 0.12, 'selfDischargeRate': 0.166, 'calendarFadePercentPerYear': 1.0, 'shelfLifeYears': 5 },
    'Ni-MH': { 'voltageStart': 1.2, 'voltageEnd': 1, 'type': 'Ni-MH', 'chemistry': 'Ni-MH', 'internalResistanceOhm': 0.004, 'selfDischargeRate': 6, 'calendarFadePercentPerYear': 3.0, 'shelfLifeYears': 3 , 'peukert': 1.02},
    'AA_Ni-MH': { 'capacity': 2000, 'voltageStart': 1.2, 'voltageEnd': 1, 'type': 'Ni-MH', 'chemistry': 'Ni-MH', 'internalResistanceOhm': 0.02, 'selfDischargeRate': 6, 'calendarFadePercentPerYear': 3.0, 'shelfLifeYears': 3 },
    '18650': { 'capacity': 2600, 'voltageStart': 3.7, 'voltageEnd': 2.5, 'type': 'Li-Ion', 'chemistry': 'Li-Ion', 'internalResistanceOhm': 0.3372, 'selfDischargeRate': 2, 'calendarFadePercentPerYear': 3.0, 'shelfLifeYears': 5, 'peukert': 1.02 },
}

# Add Peukert's coefficient
for key, data in BATTERY_DATA.items():
    if 'peukert' not in data:
        if data['chemistry'] == 'Alkaline': data['peukert'] = 1.35
        elif data['chemistry'] == 'Salt': data['peukert'] = 1.4
        elif data['chemistry'] == 'Ni-Cd': data['peukert'] = 1.1
        elif data['chemistry'] == 'Ni-MH': data['peukert'] = 1.02
        else: data['peukert'] = 1.02 # Lithium

def get_temperature_factor(chemistry, temp):
    factors = {
        'Lithium': { 60: 0.93, 25: 1, 0: 0.9, -10: 0.7, -20: 0.714 },
        'Alkaline': { 25: 1, 0: 0.8, -10: 0.6, -20: 0.4 },
        'Ni-MH': { 25: 1, 0: 0.8, -10: 0.6, -20: 0.4 },
    }
    return factors.get(chemistry, {}).get(temp, 1)

def calculate_battery_life(
    battery_type,
    temperature,
    active_time_s,
    active_current_ma,
    sleep_time_s,
    sleep_current_ma,
    consumption_mode='current'  # default to constant current unless constant power is explicitly requested
):
    """
    Python implementation of the battery life calculator logic.
    """
    data = BATTERY_DATA[battery_type]
    capacity = data['capacity']
    
    # Temperature effect
    temp_factor = get_temperature_factor(data['chemistry'], temperature)
    capacity *= temp_factor

    voltage_start = data['voltageStart']
    voltage_end = data['voltageEnd']
    average_voltage = (voltage_start + voltage_end) / 2
    r_internal = data['internalResistanceOhm']
    
    # Average current
    total_time_s = active_time_s + sleep_time_s
    if total_time_s == 0: return 0
    avg_current_ma = (active_current_ma * active_time_s + sleep_current_ma * sleep_time_s) / total_time_s

    # Peukert's Effect: apply only when discharge current exceeds rated current (C/20)
    peukert = data.get('peukert', 1.0)
    if peukert > 1.01 and avg_current_ma > 0:
        rated_current = capacity / 20  # Assume C/20 rating
        if avg_current_ma > rated_current:
            effective_capacity = capacity * ((rated_current / avg_current_ma) ** (peukert - 1))
            capacity = effective_capacity

    initial_capacity = capacity
    if initial_capacity <= 0: return 0

    # Simulation parameters
    self_discharge_rate = data.get('selfDischargeRate', 0) # % per month
    r_fraction = max(0, self_discharge_rate) / 100
    hours_per_month = 24 * 30
    lambda_self_per_hour = -math.log(1 - r_fraction) / hours_per_month if r_fraction > 0 else 0

    calendar_fade_percent_per_year = data.get('calendarFadePercentPerYear', 0)
    calendar_fade_fraction_per_year = max(0, calendar_fade_percent_per_year) / 100
    calendar_lambda_per_year = -math.log(1 - calendar_fade_fraction_per_year) if calendar_fade_fraction_per_year > 0 else 0
    
    shelf_life_years = data.get('shelfLifeYears', 100)
    max_hours = shelf_life_years * 24 * 365

    # Simulation
    # Adaptive time step: smaller steps for high currents to keep accuracy, larger steps for low currents
    if avg_current_ma >= 1000:
        dt_hours = 1.0 / 60.0  # 1 minute
    elif avg_current_ma >= 100:
        dt_hours = 1.0 / 6.0   # 10 minutes
    elif avg_current_ma >= 10:
        dt_hours = 0.5         # 30 minutes
    else:
        dt_hours = 1.0         # 1 hour

    remaining_capacity = initial_capacity
    t_hours = 0.0
    
    avg_power_mw = avg_current_ma * average_voltage
    active_power_mw = active_current_ma * average_voltage

    def ocv_from_soc(soc):
        return voltage_end + soc * (voltage_start - voltage_end)

    while t_hours < max_hours:
        # Self-discharge
        if lambda_self_per_hour > 0:
            remaining_capacity *= math.exp(-lambda_self_per_hour * dt_hours)
        
        # Calendar fade
        if calendar_lambda_per_year > 0:
            dt_years = dt_hours / (24 * 365)
            remaining_capacity *= math.exp(-calendar_lambda_per_year * dt_years)

        # Consumption
        current_soc = remaining_capacity / initial_capacity
        current_ocv = ocv_from_soc(max(0, min(1, current_soc)))
        
        step_avg_current_ma = avg_current_ma
        step_active_current_ma = active_current_ma

        if consumption_mode == 'power' and current_ocv > 0:
            step_avg_current_ma = avg_power_mw / current_ocv
            step_active_current_ma = active_power_mw / current_ocv
        
        remaining_capacity -= step_avg_current_ma * dt_hours
        if remaining_capacity <= 0:
            t_hours += dt_hours
            break

        # Voltage checks
        soc = remaining_capacity / initial_capacity
        ocv = ocv_from_soc(max(0, min(1, soc)))
        
        avg_load_a = step_avg_current_ma / 1000
        if ocv - avg_load_a * r_internal <= voltage_end:
            t_hours += dt_hours
            break
            
        active_load_a = step_active_current_ma / 1000
        if ocv - active_load_a * r_internal <= voltage_end:
            t_hours += dt_hours
            break

        t_hours += dt_hours

    return min(t_hours, max_hours)
