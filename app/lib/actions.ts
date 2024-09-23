'use server';

import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

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

// Mark attendance
export const markAttendance = async (classId: string, email: string): Promise<{ message: string }> => {
    const client = await db.connect();
    try {
        const { rows: userId } = await client.query(
            `SELECT id, classes FROM users WHERE email = $1`, [email]
        );

        if (userId.length === 0) throw new Error('User not found');

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

        const classesResult = await client.query(
            `SELECT id FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        const existingClassIds = new Set(classesResult.rows.map((row: any) => row.id));

        const validUserClasses = userClasses.filter((classId: string) => existingClassIds.has(classId));

        return {
            ...user,
            classes: validUserClasses
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
            `SELECT id, classes FROM users WHERE email = $1`, [email]
        );
        const user = userResult.rows[0] as User;

        if (!user) {
            throw new Error('User not found');
        }

        const userClasses = Array.isArray(user.classes) ? user.classes : [];

        if (userClasses.length === 0) {
            console.log('No classes found for this user.');
            return [];
        }

        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        return classesResult.rows as Class[];
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

        const studentIds = Array.isArray(classData.students) ? classData.students : [];

        const studentsResult = await client.query(
            `SELECT id, fullName AS name, email, present FROM users WHERE id = ANY($1::uuid[])`, [studentIds]
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
        await client.query(
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
