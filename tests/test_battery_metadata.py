import re
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / 'script.js'
INDEX = Path(__file__).resolve().parents[1] / 'index.html'


def _read_script():
    return SCRIPT.read_text(encoding='utf-8')


def _read_index():
    return INDEX.read_text(encoding='utf-8')


def test_index_options_match_batterydata_keys():
    html = _read_index()
    # extract the batteryType select block only
    m = re.search(r'<select[^>]*id="batteryType"[^>]*>(.*?)</select>', html, re.S)
    assert m, 'batteryType <select> not found in index.html'
    block = m.group(1)
    # find all option values inside batteryType select
    vals = re.findall(r'<option value="([^"]+)">', block)
    assert vals, 'No <option> values found in index.html'

    js = _read_script()
    # extract batteryData object literal and parse its keys
    m = re.search(r'const\s+batteryData\s*=\s*\{(.*?)\n\s*\};', js, re.S)
    assert m, 'batteryData object not found in script.js'
    data_block = m.group(1)
    # capture both quoted and unquoted keys
    key_pairs = re.findall(r"(?:'([A-Za-z0-9\-() ]+)'|([A-Za-z0-9_]+))\s*:\s*\{", data_block)
    found_keys = set(k1 or k2 for k1, k2 in key_pairs)

    # ensure each option value maps to a key in batteryData
    missing = [v for v in vals if v not in found_keys]
    assert not missing, f"index.html option values not present in batteryData keys: {missing}"


def test_batterydata_entries_have_required_fields():
    js = _read_script()
    # capture each key/object inside the batteryData literal
    m = re.search(r'const\s+batteryData\s*=\s*\{(.*?)\n\s*\};', js, re.S)
    assert m, 'batteryData object not found in script.js'
    data_block = m.group(1)
    entries = re.findall(r"'([A-Za-z0-9\-() ]+)'\s*:\s*\{([^}]+)\}", data_block)
    assert entries, 'No batteryData entries found in script.js'

    required = ['chemistry', 'shelfLifeYears', 'selfDischargeRate']
    missing = []
    for key, body in entries:
        for req in required:
            if re.search(rf"\b{req}\b\s*:\s*", body) is None:
                missing.append((key, req))

    assert not missing, f"Missing required metadata fields in batteryData entries: {missing}"
