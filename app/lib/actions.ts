'use server';

import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';

export const getUserClassesByEmail = async (email) => {
    const client = await db.connect();
    try {
        console.log('Searching for user classes with email:', email);

        // Step 1: Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT id, classes, present FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows;

        // Check if the user exists
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Step 2: Get the user ID and parse the classes from JSON
        const userId = user[0].id;
        const userClasses = JSON.parse(user[0].classes);
        const userAttendance = user[0].present;

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

        // Step 4: Log attendance status for the user
        console.log('User Attendance Status:', userAttendance ? 'Present' : 'Absent');

        // Step 5: Log classes with timings and other details
        classes.forEach((cls) => {
            console.log(`Class: ${cls.name}, Timings: ${cls.timings}`);
        });

        return classes;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};


// Function to mark attendance
export const markAttendance = async (classId, email) => {
    const client = await db.connect();
    try {
        const { rows: userId } = await client.query(
            `SELECT id FROM users WHERE email = $1`, [email]
        ); // Fetch user ID by email

        if (userId.length === 0) throw new Error('User not found');

        // Update the 'present' field to true if the user is attending the class
        await client.query(
            `UPDATE users
             SET present = true
             WHERE id = $1
             AND classes @> ARRAY[$2::uuid]`, [userId[0].id, classId]
        );

        console.log(`Attendance for class ID: ${classId} has been marked as present for user: ${email}`);

        return { message: 'Attendance marked successfully' };
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw new Error('Failed to mark attendance');
    } finally {
        client.release();
    }
};



// Function to get user info based on their email
export const getUserInfoByEmail = async (email: string) => {
    const client = await db.connect();

    try {
        // Correct the query to match your column names exactly as they are in the schema
        const userResult = await client.query(
            `SELECT id, name, email, classes, "locationlatitude", "locationlongitude", present, role
             FROM users
             WHERE email = $1`,
            [email]
        );
        const user = userResult.rows[0];

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Parse classes stored as JSON string
        const userClasses = JSON.parse(user.classes);

        // Fetch class details using the class IDs from the userClasses array
        const classesResult = await client.query(
            `SELECT id, name, timings
             FROM classes
             WHERE id = ANY($1::uuid[])`,
            [userClasses]
        );
        const classes = classesResult.rows;

        // Return the combined user information and their classes
        return {
            id: user.id,
            fullName: user.name, // Mapping 'name' to 'fullName' for consistency in UI
            email: user.email,
            locationLatitude: user.locationlatitude, // Use lowercase as in the schema
            locationLongitude: user.locationlongitude, // Use lowercase as in the schema
            present: user.present,
            role: user.role,
            classes: classes
        };
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw new Error('Failed to fetch user information');
    } finally {
        client.release();
    }
};

export const fetchUserClassesByEmail = async (email) => {
    const client = await db.connect();
    try {
        console.log('Searching for user classes with email:', email);

        // Step 1: Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT "id", "classes", "present" FROM "users" WHERE "email" = $1`, [email]
        );
        const user = userResult.rows;

        // Check if the user exists
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Step 2: Get the user ID and parse the classes from JSON
        const userId = user[0].id;
        const userClasses = JSON.parse(user[0].classes);
        const userAttendance = user[0].present;

        if (!Array.isArray(userClasses) || userClasses.length === 0) {
            throw new Error('No classes found for the user');
        }

        console.log('User classes UUIDs:', userClasses); // Debugging log

        // Step 3: Fetch classes using the class IDs from userClasses
        const classesResult = await client.query(
            `SELECT "id", "name", "timings"
             FROM "classes"
             WHERE "id" = ANY($1::uuid[])`, [userClasses]
        );
        const classes = classesResult.rows;

        // Step 4: Log attendance status for the user
        console.log('User Attendance Status:', userAttendance ? 'Present' : 'Absent');

        // Step 5: Log classes with timings and other details
        classes.forEach((cls) => {
            console.log(`Class: ${cls.name}, Timings: ${cls.timings}`);
        });

        return {
            userId,
            classes,
            attendance: userAttendance
        };
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};

// Function to check if the email is associated with a teacher
export const isTeacherByEmail = async (email) => {
    const client = await db.connect();
    try {
        const userResult = await client.query(
            `SELECT role FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0];
        return user ? user.role === 'teacher' : false;
    } catch (error) {
        console.error('Error checking if user is a teacher:', error);
        throw new Error('Failed to verify user role');
    } finally {
        client.release();
    }
};

// Function to fetch classes by email
// Function to fetch classes for a teacher by email
export const fetchClassesForTeacherByEmail = async (email) => {
    const client = await db.connect();
    try {
        const userResult = await client.query(
            `SELECT id, classes FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0];

        if (!user) throw new Error('User not found');

        const userClasses = JSON.parse(user.classes);
        if (!Array.isArray(userClasses) || userClasses.length === 0) {
            throw new Error('No classes found for the user');
        }

        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );
        return classesResult.rows;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};

// Function to get students by class ID
export const getStudentsByClassId = async (classId) => {
    const client = await db.connect();
    try {
        const studentsResult = await client.query(
            `SELECT id, name, present FROM students WHERE classId = $1`, [classId]
        );
        return studentsResult.rows;
    } catch (error) {
        console.error('Error fetching students by class ID:', error);
        throw new Error('Failed to fetch students');
    } finally {
        client.release();
    }
};