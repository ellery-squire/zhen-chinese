-- 1. Users Table (Stores account info)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                 -- Unique User ID (e.g. 'usr_10a2f9b8' or UUID)
  email TEXT UNIQUE NOT NULL,          -- User's email address
  created_at INTEGER NOT NULL,         -- Registration date timestamp
  last_login_at INTEGER                -- Last active timestamp
);

-- 2. Sentence Progress Table (Stores both Shadowing and Recall ratings)
CREATE TABLE IF NOT EXISTS sentence_progress (
  user_id TEXT NOT NULL,               -- References users(id)
  level_id TEXT NOT NULL,              -- e.g. 'A1_PART_1', 'A2_PART_4'
  sentence_id TEXT NOT NULL,           -- e.g. 'A1_P1_001', 'A1_P1_002'
  
  -- Separate Ratings (e.g. 1 to 5 stars, or 1 to 3)
  shadowing_rating INTEGER DEFAULT NULL,  -- Pronunciation / Shadowing score
  recall_rating INTEGER DEFAULT NULL,     -- Memory / Active recall score
  
  -- Timestamps for when each activity was last rated
  shadowing_updated_at INTEGER DEFAULT NULL,
  recall_updated_at INTEGER DEFAULT NULL,

  -- Foreign key connection & unique constraint
  PRIMARY KEY (user_id, sentence_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. High-Speed Index
-- Allows instant loading of all 200 sentences when a user enters a level
CREATE INDEX IF NOT EXISTS idx_user_level 
ON sentence_progress (user_id, level_id);