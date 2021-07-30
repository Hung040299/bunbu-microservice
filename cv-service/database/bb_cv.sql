create database bb_cv;

create table accounts(
  account_id SERIAL primary key,
  password varchar(1000),
  phone_numbers char(10),
  email varchar(150),
  user_name varchar(50),
  link_img varchar(250),
  create_at timestamp,
  update_at timestamp
);
create index idx_account_email on accounts(email);

create table roles(
  role_id SERIAL primary key,
  role_name varchar(20),
  create_at timestamp,
  update_at timestamp
);

create table user_roles(
  user_role_id SERIAL primary key,
  role_id int,
  account_id int,
  create_at timestamp,
  update_at timestamp,
  foreign key(role_id) references roles(role_id) ON DELETE CASCADE,
  foreign key(account_id) references accounts(account_id) ON DELETE CASCADE
);
create index idx_role_id on user_roles(role_id);

create table cv_templates(
  cv_template_id SERIAL primary key,
  location varchar(50),
  skill varchar(4000),
  product varchar(4000),
  link_img varchar (250),
  user_role_id int,
  created_at TIMESTAMP,
  update_at TIMESTAMP,
  foreign key(user_role_id) references user_roles(user_role_id) ON DELETE CASCADE
);
create index idx_cvtemplate_id on cv_templates(cv_template_id);

create table cvs(
  cv_id SERIAL primary key,
  location varchar(50),
  skill varchar(4000),
  product varchar(4000),
  link_img varchar (250),
  view_count int default 0,
  user_role_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(user_role_id) references user_roles(user_role_id) ON DELETE CASCADE
);
create index idx_cvs_id on cvs(cv_id);

create table attributes(
  attribute_id SERIAL primary key,
  attribute_name varchar(50)
);

create table attribute_values(
  attribute_value_id SERIAL primary key,
  attribute_value_name varchar(4000),
  attribute_id int,
  cv_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(attribute_id) references attributes(attribute_id) ON DELETE CASCADE,
  foreign key(cv_id) references cvs(cv_id) ON DELETE CASCADE
);

create table permissions (
  permission_id SERIAL primary key,
  permission_name varchar(25),
  created_at TIMESTAMP,
  update_at timestamp
);

create table role_permissions(
  role_permission_id SERIAL primary key,
  role_id int,
  permission_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(role_id) references roles(role_id) ON DELETE CASCADE, 
  foreign key(permission_id) references permissions(permission_id) ON DELETE CASCADE
);

create table experiences (
  experience_id SERIAL primary key,
  old_company varchar(50),
  join_date date,
  out_date date,
  cv_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(cv_id) references cvs(cv_id) ON DELETE CASCADE
);

create table programming_languages_used(
  programming_language_id SERIAL primary key,
  programming_language_name varchar(20),
  experience_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(experience_id) references experiences (experience_id) ON DELETE CASCADE
);

create table experiences_templates (
  experience_template_id SERIAL primary key,
  old_company varchar(50),
  join_date date,
  out_date date,
  cv_template_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(cv_template_id) references cv_templates (cv_template_id) ON DELETE CASCADE
);

create table programming_languages_used_templates(
  programming_language_template_id SERIAL primary key,
  programming_language_template_name varchar(20),
  update_at timestamp,
  created_at TIMESTAMP,
  experience_template_id int,
  foreign key(experience_template_id) references experiences_templates (experience_template_id) ON DELETE CASCADE
);

create table tag_name (
  tag_name_id SERIAL primary key,
  tag_name varchar(50),
  cv_id int,
  update_at timestamp,
  created_at TIMESTAMP,
  foreign key(cv_id) references cvs (cv_id) ON DELETE CASCADE
);
create index idx_tag_name on tag_name(tag_name);

create table likes(
  like_id serial,
  cv_id int,
  account_id int,
  created_at TIMESTAMP,
  update_at timestamp,
  foreign key(cv_id) references cvs(cv_id) ON DELETE CASCADE,
  foreign key(account_id) references accounts(account_id) ON DELETE CASCADE
);

CREATE TABLE conversations (
  conversation_id SERIAL PRIMARY KEY,
  conversation_name VARCHAR(1000),
  type BOOLEAN,
  account_id INT REFERENCES accounts (account_id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
create index idx_conversation on conversations(created_at);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  message_content VARCHAR(4000),
  type VARCHAR(10),
  account_id INT REFERENCES accounts (account_id) ON DELETE CASCADE,
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
  account_id INT REFERENCES accounts (account_id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
create index idx_conversation_participant on conversation_participants(created_at);
