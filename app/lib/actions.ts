'use server';

import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; // Import bcrypt
import { NextResponse } from 'next/server';

// Define user and class types
interface User {
    id: string;
    email: string;
    classes: string[];
    present: boolean;
    role: string;
}

interface Class {
    id: string;
    name: string;
    timings: any;
}

// actions.ts


// Function to create an account

export async function createAccount(id, fullname, email, password, classes = [], locationlatitude = '0.0', locationlongitude = '0.0', present = false, role = 'student') {
    const client = await db.connect(); // Get a database client connection
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Define the default UUID for classes
    const defaultClassUUID = '2e572a46-b8a4-43ee-94ae-c689a2b2e334';

    try {
        await client.query('BEGIN'); // Start a transaction

        // Insert the new user into the database
        await client.query(`
            INSERT INTO users (id, fullname, email, password, classes, locationlatitude, locationlongitude, present, role)
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9
            )
            ON CONFLICT (email) DO NOTHING;  -- Prevent duplicate email entries
        `, [
            id || uuidv4(),  // Use provided ID or auto-generate if null
            fullname,
            email,
            hashedPassword,
            JSON.stringify(classes.length > 0 ? classes : [defaultClassUUID]), // Default to the given UUID if no classes are provided
            locationlatitude, // Set default to '0.0'
            locationlongitude, // Set default to '0.0'
            present,
            role
        ]);

        await client.query('COMMIT'); // Commit the transaction
        return { success: true, message: 'Account created successfully' }; // Success response
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error creating account:', error); // Log the error
        return { success: false, message: 'Error creating account' }; // User-friendly error response
    } finally {
        client.release(); // Release the client connection
    }
}

// Function to login
export async function login(email: string, password: string) {
    try {
        // Fetch the user from the database using email
        const userResult = await db.query(`
            SELECT * FROM users WHERE email = $1;
        `, [email]);

        const user = userResult.rows[0];

        if (!user) {
            return { success: false, message: 'User not found.' };
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password.' };
        }

        // Check if the role is either 'student' or 'teacher'
        if (user.role === 'student') {
            return { success: true, role: 'student' }; // Redirect to student dashboard
        } else if (user.role === 'teacher') {
            return { success: true, role: 'teacher' }; // Redirect to teacher dashboard
        } else {
            return { success: false, message: 'Unknown role. Please contact support.' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Error during login.' };
    }
}


// Fetch user classes by email
export const getUserClassesByEmail = async (email: string): Promise<Class[]> => {
    const client = await db.connect();
    try {
        console.log('Searching for user classes with email:', email);

        // Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT id, classes, present FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0] as User;

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        let userClasses = Array.isArray(user.classes) ? user.classes : [];

        console.log('User classes UUIDs:', userClasses);

        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );
        const classes = classesResult.rows as Class[];

        if (classes.length === 0) {
            console.log('No classes found for this user.');
        }

        return classes;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};

// Fetch user info by email
export const getUserInfoByEmail = async (email: string): Promise<User> => {
    const client = await db.connect();

    try {
        const userResult = await client.query(
            `SELECT id, fullName AS name, email, classes, "locationlatitude", "locationlongitude", present, role
             FROM users WHERE email = $1`,
            [email]
        );

        const user = userResult.rows[0] as User;

        if (!user) {
            throw new Error('User not found');
        }

        const userClasses = Array.isArray(user.classes) ? user.classes : [];

        // Fetch the class details for each class ID associated with the user
        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        // Parse timings if it's stored as a JSON string
        const validClasses = classesResult.rows.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            timings: typeof cls.timings === 'string' ? JSON.parse(cls.timings) : cls.timings,  // Parse if string
        }));

        return {
            ...user,
            classes: validClasses
        };
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw new Error('Failed to fetch user information');
    } finally {
        client.release();
    }
};

// Fetch classes for user by email
export const fetchClassesForUserByEmail = async (email: string): Promise<Class[]> => {
    const client = await db.connect();

    try {
        const userResult = await client.query(
            `SELECT classes FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        const userClasses = Array.isArray(user.classes) ? user.classes : [];

        if (userClasses.length === 0) {
            console.log('No classes found for this user.');
            return [];
        }

        // Fetch class details for each class ID
        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        // Parse timings if it's stored as JSONB
        return classesResult.rows.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            timings: Array.isArray(cls.timings) ? cls.timings : JSON.parse(cls.timings)  // Parse timings if it's a string
        })) as Class[];
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};


// Check if user is a teacher by email
export const isUserTeacherByEmail = async (email: string): Promise<boolean> => {
    const client = await db.connect();
    try {
        const userResult = await client.query(
            `SELECT role FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0] as User;

        return user ? user.role === 'teacher' : false;
    } catch (error) {
        console.error('Error checking user role:', error);
        throw new Error('Failed to check user role');
    } finally {
        client.release();
    }
};

