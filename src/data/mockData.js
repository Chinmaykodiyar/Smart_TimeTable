// ── Mock Data for EduSchedule ──

export const todayScheduleSummary = {
  date: 'Oct 24, 2023',
  totalSlots: 128,
  covered: 121,
  open: 7,
  pending: 3,
  operationalPct: 94,
};

export const staffAvailability = [
  { id: 'JS', name: 'James Smith',  status: 'Medical Leave', color: '#dbeafe', textColor: '#1d4ed8' },
  { id: 'EL', name: 'Elena Lopez',  status: 'Personal Day',  color: '#fae8ff', textColor: '#a21caf' },
  { id: 'RK', name: 'Robert King',  status: 'Training',      color: '#dcfce7', textColor: '#166534' },
];

export const smartResolutionFeed = [
  { class: 'Physics 10A', subject: 'Physics 10A', absent: 'Mr. Smith',   substitute: 'Ms. Davis',   subColor: '#16a34a' },
  { class: 'World History', subject: 'World History', absent: 'Elena Lopez', substitute: 'Mr. Marco',   subColor: '#16a34a' },
  { class: 'Algebra II',  subject: 'Algebra II',  absent: 'Robert King', substitute: 'Searching…',  subColor: '#9ca3af' },
  { class: 'Biology Lab', subject: 'Biology Lab', absent: 'Dr. Aris',    substitute: 'Ms. W…',      subColor: '#16a34a' },
];

// ── Timetable ──
export const weekDays = [
  { short: 'MON', num: 12 },
  { short: 'TUE', num: 13, active: true },
  { short: 'WED', num: 14 },
  { short: 'THU', num: 15 },
  { short: 'FRI', num: 16 },
];

export const timetableEntries = [
  {
    id: 't1', type: 'class',
    time: '08:00', period: 'P1',
    subject: 'Advanced Mathematics', category: 'ACADEMIC', categoryColor: '#1d4ed8', categoryBg: '#dbeafe',
    class: 'Class 12-A', room: 'Room 302', teacher: 'Dr. Sarah Jenkins',
    accent: '#1d4ed8',
  },
  {
    id: 't2', type: 'substitute',
    time: '09:15', period: 'P2',
    subject: 'Organic Chemistry', category: 'Substitute', categoryColor: '#b45309', categoryBg: '#fef3c7',
    class: 'Class 11-C', room: 'Lab B',
    originalTeacher: 'Prof. Marcus Thorne', substituteTeacher: 'Mr. Leo Valdez',
    accent: '#f59e0b',
  },
  {
    id: 'b1', type: 'break', time: '10:30', label: 'MORNING RECESS',
    icon: 'coffee',
  },
  {
    id: 't3', type: 'class',
    time: '11:00', period: 'P3',
    subject: 'Modern Literature', category: 'HUMANITIES', categoryColor: '#166534', categoryBg: '#dcfce7',
    class: 'Class 10-B', room: 'Library Annex', teacher: 'Ms. Elena Rodriguez',
    accent: '#22c55e',
  },
  {
    id: 't4', type: 'substitute',
    time: '12:15', period: 'P4',
    subject: 'World History', category: 'Substitute', categoryColor: '#b45309', categoryBg: '#fef3c7',
    class: 'Class 12-A', room: 'Room 104',
    originalTeacher: 'Mr. James Sterling', substituteTeacher: 'Ms. Chloe Zhang',
    accent: '#f59e0b',
  },
  {
    id: 'b2', type: 'break', time: '13:30', label: 'LUNCH BREAK',
    icon: 'fork',
  },
  {
    id: 't5', type: 'class',
    time: '14:30', period: 'P5',
    subject: 'Digital Arts', category: 'CREATIVE', categoryColor: '#7c3aed', categoryBg: '#ede9fe',
    class: 'Class 11-B', room: 'Media Studio', teacher: 'Mrs. Sophia Lane',
    accent: '#8b5cf6',
  },
];

export const todaySummaryStats = {
  activePeriods: 5,
  subChanges: 2,
  totalTeaching: '04h 30m',
  studentsReached: 128,
};

// ── Leave ──
export const recentLeaveRequests = [
  { id: 'l1', teacher: 'Mark Wilson',  initial: 'MW', color: '#dbeafe', tcolor: '#1d4ed8', type: 'Emergency Medical', time: 'Today, 08:30 – 15:00' },
  { id: 'l2', teacher: 'Emily Chen',   initial: 'EC', color: '#fae8ff', tcolor: '#a21caf', type: 'Logistical Delay',   time: 'Oct 24, 08:00 – 10:00' },
  { id: 'l3', teacher: 'Sarah Miller', initial: 'SM', color: '#dcfce7', tcolor: '#166534', type: 'Personal Leave',     time: 'Oct 23, All Day' },
];

export const substitutionMap = {
  absent: { name: 'Jane Doe', dept: 'History Dept', initial: 'JD', color: '#fae8ff', tcolor: '#a21caf' },
  substitutes: [
    { name: 'Robert King',  details: 'Maths / Phys. / Hist. / Sci.', initial: 'RK', color: '#dbeafe', tcolor: '#1d4ed8', preferred: true },
    { name: 'Sarah Miller', details: 'Hist. / Geog. / Phys. / Sci.',  initial: 'SM', color: '#dcfce7', tcolor: '#166534', preferred: false },
    { name: 'Brian Lee',    details: 'Chem. / Biol. / Phys. / Sci.',  initial: 'BL', color: '#fff7ed', tcolor: '#c2410c', preferred: false },
  ],
};

export const leaveMetrics = {
  activeSubsToday: 12,
  automatedPct: '2/12',
  efficiencyRate: 98.4,
  efficiencyDelta: '+2.1%',
  avgResponseTime: '4.2m',
};

// ── Profiles ──
export const profileData = {
  name: 'Dr. Elena Rodriguez',
  role: 'Senior Faculty',
  department: 'Mathematics Department',
  specializations: ['Pure Mathematics', 'Advanced Calculus', 'Statistics'],
  substitutionsFilled: 24,
  workloadBalance: 88,
  avatar: null,
};

export const weeklyAvailability = {
  times: ['08:00 – 09:30', '10:00 – 11:30', '13:00 – 14:30'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  slots: [
    // Mon
    { day: 0, time: 0, type: 'class',   label: 'MATH-301', sub: 'Room 402' },
    { day: 0, time: 1, type: 'standby', label: 'STANDBY',  sub: 'Available' },
    { day: 0, time: 2, type: 'empty' },
    // Tue
    { day: 1, time: 0, type: 'prep',    label: 'Preparation', sub: null },
    { day: 1, time: 1, type: 'class',   label: 'MATH-102', sub: 'Auditorium 8' },
    { day: 1, time: 2, type: 'standby', label: 'STANDBY',  sub: 'Available' },
    // Wed
    { day: 2, time: 0, type: 'empty' },
    { day: 2, time: 1, type: 'empty' },
    { day: 2, time: 2, type: 'empty' },
    // Thu
    { day: 3, time: 0, type: 'empty' },
    { day: 3, time: 1, type: 'empty' },
    { day: 3, time: 2, type: 'empty' },
    // Fri
    { day: 4, time: 0, type: 'empty' },
    { day: 4, time: 1, type: 'empty' },
    { day: 4, time: 2, type: 'empty' },
  ],
};

export const activeSubstitution = {
  date: 'OCT 14, 10:00 AM',
  dateNum: 14,
  subject: 'Advanced Physics (SUB)',
  status: 'CONFIRMED',
  coveringFor: 'Prof. James Wilson',
};
