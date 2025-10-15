import { Month, OccasionType } from "../../../../../api/src/validation";

export const selectMonthOptions : string[] = Object.values(Month) as string[]

export const selectDayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1));

export const selectOccassionOptions: string[] = Object.values(OccasionType) as string[];
