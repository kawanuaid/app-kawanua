export interface Unit {
  id: string;
  label: string;
  shortLabel: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitCategory {
  id: string;
  label: string;
  icon: string;
  units: Unit[];
}

// Digital Storage - base unit: byte
const digitalStorageUnits: Unit[] = [
  {
    id: "bit",
    label: "Bit",
    shortLabel: "b",
    toBase: (v) => v / 8,
    fromBase: (v) => v * 8,
  },
  {
    id: "byte",
    label: "Byte",
    shortLabel: "B",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "kilobyte",
    label: "Kilobyte",
    shortLabel: "KB",
    toBase: (v) => v * 1024,
    fromBase: (v) => v / 1024,
  },
  {
    id: "megabyte",
    label: "Megabyte",
    shortLabel: "MB",
    toBase: (v) => v * 1024 ** 2,
    fromBase: (v) => v / 1024 ** 2,
  },
  {
    id: "gigabyte",
    label: "Gigabyte",
    shortLabel: "GB",
    toBase: (v) => v * 1024 ** 3,
    fromBase: (v) => v / 1024 ** 3,
  },
  {
    id: "terabyte",
    label: "Terabyte",
    shortLabel: "TB",
    toBase: (v) => v * 1024 ** 4,
    fromBase: (v) => v / 1024 ** 4,
  },
  {
    id: "petabyte",
    label: "Petabyte",
    shortLabel: "PB",
    toBase: (v) => v * 1024 ** 5,
    fromBase: (v) => v / 1024 ** 5,
  },
  {
    id: "exabyte",
    label: "Exabyte",
    shortLabel: "EB",
    toBase: (v) => v * 1024 ** 6,
    fromBase: (v) => v / 1024 ** 6,
  },
];

// Time - base unit: millisecond
const timeUnits: Unit[] = [
  {
    id: "millisecond",
    label: "Millisecond",
    shortLabel: "ms",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "second",
    label: "Second",
    shortLabel: "s",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "minute",
    label: "Minute",
    shortLabel: "min",
    toBase: (v) => v * 60000,
    fromBase: (v) => v / 60000,
  },
  {
    id: "hour",
    label: "Hour",
    shortLabel: "hr",
    toBase: (v) => v * 3600000,
    fromBase: (v) => v / 3600000,
  },
  {
    id: "day",
    label: "Day",
    shortLabel: "day",
    toBase: (v) => v * 86400000,
    fromBase: (v) => v / 86400000,
  },
  {
    id: "week",
    label: "Week",
    shortLabel: "wk",
    toBase: (v) => v * 604800000,
    fromBase: (v) => v / 604800000,
  },
  {
    id: "month",
    label: "Month",
    shortLabel: "mo",
    toBase: (v) => v * 2592000000,
    fromBase: (v) => v / 2592000000,
  },
  {
    id: "year",
    label: "Year",
    shortLabel: "yr",
    toBase: (v) => v * 31536000000,
    fromBase: (v) => v / 31536000000,
  },
];

// Data Transfer Rate - base unit: bit per second
const dataTransferUnits: Unit[] = [
  {
    id: "bps",
    label: "Bits per second",
    shortLabel: "bps",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "kbps",
    label: "Kilobits per second",
    shortLabel: "Kbps",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "mbps",
    label: "Megabits per second",
    shortLabel: "Mbps",
    toBase: (v) => v * 1000 ** 2,
    fromBase: (v) => v / 1000 ** 2,
  },
  {
    id: "gbps",
    label: "Gigabits per second",
    shortLabel: "Gbps",
    toBase: (v) => v * 1000 ** 3,
    fromBase: (v) => v / 1000 ** 3,
  },
  {
    id: "tbps",
    label: "Terabits per second",
    shortLabel: "Tbps",
    toBase: (v) => v * 1000 ** 4,
    fromBase: (v) => v / 1000 ** 4,
  },
  {
    id: "Bps",
    label: "Bytes per second",
    shortLabel: "B/s",
    toBase: (v) => v * 8,
    fromBase: (v) => v / 8,
  },
  {
    id: "KBps",
    label: "Kilobytes per second",
    shortLabel: "KB/s",
    toBase: (v) => v * 8 * 1024,
    fromBase: (v) => v / (8 * 1024),
  },
  {
    id: "MBps",
    label: "Megabytes per second",
    shortLabel: "MB/s",
    toBase: (v) => v * 8 * 1024 ** 2,
    fromBase: (v) => v / (8 * 1024 ** 2),
  },
  {
    id: "GBps",
    label: "Gigabytes per second",
    shortLabel: "GB/s",
    toBase: (v) => v * 8 * 1024 ** 3,
    fromBase: (v) => v / (8 * 1024 ** 3),
  },
];

// Length (Metric) - base unit: meter
const lengthMetricUnits: Unit[] = [
  {
    id: "nm",
    label: "Nanometer",
    shortLabel: "nm",
    toBase: (v) => v * 1e-9,
    fromBase: (v) => v / 1e-9,
  },
  {
    id: "um",
    label: "Micrometer",
    shortLabel: "μm",
    toBase: (v) => v * 1e-6,
    fromBase: (v) => v / 1e-6,
  },
  {
    id: "mm",
    label: "Millimeter",
    shortLabel: "mm",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "cm",
    label: "Centimeter",
    shortLabel: "cm",
    toBase: (v) => v * 0.01,
    fromBase: (v) => v / 0.01,
  },
  {
    id: "dm",
    label: "Decimeter",
    shortLabel: "dm",
    toBase: (v) => v * 0.1,
    fromBase: (v) => v / 0.1,
  },
  {
    id: "m",
    label: "Meter",
    shortLabel: "m",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "dam",
    label: "Decameter",
    shortLabel: "dam",
    toBase: (v) => v * 10,
    fromBase: (v) => v / 10,
  },
  {
    id: "hm",
    label: "Hectometer",
    shortLabel: "hm",
    toBase: (v) => v * 100,
    fromBase: (v) => v / 100,
  },
  {
    id: "km",
    label: "Kilometer",
    shortLabel: "km",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
];

// Length (Imperial) - base unit: foot
const lengthImperialUnits: Unit[] = [
  {
    id: "thou",
    label: "Thou (mil)",
    shortLabel: "th",
    toBase: (v) => v / 12000,
    fromBase: (v) => v * 12000,
  },
  {
    id: "imp_in",
    label: "Inch",
    shortLabel: "in",
    toBase: (v) => v / 12,
    fromBase: (v) => v * 12,
  },
  {
    id: "imp_ft",
    label: "Foot",
    shortLabel: "ft",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "imp_yd",
    label: "Yard",
    shortLabel: "yd",
    toBase: (v) => v * 3,
    fromBase: (v) => v / 3,
  },
  {
    id: "ftm",
    label: "Fathom",
    shortLabel: "ftm",
    toBase: (v) => v * 6,
    fromBase: (v) => v / 6,
  },
  {
    id: "rd",
    label: "Rod",
    shortLabel: "rd",
    toBase: (v) => v * 16.5,
    fromBase: (v) => v / 16.5,
  },
  {
    id: "ch",
    label: "Chain",
    shortLabel: "ch",
    toBase: (v) => v * 66,
    fromBase: (v) => v / 66,
  },
  {
    id: "fur",
    label: "Furlong",
    shortLabel: "fur",
    toBase: (v) => v * 660,
    fromBase: (v) => v / 660,
  },
  {
    id: "imp_mi",
    label: "Mile",
    shortLabel: "mi",
    toBase: (v) => v * 5280,
    fromBase: (v) => v / 5280,
  },
  {
    id: "lea",
    label: "League",
    shortLabel: "lea",
    toBase: (v) => v * 15840,
    fromBase: (v) => v / 15840,
  },
  {
    id: "imp_nmi",
    label: "Nautical Mile",
    shortLabel: "nmi",
    toBase: (v) => v * 6076.1155,
    fromBase: (v) => v / 6076.1155,
  },
];

// Length (Imperial ↔ Metric) - base unit: meter
const imperialMetricUnits: Unit[] = [
  {
    id: "in",
    label: "Inch",
    shortLabel: "in",
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
  {
    id: "ft",
    label: "Foot",
    shortLabel: "ft",
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  {
    id: "yd",
    label: "Yard",
    shortLabel: "yd",
    toBase: (v) => v * 0.9144,
    fromBase: (v) => v / 0.9144,
  },
  {
    id: "mi",
    label: "Mile",
    shortLabel: "mi",
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
  {
    id: "nmi",
    label: "Nautical Mile",
    shortLabel: "nmi",
    toBase: (v) => v * 1852,
    fromBase: (v) => v / 1852,
  },
  {
    id: "mm",
    label: "Millimeter",
    shortLabel: "mm",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "cm",
    label: "Centimeter",
    shortLabel: "cm",
    toBase: (v) => v * 0.01,
    fromBase: (v) => v / 0.01,
  },
  {
    id: "m",
    label: "Meter",
    shortLabel: "m",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "km",
    label: "Kilometer",
    shortLabel: "km",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
];

// Volume - base unit: litre
const volumeUnits: Unit[] = [
  {
    id: "ml",
    label: "Millilitre",
    shortLabel: "mL",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "cl",
    label: "Centilitre",
    shortLabel: "cL",
    toBase: (v) => v * 0.01,
    fromBase: (v) => v / 0.01,
  },
  {
    id: "dl",
    label: "Decilitre",
    shortLabel: "dL",
    toBase: (v) => v * 0.1,
    fromBase: (v) => v / 0.1,
  },
  {
    id: "l",
    label: "Litre",
    shortLabel: "L",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "cm3",
    label: "Cubic Centimetre",
    shortLabel: "cm³",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "dm3",
    label: "Cubic Decimetre",
    shortLabel: "dm³",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "m3",
    label: "Cubic Metre",
    shortLabel: "m³",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "tsp",
    label: "Teaspoon (US)",
    shortLabel: "tsp",
    toBase: (v) => v * 0.00492892,
    fromBase: (v) => v / 0.00492892,
  },
  {
    id: "tbsp",
    label: "Tablespoon (US)",
    shortLabel: "tbsp",
    toBase: (v) => v * 0.0147868,
    fromBase: (v) => v / 0.0147868,
  },
  {
    id: "floz_us",
    label: "Fluid Ounce (US)",
    shortLabel: "fl oz",
    toBase: (v) => v * 0.0295735,
    fromBase: (v) => v / 0.0295735,
  },
  {
    id: "cup_us",
    label: "Cup (US)",
    shortLabel: "cup",
    toBase: (v) => v * 0.236588,
    fromBase: (v) => v / 0.236588,
  },
  {
    id: "pt_us",
    label: "Pint (US)",
    shortLabel: "pt",
    toBase: (v) => v * 0.473176,
    fromBase: (v) => v / 0.473176,
  },
  {
    id: "qt_us",
    label: "Quart (US)",
    shortLabel: "qt",
    toBase: (v) => v * 0.946353,
    fromBase: (v) => v / 0.946353,
  },
  {
    id: "gal_us",
    label: "Gallon (US)",
    shortLabel: "gal",
    toBase: (v) => v * 3.78541,
    fromBase: (v) => v / 3.78541,
  },
  {
    id: "floz_uk",
    label: "Fluid Ounce (UK)",
    shortLabel: "fl oz",
    toBase: (v) => v * 0.0284131,
    fromBase: (v) => v / 0.0284131,
  },
  {
    id: "pt_uk",
    label: "Pint (UK)",
    shortLabel: "pt",
    toBase: (v) => v * 0.568261,
    fromBase: (v) => v / 0.568261,
  },
  {
    id: "gal_uk",
    label: "Gallon (UK)",
    shortLabel: "gal",
    toBase: (v) => v * 4.54609,
    fromBase: (v) => v / 4.54609,
  },
];

// Area - base unit: square metre
const areaUnits: Unit[] = [
  {
    id: "mm2",
    label: "Square Millimetre",
    shortLabel: "mm²",
    toBase: (v) => v * 1e-6,
    fromBase: (v) => v / 1e-6,
  },
  {
    id: "cm2",
    label: "Square Centimetre",
    shortLabel: "cm²",
    toBase: (v) => v * 1e-4,
    fromBase: (v) => v / 1e-4,
  },
  {
    id: "m2",
    label: "Square Metre",
    shortLabel: "m²",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "ha",
    label: "Hectare",
    shortLabel: "ha",
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
  {
    id: "km2",
    label: "Square Kilometre",
    shortLabel: "km²",
    toBase: (v) => v * 1e6,
    fromBase: (v) => v / 1e6,
  },
  {
    id: "in2",
    label: "Square Inch",
    shortLabel: "in²",
    toBase: (v) => v * 0.00064516,
    fromBase: (v) => v / 0.00064516,
  },
  {
    id: "ft2",
    label: "Square Foot",
    shortLabel: "ft²",
    toBase: (v) => v * 0.092903,
    fromBase: (v) => v / 0.092903,
  },
  {
    id: "yd2",
    label: "Square Yard",
    shortLabel: "yd²",
    toBase: (v) => v * 0.836127,
    fromBase: (v) => v / 0.836127,
  },
  {
    id: "ac",
    label: "Acre",
    shortLabel: "ac",
    toBase: (v) => v * 4046.86,
    fromBase: (v) => v / 4046.86,
  },
  {
    id: "mi2",
    label: "Square Mile",
    shortLabel: "mi²",
    toBase: (v) => v * 2589988.11,
    fromBase: (v) => v / 2589988.11,
  },
];

// Weight / Mass - base unit: kilogram
const weightUnits: Unit[] = [
  {
    id: "mg",
    label: "Milligram",
    shortLabel: "mg",
    toBase: (v) => v * 1e-6,
    fromBase: (v) => v / 1e-6,
  },
  {
    id: "g",
    label: "Gram",
    shortLabel: "g",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "kg",
    label: "Kilogram",
    shortLabel: "kg",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "tonne",
    label: "Metric Tonne",
    shortLabel: "t",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "oz",
    label: "Ounce",
    shortLabel: "oz",
    toBase: (v) => v * 0.0283495,
    fromBase: (v) => v / 0.0283495,
  },
  {
    id: "lb",
    label: "Pound",
    shortLabel: "lb",
    toBase: (v) => v * 0.453592,
    fromBase: (v) => v / 0.453592,
  },
  {
    id: "st",
    label: "Stone",
    shortLabel: "st",
    toBase: (v) => v * 6.35029,
    fromBase: (v) => v / 6.35029,
  },
  {
    id: "us_ton",
    label: "US Ton (Short)",
    shortLabel: "US ton",
    toBase: (v) => v * 907.185,
    fromBase: (v) => v / 907.185,
  },
  {
    id: "imp_ton",
    label: "Imperial Ton (Long)",
    shortLabel: "IMP ton",
    toBase: (v) => v * 1016.05,
    fromBase: (v) => v / 1016.05,
  },
];

// Temperature - base unit: kelvin
const temperatureUnits: Unit[] = [
  {
    id: "c",
    label: "Celsius",
    shortLabel: "°C",
    toBase: (v) => v + 273.15,
    fromBase: (v) => v - 273.15,
  },
  {
    id: "f",
    label: "Fahrenheit",
    shortLabel: "°F",
    toBase: (v) => (v - 32) * (5 / 9) + 273.15,
    fromBase: (v) => (v - 273.15) * (9 / 5) + 32,
  },
  {
    id: "k",
    label: "Kelvin",
    shortLabel: "K",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "r",
    label: "Rankine",
    shortLabel: "°R",
    toBase: (v) => v * (5 / 9),
    fromBase: (v) => v * (9 / 5),
  },
];

// Power - base unit: watt
const powerUnits: Unit[] = [
  {
    id: "mw_pw",
    label: "Milliwatt",
    shortLabel: "mW",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "w",
    label: "Watt",
    shortLabel: "W",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "kw",
    label: "Kilowatt",
    shortLabel: "kW",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "mw2",
    label: "Megawatt",
    shortLabel: "MW",
    toBase: (v) => v * 1e6,
    fromBase: (v) => v / 1e6,
  },
  {
    id: "gw",
    label: "Gigawatt",
    shortLabel: "GW",
    toBase: (v) => v * 1e9,
    fromBase: (v) => v / 1e9,
  },
  {
    id: "tw",
    label: "Terawatt",
    shortLabel: "TW",
    toBase: (v) => v * 1e12,
    fromBase: (v) => v / 1e12,
  },
  {
    id: "hp",
    label: "Horsepower (Mechanical)",
    shortLabel: "HP",
    toBase: (v) => v * 745.7,
    fromBase: (v) => v / 745.7,
  },
  {
    id: "hp_e",
    label: "Horsepower (Electrical)",
    shortLabel: "HP(E)",
    toBase: (v) => v * 746,
    fromBase: (v) => v / 746,
  },
  {
    id: "hp_m",
    label: "Horsepower (Metric)",
    shortLabel: "HP(M)",
    toBase: (v) => v * 735.499,
    fromBase: (v) => v / 735.499,
  },
  {
    id: "btuh",
    label: "BTU per Hour",
    shortLabel: "BTU/h",
    toBase: (v) => v * 0.29307107,
    fromBase: (v) => v / 0.29307107,
  },
  {
    id: "cal_s",
    label: "Calorie per Second",
    shortLabel: "cal/s",
    toBase: (v) => v * 4.184,
    fromBase: (v) => v / 4.184,
  },
  {
    id: "ftlb_s",
    label: "Foot-Pound per Second",
    shortLabel: "ft·lb/s",
    toBase: (v) => v * 1.35582,
    fromBase: (v) => v / 1.35582,
  },
];

// Energy - base unit: joule
const energyUnits: Unit[] = [
  {
    id: "j",
    label: "Joule",
    shortLabel: "J",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "kj",
    label: "Kilojoule",
    shortLabel: "kJ",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "mj",
    label: "Megajoule",
    shortLabel: "MJ",
    toBase: (v) => v * 1e6,
    fromBase: (v) => v / 1e6,
  },
  {
    id: "gj",
    label: "Gigajoule",
    shortLabel: "GJ",
    toBase: (v) => v * 1e9,
    fromBase: (v) => v / 1e9,
  },
  {
    id: "cal",
    label: "Calorie (thermochemical)",
    shortLabel: "cal",
    toBase: (v) => v * 4.184,
    fromBase: (v) => v / 4.184,
  },
  {
    id: "kcal",
    label: "Kilocalorie",
    shortLabel: "kcal",
    toBase: (v) => v * 4184,
    fromBase: (v) => v / 4184,
  },
  {
    id: "wh",
    label: "Watt-hour",
    shortLabel: "Wh",
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  {
    id: "kwh",
    label: "Kilowatt-hour",
    shortLabel: "kWh",
    toBase: (v) => v * 3.6e6,
    fromBase: (v) => v / 3.6e6,
  },
  {
    id: "mwh",
    label: "Megawatt-hour",
    shortLabel: "MWh",
    toBase: (v) => v * 3.6e9,
    fromBase: (v) => v / 3.6e9,
  },
  {
    id: "btu",
    label: "British Thermal Unit",
    shortLabel: "BTU",
    toBase: (v) => v * 1055.06,
    fromBase: (v) => v / 1055.06,
  },
  {
    id: "therm",
    label: "Therm (US)",
    shortLabel: "therm",
    toBase: (v) => v * 1.0548e8,
    fromBase: (v) => v / 1.0548e8,
  },
  {
    id: "ev",
    label: "Electronvolt",
    shortLabel: "eV",
    toBase: (v) => v * 1.602176634e-19,
    fromBase: (v) => v / 1.602176634e-19,
  },
  {
    id: "ft_lb",
    label: "Foot-Pound",
    shortLabel: "ft·lb",
    toBase: (v) => v * 1.35582,
    fromBase: (v) => v / 1.35582,
  },
];

// Speed - base unit: metre per second
const speedUnits: Unit[] = [
  {
    id: "mms",
    label: "Millimetre per Second",
    shortLabel: "mm/s",
    toBase: (v) => v * 0.001,
    fromBase: (v) => v / 0.001,
  },
  {
    id: "cms",
    label: "Centimetre per Second",
    shortLabel: "cm/s",
    toBase: (v) => v * 0.01,
    fromBase: (v) => v / 0.01,
  },
  {
    id: "ms",
    label: "Metre per Second",
    shortLabel: "m/s",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "kmh",
    label: "Kilometre per Hour",
    shortLabel: "km/h",
    toBase: (v) => v / 3.6,
    fromBase: (v) => v * 3.6,
  },
  {
    id: "mph",
    label: "Mile per Hour",
    shortLabel: "mph",
    toBase: (v) => v * 0.44704,
    fromBase: (v) => v / 0.44704,
  },
  {
    id: "kn",
    label: "Knot",
    shortLabel: "kn",
    toBase: (v) => v * 0.514444,
    fromBase: (v) => v / 0.514444,
  },
  {
    id: "fts",
    label: "Foot per Second",
    shortLabel: "ft/s",
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  {
    id: "mach",
    label: "Mach (at sea level)",
    shortLabel: "Mach",
    toBase: (v) => v * 340.29,
    fromBase: (v) => v / 340.29,
  },
  {
    id: "c_spd",
    label: "Speed of Light",
    shortLabel: "c",
    toBase: (v) => v * 299792458,
    fromBase: (v) => v / 299792458,
  },
];

// Pressure - base unit: pascal
const pressureUnits: Unit[] = [
  {
    id: "pa",
    label: "Pascal",
    shortLabel: "Pa",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "hpa",
    label: "Hectopascal",
    shortLabel: "hPa",
    toBase: (v) => v * 100,
    fromBase: (v) => v / 100,
  },
  {
    id: "kpa",
    label: "Kilopascal",
    shortLabel: "kPa",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: "mpa",
    label: "Megapascal",
    shortLabel: "MPa",
    toBase: (v) => v * 1e6,
    fromBase: (v) => v / 1e6,
  },
  {
    id: "bar",
    label: "Bar",
    shortLabel: "bar",
    toBase: (v) => v * 1e5,
    fromBase: (v) => v / 1e5,
  },
  {
    id: "mbar",
    label: "Millibar",
    shortLabel: "mbar",
    toBase: (v) => v * 100,
    fromBase: (v) => v / 100,
  },
  {
    id: "psi",
    label: "Pound per Square Inch",
    shortLabel: "psi",
    toBase: (v) => v * 6894.76,
    fromBase: (v) => v / 6894.76,
  },
  {
    id: "atm",
    label: "Standard Atmosphere",
    shortLabel: "atm",
    toBase: (v) => v * 101325,
    fromBase: (v) => v / 101325,
  },
  {
    id: "torr",
    label: "Torr",
    shortLabel: "Torr",
    toBase: (v) => v * 133.322,
    fromBase: (v) => v / 133.322,
  },
  {
    id: "mmhg",
    label: "Millimetre of Mercury",
    shortLabel: "mmHg",
    toBase: (v) => v * 133.322,
    fromBase: (v) => v / 133.322,
  },
  {
    id: "inhg",
    label: "Inch of Mercury",
    shortLabel: "inHg",
    toBase: (v) => v * 3386.39,
    fromBase: (v) => v / 3386.39,
  },
  {
    id: "psf",
    label: "Pound per Square Foot",
    shortLabel: "psf",
    toBase: (v) => v * 47.8803,
    fromBase: (v) => v / 47.8803,
  },
];

export const categories: UnitCategory[] = [
  {
    id: "digital-storage",
    label: "Digital Storage",
    icon: "hard-drive",
    units: digitalStorageUnits,
  },
  {
    id: "time",
    label: "Time",
    icon: "clock",
    units: timeUnits,
  },
  {
    id: "data-transfer",
    label: "Data Transfer",
    icon: "wifi",
    units: dataTransferUnits,
  },
  {
    id: "length-metric",
    label: "Length (Metric)",
    icon: "ruler",
    units: lengthMetricUnits,
  },
  {
    id: "length-imperial",
    label: "Length (Imperial)",
    icon: "move-horizontal",
    units: lengthImperialUnits,
  },
  {
    id: "imperial-metric",
    label: "Imperial ↔ Metric",
    icon: "repeat",
    units: imperialMetricUnits,
  },
  {
    id: "volume",
    label: "Volume",
    icon: "droplets",
    units: volumeUnits,
  },
  {
    id: "area",
    label: "Area",
    icon: "grid",
    units: areaUnits,
  },
  {
    id: "weight",
    label: "Weight / Mass",
    icon: "scale",
    units: weightUnits,
  },
  {
    id: "temperature",
    label: "Temperature",
    icon: "thermometer",
    units: temperatureUnits,
  },
  {
    id: "power",
    label: "Power",
    icon: "zap",
    units: powerUnits,
  },
  {
    id: "energy",
    label: "Energy",
    icon: "flame",
    units: energyUnits,
  },
  {
    id: "speed",
    label: "Speed",
    icon: "gauge",
    units: speedUnits,
  },
  {
    id: "pressure",
    label: "Pressure",
    icon: "gauge-circle",
    units: pressureUnits,
  },
];

export function convert(value: number, fromUnit: Unit, toUnit: Unit): number {
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}

export function formatNumber(num: number): string {
  if (num === 0) return "0";

  const absNum = Math.abs(num);

  // Very large or very small numbers - use scientific notation
  if (absNum >= 1e15 || (absNum < 1e-10 && absNum > 0)) {
    return num.toExponential(6);
  }

  // Regular numbers
  if (Number.isInteger(num) && absNum < 1e15) {
    return num.toLocaleString("en-US");
  }

  // Determine decimal places based on magnitude
  let decimals = 8;
  if (absNum >= 1000) decimals = 4;
  else if (absNum >= 1) decimals = 6;
  else if (absNum >= 0.001) decimals = 8;
  else decimals = 10;

  const formatted = num.toFixed(decimals);
  // Remove trailing zeros but keep at least 2 decimal places for non-integers
  const trimmed = formatted
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.$/, "");
  return trimmed;
}
