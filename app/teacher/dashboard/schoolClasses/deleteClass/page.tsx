'use client';

import React, { useState } from 'react';
import { deleteClassByTeacher } from 'app/lib/actions'; // Import the action to delete a class

const DeleteClassPage = () => {
    const [email, setEmail] = useState('');
    const [classCode, setClassCode] = useState('');
    const [message, setMessage] = useState('');

    const handleDeleteClass = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call the deleteClassByTeacher function and handle the response
        const response = await deleteClassByTeacher(email, classCode);

        setMessage(response.message); // Set the response message

        // Clear the input fields
        setEmail('');
        setClassCode('');
    };

    return (
        <div style={styles.container}>
            <h1>Delete a Class</h1>
            <form onSubmit={handleDeleteClass} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Teacher Email:</label>
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
                <button type="submit" style={styles.button}>Delete Class</button>
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
        backgroundColor: '#f44336', // Red for deletion
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

export default DeleteClassPage;
