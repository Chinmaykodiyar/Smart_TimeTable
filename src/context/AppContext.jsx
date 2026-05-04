import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { teachers, classes, timetables } from '../data/initialData';
import { autoAssign, getDayKey, getTodayKey } from '../utils/substituteEngine';
import { supabase } from '../supabaseClient';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [substitutions, setSubstitutions] = useState([]);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      const { data: leaves } = await supabase.from('leave_records').select('*');
      const { data: subs } = await supabase.from('substitutions').select('*');
      if (leaves) {
        setLeaveRecords(leaves.map(l => ({ id: l.id, teacherId: l.teacher_id, date: l.date, reason: l.reason, createdAt: l.created_at })));
      }
      if (subs) {
        setSubstitutions(subs.map(s => ({ 
          id: s.id,
          leaveId: s.leave_id, 
          classId: s.class_id,
          dayKey: s.day_key,
          periodIdx: s.period_idx,
          originalTeacherId: s.original_teacher_id,
          substituteTeacherId: s.substitute_teacher_id,
          subject: s.subject,
          status: s.status,
          autoAssigned: s.auto_assigned
        })));
      }
    };
    fetchData();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_records' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'substitutions' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add a leave record and auto-assign substitutes
  const addLeave = useCallback(async (leaveData) => {
    const id = `leave_${Date.now()}`;
    const record = { ...leaveData, id, createdAt: new Date().toISOString() };
    const newSubs = autoAssign(record, leaveRecords);

    // Optimistic update
    setLeaveRecords(prev => [...prev, record]);
    setSubstitutions(prev => [...prev, ...newSubs]);

    // DB insert
    await supabase.from('leave_records').insert({
      id,
      teacher_id: leaveData.teacherId,
      date: leaveData.date,
      reason: leaveData.reason || ''
    });

    if (newSubs.length > 0) {
      await supabase.from('substitutions').insert(
        newSubs.map(s => ({
          id: s.id,
          leave_id: id,
          class_id: s.classId,
          day_key: s.dayKey,
          period_idx: s.periodIdx,
          original_teacher_id: s.originalTeacherId,
          substitute_teacher_id: s.substituteTeacherId,
          subject: s.subject,
          status: s.status,
          auto_assigned: s.autoAssigned
        }))
      );
    }

    return { record, substitutions: newSubs };
  }, [leaveRecords]);

  // Remove a leave record and its substitutions
  const removeLeave = useCallback(async (leaveId) => {
    setLeaveRecords(prev => prev.filter(l => l.id !== leaveId));
    setSubstitutions(prev => prev.filter(s => s.leaveId !== leaveId));
    await supabase.from('leave_records').delete().eq('id', leaveId);
  }, []);

  // Override a substitution manually
  const overrideSubstitution = useCallback(async (subId, newTeacherId) => {
    setSubstitutions(prev => prev.map(s =>
      s.id === subId
        ? { ...s, substituteTeacherId: newTeacherId, autoAssigned: false, status: 'assigned' }
        : s
    ));
    await supabase.from('substitutions').update({
      substitute_teacher_id: newTeacherId,
      auto_assigned: false,
      status: 'assigned'
    }).eq('id', subId);
  }, []);

  // Get effective schedule for a class on a day (with substitutions applied)
  const getEffectiveSchedule = useCallback((classId, dayKey) => {
    const base = timetables[classId]?.[dayKey] || [];
    return base.map((period, pi) => {
      const sub = substitutions.find(
        s => s.classId === classId && s.periodIdx === pi && s.dayKey === dayKey
      );
      return {
        ...period,
        periodIdx: pi,
        substitution: sub || null,
        isSubstituted: !!sub,
      };
    });
  }, [substitutions]);

  // Get teacher status for today
  const getTeacherStatus = useCallback((teacherId) => {
    const todayKey = getTodayKey();
    const leave = leaveRecords.find(
      l => l.teacherId === teacherId && getDayKey(l.date) === todayKey
    );
    return leave ? { status: 'leave', leave } : { status: 'present' };
  }, [leaveRecords]);

  // Get all substitutions for a given day
  const getSubsForDay = useCallback((dayKey) => {
    return substitutions.filter(s => s.dayKey === dayKey);
  }, [substitutions]);

  // Stats
  const getTodayStats = useCallback(() => {
    const todayKey = getTodayKey();
    const todaySubs = getSubsForDay(todayKey);
    const leavesToday = leaveRecords.filter(l => getDayKey(l.date) === todayKey);
    const unassigned = todaySubs.filter(s => s.status === 'unassigned').length;
    const teachersPresent = teachers.length - leavesToday.length;
    return {
      totalTeachers: teachers.length,
      teachersPresent,
      teachersOnLeave: leavesToday.length,
      subsToday: todaySubs.length,
      unassigned,
      autoAssigned: todaySubs.filter(s => s.autoAssigned).length,
    };
  }, [leaveRecords, substitutions]);

  return (
    <AppContext.Provider value={{
      teachers,
      classes,
      timetables,
      leaveRecords,
      substitutions,
      activeView,
      setActiveView,
      addLeave,
      removeLeave,
      overrideSubstitution,
      getEffectiveSchedule,
      getTeacherStatus,
      getSubsForDay,
      getTodayStats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
