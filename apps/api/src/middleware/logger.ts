import { NextFunction, Request, Response } from "express"
import { getRequestUser } from "../tools/get-request-user"
import { bold } from "colors"


const logger = async (req:Request, res: Response, next: NextFunction) => {
  const {first_name, last_name} = await getRequestUser(res)
  const reqstr =
  req.method == 'GET' ? ` ${req.method} `.bgYellow + ` ...${req.originalUrl}`.yellow :
  req.method == 'POST' ? ` ${req.method} `.bgGreen + ` ...${req.originalUrl}`.green :
  req.method == 'UPDATE' ? ` ${req.method} `.bgMagenta + ` ...${req.originalUrl}`.magenta :
  req.method == 'DELETE' ? ` ${req.method} `.bgRed + ` ...${req.originalUrl}`.red :
  ` ${req.method} `.bgBlue + ` ...${req.originalUrl}`.blue
  
  console.group(` ${new Date().toLocaleTimeString()} `.bgBlack + bold(' REQUEST '.rainbow.bgWhite), `${req.headers.origin}`.blue, '-'.magenta, `${first_name} ${last_name}`.cyan)
  console.log(reqstr)
    next(); console.groupEnd()
}

export default logger