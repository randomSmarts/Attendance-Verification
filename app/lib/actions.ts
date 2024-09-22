'use server';

import { db } from '@vercel/postgres';

export const getUserClassesByEmail = async (email) => {
    const client = await db.connect();
    try {
        console.log('Searching for user classes with email:', email);

        // Step 1: Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT id, classes FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows;

        // Check if the user exists
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Step 2: Get the user ID and parse the classes from JSON
        const userId = user[0].id;
        const userClasses = JSON.parse(user[0].classes);

        if (!Array.isArray(userClasses) || userClasses.length === 0) {
            throw new Error('No classes found for the user');
        }

        console.log('User classes UUIDs:', userClasses); // Debugging log

        // Step 3: Fetch classes using the class IDs from userClasses
        const classesResult = await client.query(
            `SELECT id, name, timings
             FROM classes
             WHERE id = ANY($1::uuid[])`, [userClasses]
        );
        const classes = classesResult.rows;

        console.log('Fetched classes:', classes); // Debugging log

        return classes;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};



// Function to mark attendance (unchanged)
export const markAttendance = async (classId, email) => {
    const client = await db.connect();
    try {
        const { rows: userId } = await client.sql`SELECT id FROM users WHERE email = ${email};`; // Fetch user ID by email
        if (userId.length === 0) throw new Error('User not found');

        await client.sql`
            UPDATE users
            SET present = true
            WHERE id = ${userId[0].id}  // Use the fetched user ID
            AND classes @> ARRAY[${classId}]::UUID[];
        `;
        return { message: 'Attendance marked successfully' };
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw new Error('Failed to mark attendance');
    } finally {
        client.release();
    }
};
