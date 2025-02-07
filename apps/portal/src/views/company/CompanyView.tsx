
import { Input } from "@shad/input"
import { Plus, PlusSquare } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Branch, Company, CompanyPosition } from "@taskboard/types"
import { useAPI } from "@taskboard/client/hooks/global/use-api"
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"

function CompanyView() {
  const { company, branches } = useManagerAccount.context()


  return (
    <div className="text-left p-10 h-full overflow-scroll">
      <div className="flex flex-col gap-3">
        <div className="text-4xl font-bold">Company Information</div>
        <div className="grid grid-cols-2 gap-5 my-2 w-full bg-gray-50 p-5 rounded border">
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-semibold text-gray-600">Company Name:</div>
            <div className="font-mono">{company.name}</div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-semibold text-gray-600">Domain:</div>
            <div className="font-mono">{company.domain}</div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-semibold text-gray-600">Address:</div>
            <div className="font-mono">{
              company.address.split(', ').map((l) => <div key={l}>{l}</div>)
            }</div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-semibold text-gray-600">Admin Email:</div>
          </div>
        </div>
      </div>

      <BranchesList branches={branches} />
      <PositionsList company={company} />

    </div>
  )
}



function BranchesList(props: { branches: Branch[] }) {
  const nav = useNavigate()

  const list = props.branches.sort((a, b) => {
    const aIsLetter = isNaN(Number(a.number)); const bIsLetter = isNaN(Number(b.number));
    return (aIsLetter && bIsLetter) ? a.number.localeCompare(b.number) : aIsLetter ? -1 : bIsLetter ? 1 : Number(a.number) - Number(b.number)
  })

  const Head = () => <div className="p-2 border-b flex justify-between *:flex-1 whitespace-nowrap text-sm font-semibold text-slate-600">
    <div>Branches</div>
  </div>
  const Row = (props: { branch: Branch }) => <div className="p-2 border-b flex justify-between *:flex-1 whitespace-nowrap">
    <div>{props.branch.number}</div>
    <div>{props.branch.name}</div>
  </div>

  return (
    <div>
      <div className="text-2xl font-bold flex items-center gap-3 my-3">
        <div>Branches</div><PlusSquare className="text-blue-600 hover:text-blue-400 hover:cursor-pointer" onClick={() => nav('/branches/new', { replace: true })} />
      </div>
      <div className="flex flex-col border rounded justify-start">
        <Head />
        {list.map((b) => (
          <Row key={b.id} branch={b} />
        ))}
      </div>
    </div>
  )
}

function PositionsList(props: { company: Company }) {
  const api = useAPI.context()

  const [positions, set_positions] = useState<CompanyPosition[]>([])
  const [input, set_input] = useState('')

  const loadPositions = useCallback((company_id: string) => {
    api.get<CompanyPosition[]>(`/payroll/positions/${company_id}`)
      .then((r) => { set_positions(r.data); return })
      .catch((e) => { throw e })
  }, [api])

  function addPosition(position: { name: string }) { api.post<CompanyPosition>(`/payroll/positions/${props.company.id}`, position).then(() => { set_input(''); loadPositions(props.company.id) }) }

  useEffect(() => { loadPositions(props.company.id) }, [props.company.id, loadPositions])

  const Head = () => <div className="p-2 border-b flex justify-between *:flex-1 whitespace-nowrap text-sm font-semibold text-slate-600">
    <div>Position</div>
  </div>
  const Row = (props: { position: CompanyPosition }) => <div className="p-2 border-b flex justify-between *:flex-1 whitespace-nowrap">
    <div>{props.position.name}</div>
  </div>

  return (
    <div>
      <div className="text-2xl font-bold flex items-center gap-3 my-3"><div>Positions</div> </div>
      <div className="flex flex-col border rounded justify-start">
        <Head />
        {positions.map((p) => (
          <Row key={p.id} position={p} />
        ))}
        <form className="w-full flex justify-center items-center p-1 gap-3" onSubmit={(e) => { e.preventDefault(); input.length > 3 && addPosition({ name: input }) }}>
          <Input value={input} onChange={(v) => set_input(v.currentTarget.value)} />
          <Plus className="text-blue-600 hover:text-blue-400 hover:cursor-pointer" onClick={() => input.length > 3 && addPosition({ name: input })} />
        </form>
      </div>
    </div>
  )
}



// function BranchInfoRow() {
//   return (
//     <div>

//     </div>
//   )
// }


export default CompanyView