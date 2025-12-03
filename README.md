# Battery Life Calculator

A web-based calculator for estimating battery life in electronic devices based on active and sleep current consumption.

## Features

- **Battery Selection**: Choose from a wide range of primary batteries (CR1220, CR2032, AAA, AA, D, 9V, etc.) or rechargeable chemistries (Li-Ion, Ni-MH, Lead-acid, etc.) with manual capacity input for rechargeables.
- **Self-Discharge Compensation**: Automatically shows battery life with and without self-discharge over the calculated lifetime.
- **Flexible Units**: Input time in microseconds (μs), milliseconds (ms), seconds (s), minutes (min), or hours (h); current in microamps (μA), milliamps (mA), or amps (A).
- **Detailed Calculations**: Computes average current consumption, energy consumption in active/sleep modes (Wh), total energy per cycle and over battery life, battery life in seconds/minutes/hours/days/months/years.
- **Battery Information**: Shows capacity, voltage, size, max current, discharge rate, shelf life, and description for selected batteries.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Analytics**: Integrated Google Analytics for usage tracking.
- **SEO Optimized**: Meta tags and Open Graph support for better search visibility.

## Supported Batteries

### Primary Batteries (Non-rechargeable)
- CR1220 (35mAh, 3V)
- CR1616 (50mAh, 3V)
- CR1620 (75mAh, 3V)
- CR2016 (90mAh, 3V)
- LR44 (150mAh, 1.5V)
- CR2025 (160mAh, 3V)
- CR2032 (220mAh, 3V)
- CR2450 (560mAh, 3V)
- 9V Battery (550mAh, 9V)
- AAA (1000mAh, 1.5V)
- CR123A (1500mAh, 3V)
- AA (2500mAh, 1.5V)
- D (10000mAh, 1.5V)

### Rechargeable Battery Chemistries
- Ni-Cd (Nickel-Cadmium)
- Ni-MH (Nickel-Metal Hydride)
- Li-Ion (Lithium-Ion)
- Li-Pol (Lithium-Polymer)
- Lead-acid

## Usage

1. Open `https://serbinov.github.io/battery-calculator/` in a browser.
2. Select battery type or chemistry.
3. Enter capacity (for rechargeables), temperature, active time/current, and sleep time/current.
4. Click "Calculate" to see results with and without self-discharge.

## Technologies

- HTML5, CSS3, JavaScript (ES6)
- Font Awesome icons
- Google Analytics 4

## Contributing

Feel free to fork and contribute!

## Developed by

Oleg Serbinov - [Website](https://serbinov.github.io) | [GitHub](https://github.com/serbinov)

## Changelog (recent additions)

v1.1 — 2025-12-03
- Added explicit `chemistry` metadata to every battery entry in `script.js` (Lithium, Alkaline, Salt, Ni‑MH, Ni‑Cd, Li‑Ion, Lead‑acid).
- Filled conservative default parameters for every battery: shelf life, self‑discharge (%/month), post‑shelf accelerated loss where applicable and internal resistance/calendar fade.
- Improved temperature factors per chemistry and used `chemistry` when adjusting displayed capacity/behavior.
- Fixed selector mismatch bugs so `<select>` option values match `batteryData` keys and the UI updates correctly.
- Renamed Carbon/Zinc references to **Salt** across UI & code to avoid ambiguous language.
- Added unit tests verifying metadata presence and selector/key consistency (`tests/test_battery_metadata.py`).
- Added staged lifecycle handling and consistent post‑shelf simulation behavior (ensuring “with self‑discharge” never exceeds pure‑load result; CPU + load considered post‑shelf).
- Updated UI to show chemistry in every select option and removed the confusing "Total Energy Consumption" display.

Notes: defaults are conservative values based on common references (BatteryUniversity, vendor ranges). If you want manufacturer‑accurate values we can update these fields with datasheet URLs and add source references in `script.js` and the README.