export const Inputbox = ({ label, onChange, placeholder }) => {
    return (
        <div className="relative w-full">
            {/* Label */}
            {label && <label className="block text-sm font-medium mb-2 text-left">{label}</label>}

            {/* Input Box */}
            <input
                type="text"
                onChange={onChange}
                placeholder={placeholder}
                className="rounded-lg bg-gray-100 w-full text-black px-4 py-2 flex items-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>
    );
};