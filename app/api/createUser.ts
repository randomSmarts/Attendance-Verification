// pages/api/createUser.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres'; // Update this path based on your db connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, email, password, accountType } = req.body;

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user in the database
            const response = await db.query(
                'INSERT INTO users (username, email, password, accountType) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, email, hashedPassword, accountType]
            );

            const newUser = response.rows[0];
            res.status(201).json({ success: true, user: newUser });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ success: false, message: 'Error creating user. Please try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}