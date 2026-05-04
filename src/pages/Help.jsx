import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Help() {
  const { currentUser } = useAuth();
  
  return (
    <div className="page-body animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Help & User Manual
          </h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Welcome to the Smart Timetable help center. Below you'll find easy-to-understand instructions on how to use the system. You can also download this manual as a PDF for offline reading.
          </p>
        </div>
        
        <a 
          href="/Smart-Timetable-User-Manual.pdf" 
          download 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF Manual
        </a>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ maxWidth: '800px' }}>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '8px', marginBottom: '16px' }}>
            1. Getting Started
          </h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            The Smart Timetable is designed to be simple. When you open the app, you will need to log in. 
            There are two types of accounts:
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li><strong>Admin (Principal/Manager):</strong> Has access to all overview stats, can see everyone's timetables, and manage teacher leaves and substitutions.</li>
              <li><strong>Teacher:</strong> Has access to their personal dashboard, can view all timetables, and can see if they have been assigned as a substitute for another teacher.</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>
            2. Viewing Timetables
          </h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            To see the schedule for any class, click on the <strong>"Timetables"</strong> button in the left menu.
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li>You can select a specific class (like Class 1, Class 2, etc.) from the top menu.</li>
              <li>The timetable shows all periods from Monday to Friday.</li>
              <li>If a teacher is on leave, their class will be marked with a special <strong>Substituted</strong> badge, showing who the new teacher is for that period.</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>
            3. Managing Leaves & Substitutions (Admins Only)
          </h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            If you are an Admin, you will see a <strong>"Leave & Substitution"</strong> button in the menu. This is where the magic happens!
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li>To mark a teacher on leave, click the <strong>"Record New Leave"</strong> button, select the teacher, and choose the date.</li>
              <li>The system will <strong>automatically</strong> find available substitute teachers who are free during those specific periods!</li>
              <li>You can review the suggested substitutions and click <strong>"Approve & Save"</strong> to finalize them. The timetable will instantly update for everyone.</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>
            4. Teacher Dashboard
          </h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            If you are a Teacher, your home page is your <strong>Dashboard</strong>. 
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li>It shows exactly what classes you have today and what subject you are teaching.</li>
              <li>If an admin assigns you as a substitute for another teacher who is absent, that extra class will clearly appear on your dashboard with a "Substitute" label.</li>
            </ul>
          </p>

        </div>
      </div>
    </div>
  );
}
