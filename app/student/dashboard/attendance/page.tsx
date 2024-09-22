'use client';

import React, { useEffect, useState } from 'react';
import AttendanceButton from 'app/ui/attendance/button';
import { getUserClassesByEmail } from 'app/lib/actions'; // Updated function to fetch classes by email

const Page = () => {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const userClasses = await getUserClassesByEmail(email);
            setClasses(userClasses);
            if (userClasses.length === 0) {
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
            {classes.length > 0 && <AttendanceButton classes={classes} email={email} />} {/* Pass email to button */}
        </div>
    );
};

export default Page;
