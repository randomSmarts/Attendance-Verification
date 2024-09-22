'use client';

import React, { useState } from 'react';
import AttendanceButton from 'app/ui/attendance/button';
import { getUserClassesByEmail } from 'app/lib/actions'; // Updated function to fetch classes by email

const Page = () => {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const fetchedClasses = await getUserClassesByEmail(email); // Directly get the classes array
            setClasses(fetchedClasses); // Set the classes state with the fetched classes
            if (fetchedClasses.length === 0) {
                setMessage('No classes found for this email.');
            } else {
                setMessage('');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setMessage('Failed to fetch classes.');
        }
    };

    return (
        <div>
            <h1>Attendance</h1>
            <form onSubmit={handleEmailSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Get Classes</button>
            </form>
            {message && <p>{message}</p>}
            {classes.length > 0 && (
                <AttendanceButton classes={classes} email={email} /> // Pass classes to AttendanceButton
            )}
        </div>
    );
};

export default Page;
