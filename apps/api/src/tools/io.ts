import { Request } from "express";
import { DefaultEventsMap, Server } from "socket.io";

export type IOServer = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export function getIO(req: Request) {
  return req.app.get('io') as IOServer
}