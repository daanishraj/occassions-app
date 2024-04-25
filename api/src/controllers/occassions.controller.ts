import type { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";

export enum Month {
  JANUARY = "January",
  FEBRUARY = "February",
  MARCH = "March",
  APRIL = "April",
  MAY = "May",
  JUNE = "June",
  JULY = "July",
  AUGUST = "August",
  SEPTEMBER = "September",
  OCTOBER = "October",
  NOVEMBER = "November",
  DECEMBER = "December",
}

export type DaysofMonth =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

export enum OccasionType {
  BIRTHDAY = "birthday",
  ANNIVERSARY = "anniversary",
}

export type Occasion = {
  id: string;
  name: string;
  occasionType: OccasionType;
  month: Month;
  day: DaysofMonth;
};

export type AddOccasion = {
  name: string;
  occasionType: OccasionType;
  month: Month;
  day: DaysofMonth;
};

let data: Occasion[] = [
  {
    id: uuidV4(),
    name: "PY",
    occasionType: OccasionType.BIRTHDAY,
    day: 1,
    month: Month.JANUARY,
  },
  {
    id: uuidV4(),
    name: "Sri Yukteswar",
    occasionType: OccasionType.BIRTHDAY,
    month: Month.MAY,
    day: 10,
  },
  {
    id: uuidV4(),
    name: "Gigi Bartha",
    occasionType: OccasionType.BIRTHDAY,
    month: Month.DECEMBER,
    day: 31,
  },
  {
    id: uuidV4(),
    name: "Oliver Guenay",
    occasionType: OccasionType.BIRTHDAY,
    month: Month.NOVEMBER,
    day: 17,
  },
  {
    id: uuidV4(),
    name: "Sophia Waldvogel",
    occasionType: OccasionType.BIRTHDAY,
    month: Month.DECEMBER,
    day: 24,
  },
];

// TODO: fix this
// @ts-ignore
const getOccasions = async (req: Request, res: Response) => {
  res.status(200).send(data);
};

const addOccasion = async (req: Request, res: Response) => {
  const id = uuidV4();
  req.body.id = id;
  const { name, occasionType, month, day } = req.body;
  if (!(name && occasionType && month && day)) {
    console.log("invalid payload - missing fields!");
    res.status(400).send({ error: "some fields are missing" });
  }
  data.push(req.body);
  res.status(200).send(req.body);
};

const deleteOccasion = async (req: Request, res: Response) => {
  data = data.filter((occasion: Occasion) => occasion.id !== req.params.id);
  res.status(204).send();
};

export const occasionsController = {
  getOccasions,
  deleteOccasion,
  addOccasion,
};
