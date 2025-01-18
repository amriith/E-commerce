export const Inputbox = ({ label, onChange, placeholder }) => {
    return (
        <div className="relative w-full">
            {/* Label */}
            {label && (
                <label className="block text-lg font-medium mb-1 text-left">
                    {label}
                </label>
            )}

            {/* Input Box */}
            <input
                type="text"
                onChange={onChange}
                placeholder={placeholder}
                className="rounded-md bg-gray-100 w-full text-black px-2 py-1 text-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
        </div>
    );
};