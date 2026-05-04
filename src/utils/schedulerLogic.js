/**
 * Automatically fills substitute teachers for an absent teacher.
 * Prioritizes teachers who teach the same subject, otherwise assigns any available teacher.
 * 
 * @param {Object} timetable - Current timetable state { classId: [periodAssignments] }
 * @param {string} absentTeacherId - The ID of the teacher who is on leave
 * @param {Array} allTeachers - Array of all teacher objects
 * @returns {Object} updatedTimetable - A new timetable object with substitutions
 */
export const autoFillSubstitutes = (timetable, absentTeacherId, allTeachers) => {
  // Deep clone to avoid mutating state directly
  const updatedTimetable = JSON.parse(JSON.stringify(timetable));
  
  const absentTeacher = allTeachers.find(t => t.id === absentTeacherId);
  if (!absentTeacher) return updatedTimetable;

  // Track how many classes each substitute is taking to try and balance workload optionally
  const substituteWorkload = {};

  // For each class in the timetable
  Object.keys(updatedTimetable).forEach(classId => {
    const classSchedule = updatedTimetable[classId];
    
    // Check each period for the absent teacher
    classSchedule.forEach((slot, index) => {
      if (slot.teacherId === absentTeacherId) {
        
        const periodId = slot.periodId;
        const subjectRequired = slot.subject;
        
        // Find all teachers currently busy in this exact period across ALL classes
        const busyTeacherIdsInPeriod = new Set();
        Object.values(updatedTimetable).forEach(schedule => {
          const matchingSlot = schedule.find(s => s.periodId === periodId);
          if (matchingSlot) {
            busyTeacherIdsInPeriod.add(matchingSlot.teacherId);
          }
        });

        // Add absent teacher to busy list so they aren't reassigned to themselves
        busyTeacherIdsInPeriod.add(absentTeacherId);

        // Filter available teachers
        const availableTeachers = allTeachers.filter(t => 
          !busyTeacherIdsInPeriod.has(t.id) && t.status !== 'leave'
        );

        if (availableTeachers.length > 0) {
          // Priority 1: Same subject
          const sameSubjectTeachers = availableTeachers.filter(t => t.subject === subjectRequired);
          
          let selectedSubstitute = null;

          if (sameSubjectTeachers.length > 0) {
            // Pick a random or the first available same subject teacher
            selectedSubstitute = sameSubjectTeachers[0];
          } else {
            // Priority 2: Any available teacher
            selectedSubstitute = availableTeachers[0];
          }

          // Assign the substitute
          updatedTimetable[classId][index] = {
            ...slot,
            teacherId: selectedSubstitute.id,
            isSubstitute: true,
            originalTeacherId: absentTeacherId
          };

          // Mark this substitute as busy now for this period (updated in timetable, 
          // so next iteration will naturally catch it, but good to note)
        } else {
          // No one is available - mark as Unassigned
          updatedTimetable[classId][index] = {
            ...slot,
            teacherId: null,
            isSubstitute: true,
            originalTeacherId: absentTeacherId,
            error: "No available teachers"
          };
        }
      }
    });
  });

  return updatedTimetable;
};
