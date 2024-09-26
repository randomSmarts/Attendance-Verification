// pages/api/login.ts
import { login } from 'app/lib/actions';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const response = await login(email, password);
        res.status(response.status).json(await response.json());
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}