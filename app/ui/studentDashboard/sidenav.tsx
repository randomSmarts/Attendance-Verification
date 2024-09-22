import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo'; // Assuming you still want to use this logo
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
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
                    <Link legacyBehavior href="/app/student/dashboard/attendance" passHref>
                        <a className="flex items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                            <span>Attendance</span>
                        </a>
                    </Link>
                    <Link legacyBehavior href="/app/student/dashboard/schoolClasses" passHref>
                        <a className="flex items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                            <span>School Classes</span>
                        </a>
                    </Link>
                    <Link legacyBehavior href="/app/student/dashboard/profile" passHref>
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
