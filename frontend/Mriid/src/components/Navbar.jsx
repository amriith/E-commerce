import lightLogo from '../logo/MRIID.png'; 

export const Navbar = () => {
    return (
        <nav className="bg-white dark:bg-gray-800 antialiased">
            <div className="max-w-screen-xl px-9 mx-auto 2xl:px-0 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        {/* Logo Section */}
                        <div>
                            <a href="#" title="Home">
                                {/* Light Mode Logo */}
                                <img
                                    className="block w-auto h-120 dark:hidden"
                                    src={lightLogo}
                                    alt="Light Logo"
                                />
                                {/* Dark Mode Logo */}
                                <img
                                    className="hidden w-auto h-120 dark:block"
                                    src={lightLogo}
                                    alt="Dark Logo"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};