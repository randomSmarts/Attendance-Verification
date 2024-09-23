const classes = [
  {
    id: 'b4b33b5f-29b8-4e61-8eb0-0ecedc547c34',
    name: 'Mathematics',
    entryCode: 'hg6rf1',
    teacherID: '410544b2-4001-4271-9855-fec4b6a6442a',
    timings: [
      { day: 'Monday', time: '10:00 AM - 11:00 AM' },
      { day: 'Wednesday', time: '10:00 AM - 11:00 AM' }
    ],
    students: [
      '2a1b544b-4001-1234-5678-abc123def456',
      '3b1b544b-4001-1234-5678-abc123def789'
    ]
  },
  {
    id: 'c2c86b62-dba5-4c2e-912e-b5f54e6a66f1',
    name: 'Science',
    entryCode: 'abc123',
    teacherID: '410544b2-4001-4271-9855-fec4b6a6442a',
    timings: [
      { day: 'Tuesday', time: '1:00 PM - 2:00 PM' },
      { day: 'Thursday', time: '1:00 PM - 2:00 PM' }
    ],
    students: [
      '2a1b544b-4001-1234-5678-abc123def456',
      '4c1b544b-4001-1234-5678-abc123def101'
    ]
  },
  {
    id: 'd8f2b5ae-4e0b-4b66-973e-c60f8927f63c',
    name: 'History',
    entryCode: 'def456',
    teacherID: '5a1b544b-4001-4271-9855-fec4b6a6443b',
    timings: [
      { day: 'Friday', time: '2:00 PM - 3:00 PM' }
    ],
    students: [
      '3b1b544b-4001-1234-5678-abc123def789',
      '4c1b544b-4001-1234-5678-abc123def101'
    ]
  }
];

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    fullName: 'Aarsh Mittal',
    email: 'aarshsmittal@gmail.com',
    password: 'password12@123418',
    classes: [classes[0].id, classes[1].id],
    locationLatitude: '28.7041',
    locationLongitude: '77.1025',
    present: true,
    role: 'teacher',
  },
  {
    id: '2a1b544b-4001-1234-5678-abc123def456',
    fullName: 'John Doe',
    password: 'passwowergerrd12@123418',
    email: 'johndoe@student.com',
    classes: [classes[0].id, classes[1].id],
    locationLatitude: '40.7128',
    locationLongitude: '-74.0060',
    present: true,
    role: 'student',
  },
  {
    id: '3b1b544b-4001-1234-5678-abc123def789',
    fullName: 'Jane Smith',
    password: 'password3418',
    email: 'janesmith@student.com',
    classes: [classes[0].id, classes[2].id],
    locationLatitude: '34.0522',
    locationLongitude: '-118.2437',
    present: true,
    role: 'student',
  },
  {
    id: '4c1b544b-4001-1234-5678-abc123def101',
    fullName: 'Mark Johnson',
    email: 'markjohnson@student.com',
    password: 'password12@123418',
    classes: [classes[1].id, classes[2].id],
    locationLatitude: '51.5074',
    locationLongitude: '-0.1278',
    present: true,
    role: 'student',
  }
];

export { classes, users };
