'use client';

import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const router = useRouter();

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-lg mt-2">This is an example dashboard and not your actual data.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Attendance Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Attendance</h2>
                    <p className="text-gray-700 mb-4">
                        Keep track of your attendance and verify your location.
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Today's Status:</span>
                        <span className="text-sm font-bold text-green-600">Present</span>
                    </div>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('./dashboard/attendance')}
                    >
                        View Attendance
                    </button>
                </section>

                {/* School Classes Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">School Classes</h2>
                    <p className="text-gray-700 mb-4">
                        Access your class schedule and manage your academic responsibilities.
                    </p>
                    <ul className="text-gray-700 list-disc pl-4 mb-4">
                        <li>Mathematics - 10:00 AM</li>
                        <li>Physics - 12:00 PM</li>
                        <li>History - 2:00 PM</li>
                    </ul>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('./dashboard/schoolClasses/viewClasses')}
                    >
                        Manage Classes
                    </button>
                </section>

                {/* Profile Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Profile</h2>
                    <p className="text-gray-700 mb-4">
                        Update your personal details and preferences to keep your profile up-to-date.
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src="https://via.placeholder.com/50"
                            alt="Profile Avatar"
                            className="w-12 h-12 rounded-full border"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-800">John Doe</p>
                            <p className="text-sm text-gray-500">johndoe@example.com</p>
                        </div>
                    </div>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('./dashboard/profile')}
                    >
                        Edit Profile
                    </button>
                </section>
            </div>

            {/* Additional Features Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Coming Soon</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Notifications */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Notifications</h3>
                        <p className="text-gray-700 mb-4">
                            Stay informed about important updates and announcements.
                        </p>
                        <ul className="text-gray-700 list-disc pl-4 mb-4">
                            <li>Mid-term exams start next week.</li>
                            <li>Sports day scheduled for Friday.</li>
                            <li>New assignment uploaded for Physics.</li>
                        </ul>
                        <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    {/* Support */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Need Help?</h3>
                        <p className="text-gray-700 mb-4">
                            Facing issues or have questions? Contact the support team for assistance.
                        </p>
                        <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}