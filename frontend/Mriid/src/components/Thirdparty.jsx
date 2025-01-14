import githubIcon from "../assets/github.svg";
import googleIcon from "../assets/google.svg";

export const Thirdparty = () => {
   return  (
    <div> 
    <button className="bg-white font-semibold active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150">
       <img className="w-5 mr-1" src={githubIcon} alt="GitHub" />  GITHUB

    </button> 
    <button className="bg-white font-semibold active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150">
       <img className="w-5 mr-1" src={googleIcon} alt="GitHub" />  GOOGLE

    </button> 

    </div>
   )
}