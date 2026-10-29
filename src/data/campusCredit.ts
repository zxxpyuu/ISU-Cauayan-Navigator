export type CreditPerson = {
  name: string;
  role: string;
};

export type CreditPageData = {
  projectTitle: string;
  projectNote: string;
  people: CreditPerson[];
};

export const APP_CREDIT: CreditPageData = {
  projectTitle: 'About the Project: Isabela State University - Cauayan Campus Navigator',
  projectNote:
    'The Vision\n' +
    '- The Isabela State University - Cauayan Campus Navigator is an interactive campus navigation tool created to make it easier for students, freshmen, faculty, and visitors to find their way around the Isabela State University – Cauayan Campus.\n' +
    '- The project aims to solve common navigation problems caused by unfamiliar campus layouts. Instead of relying on static maps or asking for directions, users can explore the campus digitally and quickly locate buildings, rooms, and important areas.\n\n' +
    'Creative and Critical Thinking\n' +
    'The project applies the principles of Creative and Critical Thinking by combining practical problem-solving with user-centered design.\n' +
    '1. Intuitive Navigation: The system uses familiar map features such as zooming, panning, searching, and location markers, making it easy to understand even for first-time users.\n' +
    '2. Clear Visual Design: The interface uses organized layouts, readable text, campus-themed colors, and clear markers to help users quickly identify important locations.\n' +
    '3. Real-World Utility: Rather than creating only a static campus map, the project provides an interactive and searchable system that can help users locate buildings, rooms, offices, and other campus facilities.\n\n' +
    'Academic Context\n' +
    '- The Isabela State University - Cauayan Campus Navigator was developed as a Final Requirement for the Creative and Critical Thinking course under Prof. Crisbel Ortega.\n' +
    '- The project demonstrates how creative thinking, critical analysis, user-centered design, and technology can be combined to address a real problem within the university community. Through planning, designing, testing, and improving the prototype, the project focuses on creating a useful and accessible solution for campus navigation.\n\n' +
    'The Project Team\n' +
    'Claire Bautista – Member\n' +
    'Ace Concepcion – Member\n' +
    'Ariana Farah Libari – Member\n' +
    'Carl James Mamuad – Member\n' +
    'Jan Win Medina – Member\n' +
    'Princes Joy Palaguitto – Member\n' +
    'Zyanne Pasiola – Member\n' +
    'Rayver Quilang – Member\n' +
    'Justin Roque – Member\n' +
    'Sasy Mae Rosete – Member\n' +
    'John Mikel Tolentino – Member\n' +

    'Prof. Crisbel Ortega – Instructor / Adviser',
  people: [
    { name: 'Claire Bautista', role: 'Member' },
    { name: 'Ace Concepcion', role: 'Member' },
    { name: 'Ariana Farah Libari', role: 'Member' },
    { name: 'Carl James Mamuad', role: 'Member' },
    { name: 'Jan Win Medina', role: 'Member' },
    { name: 'Princes Joy Palaguitto', role: 'Member' },
    { name: 'Zyanne Pasiola', role: 'Member' },
    { name: 'Rayver Quilang', role: 'Member' },
    { name: 'Justin Roque', role: 'Member' },
    { name: 'Sasy Mae Rosete', role: 'Member' },
    { name: 'John Mikel Tolentino', role: 'Member' },
    { name: 'Prof. Crisbel Ortega', role: 'Instructor / Adviser' }
  ]
};
