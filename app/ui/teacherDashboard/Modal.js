// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, students }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>Students Enrolled</h2>
                <ul style={styles.studentList}>
                    {students.map((student) => (
                        <li key={student.id} style={styles.studentItem}>
                            <span style={styles.studentName}>{student.name}</span>
                            <span style={styles.studentEmail}>({student.email})</span>
                            <span style={styles.studentAttendance}>
                                - Present: {student.present ? 'Yes' : 'No'}
                            </span>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose} style={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

// Styles
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        width: '80%', // Adjust width as necessary
        maxWidth: '600px', // Maximum width for larger screens
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        overflowY: 'auto', // Allow scrolling for long lists
        maxHeight: '80vh', // Limit height of modal
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '1.5em',
    },
    studentList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    studentItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
    },
    studentName: {
        fontWeight: 'bold',
    },
    studentEmail: {
        color: '#555',
        marginLeft: '10px',
    },
    studentAttendance: {
        color: '#007BFF', // Optional color for attendance status
    },
    closeButton: {
        marginTop: '20px',
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Modal;
// The Modal component displays a list of students with their attendance status. It includes a close button to dismiss
// the modal. The styles are defined inline for simplicity, but you can extract them to a separate CSS file if needed.
