// ═══════════════════════════════════════
// Initial Data — Teachers, Classes, Timetables
// School week: Monday–Saturday, 6 periods/day
// ═══════════════════════════════════════

export const DAYS = ['mon','tue','wed','thu','fri','sat'];
export const DAY_LABELS = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday' };
export const DAY_SHORT  = { mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu', fri:'Fri', sat:'Sat' };

export const PERIODS = [
  { id: 0, label: 'Period 1', time: '08:00–08:45' },
  { id: 1, label: 'Period 2', time: '08:50–09:35' },
  { id: 2, label: 'Period 3', time: '09:40–10:25' },
  { id: 'break', label: 'Break',    time: '10:25–10:45', isBreak: true },
  { id: 3, label: 'Period 4', time: '10:45–11:30' },
  { id: 4, label: 'Period 5', time: '11:35–12:20' },
  { id: 5, label: 'Period 6', time: '12:25–13:10' },
];

// Teacher color palette
const COLORS = [
  { bg:'#dbeafe', text:'#1d4ed8' },
  { bg:'#dcfce7', text:'#166534' },
  { bg:'#fce7f3', text:'#be185d' },
  { bg:'#fef3c7', text:'#b45309' },
  { bg:'#ede9fe', text:'#7c3aed' },
  { bg:'#ccfbf1', text:'#0f766e' },
  { bg:'#ffedd5', text:'#c2410c' },
  { bg:'#fae8ff', text:'#a21caf' },
  { bg:'#f0fdf4', text:'#15803d' },
  { bg:'#eff6ff', text:'#1d4ed8' },
];

export const teachers = [
  { id:'t1',  name:'Mrs. Priya Sharma',   initials:'PS', subjects:['Maths','Science'],    secondary:['English'], ...COLORS[0], username:'priya.sharma',   password:'priya123'   },
  { id:'t2',  name:'Mr. Arjun Mehta',     initials:'AM', subjects:['English','Hindi'],     secondary:['EVS'],     ...COLORS[1], username:'arjun.mehta',    password:'arjun123'   },
  { id:'t3',  name:'Mrs. Sunita Rao',     initials:'SR', subjects:['Science','EVS'],       secondary:['Maths'],   ...COLORS[2], username:'sunita.rao',     password:'sunita123'  },
  { id:'t4',  name:'Mr. Ravi Kumar',      initials:'RK', subjects:['Hindi','EVS'],         secondary:['English'], ...COLORS[3], username:'ravi.kumar',     password:'ravi123'    },
  { id:'t5',  name:'Mrs. Anita Joshi',    initials:'AJ', subjects:['English','Art'],       secondary:['Hindi'],   ...COLORS[4], username:'anita.joshi',    password:'anita123'   },
  { id:'t6',  name:'Mr. Deepak Nair',     initials:'DN', subjects:['Maths','Computers'],  secondary:['Science'], ...COLORS[5], username:'deepak.nair',    password:'deepak123'  },
  { id:'t7',  name:'Mrs. Kavya Reddy',    initials:'KR', subjects:['EVS','Science'],       secondary:['Hindi'],   ...COLORS[6], username:'kavya.reddy',    password:'kavya123'   },
  { id:'t8',  name:'Mr. Suresh Pillai',   initials:'SP', subjects:['PE','Art'],            secondary:['EVS'],     ...COLORS[7], username:'suresh.pillai',  password:'suresh123'  },
  { id:'t9',  name:'Mrs. Meena Iyer',     initials:'MI', subjects:['Hindi','English'],     secondary:['Maths'],   ...COLORS[8], username:'meena.iyer',     password:'meena123'   },
  { id:'t10', name:'Mr. Vikram Bose',     initials:'VB', subjects:['Computers','Maths'],  secondary:['Science'], ...COLORS[9], username:'vikram.bose',    password:'vikram123'  },
];

export const classes = [
  { id:'c1', name:'Standard I',   shortName:'Std I',   room:'Room 101', students:32 },
  { id:'c2', name:'Standard II',  shortName:'Std II',  room:'Room 102', students:35 },
  { id:'c3', name:'Standard III', shortName:'Std III', room:'Room 201', students:38 },
  { id:'c4', name:'Standard IV',  shortName:'Std IV',  room:'Room 202', students:36 },
  { id:'c5', name:'Standard V',   shortName:'Std V',   room:'Room 301', students:34 },
];

// ─── Timetable ───────────────────────────────────────────────
// timetables[classId][day] = array of 6 period objects: { subject, teacherId }
// Constraint: for each (day, periodIdx), all 5 classes have DIFFERENT teacherIds
//
// Period-slot → teacher assignment (same every day for simplicity; subjects vary by day):
//   P0: C1→t1, C2→t2, C3→t3, C4→t4, C5→t5
//   P1: C1→t6, C2→t7, C3→t8, C4→t9, C5→t10
//   P2: C1→t2, C2→t1, C3→t6, C4→t3, C5→t4
//   P3: C1→t7, C2→t8, C3→t9, C4→t10,C5→t6
//   P4: C1→t3, C2→t5, C3→t1, C4→t6, C5→t7  (wait check: t6 P1C1 ≠ P4C4 ✓, t7 P1C2 ≠ P4C5 ✓)
//   P5: C1→t9, C2→t10,C3→t5, C4→t2, C5→t1  (t1 P0C1 ≠ P2C2 ≠ P4C3 ≠ P5C5 ✓)
// All teachers appear 3–4 times per day across classes — no same-period conflicts ✓

const SUBJECT_ROTATIONS = {
  c1: {
    mon:['Maths',   'Maths',     'Hindi',     'EVS',       'Art',       'English'  ],
    tue:['English', 'Computers', 'Maths',     'Science',   'Hindi',     'EVS'      ],
    wed:['Science', 'Maths',     'English',   'PE',        'Maths',     'Hindi'    ],
    thu:['Maths',   'Computers', 'EVS',       'Maths',     'English',   'Science'  ],
    fri:['Hindi',   'Maths',     'Science',   'Art',       'EVS',       'Maths'    ],
    sat:['EVS',     'PE',        'Hindi',     'Computers', 'Science',   'Maths'    ],
  },
  c2: {
    mon:['English', 'EVS',       'Maths',     'Art',       'English',   'Hindi'    ],
    tue:['Hindi',   'Science',   'English',   'Maths',     'EVS',       'Maths'    ],
    wed:['Maths',   'EVS',       'Hindi',     'English',   'English',   'Computers'],
    thu:['English', 'PE',        'Science',   'EVS',       'Maths',     'Hindi'    ],
    fri:['Science', 'Maths',     'English',   'Hindi',     'Art',       'EVS'      ],
    sat:['Hindi',   'Art',       'EVS',       'Science',   'Maths',     'English'  ],
  },
  c3: {
    mon:['Science', 'PE',        'Maths',     'English',   'Science',   'Art'      ],
    tue:['Maths',   'Art',       'Science',   'Hindi',     'Maths',     'English'  ],
    wed:['EVS',     'Maths',     'Science',   'Maths',     'Hindi',     'PE'       ],
    thu:['English', 'EVS',       'Maths',     'Science',   'Art',       'Computers'],
    fri:['Hindi',   'Science',   'EVS',       'PE',        'English',   'Maths'    ],
    sat:['Maths',   'English',   'PE',        'EVS',       'Science',   'Hindi'    ],
  },
  c4: {
    mon:['Hindi',   'Hindi',     'Science',   'Computers', 'Maths',     'Maths'    ],
    tue:['EVS',     'Maths',     'Hindi',     'English',   'Science',   'Computers'],
    wed:['Science', 'Hindi',     'EVS',       'Hindi',     'Computers', 'Maths'    ],
    thu:['Maths',   'Science',   'English',   'Art',       'Hindi',     'EVS'      ],
    fri:['Computers','EVS',      'Maths',     'Hindi',     'PE',        'Science'  ],
    sat:['Art',     'English',   'Computers', 'Maths',     'Maths',     'PE'       ],
  },
  c5: {
    mon:['English', 'Computers', 'EVS',       'Maths',     'Science',   'Science'  ],
    tue:['Hindi',   'Maths',     'English',   'EVS',       'Computers', 'Hindi'    ],
    wed:['Maths',   'Science',   'Hindi',     'English',   'EVS',       'Maths'    ],
    thu:['Science', 'Hindi',     'Maths',     'Computers', 'Hindi',     'Art'      ],
    fri:['EVS',     'English',   'Computers', 'Science',   'Maths',     'EVS'      ],
    sat:['Computers','EVS',      'Science',   'PE',        'Art',       'English'  ],
  },
};

const TEACHER_MAP = [
  ['t1','t6','t2','t7','t3','t9'],  // c1 periods 0-5
  ['t2','t7','t1','t8','t5','t10'], // c2 periods 0-5
  ['t3','t8','t6','t9','t1','t5'],  // c3 periods 0-5
  ['t4','t9','t3','t10','t6','t2'], // c4 periods 0-5
  ['t5','t10','t4','t6','t7','t1'], // c5 periods 0-5
];

// Build timetables
export const timetables = {};
['c1','c2','c3','c4','c5'].forEach((cid, ci) => {
  timetables[cid] = {};
  DAYS.forEach(day => {
    timetables[cid][day] = SUBJECT_ROTATIONS[cid][day].map((subject, pi) => ({
      subject,
      teacherId: TEACHER_MAP[ci][pi],
    }));
  });
});
