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
export async function login(email: string, password: string, role: string) {
    try {
        const userResult = await db.query(`
            SELECT * FROM users WHERE email = $1;
        `, [email]);

        const user = userResult.rows[0];

        if (!user) {
            return { success: false, message: 'User not found.' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password.' };
        }

        if (user.role !== role) {
            return { success: false, message: `Invalid role. You are not registered as a ${role}.` };
        }

        return { success: true, role: user.role };
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

        if (!user) {
            throw new Error('User not found');
        }

        const userClasses = Array.isArray(user.classes) ? user.classes : [];

        if (userClasses.length === 0) {
            console.log('No classes found for this user.');
            return [];
        }

        // Fetch class details (timings and name) for each class
        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        // Parse timings if stored as JSONB or JSON string
        const classes = classesResult.rows.map((cls) => ({
            id: cls.id,
            name: cls.name,
            timings: Array.isArray(cls.timings) ? cls.timings : JSON.parse(cls.timings),  // Ensure timings are parsed
        })) as Class[];

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
        // Fetch user details from the database
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

        if (userClasses.length === 0) {
            return { ...user, classes: [] };  // Return early if no classes found
        }

        // Fetch the class details for the user
        const classesResult = await client.query(
            `SELECT id, name, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        // Parse timings, ensure they are handled as arrays
        const validClasses = classesResult.rows.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            timings: Array.isArray(cls.timings) ? cls.timings : JSON.parse(cls.timings),  // Ensure timings are parsed
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

        // Parse timings if it's stored as JSONB or JSON string
        return classesResult.rows.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            timings: Array.isArray(cls.timings) ? cls.timings : JSON.parse(cls.timings),  // Parse timings if it's a string
        })) as Class[];
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw new Error('Failed to fetch classes');
    } finally {
        client.release();
    }
};

// Fetch classes for user by email
export const fetchClassesForUserByEmail5 = async (email: string): Promise<Class[]> => {
    const client = await db.connect();

    try {
        // Fetch the user's classes
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

        // Fetch details for each class, including the entryCode
        const classesResult = await client.query(
            `SELECT id, name, entrycode, timings FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]
        );

        // Parse timings if stored as JSONB or JSON string
        return classesResult.rows.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            entryCode: cls.entrycode, // Include the entry code
            timings: Array.isArray(cls.timings) ? cls.timings : JSON.parse(cls.timings), // Ensure timings are parsed
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

// Add a class and include the teacher in the student list
export const addClass = async (
    teacherId: string,
    name: string,
    entryCode: string,
    timings: any,
    students: string[] = []
): Promise<{ success: boolean; classId: string }> => {
    const client = await db.connect();
    const classId = uuidv4();

    try {
        // Insert the class into the database, associating the teacher as `teacherId`
        await client.query(
            `INSERT INTO classes (id, name, entrycode, teacherid, timings, students)
             VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)`,
            [classId, name, entryCode, teacherId, JSON.stringify(timings), JSON.stringify(students)]
        );

        // Update the teacher's `classes` field in the `users` table
        await client.query(
            `UPDATE users
             SET classes = classes || $1::jsonb
             WHERE id = $2`,
            [JSON.stringify([classId]), teacherId]
        );

        return { success: true, classId };
    } catch (error) {
        console.error('Error adding class:', error);
        throw new Error('Failed to add class. Please try again later.');
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

/*
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
*/

// Fetch classes for user by email
export const fetchClassesForUserByEmail3 = async (email: string): Promise<Class[]> => {
    const client = await db.connect();
    console.log('Fetching classes for email:', email);

    try {
        const userResult = await client.query(`SELECT classes FROM users WHERE email = $1`, [email]);
        const user = userResult.rows[0];
        console.log('User found:', user);

        if (!user) {
            console.log('User not found.');
            throw new Error('User not found');
        }

        const userClasses = Array.isArray(user.classes) ? user.classes : [];
        console.log('Classes for user:', userClasses);

        if (userClasses.length === 0) {
            console.log('No classes found.');
            return [];
        }

        const classesResult = await client.query(`SELECT id, name FROM classes WHERE id = ANY($1::uuid[])`, [userClasses]);
        console.log('Classes fetched from DB:', classesResult.rows);

        return classesResult.rows;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw new Error('Failed to fetch classes.');
    } finally {
        client.release();
        console.log('Class fetching process complete.');
    }
};

// Mark attendance logic and update user location
export const markAttendance = async (email: string, classId: string, present: boolean, locationCoords = null) => {
    const client = await db.connect();
    console.log('Marking attendance for email:', email, 'classId:', classId, 'present:', present);

    try {
        // Step 1: Get the student by email
        const userResult = await client.query(`SELECT id, present FROM users WHERE email = $1`, [email]);
        const user = userResult.rows[0];
        console.log('Student data found:', user);

        if (!user) throw new Error('User not found');

        // Update user's location if coordinates are provided
        if (locationCoords) {
            console.log('Updating user location:', locationCoords);
            await client.query(
                `UPDATE users SET locationlatitude = $1, locationlongitude = $2 WHERE email = $3`,
                [locationCoords.latitude, locationCoords.longitude, email]
            );
            console.log('User location updated successfully.');
        }

        // Step 2: Check time window for the class
        const classResult = await client.query(`SELECT timings FROM classes WHERE id = $1`, [classId]);
        const classData = classResult.rows[0];
        console.log('Class timings found:', classData);

        const now = new Date();
        console.log('Current time:', now);

        let isWithinTimeWindow = false;

        for (const timing of classData.timings) {
            const dayOfWeek = timing.day; // e.g., "Monday"
            const startTimeString = timing.startTime; // e.g., "12:10AM"
            console.log(`Processing timing: ${dayOfWeek} - ${startTimeString}`);

            // Get the correct date for the next occurrence of the class day
            const classDayDate = getNextClassDay(now, dayOfWeek);
            if (!classDayDate) {
                console.error(`Invalid class day: ${dayOfWeek}`);
                continue;
            }

            // Construct a full date and time string
            const classStart = new Date(`${classDayDate.toDateString()} ${convertTo24HourTime(startTimeString)}`);

            if (isNaN(classStart.getTime())) {
                console.error('Invalid class start date:', classStart);
                continue;
            }

            const timeWindowStart = new Date(classStart.getTime() - 5 * 60 * 1000); // 5 minutes before start
            const timeWindowEnd = new Date(classStart.getTime() + 5 * 60 * 1000);   // 5 minutes after start

            console.log(`Class start: ${classStart}`);
            console.log(`Time window: start = ${timeWindowStart}, end = ${timeWindowEnd}`);

            // Check if current time is within the allowed window
            if (now >= timeWindowStart && now <= timeWindowEnd) {
                isWithinTimeWindow = true;
                break; // No need to check further if one timing is valid
            }
        }

        if (!isWithinTimeWindow) {
            console.log('Outside of allowed time window.');
            return { success: false, message: 'Outside of allowed time window.' };
        }

        // Step 3: Update attendance based on location and time window
        console.log('Updating attendance in the database...');
        await client.query(
            `UPDATE users SET present = $1 WHERE email = $2`,
            [present, email]
        );

        console.log('Attendance updated successfully.');
        return { success: true, message: 'Attendance updated successfully.' };
    } catch (error) {
        console.error('Error marking attendance:', error);
        return { success: false, message: 'Failed to mark attendance.' };
    } finally {
        client.release();
        console.log('Attendance marking process complete.');
    }
};

// Utility function to get the next occurrence of a specific day (e.g., next Monday)
// Utility function to get the correct occurrence of a class day (today or next week)
function getNextClassDay(currentDate: Date, targetDay: string): Date | null {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = daysOfWeek.indexOf(targetDay);

    if (targetDayIndex === -1) {
        console.error(`Invalid day: ${targetDay}`);
        return null;
    }

    const currentDayIndex = currentDate.getDay();

    // If today is the target day, use today as the class day
    if (currentDayIndex === targetDayIndex) {
        console.log(`Class is today (${daysOfWeek[currentDayIndex]}).`);
        return currentDate;  // Return today's date
    }

    // Otherwise, calculate the next occurrence of the target day
    const daysUntilNextClass = (targetDayIndex + 7 - currentDayIndex) % 7 || 7;

    const nextClassDate = new Date(currentDate);
    nextClassDate.setDate(currentDate.getDate() + daysUntilNextClass);
    return nextClassDate;
}

// Convert 12-hour time (e.g., "1:00PM") to 24-hour time (e.g., "13:00")
function convertTo24HourTime(timeString: string): string {
    const [time, modifier] = timeString.split(/(AM|PM)/i);
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


