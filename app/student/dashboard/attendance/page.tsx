'use client';

import React, { useEffect, useState } from 'react';
import { fetchClassesForUserByEmail3, markAttendance } from 'app/lib/actions'; // Backend actions
import { checkGeolocation } from 'app/utils/attendanceUtils'; // Geolocation logic

export default function AttendancePage() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    // Fetch classes when the page loads
    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        console.log('Retrieved email from localStorage:', userEmail); // Debug log

        if (!userEmail) {
            setMessage('Error: Unable to retrieve your email. Please log in again.');
            return;
        }

        setEmail(userEmail);
        fetchClasses(userEmail);
    }, []);

    const fetchClasses = async (userEmail) => {
        setLoading(true);
        setMessage('');
        try {
            const result = await fetchClassesForUserByEmail3(userEmail);
            if (result.length === 0) {
                setMessage('No classes found for your account.');
            } else {
                setClasses(result);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setMessage('Failed to fetch classes.');
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async () => {
        if (!email) {
            setMessage('Error: Unable to retrieve your email.');
            return;
        }

        setMessage('');
        setLoading(true);
        try {
            const attendanceResult = await markAttendance(email, selectedClass, false);
            const { withinLocation, currentCoords } = await checkGeolocation();

            await markAttendance(email, selectedClass, false, currentCoords);

            // if (!withinLocation) {
            //     setMessage('You are not within the allowed location.');
            //     return;
            // }

            const timeResult = await markAttendance(email, selectedClass, true, currentCoords);
            if (timeResult.success) {
                setMessage('Attendance marked successfully.');
            } else {
                setMessage('Attendance verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            setMessage('Failed to mark attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Attendance Verification</h1>
            {loading && <p>Loading classes...</p>}

            {classes.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Select Your Class</h2>
                    <ul className="space-y-4">
                        {classes.map((cls) => (
                            <li key={cls.id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="text-md font-semibold">{cls.name}</h3>
                                    {cls.timings && (
                                        <p className="text-gray-500 text-sm">
                                            Schedule: {cls.timings.map((t) => `${t.day} ${t.startTime}`).join(', ')}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedClass(cls.id)}
                                    className={`px-4 py-2 rounded ${
                                        selectedClass === cls.id
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400 text-black'
                                    }`}
                                >
                                    {selectedClass === cls.id ? 'Selected' : 'Select'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedClass && (
                <button
                    onClick={handleAttendance}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Marking Attendance...' : 'Verify Attendance'}
                </button>
            )}

            {message && <div className="text-red-500 mt-4">{message}</div>}
        </div>
    );
}