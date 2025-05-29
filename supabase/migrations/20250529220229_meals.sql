-- Create a table for meals
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all meals"
    ON meals
    FOR SELECT
    USING (true);

CREATE POLICY "Users can create meals"
    ON meals
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own meals"
    ON meals
    FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own meals"
    ON meals
    FOR DELETE
    USING (auth.uid() = created_by);