// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

const classes = [
  {
    id: 'b4b33b5f-29b8-4e61-8eb0-0ecedc547c34', // Updated to a valid UUID
    name: 'Mathematics',
    entryCode: 'hg6rf1',
    teacherID: '410544b2-4001-4271-9855-fec4b6a6442a',
    attendance: true,
    inClassVerifiedProfile: true,
    timings: [
      {
        day: 'Monday',
        time: '10:00 AM - 11:00 AM'
      },
      {
        day: 'Wednesday',
        time: '10:00 AM - 11:00 AM'
      }
    ],
    students: [
      '2a1b544b-4001-1234-5678-abc123def456', // John Doe
      '3b1b544b-4001-1234-5678-abc123def789'  // Jane Smith
    ] // John and Jane are enrolled in Mathematics
  },
  {
    id: 'c2c86b62-dba5-4c2e-912e-b5f54e6a66f1', // Updated to a valid UUID
    name: 'Science',
    entryCode: 'abc123',
    teacherID: '410544b2-4001-4271-9855-fec4b6a6442a',
    attendance: true,
    inClassVerifiedProfile: true,
    timings: [
      {
        day: 'Tuesday',
        time: '1:00 PM - 2:00 PM'
      },
      {
        day: 'Thursday',
        time: '1:00 PM - 2:00 PM'
      }
    ],
    students: [
      '2a1b544b-4001-1234-5678-abc123def456', // John Doe
      '4c1b544b-4001-1234-5678-abc123def101'  // Mark Johnson
    ] // John and Mark are enrolled in Science
  },
  {
    id: 'd8f2b5ae-4e0b-4b66-973e-c60f8927f63c', // Updated to a valid UUID
    name: 'History',
    entryCode: 'def456',
    teacherID: '5a1b544b-4001-4271-9855-fec4b6a6443b', // Different teacher ID
    attendance: true,
    inClassVerifiedProfile: true,
    timings: [
      {
        day: 'Friday',
        time: '2:00 PM - 3:00 PM'
      }
    ],
    students: [
      '3b1b544b-4001-1234-5678-abc123def789', // Jane Smith
      '4c1b544b-4001-1234-5678-abc123def101'  // Mark Johnson
    ] // Jane and Mark are enrolled in History
  }
];

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    fullName: 'Aarsh Mittal',
    email: 'aarshsmittal@gmail.com',
    classes: [classes[0].id, classes[1].id], // Aarsh teaches Mathematics and Science
    locationLatitude: '28.7041',
    locationLongitude: '77.1025',
    role: 'teacher',
  },
  {
    id: '2a1b544b-4001-1234-5678-abc123def456',
    fullName: 'John Doe',
    email: 'johndoe@student.com',
    classes: [classes[0].id, classes[1].id], // John is enrolled in Mathematics and Science
    locationLatitude: '40.7128',
    locationLongitude: '-74.0060',
    role: 'student',
  },
  {
    id: '3b1b544b-4001-1234-5678-abc123def789',
    fullName: 'Jane Smith',
    email: 'janesmith@student.com',
    classes: [classes[0].id, classes[2].id], // Jane is enrolled in Mathematics and History
    locationLatitude: '34.0522',
    locationLongitude: '-118.2437',
    role: 'student',
  },
  {
    id: '4c1b544b-4001-1234-5678-abc123def101',
    fullName: 'Mark Johnson',
    email: 'markjohnson@student.com',
    classes: [classes[1].id, classes[2].id], // Mark is enrolled in Science and History
    locationLatitude: '51.5074',
    locationLongitude: '-0.1278',
    role: 'student',
  }
];

const classEnrollments = [
  {
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',  // Aarsh Mittal (teacher)
    class_id: 'b4b33b5f-29b8-4e61-8eb0-0ecedc547c34',  // Mathematics class ID
    timing: {
      day: ['Monday', 'Wednesday'],  // Days the class is held
      times: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM'],  // All available timings for the class
      enrolledTiming: '10:00 AM - 11:00 AM',  // Specific timing this user is enrolled in
    },
  },
  {
    user_id: '2a1b544b-4001-1234-5678-abc123def456',  // John Doe (student)
    class_id: 'b4b33b5f-29b8-4e61-8eb0-0ecedc547c34',  // Mathematics class ID
    timing: {
      day: ['Tuesday'],  // Days the class is held
      times: ['10:00 AM - 11:00 AM'],  // All available timings for the class
      enrolledTiming: '10:00 AM - 11:00 AM',  // Specific timing this user is enrolled in
    },
  },
  {
    user_id: '3b1b544b-4001-1234-5678-abc123def789',  // Jane Smith (student)
    class_id: 'b4b33b5f-29b8-4e61-8eb0-0ecedc547c34',  // Mathematics class ID
    timing: {
      day: ['Monday', 'Wednesday'],  // Days the class is held
      times: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM'],  // All available timings for the class
      enrolledTiming: '1:00 PM - 2:00 PM',  // Specific timing this user is enrolled in
    },
  },
  // Add more enrollments as needed
];

export { classes, users, classEnrollments };
