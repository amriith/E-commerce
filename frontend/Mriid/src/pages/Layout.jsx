 import { Outlet } from "react-router-dom";

 export const Layout = () => {
     return (
      <div className="absolute top-0 w-full h-full bg-gray-800  bg-cover flex items-center justify-center">
            <Outlet />
        </div>
     )
 }