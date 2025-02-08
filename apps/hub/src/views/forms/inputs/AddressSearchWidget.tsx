import { useCallback, useEffect, useState } from "react";
import { Card } from "@shad/card";
import { Separator } from "@shad/separator";
import axios from "axios";
import { Input } from "@shad/input";
import { SiGooglemaps } from 'react-icons/si';
import { X } from "lucide-react";
import { useDebounce } from 'use-debounce'
import { Address } from "@taskboard/types";



export type PlacePrediction = {
  placePrediction: {
    place: string,
    placeId: string,
    text: {
      text: string,
      matches: {
        startOffset?: number
        endOffset?: number
      }[],
    }
  }
}





function useAddressSearch() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<PlacePrediction[]>([]);
  const [selected, setSelected] = useState<PlacePrediction>();
  const [details, setDetails] = useState<Address>()

  const getDetails = (place_id: string) => {
    axios({
      method: 'GET',
      baseURL: `https://places.googleapis.com/v1/places/${place_id}`,
      headers: {
        "Content-Type": 'application/json',
        "X-Goog-Api-Key": 'AIzaSyDcQC1fU7IHnMHjsthxyVCu_xLGWyI6Ltk',
        "X-Goog-FieldMask": "id,formattedAddress,addressComponents"
      }
    }).then((r) => {
      setDetails({ place_id_google: r.data.id as string, formatted: r.data.formattedAddress as string })
      setInput('')
      console.log(r.data);
    }).catch((err) => console.log(err));
  }

  useEffect(() => selected ? getDetails(selected.placePrediction.placeId) : setDetails(undefined), [selected])

  const search = useCallback((inp: string) => {
    axios({
      method: 'POST',
      baseURL: 'https://places.googleapis.com/v1/places:autocomplete',
      headers: {
        "Content-Type": 'application/json',
        'X-Goog-Api-Key': 'AIzaSyDcQC1fU7IHnMHjsthxyVCu_xLGWyI6Ltk'
      },
      data: {
        input: inp,
        includedRegionCodes: ['ca'],
        // includedPrimaryTypes: ['street_address']
      }
    }).then(v => { console.log(v.data); setResults(v.data.suggestions ?? []); }).catch((err) => { console.log(err); });
  }, []);

  const [search_input] = useDebounce(input, 1500, { leading: true, maxWait: 1500 })
  useEffect(() => { search_input.length > 2 ? search(search_input) : setResults([]) }, [search_input, search]);

  return { input, setInput, results, selected, setSelected, getDetails, details, setDetails };
}
export function AddressSearchWidget(props: { value: Address | undefined, onChange: (value?: Address) => void }) {
  const { onChange, value } = props
  const as = useAddressSearch();

  useEffect(() => {
    onChange(as.details)
  }, [as.details])

  return (
    <div className="flex flex-col gap-5">
      {value ?
        <div className="font-mono text-sm bg-gray-100 w-fit p-3 rounded border flex justify-between gap-7">
          <div>
            {value.formatted.split(', ').map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          <X size={15} className="text-gray-500 hover:text-gray-300 hover:cursor-pointer" onClick={() => onChange(undefined)} />
        </div>
        : <div className="rounded overflow-hidden border">
          <Card className="flex justify-between items-center rounded-none p-2 gap-2 bg-gray-100 border-none">
            <div><SiGooglemaps className="size-5" /></div>
            <Input placeholder="Search address..." className="border-none shadow-none text-sm bg-white" value={as.input} onChange={e => as.setInput(e.currentTarget.value)} />
          </Card>
          {(as.results.length > 0) && <Card className="flex flex-col text-left rounded-none border-none">
            {as.results?.map((p) => (
              <div key={p.placePrediction.placeId}>
                <div onClick={() => as.setSelected(p)} className="p-2 hover:bg-slate-100 cursor-pointer font-mono text-xs truncate">{p.placePrediction.text.text}</div>
                <Separator />
              </div>
            ))}
          </Card>}
        </div>}
    </div>
  );
}
