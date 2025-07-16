CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT,
  description TEXT,
  image_url TEXT,
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of text for achievements
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add RLS (Row Level Security) policies if needed for more granular control
-- For now, we'll assume admin access handles all operations.
