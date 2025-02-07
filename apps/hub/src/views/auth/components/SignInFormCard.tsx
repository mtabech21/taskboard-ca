import { Unauthenticated } from "@taskboard/types";
import { Loader } from "lucide-react";
import { Form, FormField } from "@shad/form";
import { Button } from "@shad/button";
import { Input } from "@shad/input";
import { useSignIn } from "../../../hooks/forms/useSignInForm";
import { Label } from "@shad/label";
import { Checkbox } from "@shad/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shad/dialog";
import SignUpFormCard from "./SignUpFormCard";
import { useState } from "react";

export default function SignInFormCard(props: { auth: Unauthenticated; }) {

  const { form, handler } = useSignIn(props.auth)

  return (
    <div className="flex flex-col w-[400px] gap-8 p-10 text-nowrap select-none">
      <div className="flex flex-col  justify-between h-full">
        <div className="text-3xl font-tb_medium font-extrabold">Sign in</div>
        <Form {...form}>
          <form className={'flex flex-col gap-8'} autoComplete="off" onSubmit={form.handleSubmit(handler)}>
            <div className="flex flex-col gap-3 ">
              <FormField control={form.control} name="email" render={({ field }) =>
                <div className="text-left">
                  <Label className="text-xs text-gray-400 p-1">Email</Label>
                  <Input {...field} className="shadow-none bg-gray-50 border h-10" />
                </div>
              } />
              <FormField control={form.control} name="password" render={({ field }) =>
                <div className="text-left">
                  <div className="flex justify-between p-1">
                    <Label className="text-xs text-gray-400">Password</Label>
                    <div className="text-xs text-gray-300"></div>
                  </div>
                  <Input type="password" {...field} className="shadow-none bg-gray-50 border h-10" />
                </div>
              } />

              <div className="flex justify-between gap-5">
                <FormField control={form.control} name="remember_me" render={({ field }) =>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="bg-gray-50 border-gray-200 shadow-none" />
                    <div className="text-xs font-bold text-gray-600">Remember me</div>
                  </div>
                } />
                <div className="text-xs text-blue cursor-pointer hover:text-gray-500">Forgot Password?</div>
              </div>
            </div>
            <Button className="bg-blue min-w-full text-white hover:bg-blue hover:opacity-85 rounded shadow-md" disabled={(!form.formState.dirtyFields.password || !form.formState.isValid)} type="submit" style={{ width: '6em' }} >{form.formState.isLoading ? <Loader /> : 'Sign In'}</Button>
          </form>
        </Form>
        <div className="text-gray-600 text-sm font-tb_medium">
          <div className="flex p-2 items-center">
            <div className="flex-1 bg-gray-300 h-[1px]" />
            <div className="text-gray-400 px-2">or</div>
            <div className="flex-1 bg-gray-300 h-[1px]" />
          </div>
          <CreateAccountButton auth={props.auth} />
          {/* Don't have an account? <span className="text-blue font-bold text-sm hover:text-gray-500 cursor-pointer">Register</span> */}
        </div>
      </div>

    </div >
  );
}

function CreateAccountButton(props: { auth: Unauthenticated }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)} >
      <Button className="bg-white border-blue border-2 text-blue min-w-full hover:bg-gray-100 rounded shadow-md" style={{ width: '6em' }} onClick={() => setOpen(true)} >Create Account</Button>
      <DialogContent className="p-10">
        <DialogHeader >
          <DialogTitle className="font-tb_medium text-4xl font-extrabold text-center">Create Account</DialogTitle>
        </DialogHeader>
        <SignUpFormCard auth={props.auth} />
      </DialogContent>
    </Dialog>
  )
}


