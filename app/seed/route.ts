import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, classes } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      classes UUID[] DEFAULT '{}'::UUID[],
      role VARCHAR(50)
    );
  `;

    await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await client.sql`
        INSERT INTO users (id, full_name, email, password, classes, role)
        VALUES (${user.id}, ${user.fullName}, ${user.email}, ${hashedPassword}, ${user.classes.map(cls => `'${cls}'`).join(',')}, ${user.role})
        ON CONFLICT (id) DO NOTHING;
      `;
        })
    );
}

async function seedClasses() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
    CREATE TABLE IF NOT EXISTS classes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      entry_code VARCHAR(255) NOT NULL,
      teacher_id UUID NOT NULL,
      timings JSONB NOT NULL,
      students UUID[] DEFAULT '{}'::UUID[]
    );
  `;

    await Promise.all(
        classes.map((cls) => client.sql`
      INSERT INTO classes (id, name, entry_code, teacher_id, timings, students)
      VALUES (${cls.id}, ${cls.name}, ${cls.entryCode}, ${cls.teacherID}, ${cls.timings}, ${cls.students.map(student => `'${student}'`).join(',')})
      ON CONFLICT (id) DO NOTHING;
    `)
    );
}

export async function GET() {
    try {
        await client.sql`BEGIN`;
        await seedUsers();
        await seedClasses();
        await client.sql`COMMIT`;

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        await client.sql`ROLLBACK`;
        return Response.json({ error: error.message }, { status: 500 });
    }
}
