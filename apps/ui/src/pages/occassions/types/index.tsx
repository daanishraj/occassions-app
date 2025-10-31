import { Month, OccasionType } from "@occasions/types";

export const selectMonthOptions : string[] = Object.values(Month) as string[]

export const selectDayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1));

export const selectOccassionOptions: string[] = Object.values(OccasionType) as string[];
