CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_key TEXT NOT NULL, -- Key for translation
  description_key TEXT NOT NULL, -- Key for translation
  price_per_unit NUMERIC NOT NULL,
  unit_type TEXT NOT NULL,
  image_url TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  icon TEXT,
  keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
