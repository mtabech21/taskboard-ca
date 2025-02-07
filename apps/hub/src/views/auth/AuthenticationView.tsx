import { Unauthenticated } from "@taskboard/types";
import { LoadingView } from "./components/LoadingView";
import logo from '@assets/images/logo.svg'
import SignInFormCard from "./components/SignInFormCard";
import { Dialog, DialogTrigger } from "@shad/dialog";

export default function AuthenticationView(props: { auth: Unauthenticated }) {

  return (
    props.auth.isLoading ?
      <LoadingView />
      :
      <div className="flex flex-col justify-evenly h-full w-full">
        <div className="flex flex-col md:flex-row md:justify-evenly justify-start items-center gap-10 p-20 bg-white w-full h-full">
          <TaskboardLogo />
          <Dialog open={true}>
            <DialogTrigger />
          </Dialog>
          <SignInFormCard auth={props.auth} />
        </div>
        <Footer />
      </div>

  );
}

function Footer() {
  return (
    <div className="flex flex-wrap justify-center gap-5 text-gray-700 p-3 text-sm">
      <div className="cursor-pointer hover:underline">About</div>
      <div className="cursor-default text-gray-400">•</div>
      <div className="cursor-pointer hover:underline">Contact Us</div>
      <div className="cursor-default text-gray-400">•</div>
      <div className="cursor-pointer hover:underline">Download App</div>
      <div className="cursor-default text-gray-400">•</div>
      <div className="cursor-pointer hover:underline">Terms of Service</div>
      <div className="cursor-default text-gray-400">•</div>
      <div className="cursor-pointer hover:underline">Privacy Policy</div>
      <div className="cursor-default text-gray-400">© 2024 METE SOLUTIONS INC.</div>
    </div>
  )
}


function TaskboardLogo() {
  return (

    <div className="flex flex-col items-center gap-7 font-tb_medium select-none">
      <div className="text-7xl font-extralight text-nowrap">simplify <span className="font-extrabold">growth</span></div>
      <div className="flex items-baseline gap-3">
        <div className="font-extrabold">with</div>
        <div className="flex items-center">
          <img src={logo} alt="logo" draggable='false' className="h-[4em]" style={{ maxHeight: '2em', userSelect: 'none', aspectRatio: "auto" }} />
          <div className="relative">
          </div>
        </div>
      </div>
    </div>

  )
}
