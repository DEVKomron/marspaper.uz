CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_key TEXT NOT NULL,
  description_key TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  icon_name TEXT, -- Lucide icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
