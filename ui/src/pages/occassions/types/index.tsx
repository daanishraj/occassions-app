import { OccasionType } from "../../../../../api/src/controllers/occassions.controller";

export const selectMonthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const selectDayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1));

export const selectOccassionOptions: string[] = Object.values(OccasionType) as string[];
