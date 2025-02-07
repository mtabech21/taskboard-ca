// import { Auth } from "@/types";
// import { Loader } from "lucide-react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shad/card";
// import { Form, FormField } from "@shad/form";
// import { Button } from "@shad/button";
// import { Input } from "@shad/input";
// import { useSignIn } from "../../../hooks/forms/useSignInForm";

// export default function SignInFormCard(props: { auth: Auth; }) {

//   const { form, handler } = useSignIn(props.auth)
//   const disabled_button = (!form.formState.dirtyFields.password || !form.formState.isValid)

//   return (
//     <Card style={{ maxWidth: '500px', marginTop: '100px' }}>
//       <CardHeader>
//         <CardTitle style={{ padding: '.5em' }}>Login</CardTitle>
//         <CardDescription>Use your credentials to log in.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form className={'flex-col space-y-3'} autoComplete="off" onSubmit={form.handleSubmit(handler)}>
//             <FormField control={form.control} name="email" render={({ field }) => <Input placeholder="user@example.com" {...field} />} />
//             <FormField control={form.control} name="password" render={({ field }) => <Input type="password" placeholder="Password" {...field} />} />
//             <Button disabled={disabled_button} type="submit" style={{ width: '6em' }} >{form.formState.isLoading ? <Loader /> : 'Sign In'}</Button>
//           </form>
//         </Form>
//       </CardContent>
//       <CardFooter>
//       </CardFooter>
//     </Card >
//   );
// }


