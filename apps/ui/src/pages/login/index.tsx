import { SignIn, SignUp } from "@clerk/clerk-react";
import styles from './index.module.css';


const Login = () => {
  return (
    <div className={styles.container}>
            <SignUp />
            <SignIn path="/sign-in" forceRedirectUrl="/occasions" signUpForceRedirectUrl="/occasions" />
    </div>
  );
}



export default Login;