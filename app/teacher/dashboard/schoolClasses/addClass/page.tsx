'use client';

import React, { useState, useEffect } from 'react';
import { addClass, getTeacherIdByEmail } from 'app/lib/actions'; // Ensure correct import path

export default function ManageClasses() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [entryCode, setEntryCode] = useState('');
    const [timings, setTimings] = useState([{ day: '', startTime: '', endTime: '' }]);
    const [students, setStudents] = useState<string[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [teacherId, setTeacherId] = useState<string | null>(null);


    useEffect(() => {
        const fetchTeacherId = async () => {
            if (!email) {
                setMessage('Please enter a valid email.');
                return;
            }

            try {
                const id = await getTeacherIdByEmail(email);
                setTeacherId(id);
            } catch (error) {
                console.error('Error fetching teacher ID:', error);
                setMessage('Error fetching teacher ID. Please check the email.');
            }
        };

        if (email) {
            fetchTeacherId();
        }
    }, [email]);

    const handleAddClass = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!teacherId) {
            setMessage('Please enter a valid teacher email and make sure it is valid.');
            return;
        }

        // Validate timings
        if (timings.some(timing => !timing.day || !timing.startTime || !timing.endTime)) {
            setMessage('Please fill out all timing fields.');
            return;
        }

        try {
            const result = await addClass(teacherId, name, entryCode, timings, students);
            setMessage(`Class added successfully! ID: ${result.classId}`);
            // Reset form fields if needed
            setName('');
            setEntryCode('');
            setTimings([{ day: '', startTime: '', endTime: '' }]);
            setStudents([]);
        } catch (error) {
            setMessage(`Error adding class: ${error.message}`);
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Manage Classes</h1>

            <h2 className="text-xl mb-2">Add a Class</h2>
            <form onSubmit={handleAddClass} className="mb-8">
                <input
                    type="email"
                    placeholder="Teacher Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Class Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Entry Code"
                    value={entryCode}
                    onChange={(e) => setEntryCode(e.target.value)}
                    className="border p-2 w-full mb-2"
                    required
                />

                <h3 className="text-lg mb-2">Timings</h3>
                {timings.map((timing, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            placeholder="Day (e.g. Monday)"
                            value={timing.day}
                            onChange={(e) => handleTimingChange(index, 'day', e.target.value)}
                            className="border p-2 w-1/3"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Start Time (e.g. 10:00 AM)"
                            value={timing.startTime}
                            onChange={(e) => handleTimingChange(index, 'startTime', e.target.value)}
                            className="border p-2 w-1/3"
                            required
                        />
                        <input
                            type="text"
                            placeholder="End Time (e.g. 11:00 AM)"
                            value={timing.endTime}
                            onChange={(e) => handleTimingChange(index, 'endTime', e.target.value)}
                            className="border p-2 w-1/3"
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addTimingField} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                    Add Timing
                </button>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Add Class
                </button>
            </form>

            {/* Message Display */}
            {message && <div className="text-red-500 mb-4">{message}</div>}
        </div>
    );
}
