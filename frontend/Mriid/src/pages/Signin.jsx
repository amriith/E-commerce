import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { PasswordInput } from "../components/PasswordInput";
import { Thirdparty } from "../components/Thirdparty";

export const Signin = () => {
    return (
        <div>
          <div className="flex justify-center grid place-items-center bg-gray-200 object-scale-down flex-col shadow-lg rounded-lg   md:w-[400px] h-[370px] mx-auto">
          <div className=" w-full rounded-lg text-center bg-gray-200   justify-center items-center p-2 h-max ">
          <p className="mb-4 text-sm">Sign in with</p> 
          <Thirdparty/>   </div>
          <hr className="flex items-center justify-center w-64 h-px my-2 bg-gray-400 border-0 mt-1 " />
        
          <p className="mb-2 text-sm">Or sign in with credentials</p> 
          
           <Inputbox placeholder={"Email"} label={"Email"}/>
          <PasswordInput placeholder={"Password"} label={"Password"} />
           <Button label={"Sign In"}  />
             </div>  
           
        </div>
    );
};
