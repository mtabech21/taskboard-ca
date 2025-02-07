import { NextFunction, Request, Response } from "express";

const errors = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.group(` ERRORED `.bgRed, `${req.headers.origin}`, '-', `${req.ip}`.cyan, ` ${req.method} `.bgYellow, `...${req.originalUrl}`.yellow)
  console.log(`${new Error(String(error)).stack}`.red.bgBlack); console.log(); console.groupEnd()
  res.sendStatus(500)
  next()
}

export default errors