
export function Button ({label, onClick}){
    return <button onClick={onClick} className=" text-white bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">{label}</button>
}