'use client';

import React, { useState, useEffect } from 'react';
import { fetchClassesForUserByEmail, fetchStudentsByClassId } from 'app/lib/actions'; // Ensure correct imports
import Modal from 'app/ui/teacherDashboard/Modal'; // Adjust the path if needed

const UserClassesPage = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Retrieve email from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
            fetchClasses(storedEmail);
        } else {
            setMessage('Error: Unable to retrieve your email. Please log in again.');
        }
    }, []);

    // Fetch classes for the logged-in user
    const fetchClasses = async (userEmail: string) => {
        setLoading(true);
        try {
            const result = await fetchClassesForUserByEmail(userEmail);
            setClasses(result);

            if (result.length === 0) {
                setMessage('No classes found.');
            } else {
                setMessage('');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setMessage('Failed to fetch classes.');
        } finally {
            setLoading(false);
        }
    };

    // Handle class click to fetch students
    const handleClassClick = async (classId: string) => {
        try {
            const students = await fetchStudentsByClassId(classId);
            setSelectedStudents(students);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching students:', error);
            setMessage('Failed to fetch students.');
        }
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudents([]);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Your Classes</h1>
            <p style={styles.subtitle}>View and manage the classes assigned to you.</p>

            {loading && <p style={styles.message}>Loading classes...</p>}

            {message && !loading && (
                <div
                    style={{
                        ...styles.message,
                        color: message.startsWith('Error') ? 'red' : 'green',
                    }}
                >
                    {message}
                </div>
            )}

            {classes.length > 0 && (
                <div style={styles.classCardsContainer}>
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            style={styles.classCard}
                            onClick={() => handleClassClick(cls.id)}
                        >
                            <h2 style={styles.className}>{cls.name}</h2>
                            <p style={styles.timingsLabel}>Timings:</p>
                            <ul style={styles.timingsList}>
                                {Array.isArray(cls.timings) && cls.timings.length > 0 ? (
                                    cls.timings.map((timing, index) => (
                                        <li key={index} style={styles.timingItem}>
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

// Styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '14px',
        color: '#555',
        textAlign: 'center',
        marginBottom: '20px',
    },
    message: {
        marginTop: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    classCardsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '20px',
        justifyContent: 'center',
    },
    classCard: {
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        width: '300px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    classCardHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    className: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    timingsLabel: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    timingsList: {
        margin: '0',
        padding: '0',
        listStyle: 'none',
    },
    timingItem: {
        fontSize: '14px',
        marginBottom: '5px',
    },
};

export default UserClassesPage;