// import supabase from '../../../supabase';

import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";


type LoginCredentials = {
    email: string;
    password: string
}

enum Action {
    SIGNUP = "signup",
    LOGIN = "login"
}



const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [action, setAction] = React.useState<Action>(Action.LOGIN);

    const form = useForm<LoginCredentials>({
        mode: "controlled",
        validateInputOnChange: true,
        initialValues: { email: "", password: "" },
    
        // validate: {
        //   email: isEmail("Invalid email"),
        // },
      });

      const handleSubmit = async (values: typeof form.values) => {
        console.log('submit!');
        
        try {

            if (action === Action.SIGNUP) {


            // let { data, error } = await supabase.auth.signUp({
                // email: 'someone@email.com',
                // password: 'FnTVoauKWklMVUXumGMT'
                // email: email,
                // password: password
            // })

            // console.log({ data, error});
            return;
            }

            // let { data, error } = await supabase.auth.signInWithPassword({
            //     email: email,
            //     password: password
            // })

            // console.log({ data, error});



        }  catch (error) { 
            console.log( { error });

        }

        console.log({ values });

      };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              mt="sm"
              label="Email"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
              withAsterisk
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          <TextInput
            label="password"
            placeholder="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
            withAsterisk
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <Button onClick={()=>setAction(Action.LOGIN)}  type="submit" mt="sm">
            Login
          </Button>
          <Button onClick={()=> setAction(Action.SIGNUP)}type="submit" mt="sm">
            Sign Up!
          </Button>
        </form>
      );

}



export default Login;