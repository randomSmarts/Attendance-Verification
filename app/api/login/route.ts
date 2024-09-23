// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: Request) {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL // TODO: Add ENV Variable
    });

    await client.connect();

    const body = await request.json();
    const { email, password, accountType } = body;

    const query = `
        SELECT * FROM users 
        WHERE email = $1 AND password = $2 AND role = $3
    `;
    const values = [email, password, accountType];

    try {
        const result = await client.query(query, values);
        await client.end();

        if (result.rows.length > 0) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Database query error', err);
        return NextResponse.json({ success: false, message: 'An error occurred' });
    }
}
