// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const classes = [
  {
    id: '1',
    name: 'Mathematics',
    entryCode: 'hg6rf1',
    teacherID: '410544b2-4001-4271-9855-fec4b6a6442a',  // Link to the teacher user
    attendance: true,
    inClassVerifiedProfile: true,
  }
];

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    fullName: 'Aarsh Mittal',
    email: 'aarshsmittal@gmail.com',
    classes: classes[0].id,
    locationLatitude: '28.7041',
    locationLongitude: '77.1025',
    role: 'teacher',  // New property indicating the user is a teacher
  },
  {
    id: '2a1b544b-4001-1234-5678-abc123def456',
    fullName: 'John Doe',
    email: 'johndoe@student.com',
    classes: classes[0].id,
    locationLatitude: '40.7128',
    locationLongitude: '-74.0060',
    role: 'student',  // New property indicating the user is a student
  },
];

export { classes, users};
