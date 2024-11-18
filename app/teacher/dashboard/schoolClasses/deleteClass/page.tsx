'use client';

import React, { useState, useEffect } from 'react';
import { deleteClassByTeacher } from 'app/lib/actions'; // Import the action to delete a class

const DeleteClassPage = () => {
    const [classCode, setClassCode] = useState('');
    const [email, setEmail] = useState<string | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Fetch the email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setFeedbackMessage('Error: Unable to retrieve your email. Please log in again.');
        }
    }, []);

    const handleDeleteClass = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setFeedbackMessage('Error: Unable to retrieve your email. Please log in again.');
            return;
        }

        try {
            // Call the deleteClassByTeacher function
            const response = await deleteClassByTeacher(email, classCode);
            setFeedbackMessage(response.message);
        } catch (error: any) {
            console.error('Error deleting class:', error);
            setFeedbackMessage('Failed to delete the class. Please try again.');
        }

        // Clear the class code field
        setClassCode('');
    };
// @ts-ignore
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Delete a Class</h1>
            <p style={styles.subtitle}>
                Use the class code to delete a class you’ve created. This action cannot be undone.
            </p>

            {feedbackMessage && (
                <div
                    style={{
                        ...styles.feedback,
                        backgroundColor: feedbackMessage.startsWith('Error') ? '#ffdddd' : '#ddffdd',
                        color: feedbackMessage.startsWith('Error') ? '#d8000c' : '#4f8a10',
                    }}
                >
                    {feedbackMessage}
                </div>
            )}

            <form onSubmit={handleDeleteClass} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="classCode" style={styles.label}>
                        Class Code:
                    </label>
                    <input
                        type="text"
                        id="classCode"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        required
                        style={styles.input}
                        placeholder="Enter the class code"
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Delete Class
                </button>
            </form>
        </div>
    );
};

// Styles for the page
const styles = {
    container: {
        maxWidth: '500px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: '14px',
        color: '#555',
        textAlign: 'center',
        marginBottom: '20px',
    },
    feedback: {
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    button: {
        padding: '12px',
        backgroundColor: '#d32f2f', // A bold red for deletion
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#b71c1c',
    },
};

export default DeleteClassPage;