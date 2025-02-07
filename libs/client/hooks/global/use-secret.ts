import { QueryClient, useQuery } from "@tanstack/react-query";
import { encryptWithPublicKey, importPublicKey } from "@taskboard/tools/functions/public_key";
import axios from "axios";



export function useSecret(client?: QueryClient) {

  const { data: public_key_string, isSuccess, refetch, } = useQuery({
    queryKey: ['public_key'],
    queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/public/key`).then(r => r.data)
  }, client)

  async function encrypt(str: string) {
    if (isSuccess) {
      const public_key = await importPublicKey(public_key_string)
      return await encryptWithPublicKey(public_key, str)
    } else {
      throw new Error('NO PUBLIC KEY')
    }
  }

  return isSuccess ? { encrypt, isSuccess, refetch } : { refetch }
}

