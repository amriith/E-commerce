import { BottomWarning } from "../components/bottomWarning";
import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { PasswordInput } from "../components/PasswordInput";
import { Thirdparty } from "../components/Thirdparty";

export const Signup = () => {
    return (
<div>
<div className="flex justify-center grid place-items-center bg-gray-200 object-scale-down flex-col shadow-lg rounded-lg   md:w-[450px] h-[550px] mx-auto">
<div className="w-full rounded-md text-center bg-gray-200 justify-center items-center p-1 h-max">
 
    <p className="mb-2 text-lg">Sign up with</p> 

  
    <div className="btn-wrapper text-center relative flex flex-col min-w-0 break-words items-center w-full mb-1 rounded-md bg-blueGray-200 border-0">
        <Thirdparty />
    </div>
</div>

<hr className="flex items-center justify-center w-40 h-[1px] my-2 bg-gray-400 border-0 mt-0.5" />

<p className="mb-2 text-lg">Or sign up with credentials</p>

 <Inputbox placeholder={"Name"} label={"First Name"}/>
 <Inputbox placeholder={"Last Name"} label={"Last Name"}/>
 <Inputbox placeholder={"Email"} label={"Email"}/>
 <PasswordInput placeholder={"Password"} label={"Password"} />

 <Button label={"Create Account"} /> 
 </div>
 <BottomWarning label={"Welcome back! "}  buttonText={"Login here"} to={"/signin"} />
</div> 

  
        
    );
};