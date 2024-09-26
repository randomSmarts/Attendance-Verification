'use client';

import React, { useState } from 'react';
import AttendanceButton from 'app/ui/attendance/button';
import { getUserClassesByEmail } from 'app/lib/actions'; // Ensure this points to your modified function

const UserClassesPage = () => {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await getUserClassesByEmail(email);
            setClasses(result); // Assuming this function returns the classes array

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
                        <div key={cls.id} style={styles.classCard}>
                            <h2>{cls.name}</h2>
                            <p>Timings:</p>
                            <ul>
                                {/* Map through the timings array and display each day and time */}
                                {Array.isArray(cls.timings) ? (
                                    cls.timings.map((timing, index) => (
                                        <li key={index}>
                                            <strong>{timing.day}</strong>: {timing.time}
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
        flex: '1 1 calc(33% - 16px)',
    },
    message: {
        color: 'red',
    }
};

export default UserClassesPage;
