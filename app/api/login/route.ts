// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
    });

    await client.connect();

    try {
        const body = await request.json();
        const { email, password, accountType } = body;

        // Query to find the user by email and account type
        const query = `
            SELECT * FROM users 
            WHERE email = $1 AND role = $2
        `;
        const values = [email, accountType];

        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            // Compare the hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                return NextResponse.json({ success: true });
            } else {
                return NextResponse.json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Database query error', err);
        return NextResponse.json({ success: false, message: 'An error occurred' });
    } finally {
        await client.end(); // Ensure client is closed in finally block
    }
}
