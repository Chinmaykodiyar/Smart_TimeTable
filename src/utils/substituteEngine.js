// Auto-Substitution Engine
// Returns an array of substitution records given a new leave entry

import { timetables, teachers, classes, DAYS } from '../data/initialData';

/**
 * Find which day-key corresponds to a JS Date
 */
export function getDayKey(date) {
  const d = new Date(date);
  const dow = d.getDay(); // 0=Sun,1=Mon...6=Sat
  const map = { 1:'mon',2:'tue',3:'wed',4:'thu',5:'fri',6:'sat' };
  return map[dow] || null; // null = Sunday (school closed)
}

/**
 * Get today's day key
 */
export function getTodayKey() {
  return getDayKey(new Date());
}

/**
 * Get all periods where a teacher teaches on a given day key (across all classes)
 * Returns: [{ classId, periodIdx, subject }]
 */
export function getTeacherPeriodsOnDay(teacherId, dayKey) {
  const slots = [];
  Object.keys(timetables).forEach(classId => {
    const daySchedule = timetables[classId][dayKey];
    if (!daySchedule) return;
    daySchedule.forEach((period, pi) => {
      if (period.teacherId === teacherId) {
        slots.push({ classId, periodIdx: pi, subject: period.subject });
      }
    });
  });
  return slots;
}

/**
 * Find the best available substitute teacher for a given period slot on a day
 * @param {string} absentTeacherId
 * @param {string} subject - desired subject
 * @param {string} dayKey
 * @param {number} periodIdx
 * @param {Array} allLeaveRecords - all active leave records for that day
 * @param {Array} alreadyAssigned - subs already assigned in this batch [{substituteTeacherId, periodIdx}]
 */
export function findBestSubstitute(absentTeacherId, subject, dayKey, periodIdx, allLeaveRecords, alreadyAssigned) {
  // Build sets of unavailable teachers at this period
  const teachersOnLeave = new Set(
    allLeaveRecords
      .filter(l => getDayKey(l.date) === dayKey)
      .map(l => l.teacherId)
  );

  // Teachers already teaching at this period (original schedule)
  const teachingAtPeriod = new Set();
  Object.keys(timetables).forEach(classId => {
    const slot = timetables[classId][dayKey]?.[periodIdx];
    if (slot && slot.teacherId !== absentTeacherId) {
      teachingAtPeriod.add(slot.teacherId);
    }
  });

  // Teachers already assigned as sub for this period in this batch
  const alreadySubbingAtPeriod = new Set(
    alreadyAssigned
      .filter(a => a.periodIdx === periodIdx)
      .map(a => a.substituteTeacherId)
  );

  const available = teachers.filter(t => {
    if (t.id === absentTeacherId) return false;
    if (teachersOnLeave.has(t.id)) return false;
    if (teachingAtPeriod.has(t.id)) return false;
    if (alreadySubbingAtPeriod.has(t.id)) return false;
    return true;
  });

  if (available.length === 0) return null;

  // Score: 3 = primary subject match, 2 = secondary match, 1 = any
  const scored = available.map(t => {
    let score = 1;
    if (t.subjects.includes(subject)) score = 3;
    else if (t.secondary.includes(subject)) score = 2;
    return { teacher: t, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].teacher;
}

/**
 * Main engine: generate substitution records for a new leave entry
 * @param {Object} leaveRecord - { id, teacherId, date, type }
 * @param {Array} existingLeaveRecords
 * @returns {Array} substitution records
 */
export function autoAssign(leaveRecord, existingLeaveRecords) {
  const dayKey = getDayKey(leaveRecord.date);
  if (!dayKey) return []; // Sunday

  const slots = getTeacherPeriodsOnDay(leaveRecord.teacherId, dayKey);
  const allLeave = [...existingLeaveRecords, leaveRecord];
  const assigned = [];

  slots.forEach(({ classId, periodIdx, subject }) => {
    const sub = findBestSubstitute(
      leaveRecord.teacherId,
      subject,
      dayKey,
      periodIdx,
      allLeave,
      assigned
    );

    assigned.push({
      id: `sub_${Date.now()}_${classId}_${periodIdx}`,
      leaveId: leaveRecord.id,
      absentTeacherId: leaveRecord.teacherId,
      substituteTeacherId: sub ? sub.id : null,
      classId,
      periodIdx,
      dayKey,
      subject,
      autoAssigned: true,
      status: sub ? 'assigned' : 'unassigned',
    });
  });

  return assigned;
}
