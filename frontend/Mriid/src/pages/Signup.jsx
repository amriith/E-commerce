import { Thirdparty } from "../components/Thirdparty";

export const Signup = () => {
    return (
        <div className="flex justify-center  bg-white flex-col shadow-lg rounded-lg">
                   
         <div className=" w-full rounded-lg text-center bg-white w-80 justify-center items-center p-2 h-max ">
            <p className="mb-2">Sign up with</p> 
                     
        <div className="btn-wrapper text-center relative flex flex-col min-w-0 break-words items-center w-full mb-6  rounded-lg bg-blueGray-200 border-0">
        <Thirdparty/>  
      
        <hr class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700">
           
            </hr>
           
            </div>
         </div>
        </div>
      
          
        
    );
};