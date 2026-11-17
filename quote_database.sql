PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    branding_type TEXT,
    design_available TEXT NOT NULL DEFAULT 'Yes'
        CHECK (design_available IN ('Yes', 'No')),
    design_file_path TEXT,
    deadline TEXT,
    location TEXT,
    additional_info TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'quoted', 'accepted', 'rejected', 'completed')),
    submitted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status
    ON quote_requests (status);

CREATE INDEX IF NOT EXISTS idx_quote_requests_submitted_at
    ON quote_requests (submitted_at);
