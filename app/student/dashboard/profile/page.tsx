'use client';

import React, { useEffect, useState } from 'react';
import { getUserInfoByEmail, fetchClassesForUserByEmail } from 'app/lib/actions'; // Ensure correct import path

export default function ViewUserInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [userClasses, setUserClasses] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            const userEmail = localStorage.getItem('email');
            console.log('Retrieved email from localStorage:', userEmail); // Debugging

            if (!userEmail) {
                setError('Error: Unable to retrieve your email. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                // Fetch the user info by email
                const data = await getUserInfoByEmail(userEmail);
                setUserInfo(data);

                // Fetch the classes for the user
                const classesData = await fetchClassesForUserByEmail(userEmail);
                setUserClasses(classesData);
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'An error occurred while fetching your data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">View Your Profile</h1>

            {/* Loading state */}
            {loading && <p className="text-blue-500 mb-4">Loading your information...</p>}

            {/* Error message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* User Info */}
            {userInfo && (
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">User Info</h2>
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Role:</strong> {userInfo.role}</p>
                    <p><strong>Location:</strong> Latitude: {userInfo.locationlatitude}, Longitude: {userInfo.locationlongitude}</p>
                    <p><strong>Attendance Status:</strong> {userInfo.present ? 'Present' : 'Absent'}</p>

                    <h3 className="text-lg font-semibold mt-4">Enrolled Classes:</h3>
                    <ul className="list-disc ml-5">
                        {userClasses.length > 0 ? (
                            userClasses.map((cls: any) => (
                                <li key={cls.id}>
                                    <p>{cls.name}</p>
                                    <ul>
                                        {/* Loop through each timing for the class */}
                                        {cls.timings && Array.isArray(cls.timings) ? (
                                            cls.timings.map((timing: any, index: number) => (
                                                <li key={index}>
                                                    <strong>{timing.day}</strong>: {timing.startTime} - {timing.endTime}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No timings available.</li>
                                        )}
                                    </ul>
                                </li>
                            ))
                        ) : (
                            <li>No classes found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}