import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { classes, users } from '../lib/placeholder-data'; /* Ensure this path is correct */

const client = await db.connect();

async function seedUsers() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
     CREATE TABLE IF NOT EXISTS users (
       id UUID PRIMARY KEY,  /* Unique user ID from the auth service */
       name VARCHAR(255) NOT NULL,
       email TEXT NOT NULL UNIQUE,
       role VARCHAR(50) NOT NULL,  /* User role (teacher or student) */
       present BOOLEAN DEFAULT false,  /* Whether the user is present in class */
       classes JSONB NOT NULL,  /* List of class IDs the user is associated with */
       locationLatitude VARCHAR(20) NOT NULL,  /* Latitude of the user's location */
       locationLongitude VARCHAR(20) NOT NULL  /* Longitude of the user's location */
     );
   `;

    /* Insert users into the database */
    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            return client.sql`
        INSERT INTO users (id, name, email, role, present, classes, locationLatitude, locationLongitude)
        VALUES (
            ${user.id}, 
            ${user.fullName}, 
            ${user.email}, 
            ${user.role}, 
            ${user.present}, 
            ${JSON.stringify(user.classes)}, 
            ${user.locationLatitude}, 
            ${user.locationLongitude}
        )
        ON CONFLICT (id) DO NOTHING;  /* Prevent inserting duplicate users */
      `;
        }),
    );

    return insertedUsers;
}

async function seedClasses() {
    await client.sql`
     CREATE TABLE IF NOT EXISTS classes (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name VARCHAR(255) NOT NULL,
       entryCode VARCHAR(255) NOT NULL,
       teacherID UUID NOT NULL,  /* Foreign key to users table */
       timings JSONB NOT NULL,  /* Store multiple timings as JSON */
       students JSONB NOT NULL  /* Store list of student IDs enrolled in the class */
     );
   `;

    /* Insert classes into the database */
    const insertedClasses = await Promise.all(
        classes.map(async (classData) => {
            return client.sql`
        INSERT INTO classes (id, name, entryCode, teacherID, timings, students)
        VALUES (
            ${classData.id}, 
            ${classData.name}, 
            ${classData.entryCode}, 
            ${classData.teacherID}, 
            ${JSON.stringify(classData.timings)}, 
            ${JSON.stringify(classData.students)}
        )
        ON CONFLICT (id) DO NOTHING;  /* Prevent inserting duplicate classes */
      `;
        }),
    );

    return insertedClasses;
}

export async function GET() {
    try {
        await client.sql`BEGIN`;  /* Start transaction */

        // Uncomment the following lines if you need to delete existing data before seeding
        // await client.sql`DELETE FROM students;`;
        // await client.sql`DELETE FROM classes;`;
        // await client.sql`DELETE FROM users;`;

        await seedUsers();
        await seedClasses();
        await client.sql`COMMIT`;  /* Commit transaction */

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        await client.sql`ROLLBACK`;  /* Rollback transaction on error */
        console.error(error);  /* Log error details */
        return Response.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
