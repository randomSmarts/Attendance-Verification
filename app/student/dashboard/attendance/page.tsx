'use client';

import React, { useEffect, useState } from 'react';
import AttendanceButton from 'app/ui/attendance/button';
import { getUserClasses } from 'app/lib/actions';

const Page = ({ userId }) => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            console.log(`Using user ID: ${userId}`); // Logging user ID
            try {
                const userClasses = await getUserClasses(userId); // Fetch classes using the user ID
                setClasses(userClasses);
            } catch (error) {
                console.error('Error fetching classes:', error.message || error);
            }
        };

        fetchClasses();
    }, [userId]); // userId is used as a dependency

    return (
        <div>
            <h1>Attendance</h1>
            <AttendanceButton classes={classes} userId={userId} /> {/* Pass userId to AttendanceButton */}
        </div>
    );
};

export default Page;
