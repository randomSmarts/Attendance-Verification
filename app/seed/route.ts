import { NextResponse } from 'next/server';

export async function GET() {
    // Example data
    const data = { message: 'Seed route is working!' };

    return NextResponse.json(data);
}

// If you need POST or other HTTP methods, add them accordingly
export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ message: 'Data received', body });
}

/*import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { classes, users } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
    await client.sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      classes JSONB NOT NULL,
      locationLatitude VARCHAR(20) NOT NULL,
      locationLongitude VARCHAR(20) NOT NULL,
      present BOOLEAN NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return client.sql`
        INSERT INTO users (id, fullName, email, password, classes, locationLatitude, locationLongitude, present, role)
        VALUES (
          ${user.id},
          ${user.fullName},
          ${user.email},
          ${hashedPassword},
          ${JSON.stringify(user.classes)},  -- Make sure to stringify classes
          ${user.locationLatitude},
          ${user.locationLongitude},
          ${user.present},
          ${user.role}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
        })
    );

    return insertedUsers;
}

async function seedClasses() {
    await client.sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS classes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      entryCode VARCHAR(255) NOT NULL,
      teacherID UUID NOT NULL,
      timings JSONB NOT NULL,
      students JSONB NOT NULL
    );
  `;

    const insertedClasses = await Promise.all(
        classes.map((cls) => client.sql`
      INSERT INTO classes (id, name, entryCode, teacherID, timings, students)
      VALUES (
        ${cls.id},
        ${cls.name},
        ${cls.entryCode},
        ${cls.teacherID},
        ${JSON.stringify(cls.timings)},  -- Stringify timings
        ${JSON.stringify(cls.students)}   -- Stringify students
      )
      ON CONFLICT (id) DO NOTHING;
    `)
    );

    return insertedClasses;
}

export async function GET() {
    try {
        await client.sql`BEGIN`;
        await seedClasses();
        await seedUsers();
        await client.sql`COMMIT`;

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        await client.sql`ROLLBACK`;
        return Response.json({ error: error.message }, { status: 500 });
    }
}
*/

