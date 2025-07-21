
import React, { useState, useEffect, useRef } from 'react';

interface UserProfileProps {
    user: { name: string; email: string };
    onLogout: () => void;
    onGenerateCategoryPdf: (categoryName: string) => void;
    categories: string[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onGenerateCategoryPdf, categories }) => {
    const [isOpen, setIsOpen] = useState(false);
    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-teal-300 border-2 border-gray-600 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition"
            >
                {userInitial}
            </button>
            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        <div className="px-4 py-3 border-b border-gray-700">
                            <p className="text-sm text-gray-300" role="none">Signed in as</p>
                            <p className="text-sm font-medium text-white truncate" role="none">{user.name}</p>
                            <p className="text-xs font-medium text-gray-400 truncate" role="none">{user.email}</p>
                        </div>
                        
                        <div className="py-1">
                            <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">Reports</p>
                            {categories.map(categoryName => (
                                <button
                                    key={categoryName}
                                    onClick={() => {
                                        onGenerateCategoryPdf(categoryName);
                                        setIsOpen(false);
                                    }}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-4 py-2 text-sm"
                                    role="menuitem"
                                >
                                    Summary for {categoryName}
                                </button>
                            ))}
                        </div>
                        

                        <div className="border-t border-gray-700 my-1"></div>

                        <button
                            disabled
                            title="Functionality not yet implemented"
                            className="text-gray-500 cursor-not-allowed block w-full text-left px-4 py-2 text-sm"
                            role="menuitem"
                        >
                            Manage Account
                        </button>
                        
                        <div className="border-t border-gray-700 my-1"></div>

                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-4 py-2 text-sm"
                            role="menuitem"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};