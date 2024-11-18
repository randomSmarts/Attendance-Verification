'use client';

import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
    const router = useRouter();

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <p className="text-lg mt-2">This is an example dashboard and not your actual data.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
                {/* School Classes Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">School Classes</h2>
                    <p className="text-gray-700 mb-4">
                        Manage your classes and track attendance for each session.
                    </p>
                    <ul className="text-gray-700 list-disc pl-4 mb-4">
                        <li>Mathematics - Class A</li>
                        <li>Physics - Class B</li>
                        <li>History - Class C</li>
                    </ul>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('/classes/manage')}
                    >
                        View Classes & Attendance
                    </button>
                </section>

                {/* Profile Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Profile</h2>
                    <p className="text-gray-700 mb-4">Update your personal information and teaching preferences.</p>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src="https://via.placeholder.com/50"
                            alt="Profile Avatar"
                            className="w-12 h-12 rounded-full border"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-800">Jane Doe</p>
                            <p className="text-sm text-gray-500">janedoe@example.com</p>
                        </div>
                    </div>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('/profile/edit')}
                    >
                        Edit Profile
                    </button>
                </section>

                {/* Quick Actions Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-blue-600 mb-4">Quick Actions</h2>
                        <p className="text-gray-700 mb-6">
                            Perform tasks quickly, like adding a class or deleting an existing one.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 mt-auto">
                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                            onClick={() => router.push('/classes/add')}
                        >
                            Add New Class
                        </button>
                        <button
                            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-400 transition"
                            onClick={() => router.push('/classes/delete')}
                        >
                            Delete Class
                        </button>
                    </div>
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
                            Receive updates about school events, assignments, and announcements.
                        </p>
                        <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    {/* Support */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Need Help?</h3>
                        <p className="text-gray-700 mb-4">
                            Get assistance with managing your classes, attendance, or technical issues.
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