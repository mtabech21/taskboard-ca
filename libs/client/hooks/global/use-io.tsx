import { useEffect } from "react";
import Contextor from "../contextor";
import io from 'socket.io-client'
import { QueryClient } from "@tanstack/react-query";


export const useIO = new Contextor((config: { url: string, queryClient: QueryClient }) => {
  const client = config.queryClient
  const socket = io(config.url, {
    reconnection: true
  })

  useEffect(() => {
    socket.on('associate_update', (d) => {
      client.invalidateQueries({ predicate: (q) => q.queryKey.includes(d) })
    })
  }, [client])

})