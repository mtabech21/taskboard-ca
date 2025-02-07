import axios from "axios";
import Contextor from "../contextor";
import { useMemo } from "react";
import { Authentication } from "@taskboard/types";


export const useAPI = new Contextor((config: { url: string, auth: Authentication }) => {
  const { auth, url } = config
  const api = useMemo(() => axios.create({
    baseURL: url,
    withCredentials: true
  }), [auth]);


  return api
})








