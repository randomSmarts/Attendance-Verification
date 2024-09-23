'use server';

import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

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
        let userClasses = [];
        try {
            userClasses = JSON.parse(user[0].classes);
        } catch (error) {
            console.error('Invalid format for user classes:', error.message);
            userClasses = []; // Default to empty array on parse error
        }

        // Ensure userClasses is an array
        if (!Array.isArray(userClasses)) {
            userClasses = [];
        }

        console.log('User classes UUIDs:', userClasses); // Debugging log

        // Step 3: Fetch classes using the class IDs from userClasses
        const classesResult = await client.query(
            `SELECT id, name, timings
             FROM classes
             WHERE id = ANY($1::uuid[])`, [userClasses]
        );
        const classes = classesResult.rows;

        // Filter valid classes based on fetched results
        const validClassIds = new Set(classes.map(cls => cls.id));
        const filteredUserClasses = userClasses.filter(classId => validClassIds.has(classId));

        // Log attendance status for the user
        const userAttendance = user[0].present;
        console.log('User Attendance Status:', userAttendance ? 'Present' : 'Absent');

        // Log classes with timings and other details
        classes.forEach((cls) => {
            console.log(`Class: ${cls.name}, Timings: ${cls.timings}`);
        });

        // Return only valid classes or an empty array if none are valid
        return classes.length > 0 ? classes : [];
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
        const userResult = await client.query(
            `SELECT id, name, email, classes, "locationlatitude", "locationlongitude", present, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        const user = userResult.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        let userClasses = [];
        try {
            // Attempt to parse the classes JSON
            userClasses = JSON.parse(user.classes);
        } catch (error) {
            console.error('Invalid format for user classes:', error.message);
            // If parsing fails, you can log and fallback to an empty array
            userClasses = [];
        }

        // Ensure userClasses is an array
        if (!Array.isArray(userClasses)) {
            userClasses = []; // Fallback to empty array if it's not an array
        }

        // Fetch existing classes to filter out invalid class IDs
        const classesResult = await client.query(
            `SELECT id
             FROM classes
             WHERE id = ANY($1::uuid[])`,
            [userClasses]
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

        // Parse classes stored as JSON
        const userClasses = JSON.parse(user.classes);
        if (!Array.isArray(userClasses) || userClasses.length === 0) {
            throw new Error('No classes found for this user');
        }

        // Fetch class details using the class IDs from the userClasses array
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
        const studentIds = JSON.parse(classData.students);
        const studentsResult = await client.query(
            `SELECT id, name, email, present FROM users WHERE id = ANY($1::uuid[])`, [studentIds]
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
export const addClass = async (teacherid: string, name: string, entrycode: string, timings: string[], students: string[]) => {
    const client = await db.connect();
    const classId = uuidv4(); // Generate a random UUID

    try {
        const result = await client.query(
            `INSERT INTO classes (id, name, entrycode, teacherid, timings, students)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [classId, name, entrycode, teacherid, JSON.stringify(timings), JSON.stringify(students)]
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
export const getTeacherIdByEmail = async (email: string) => {
    const client = await db.connect();

    try {
        const result = await client.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            throw new Error('Teacher not found');
        }

        return result.rows[0].id;
    } catch (error) {
        console.error('Error fetching teacher ID:', error);
        throw new Error('Failed to fetch teacher ID');
    } finally {
        client.release();
    }
};

// Fetch classes by teacher's email
export const getClassesByEmail = async (email: string) => {
    const client = await db.connect();
    try {
        const res = await client.query(
            `SELECT * FROM classes
            WHERE teacherid IN (
                SELECT id FROM users WHERE email = $1
            )`,
            [email]
        );
        return res.rows; // Return the fetched classes
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};

export const deleteClassById = async (classId: string) => {
    const client = await db.connect();
    try {
        // Remove the class from the database
        await client.query(`DELETE FROM classes WHERE id = $1`, [classId]);

        // Remove the class ID from all users
        await removeClassFromUsers(classId);

        return { success: true, message: 'Class deleted successfully' };
    } catch (error) {
        console.error('Error deleting class:', error);
        throw new Error('Failed to delete class');
    } finally {
        client.release();
    }
};

export const removeClassFromUsers = async (classId: string) => {
    const client = await db.connect();
    try {
        // Fetch all users and their classes
        const { rows } = await client.query(`SELECT id, classes FROM users`);

        for (const user of rows) {
            let classesArray;

            try {
                // Parse the JSON string safely
                classesArray = JSON.parse(user.classes);
            } catch (error) {
                console.error('Error parsing classes JSON for user ID:', user.id);
                continue; // Skip this user if their classes are not valid JSON
            }

            // Check if the classId exists in the array
            if (Array.isArray(classesArray) && classesArray.includes(classId)) {
                // Remove the classId from the array
                const updatedClasses = classesArray.filter(id => id !== classId);

                // Update the user's classes in the database
                await client.query(
                    `UPDATE users SET classes = $1 WHERE id = $2`,
                    [JSON.stringify(updatedClasses), user.id] // Convert back to JSON string
                );
            }
        }
    } catch (error) {
        console.error('Error removing class from users:', error);
        throw new Error('Failed to remove class from users');
    } finally {
        client.release();
    }
};