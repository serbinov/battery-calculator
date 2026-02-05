import json
import os
import pytest
from tests.calculator_model import calculate_battery_life

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), 'fixtures')

fixture_files = {
    'CR2032': 'cr2032.json',
    'CR-P2': 'cr_p2.json',
    'AA': 'aa_alkaline.json',
    '18650': '18650_liion.json',
    'AA_Ni-MH': 'aa_nimh.json'
}

# Tolerances by battery type (relative)
TOLERANCES = {
    'CR2032': 0.30,
    'CR-P2': 0.30,
    'AA': 0.30,
    '18650': 0.60,
    'AA_NiMH': 0.20
}


def load_fixture(name):
    path = os.path.join(FIXTURES_DIR, fixture_files[name])
    with open(path, 'r') as f:
        return json.load(f)


@pytest.mark.parametrize('battery_key', list(fixture_files.keys()))
def test_datasheet_points(battery_key):
    points = load_fixture(battery_key)
    tol = TOLERANCES.get(battery_key, 0.3)

    # Map key to parameters for calculate_battery_life
    for p in points:
        current = p['current_ma']
        expected = p['expected_hours']

        # choose a battery_type that exists in BATTERY_DATA
        battery_type = battery_key if battery_key in __import__('tests.calculator_model', fromlist=['BATTERY_DATA']).BATTERY_DATA else 'AA'

        # we use a simple constant-current discharge (consumption_mode='current')
        modeled = calculate_battery_life(
            battery_type=battery_type,
            temperature=25,
            active_time_s=1,
            active_current_ma=current,
            sleep_time_s=0,
            sleep_current_ma=0,
            consumption_mode='current'
        )

        if expected == 0:
            assert modeled == 0
        else:
            rel_err = abs(modeled - expected) / expected
            assert rel_err <= tol, f"{battery_key} @ {current}mA: expected {expected}h ±{tol*100:.0f}%, got {modeled:.1f}h (err {rel_err:.2f})"
