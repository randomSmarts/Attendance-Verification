// pages/api/createAccount.ts
import { createAccount } from 'app/lib/actions';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fullname, email, password, accountType } = req.body;
        const response = await createAccount(fullname, email, password, accountType);
        res.status(response.status).json(await response.json());
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}