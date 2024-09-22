'use server';

import { sql } from '@vercel/postgres';

// Function to fetch user classes
export const getUserClasses = async (userId) => {
    console.log(`Fetching classes for user ID: ${userId}`); // Logging user ID
    try {
        const { rows: userClasses } = await sql`
            SELECT c.id, c.name, c.timings
            FROM classes c
            JOIN users u ON u.id = ${userId}  // Ensure this matches your user ID
            WHERE c.teacherID = ${userId} OR c.students @> ARRAY[${userId}]::UUID[];
        `;
        console.log(`Fetched classes:`, userClasses); // Log fetched classes
        return userClasses;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    }
};

// Function to mark attendance
export const markAttendance = async (classId, userId) => {
    console.log(`Marking attendance for user ID: ${userId}, class ID: ${classId}`); // Logging IDs
    const client = await sql.connect();
    try {
        await client.sql`
            UPDATE users
            SET present = true
            WHERE id = ${userId}  // Ensure this matches your user ID
            AND classes @> ARRAY[${classId}]::UUID[];  // Ensure classId is correctly provided
        `;
        console.log('Attendance marked successfully.'); // Log success
        return { message: 'Attendance marked successfully' };
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw new Error('Failed to mark attendance');
    } finally {
        client.release();
    }
};
