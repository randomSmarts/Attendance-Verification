import { createUserAccount, loginUser } from 'app/lib/actions'; // Adjust the import path as necessary

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { action } = req.body; // Determine the action (register or login)

        if (action === 'register') {
            const { fullName, email, password, role, classes, locationLatitude, locationLongitude } = req.body;
            const result = await createUserAccount(fullName, email, password, role, classes, locationLatitude, locationLongitude);
            return res.status(result.success ? 200 : 400).json(result);
        } else if (action === 'login') {
            const { email, password, accountType } = req.body;
            const result = await loginUser(email, password, accountType);
            return res.status(result.success ? 200 : 400).json(result);
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}