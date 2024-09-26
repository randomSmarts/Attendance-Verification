'use client';

import React, { useState } from 'react';
import AttendanceButton from 'app/ui/attendance/button';
import { fetchClassesForUserByEmail, fetchStudentsByClassId } from 'app/lib/actions'; // Ensure correct imports
import Modal from 'app/ui/teacherDashboard/Modal'; // Adjust the path if needed

const UserClassesPage = () => {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Please enter a valid email.');
            return;
        }

        try {
            const result = await fetchClassesForUserByEmail(email);
            setClasses(result);

            if (result.length === 0) {
                setMessage('No classes found for this email.');
            } else {
                setMessage('');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setMessage('Failed to fetch classes.');
        }
    };

    const handleClassClick = async (classId) => {
        try {
            const students = await fetchStudentsByClassId(classId);
            setSelectedStudents(students);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching students:', error);
            setMessage('Failed to fetch students.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudents([]);
    };

    return (
        <div style={styles.container}>
            <h1>User Classes</h1>
            <form onSubmit={handleEmailSubmit} style={styles.form}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Get Classes</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
            {classes.length > 0 && (
                <div style={styles.classCardsContainer}>
                    {classes.map((cls) => (
                        <div key={cls.id} style={styles.classCard} onClick={() => handleClassClick(cls.id)}>
                            <h2>{cls.name}</h2>
                            <p>Timings:</p>
                            <ul>
                                {/* Map through the timings array and display each day and time */}
                                {Array.isArray(cls.timings) && cls.timings.length > 0 ? (
                                    cls.timings.map((timing, index) => (
                                        <li key={index}>
                                            <strong>{timing.day}</strong>: {timing.startTime} - {timing.endTime}
                                        </li>
                                    ))
                                ) : (
                                    <li>No timings available</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal} students={selectedStudents} />
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        marginRight: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    classCardsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: '20px',
    },
    classCard: {
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        flex: '1 1 calc(33% - 16px)', // Adjust the width as needed
        cursor: 'pointer', // Indicate it's clickable
    },
    message: {
        color: 'red',
    }
};

export default UserClassesPage;