// Fetch students by class ID
export const fetchStudentsByClassId = async (classId: string): Promise<User[]> => {
    const client = await db.connect();
    try {
        const classResult = await client.query(
            `SELECT students FROM classes WHERE id = $1`, [classId]
        );
        const classData = classResult.rows[0];

        if (!classData) {
            throw new Error('Class not found');
        }

        const studentIds = Array.isArray(classData.students) ? classData.students : JSON.parse(classData.students);

        if (studentIds.length === 0) {
            console.log('No students found for this class.');
            return [];
        }

        const studentsResult = await client.query(
            `SELECT id, fullname AS name, email, present FROM users WHERE id = ANY($1::uuid[])`, [studentIds]
        );

        return studentsResult.rows as User[];
    } catch (error) {
        console.error('Error fetching students by class ID:', error);
        throw new Error('Failed to fetch students');
    } finally {
        client.release();
    }
};

// Add a class
export const addClass = async (teacherId: string, name: string, entryCode: string, timings: any, students: string[]): Promise<{ success: boolean, classId: string }> => {
    const client = await db.connect();
    const classId = uuidv4();

    try {
        // Insert the new class with properly formatted timings and students
        await client.query(
            `INSERT INTO classes (id, name, entrycode, teacherid, timings, students)
             VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)`, // Store timings and students as JSONB
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
export const getTeacherIdByEmail = async (email: string): Promise<string> => {
    const client = await db.connect();

    try {
        const result = await client.query(
            `SELECT id FROM users WHERE email = $1`, [email]
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


export const joinClassByCode = async (email, classCode) => {
    const client = await db.connect();
    try {
        // Step 1: Get the user (student) ID using the email
        const userResult = await client.query('SELECT id, classes FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return { success: false, message: 'User (student) not found.' };
        }

        // Step 2: Get the class details using the class code
        const classResult = await client.query('SELECT id, students FROM classes WHERE entryCode = $1', [classCode]);
        const foundClass = classResult.rows[0];

        if (!foundClass) {
            return { success: false, message: 'Class code not found.' };
        }

        // Step 3: Check if the user (student) is already enrolled in the class
        const studentsEnrolled = foundClass.students || []; // Ensure we have an array
        if (studentsEnrolled.includes(user.id)) {
            return { success: false, message: 'You are already enrolled in this class.' };
        }

        // Step 4: Enroll the user (student) in the class
        // Concatenate the new student ID into the students array (assuming students is JSONB array)
        await client.query(
            `UPDATE classes SET students = students || $1::jsonb WHERE id = $2`,
            [JSON.stringify([user.id]), foundClass.id]
        );

        // Step 5: Update the user's class list
        await client.query(
            `UPDATE users SET classes = classes || $1::jsonb WHERE id = $2`,
            [JSON.stringify([foundClass.id]), user.id]
        );

        // Return success message
        return { success: true, message: 'Successfully enrolled in the class.' };
    } catch (error) {
        console.error('Error joining class:', error);
        return { success: false, message: 'Error joining class. Please try again later.' };
    } finally {
        client.release();
    }
};

export const leaveClassByCode = async (email, classCode) => {
    const client = await db.connect();
    try {
        // Step 1: Get the user (student) ID using the email
        const userResult = await client.query('SELECT id, classes FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return { success: false, message: 'User (student) not found.' };
        }

        // Step 2: Get the class details using the class code
        const classResult = await client.query('SELECT id, students FROM classes WHERE entryCode = $1', [classCode]);
        const foundClass = classResult.rows[0];

        if (!foundClass) {
            return { success: false, message: 'Class code not found.' };
        }

        // Step 3: Check if the user (student) is enrolled in the class
        const studentsEnrolled = foundClass.students || []; // Ensure we have an array
        if (!studentsEnrolled.includes(user.id)) {
            return { success: false, message: 'You are not enrolled in this class.' };
        }

        // Log the data to inspect the values
        console.log("User ID: ", user.id);
        console.log("Class ID: ", foundClass.id);
        console.log("Students Enrolled: ", studentsEnrolled);

        // Step 4: Remove the user (student) from the class (JSONB modification)
        const updateClassResponse = await client.query(
            `UPDATE classes 
             SET students = students - $1  -- Use the JSONB removal operator
             WHERE id = $2`,
            [user.id, foundClass.id]
        );

        if (updateClassResponse.rowCount === 0) {
            return { success: false, message: 'Failed to update the class students.' };
        }

        // Step 5: Remove the class from the user's class list (JSONB modification)
        const updateUserResponse = await client.query(
            `UPDATE users 
             SET classes = classes - $1  -- Use the JSONB removal operator
             WHERE id = $2`,
            [foundClass.id, user.id]
        );

        if (updateUserResponse.rowCount === 0) {
            return { success: false, message: 'Failed to update user classes.' };
        }

        // Return success message
        return { success: true, message: 'Successfully left the class.' };
    } catch (error) {
        console.error('Error leaving class:', error);
        return { success: false, message: 'Error leaving class. Please try again later.' };
    } finally {
        client.release();
    }
};


export const deleteClassByTeacher = async (email, classCode) => {
    const client = await db.connect();
    try {
        // Step 1: Verify that the user is a teacher
        const teacherResult = await client.query('SELECT id, role FROM users WHERE email = $1', [email]);
        const teacher = teacherResult.rows[0];

        if (!teacher) {
            return { success: false, message: 'Teacher not found.' };
        }

        if (teacher.role !== 'teacher') {
            return { success: false, message: 'Only teachers can delete a class.' };
        }

        // Step 2: Get the class details using the class code
        const classResult = await client.query('SELECT id, students FROM classes WHERE entryCode = $1', [classCode]);
        const foundClass = classResult.rows[0];

        if (!foundClass) {
            return { success: false, message: 'Class code not found.' };
        }

        // Step 3: Get all students enrolled in the class
        const studentsEnrolled = foundClass.students || [];

        if (studentsEnrolled.length > 0) {
            // Step 4: Remove the class from each student's classes field
            const updateUsersResponse = await client.query(
                `UPDATE users 
                 SET classes = classes - $1  -- Remove the class from each student
                 WHERE id = ANY($2)`,  // Use the array of student IDs
                [foundClass.id, studentsEnrolled]
            );

            if (updateUsersResponse.rowCount === 0) {
                return { success: false, message: 'Failed to update student classes.' };
            }
        }

        // Step 5: Delete the class from the classes table
        const deleteClassResponse = await client.query('DELETE FROM classes WHERE id = $1', [foundClass.id]);

        if (deleteClassResponse.rowCount === 0) {
            return { success: false, message: 'Failed to delete the class.' };
        }

        // Return success message
        return { success: true, message: 'Class deleted successfully.' };
    } catch (error) {
        console.error('Error deleting class:', error);
        return { success: false, message: 'Error deleting class. Please try again later.' };
    } finally {
        client.release();
    }
};

export const getUserClassesByEmail2 = async (email: string): Promise<Class[]> => {
    const client = await db.connect();
    try {
        console.log('Searching for user classes with email:', email);

        // Fetch user details based on the provided email
        const userResult = await client.query(
            `SELECT id, classes, present FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0] as User;

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        let userClasses = Array.isArray(user.classes) ? user.classes : [];

        console.log('User classes UUIDs:', userClasses);

        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );
        const classes = classesResult.rows as Class[];

        if (classes.length === 0) {
            console.log('No classes found for this user.');
        }

        return classes;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};

// Mark the user's attendance
export const markAttendance = async (classId: string, email: string, latitude: number, longitude: number) => {
    const client = await db.connect();
    try {
        // Fetch the user by email
        const userResult = await client.query(`SELECT id FROM users WHERE email = $1`, [email]);
        const user = userResult.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        // Update the user's attendance (set present to true, update latitude and longitude)
        const updateResult = await client.query(
            `UPDATE users SET present = true, locationLatitude = $1, locationLongitude = $2 WHERE id = $3`,
            [latitude, longitude, user.id]
        );

        if (updateResult.rowCount === 0) {
            throw new Error('Failed to mark attendance');
        }

        return { success: true, message: 'Attendance marked successfully.' };
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw new Error('Failed to mark attendance');
    } finally {
        client.release();
    }
};