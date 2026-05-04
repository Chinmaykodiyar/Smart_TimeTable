-- Create leave_records table
CREATE TABLE public.leave_records (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    date TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create substitutions table
CREATE TABLE public.substitutions (
    id TEXT PRIMARY KEY,
    leave_id TEXT NOT NULL REFERENCES public.leave_records(id) ON DELETE CASCADE,
    class_id TEXT NOT NULL,
    day_key TEXT NOT NULL,
    period_idx INTEGER NOT NULL,
    original_teacher_id TEXT NOT NULL,
    substitute_teacher_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'assigned',
    auto_assigned BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for both tables
alter publication supabase_realtime add table public.leave_records;
alter publication supabase_realtime add table public.substitutions;

-- Disable RLS for easy access (since this is an internal school app and we haven't set up full Auth yet)
ALTER TABLE public.leave_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.substitutions DISABLE ROW LEVEL SECURITY;
