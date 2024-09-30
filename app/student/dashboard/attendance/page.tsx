'use client';

import React, { useState } from 'react';
import { fetchClassesForUserByEmail3, markAttendance } from 'app/lib/actions'; // Backend actions
import { checkGeolocation } from 'app/utils/attendanceUtils'; // Geolocation logic

export default function AttendancePage() {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to fetch student classes by email
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        console.log('Fetching classes for email:', email);

        try {
            const result = await fetchClassesForUserByEmail3(email);
            console.log('Classes fetched:', result);

            if (result.length === 0) {
                setMessage('No classes found for this email.');
                console.log('No classes found for this email.');
            } else {
                setClasses(result);
            }
        } catch (error) {
            setMessage('Failed to fetch classes.');
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
            console.log('Class fetching complete.');
        }
    };

    // Function to mark attendance and update location
    const handleAttendance = async () => {
        setMessage('');
        setLoading(true);
        console.log('Attempting to mark attendance for class:', selectedClass);

        try {
            // Auto-set present to false initially
            console.log('Setting present status to false.');
            const attendanceResult = await markAttendance(email, selectedClass, false);
            console.log('Initial attendance status set to false:', attendanceResult);

            // Geolocation check
            console.log('Checking geolocation...');
            const { withinLocation, currentCoords } = await checkGeolocation();
            console.log('Geolocation check result:', { withinLocation, currentCoords });

            // Update location regardless of attendance status
            console.log('Updating user location with:', currentCoords);
            await markAttendance(email, selectedClass, false, currentCoords); // Update location, even if not present

            if (!withinLocation) {
                setMessage('You are not within the allowed location.');
                console.log('User is not within the allowed location.');
                return;
            }

            // Time check (handled in the backend)
            console.log('Attempting to set attendance to true based on location and time...');
            const timeResult = await markAttendance(email, selectedClass, true, currentCoords);

            if (timeResult.success) {
                setMessage('Attendance marked successfully.');
                console.log('Attendance marked successfully.');
            } else {
                setMessage('Failed to mark attendance. Please contact your teacher.');
                console.log('Attendance marking failed:', timeResult.message);
            }
        } catch (error) {
            setMessage('Failed to mark attendance.');
            console.error('Error during attendance marking:', error);
        } finally {
            setLoading(false);
            console.log('Attendance process complete.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Attendance Verification</h1>

            <form onSubmit={handleEmailSubmit} className="mb-8">
                <label htmlFor="email" className="block mb-2 font-medium">Enter your email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-4"
                    placeholder="student@example.com"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Classes'}
                </button>
            </form>

            {/* Class selection dropdown */}
            {classes.length > 0 && (
                <div className="mb-8">
                    <label htmlFor="classSelect" className="block mb-2 font-medium">Select a Class:</label>
                    <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border p-2 w-full mb-4"
                        required
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Attendance Button */}
            {selectedClass && (
                <button
                    onClick={handleAttendance}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify Attendance'}
                </button>
            )}

            {message && <div className="text-red-500 mt-4">{message}</div>}
        </div>
    );
}
