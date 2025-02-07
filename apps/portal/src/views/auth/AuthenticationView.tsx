
import { LoadingView } from "./components/LoadingView";
import logo from '../../assets/tb_logo_black.svg'
import SignInFormCard from "./components/SignInFormCard";

import { Unauthenticated } from "@taskboard/types";


export default function AuthenticationView(props: { auth: Unauthenticated }) {


  return (

    props.auth.isLoading ?
      <LoadingView />
      :
      <div className="flex flex-col justify-center w-fit m-auto">
        <img src={logo} alt="logo" style={{ maxHeight: '1.5em', userSelect: 'none', aspectRatio: "auto", marginTop: '150px' }} />
        <div style={{ fontSize: '3em' }} className="px-3 py-1 font-mono">ADMIN PORTAL</div>
        <SignInFormCard auth={props.auth} />
        <footer style={{ fontSize: '0.8em', marginTop: '50px', opacity: '0.5' }}>COPYRIGHT 2024 © METE SOLUTIONS INC.</footer>
      </div>

  );
}
