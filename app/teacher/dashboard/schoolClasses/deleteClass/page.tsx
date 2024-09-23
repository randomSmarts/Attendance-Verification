export default function Page() {
    return <p>Customers Page</p>;
}

/*'use client';

import React, { useState } from 'react';
import { getClassesByEmail, deleteClassById } from 'app/lib/actions';

export default function DeleteClass() {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    const handleFetchClasses = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const fetchedClasses = await getClassesByEmail(email);
            setClasses(fetchedClasses);
        } catch (error) {
            setMessage(`Error fetching classes: ${error.message}`);
        }
    };

    const handleDeleteClasses = async () => {
        if (selectedClassIds.length === 0) {
            setMessage('Please select at least one class to delete.');
            return;
        }

        try {
            for (const classId of selectedClassIds) {
                await deleteClassById(classId);
            }
            setMessage('Classes deleted successfully!');
            setClasses((prevClasses) => prevClasses.filter(classItem => !selectedClassIds.includes(classItem.id)));
            setSelectedClassIds([]);
        } catch (error) {
            setMessage(`Error deleting classes: ${error.message}`);
        }
    };

    const handleCheckboxChange = (classId: string) => {
        setSelectedClassIds((prev) =>
            prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Delete Classes</h1>
            <form onSubmit={handleFetchClasses} className="mb-8">
                <input
                    type="email"
                    placeholder="Teacher Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Fetch Classes
                </button>
            </form>

            {classes.length > 0 && (
                <div>
                    <h2 className="text-xl mb-2">Select Classes to Delete</h2>
                    {classes.map((classItem) => (
                        <div key={classItem.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                value={classItem.id}
                                checked={selectedClassIds.includes(classItem.id)}
                                onChange={() => handleCheckboxChange(classItem.id)}
                            />
                            <label className="ml-2">{classItem.name}</label>
                        </div>
                    ))}
                    <button
                        onClick={handleDeleteClasses}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Delete Selected Classes
                    </button>
                </div>
            )}

            {message && <div className="text-red-500 mb-4">{message}</div>}
        </div>
    );
}
*/