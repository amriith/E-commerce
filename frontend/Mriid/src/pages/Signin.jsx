import { BottomWarning } from "../components/bottomWarning";
import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { PasswordInput } from "../components/PasswordInput";
import { Thirdparty } from "../components/Thirdparty";

export const Signin = () => {
    return (
        <div class>
          <div className="flex justify-center grid place-items-center bg-gray-200 object-scale-down flex-col shadow-lg rounded-lg   md:w-[450px] h-[500px] mx-auto">
          <div className="w-full rounded-lg text-center bg-gray-200 flex flex-col justify-center items-center p-4 h-max">
   
        <p className="mb-2 text-lg">Sign in with</p> 

       <div className="flex justify-center items-center">
        <Thirdparty />
          </div>
          </div>

   <hr className="w-64 h-px bg-gray-400 border-0 mt-1" />


<p className="mb-2 text-lg">Or sign in with credentials</p>
          
           <Inputbox placeholder={"Email"} label={"Email"}/>
          <PasswordInput placeholder={"Password"} label={"Password"} />
           <Button label={"Sign In"}  />
             </div>  
             <BottomWarning label={"New to Mriid?"} buttonText={"Create an account"} to={"/signup"}/>
        </div>
        
    );
};
