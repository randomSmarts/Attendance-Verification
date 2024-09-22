import React, { useState } from 'react';
import { markAttendance } from 'app/lib/actions'; // Ensure correct import path for markAttendance function
import { checkAttendanceTiming, checkGeolocation } from 'app/student/dashboard/attendance/utils'; // Ensure correct import path for utility functions

const AttendanceButton = ({ classes, email }) => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [message, setMessage] = useState('');

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value); // Set the selected class ID
    };

    const handleAttendance = async () => {
        // Ensure a class is selected
        if (!selectedClass) {
            setMessage('Please select a class.');
            return;
        }

        // Call the timing and geolocation functions
        const isWithinTime = await checkAttendanceTiming(selectedClass); // Check if within time window
        const isWithinLocation = await checkGeolocation(); // Check if within location range

        if (isWithinTime && isWithinLocation) {
            // Call markAttendance to update the database if both checks pass
            const response = await markAttendance(selectedClass, email);
            setMessage(response.message);
        } else {
            // If either check fails, display an appropriate message
            setMessage('You are not within the allowed time or location.');
        }
    };

    return (
        <div>
            {/* Dropdown to select a class */}
            <select onChange={handleClassChange} value={selectedClass}>
                <option value="">Select a class</option>
                {classes.map((classData) => (
                    <option key={classData.id} value={classData.id}>
                        {classData.name}
                    </option>
                ))}
            </select>

            {/* Button to mark attendance */}
            <button onClick={handleAttendance}>Mark Attendance</button>

            {/* Display message to the user */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default AttendanceButton;
