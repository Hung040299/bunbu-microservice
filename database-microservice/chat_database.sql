CREATE TABLE conversations (
  conversation_id SERIAL PRIMARY KEY,
  conversation_name VARCHAR(1000),
  type BOOLEAN,
  user_id INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
create index idx_conversation on conversations(created_at);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  message_content VARCHAR(4000),
  type VARCHAR(10),
  user_id INT ,
  conversation_id INT REFERENCES conversations (conversation_id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
create index idx_message on messages(created_at);

CREATE TABLE files (
  file_id SERIAL PRIMARY KEY,
  url VARCHAR(1000),
  type VARCHAR(10),
  message_id INT REFERENCES messages (message_id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
create index idx_file on files(created_at);

CREATE TABLE conversation_participants(
  conversation_participant_id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES conversations (conversation_id) ON DELETE CASCADE,
  user_id INT ,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
create index idx_conversation_participant on conversation_participants(created_at);
