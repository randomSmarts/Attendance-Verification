'use client';

import React, { useState } from 'react';
import { joinClassByCode } from 'app/lib/actions'; // Import the joinClassByCode function

const JoinClassPage = () => {
    const [email, setEmail] = useState('');
    const [classCode, setClassCode] = useState('');
    const [message, setMessage] = useState('');

    const handleJoinClass = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call the joinClassByCode function and handle the response
        const response = await joinClassByCode(email, classCode);

        if (response.success) {
            setMessage(response.message);
        } else {
            setMessage(response.message);
        }

        // Clear the input fields
        setEmail('');
        setClassCode('');
    };

    return (
        <div style={styles.container}>
            <h1>Join a Class</h1>
            <form onSubmit={handleJoinClass} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="classCode">Class Code:</label>
                    <input
                        type="text"
                        id="classCode"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Join Class</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

// Styles for the page
const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    message: {
        marginTop: '15px',
        fontWeight: 'bold',
    },
};

export default JoinClassPage;