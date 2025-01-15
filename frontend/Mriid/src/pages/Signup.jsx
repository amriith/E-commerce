import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { Thirdparty } from "../components/Thirdparty";

export const Signup = () => {
    return (
<div>
<div className="flex justify-center grid place-items-center bg-gray-200  flex-col shadow-lg rounded-lg  w-[400px] md:w-[500px] mx-auto">
<div className=" w-full rounded-lg text-center bg-gray-200  w-80 justify-center items-center p-2 h-max ">
<p className="mb-4 text-sm">Sign up with</p> 
<div className="btn-wrapper text-center relative flex flex-col min-w-0 break-words items-center w-full mb-2  rounded-lg bg-blueGray-200 border-0">
<Thirdparty/>  
</div>
</div>
<hr className="flex items-center justify-center w-64 h-px my-3 bg-gray-400 border-0 mt-1 " />

<p className="mb-4 text-sm">Or sign up with credentials</p> 
 <Inputbox placeholder={"Name"} label={"First Name"}/>
 <Inputbox placeholder={"Last Name"} label={"Last Name"}/>
 <Inputbox placeholder={"Email"} label={"Email"}/>
 <Inputbox placeholder={"Password"} label={"Password"} />
 <Button label={"Create Account"} /> 


</div>
</div>  
        
    );
};