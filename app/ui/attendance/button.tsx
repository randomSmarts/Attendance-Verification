import React, { useState } from 'react';
import { markAttendance } from 'app/lib/actions'; // Adjust import as needed
import { checkAttendanceTiming, checkGeolocation } from 'app/student/dashboard/attendance/utils';

const AttendanceButton = ({ classes, userId }) => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [message, setMessage] = useState('');

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value); // This will set the selected class ID
    };

    const handleAttendance = async () => {
        // Check if a class is selected
        if (!selectedClass) {
            setMessage('Please select a class.');
            return;
        }

        // Existing logic for checking timing and location
        const isWithinTime = await checkAttendanceTiming(selectedClass);
        const isWithinLocation = await checkGeolocation();

        if (isWithinTime && isWithinLocation) {
            const response = await markAttendance(selectedClass, userId); // Pass the selected class ID and user ID
            // Handle response accordingly
        } else {
            setMessage('You are not within the allowed time or location.');
        }
    };

    return (
        <div>
            <select onChange={handleClassChange}>
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
