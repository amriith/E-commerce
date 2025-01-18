
export function Button({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="text-white bg-black text-lg font-medium uppercase px-3 py-2 rounded-md shadow-sm hover:shadow outline-none focus:outline-none mr-0.5 mb-0.5 w-full ease-linear transition-all duration-150"
        >
            {label}
        </button>
    );
}