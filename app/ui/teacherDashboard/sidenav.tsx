'use client';

import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function SideNav() {
    const [isClassesDropdownOpen, setIsClassesDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsClassesDropdownOpen(!isClassesDropdownOpen);
    };

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            {/* Logo Link */}
            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
                href="/"
            >
                <div className="w-32 text-white md:w-40">
                    <AcmeLogo />
                </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <nav className="flex flex-col space-y-2 w-full">

                    {/* School Classes Link with Dropdown */}
                    <div className="flex flex-col">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center justify-between gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
                        >
                            <span>School Classes</span>
                            {isClassesDropdownOpen ? (
                                <ChevronUpIcon className="w-5" />
                            ) : (
                                <ChevronDownIcon className="w-5" />
                            )}
                        </button>

                        {/* Dropdown Content */}
                        {isClassesDropdownOpen && (
                            <div className="ml-4 mt-2 space-y-2">
                                <Link legacyBehavior={true} href="app/student/dashboard/schoolClasses/viewClasses" passHref>
                                    <a className="block rounded-md bg-gray-50 p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                                        View Classes
                                    </a>
                                </Link>
                                <Link legacyBehavior={true} href="app/student/dashboard/schoolClasses/editClass" passHref>
                                    <a className="block rounded-md bg-gray-50 p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                                        Edit a Class
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Profile Link */}
                    <Link legacyBehavior={true} href="app/student/dashboard/profile" passHref>
                        <a className="flex items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                            <span>Profile</span>
                        </a>
                    </Link>
                </nav>

                {/* Sign Out Button */}
                <form>
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        <PowerIcon className="w-6" />
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}
