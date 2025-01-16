import { useState } from "react";

export const PasswordInput = ({ onChange, label, placeholder }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="relative w-full">
            {/* Label */}
            {label && <label className="block text-sm font-medium mb-2 text-left">{label}</label>}

            {/* Password Input */}
            <input
                type={isPasswordVisible ? "text" : "password"} // Toggles between "password" and "text"
                onChange={onChange}
                placeholder={placeholder}
                className="rounded-lg bg-gray-100 w-full text-black px-4 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle state
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-blue-500"
            >
                {isPasswordVisible ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.7 2.13-2.684 3.984-5.542 4.982m-9-2.87a9.001 9.001 0 01-1.516-2.112m10.328 2.962A8.963 8.963 0 0012 15c-4.478 0-8.268-2.943-9.542-7a9.01 9.01 0 011.516-2.112"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223a9.009 9.009 0 012.573-2.915M15 12a3 3 0 00-6 0 3 3 0 006 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15c4.478 0 8.268-2.943 9.542-7a9.01 9.01 0 00-1.516-2.112m-7.838 2.962A8.963 8.963 0 0012 9c-4.478 0-8.268 2.943-9.542 7 .7 2.13 2.684 3.984 5.542 4.982M8.45 16.136a9.001 9.001 0 01-1.516-2.112"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
};