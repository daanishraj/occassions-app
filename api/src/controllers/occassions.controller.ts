import type { Request, Response } from "express";


const getOccasions = (req: Request, res: Response) => {
    console.log('inside getOccassions')
    res.send(200)
}

export const occassionsController = {
    getOccasions
}