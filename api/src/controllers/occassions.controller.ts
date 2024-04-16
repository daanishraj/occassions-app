import type { Request, Response } from "express";

enum OccassionType {
  BIRTHDAY = "birthday",
  ANNIVERSARY = "anniversary",
}

export type Occassion = {
  id: number;
  name: string;
  occassionType: OccassionType;
  date: string;
  comment?: string;
};

const testData: Occassion[] = [
  {
    id: 1001,
    name: "PY",
    occassionType: OccassionType.BIRTHDAY,
    date: "05/01",
  },
  {
    id: 1002,
    name: "Sri Yukteswar",
    occassionType: OccassionType.BIRTHDAY,
    date: "10/05",
  },
  {
    id: 1003,
    name: "Gigi Bartha",
    occassionType: OccassionType.BIRTHDAY,
    date: "31/12",
  },
  {
    id: 1004,
    name: "Oliver Guenay",
    occassionType: OccassionType.BIRTHDAY,
    date: "17/11",
  },
  {
    id: 1005,
    name: "Sophia Waldvogel",
    occassionType: OccassionType.BIRTHDAY,
    date: "24/12",
  },
];

const getOccasions = (req: Request, res: Response) => {
  console.log({ req });

  console.log("inside getOccassions");
  res.status(200).send(testData);
};

export const occassionsController = {
  getOccasions,
};
