import React, { useState } from 'react';
import { markAttendance } from 'app/lib/actions'; // Import the markAttendance action
import { checkAttendanceTiming, checkGeolocation } from 'app/student/dashboard/attendance/utils'; // Utility functions

const AttendanceButton = ({ email, classes }) => {
    const [selectedClass, setSelectedClass] = useState('');
    const [message, setMessage] = useState('');

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value); // Set the selected class ID
    };

    const handleAttendance = async () => {
        if (!selectedClass) {
            setMessage('Please select a class.');
            return;
        }

        // Check attendance timing
        const isWithinTime = await checkAttendanceTiming(selectedClass);

        // Check if the user is within geolocation range
        const { success, latitude, longitude } = await checkGeolocation();

        if (isWithinTime && success) {
            // Mark attendance if both checks pass
            const response = await markAttendance(selectedClass, email, latitude, longitude);
            setMessage(response.message);
        } else {
            setMessage('You are not within the allowed time or location.');
        }
    };

    return (
        <div>
            <select onChange={handleClassChange} value={selectedClass}>
                <option value="">Select a class</option>
                {classes.map((classData) => (
                    <option key={classData.id} value={classData.id}>
                        {classData.name}
                    </option>
                ))}
            </select>

            <button onClick={handleAttendance}>Mark Attendance</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AttendanceButton;
