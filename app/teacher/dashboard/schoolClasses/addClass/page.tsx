'use client';

import React, { useState, useEffect } from 'react';
import { addClass, getTeacherIdByEmail } from 'app/lib/actions'; // Ensure correct import path

export default function ManageClasses() {
    const [name, setName] = useState('');
    const [entryCode, setEntryCode] = useState('');
    const [timings, setTimings] = useState([{ day: '', startTime: '', endTime: '' }]);
    const [students, setStudents] = useState<string[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [teacherId, setTeacherId] = useState<string | null>(null);

    // Fetch the teacher's ID when the component mounts
    useEffect(() => {
        const fetchTeacherId = async () => {
            const storedEmail = localStorage.getItem('email');
            if (!storedEmail) {
                setMessage('Error: Unable to retrieve your email. Please log in again.');
                return;
            }

            try {
                const id = await getTeacherIdByEmail(storedEmail);
                setTeacherId(id);
            } catch (error) {
                console.error('Error fetching teacher ID:', error);
                setMessage('Error fetching teacher ID. Please log in again.');
            }
        };

        fetchTeacherId();
    }, []);

    const handleAddClass = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teacherId) {
            setMessage('Error: Unable to fetch teacher information. Please log in again.');
            return;
        }

        // Validate timings
        if (timings.some((timing) => !timing.day || !timing.startTime || !timing.endTime)) {
            setMessage('Please fill out all timing fields.');
            return;
        }

        try {
            const result = await addClass(teacherId, name, entryCode, timings, students);
            setMessage(`Class added successfully! ID: ${result.classId}`);

            // Reset form fields after success
            setName('');
            setEntryCode('');
            setTimings([{ day: '', startTime: '', endTime: '' }]);
            setStudents([]);
        } catch (error) {
            console.error('Error adding class:', error);
            setMessage(`Error adding class: ${error.message || 'An unexpected error occurred.'}`);
        }
    };

    const addTimingField = () => {
        setTimings([...timings, { day: '', startTime: '', endTime: '' }]);
    };

    const handleTimingChange = (index: number, field: string, value: string) => {
        const newTimings = timings.map((timing, i) =>
            i === index ? { ...timing, [field]: value } : timing
        );
        setTimings(newTimings);
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Manage Classes</h1>

            <h2 className="text-xl mb-2">Add a Class</h2>
            {message && (
                <div
                    className={`mb-4 p-3 rounded ${
                        message.startsWith('Class added')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                    <label htmlFor="className" className="block mb-1 font-medium">
                        Class Name:
                    </label>
                    <input
                        id="className"
                        type="text"
                        placeholder="Enter class name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="entryCode" className="block mb-1 font-medium">
                        Entry Code:
                    </label>
                    <input
                        id="entryCode"
                        type="text"
                        placeholder="Enter entry code"
                        value={entryCode}
                        onChange={(e) => setEntryCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Timings</h3>
                    {timings.map((timing, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Day (e.g., Monday)"
                                value={timing.day}
                                onChange={(e) => handleTimingChange(index, 'day', e.target.value)}
                                className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Start Time (e.g., 10:00 AM)"
                                value={timing.startTime}
                                onChange={(e) => handleTimingChange(index, 'startTime', e.target.value)}
                                className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                required
                            />
                            <input
                                type="text"
                                placeholder="End Time (e.g., 11:00 AM)"
                                value={timing.endTime}
                                onChange={(e) => handleTimingChange(index, 'endTime', e.target.value)}
                                className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                required
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTimingField}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
                    >
                        Add Timing
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-400 transition"
                >
                    Add Class
                </button>
            </form>
        </div>
    );
}