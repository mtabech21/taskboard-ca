
import { ManagerAccount } from "@taskboard/types";
import Contextor from "../contextor";



export const useManagerAccount = new Contextor((config: { account: ManagerAccount }) => {
  return config.account
})