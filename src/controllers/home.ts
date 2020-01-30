import { Request, Response } from "express";
export let getStatus = (request: Request, response: Response) => {
    response.status(200).send("API is up and running!!");
};