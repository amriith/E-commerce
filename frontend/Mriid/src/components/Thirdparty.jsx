import githubIcon from "../assets/github.svg";
import googleIcon from "../assets/google.svg";

export const Thirdparty = () => {
   return (
      <div className="flex space-x-2"> 
         {/* Smaller GitHub Button */}
         <button className="bg-white font-medium active:bg-blueGray-50 text-blueGray-700 font-normal px-2 py-1 rounded-md outline-none focus:outline-none uppercase shadow-sm hover:shadow inline-flex items-center text-[10px] ease-linear transition-all duration-150">
            <img className="w-4 mr-1" src={githubIcon} alt="GitHub" /> GITHUB
         </button> 

         {/* Smaller Google Button */}
         <button className="bg-white font-medium active:bg-blueGray-50 text-blueGray-700 font-normal px-2 py-1 rounded-md outline-none focus:outline-none uppercase shadow-sm hover:shadow inline-flex items-center text-[10px] ease-linear transition-all duration-150">
            <img className="w-4 mr-1" src={googleIcon} alt="Google" /> GOOGLE
         </button> 
      </div>
   );
};