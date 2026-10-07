export interface GreekRoadTaxInput {
  firstRegistrationDate: string; // YYYY-MM-DD
  engineDisplacementCc?: number;
  co2Gkm?: number;
}

const dateValue = (date: string) => new Date(`${date}T00:00:00Z`).getTime();

const PRE_2010_BRACKETS = [
  { max: 300, until2000: 22, y2001to2005: 22, from2006: 22 },
  { max: 785, until2000: 55, y2001to2005: 55, from2006: 55 },
  { max: 1071, until2000: 120, y2001to2005: 120, from2006: 120 },
  { max: 1357, until2000: 135, y2001to2005: 135, from2006: 135 },
  { max: 1548, until2000: 225, y2001to2005: 240, from2006: 255 },
  { max: 1738, until2000: 250, y2001to2005: 265, from2006: 280 },
  { max: 1928, until2000: 280, y2001to2005: 300, from2006: 320 },
  { max: 2357, until2000: 615, y2001to2005: 630, from2006: 690 },
  { max: 3000, until2000: 820, y2001to2005: 840, from2006: 920 },
  { max: 4000, until2000: 1025, y2001to2005: 1050, from2006: 1150 },
  { max: Number.POSITIVE_INFINITY, until2000: 1230, y2001to2005: 1260, from2006: 1380 }
];

const roadTaxFromCo2 = (co2: number, wltp: boolean) => {
  const bands = wltp
    ? [
        { max: 122, rate: 0 }, { max: 139, rate: 0.64 }, { max: 166, rate: 0.7 },
        { max: 208, rate: 0.85 }, { max: 224, rate: 1.87 }, { max: 240, rate: 2.2 },
        { max: 260, rate: 2.5 }, { max: 280, rate: 2.7 }, { max: Number.POSITIVE_INFINITY, rate: 2.85 }
      ]
    : [
        { max: 90, rate: 0 }, { max: 100, rate: 0.9 }, { max: 120, rate: 0.98 },
        { max: 140, rate: 1.2 }, { max: 160, rate: 1.85 }, { max: 180, rate: 2.45 },
        { max: 200, rate: 2.78 }, { max: 250, rate: 3.05 }, { max: Number.POSITIVE_INFINITY, rate: 3.72 }
      ];

  const band = bands.find((item) => co2 <= item.max);
  if (!band) return null;
  // AADE publishes an annual euro-per-gram rate for each CO₂ band. The selected
  // band rate is applied to the vehicle's full certified g/km figure (not marginally).
  return Math.round(co2 * band.rate * 100) / 100;
};

/**
 * Indicative calculator based on the AADE published bands.
 * The vehicle licence / Certificate of Conformity remains the authoritative source for CO₂.
 */
export const calculateGreekRoadTax = ({ firstRegistrationDate, engineDisplacementCc, co2Gkm }: GreekRoadTaxInput) => {
  const firstRegistration = dateValue(firstRegistrationDate);
  const co2Start = dateValue('2010-11-01');
  const wltpStart = dateValue('2021-01-01');

  if (firstRegistration >= co2Start) {
    if (typeof co2Gkm !== 'number') return null;
    return roadTaxFromCo2(co2Gkm, firstRegistration >= wltpStart);
  }

  if (typeof engineDisplacementCc !== 'number') return null;
  const bracket = PRE_2010_BRACKETS.find((item) => engineDisplacementCc <= item.max);
  if (!bracket) return null;
  const year = new Date(`${firstRegistrationDate}T00:00:00Z`).getUTCFullYear();
  if (year <= 2000) return bracket.until2000;
  if (year <= 2005) return bracket.y2001to2005;
  return bracket.from2006;
};

export interface AthensRingInput {
  fuelType: string;
  euroClass?: number;
  co2Gkm?: number;
  firstRegistrationDate: string;
  factoryLpgOrCng?: boolean;
}

/** Implements the public gov.gr eligibility rules for the special Athens ring permit. */
export const isAthensRingEligible = ({ fuelType, euroClass, co2Gkm, firstRegistrationDate, factoryLpgOrCng }: AthensRingInput) => {
  const normalized = fuelType.toLowerCase();
  if (normalized.includes('electric') || normalized.includes('hybrid') || factoryLpgOrCng) return true;
  if (euroClass !== 6 || typeof co2Gkm !== 'number') return false;
  const isWltpEra = dateValue(firstRegistrationDate) >= dateValue('2021-01-01');
  return co2Gkm < (isWltpEra ? 145 : 120);
};
