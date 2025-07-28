// Base API types for WizardWorld API

export interface HouseDto {
  id: string;
  name: string | null;
  houseColours: string | null;
  founder: string | null;
  animal: string | null;
  element: string | null;
  ghost: string | null;
  commonRoom: string | null;
  heads: HouseHeadDto[] | null;
  traits: TraitDto[] | null;
}

export interface HouseHeadDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface TraitDto {
  id: string;
  name: TraitName;
}

export const TraitName = {
  None: "None",
  Courage: "Courage",
  Bravery: "Bravery",
  Determination: "Determination",
  Daring: "Daring",
  Nerve: "Nerve",
  Chivalary: "Chivalary",
  Hardworking: "Hardworking",
  Patience: "Patience",
  Fairness: "Fairness",
  Just: "Just",
  Loyalty: "Loyalty",
  Modesty: "Modesty",
  Wit: "Wit",
  Learning: "Learning",
  Wisdom: "Wisdom",
  Acceptance: "Acceptance",
  Inteligence: "Inteligence",
  Creativity: "Creativity",
  Resourcefulness: "Resourcefulness",
  Pride: "Pride",
  Cunning: "Cunning",
  Ambition: "Ambition",
  Selfpreservation: "Selfpreservation"
} as const;

export type TraitName = typeof TraitName[keyof typeof TraitName];

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
} 