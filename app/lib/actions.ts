'use server';

import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export const getUserClassesByEmail = async (email) => {
    const client = await db.connect();
    try {
        console.log('Searching for user classes with email:', email);

        // Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT id, classes, present FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0];

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Parse user classes, ensuring it's valid JSON
        let userClasses = Array.isArray(user.classes) ? user.classes : [];

        console.log('User classes UUIDs:', userClasses);

        // Fetch classes using the class IDs from userClasses
        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );
        const classes = classesResult.rows;

        // Check if any classes were found
        if (classes.length === 0) {
            console.log('No classes found for this user.');
        }

        return classes; // Return classes, will be empty if none found
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
            `SELECT id, classes FROM users WHERE email = $1`, [email]
        );

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
export const getUserInfoByEmail = async (email) => {
    const client = await db.connect();

    try {
        const userResult = await client.query(
            `SELECT id, fullName AS name, email, classes, "locationlatitude", "locationlongitude", present, role
             FROM users WHERE email = $1`,
            [email]
        );

        const user = userResult.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        let userClasses = Array.isArray(user.classes) ? user.classes : []; // Ensure classes is an array

        // Fetch existing classes to filter out invalid class IDs
        const classesResult = await client.query(
            `SELECT id FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        const existingClassIds = new Set(classesResult.rows.map(row => row.id));

        // Filter out invalid class IDs from userClasses
        const validUserClasses = userClasses.filter(classId => existingClassIds.has(classId));

        // Return user information along with valid classes
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            locationLatitude: user.locationlatitude,
            locationLongitude: user.locationlongitude,
            present: user.present,
            role: user.role,
            classes: validUserClasses // Return only valid class IDs
        };
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw new Error('Failed to fetch user information');
    } finally {
        client.release();
    }
};

// Function to fetch classes by email
export const fetchClassesForUserByEmail = async (email) => {
    const client = await db.connect();
    try {
        // Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT id, classes FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0];

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Debug log the user classes before parsing
        console.log('User classes raw data:', user.classes);

        // Ensure userClasses is an array
        const userClasses = Array.isArray(user.classes) ? user.classes : [];

        // Check if userClasses is empty
        if (userClasses.length === 0) {
            console.log('No classes found for this user.');
            return []; // Return an empty array instead of throwing an error
        }

        // Debug log the parsed user classes
        console.log('Parsed user classes:', userClasses);

        // Fetch class details using the class IDs from the userClasses array
        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        // Check if any classes were found
        if (classesResult.rows.length === 0) {
            console.log('No classes found in the database for these IDs:', userClasses);
            return []; // Return an empty array if no classes were found
        }

        return classesResult.rows;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};


// Function to check if the user is a teacher based on their email
export const isUserTeacherByEmail = async (email) => {
    const client = await db.connect();
    try {
        const userResult = await client.query(
            `SELECT role FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0];

        return user ? user.role === 'teacher' : false;
    } catch (error) {
        console.error('Error checking user role:', error);
        throw new Error('Failed to check user role');
    } finally {
        client.release();
    }
};

// Function to fetch students by class ID
export const fetchStudentsByClassId = async (classId) => {
    const client = await db.connect();
    try {
        const classResult = await client.query(
            `SELECT students FROM classes WHERE id = $1`, [classId]
        );
        const classData = classResult.rows[0];

        if (!classData) {
            throw new Error('Class not found');
        }

        // Parse student IDs from the class data
        const studentIds = Array.isArray(classData.students) ? classData.students : []; // Check if students exist
        const studentsResult = await client.query(
            `SELECT id, fullName AS name, email, present FROM users WHERE id = ANY($1::uuid[])`, [studentIds]
        );

        return studentsResult.rows;
    } catch (error) {
        console.error('Error fetching students by class ID:', error);
        throw new Error('Failed to fetch students');
    } finally {
        client.release();
    }
};

// Add a class
export const addClass = async (teacherId, name, entryCode, timings, students) => {
    const client = await db.connect();
    const classId = uuidv4(); // Generate a random UUID

    try {
        const result = await client.query(
            `INSERT INTO classes (id, name, entrycode, teacherid, timings, students)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [classId, name, entryCode, teacherId, JSON.stringify(timings), JSON.stringify(students)]
        );

        return { success: true, classId };
    } catch (error) {
        console.error('Error adding class:', error);
        throw new Error('Failed to add class');
    } finally {
        client.release();
    }
};

// Get teacher ID by email
export const getTeacherIdByEmail = async (email) => {
    const client = await db.connect();

    try {
        const result = await client.query(
            `SELECT id FROM users WHERE email = $1`, [email]
        );

        if (result.rows.length === 0) {
            throw new Error('Teacher not found');
        }

        return result.rows[0].id; // Return the teacher's ID
    } catch (error) {
        console.error('Error fetching teacher ID:', error);
        throw new Error('Failed to fetch teacher ID');
    } finally {
        client.release();
    }
};
