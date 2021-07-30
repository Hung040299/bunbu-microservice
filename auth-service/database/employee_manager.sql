CREATE TABLE Skill (
  skill_id serial Primary key,
  skill_name varchar(255)
);
create index index_skill on Skill (skill_id);
CREATE TABLE Skill_level (
  level_id serial Primary key,
  level_name varchar(255)
);
CREATE TABLE Tech (
  tech_id serial Primary key,
  tech_name varchar(255)
);
CREATE TABLE Skill_tech (
  skill_tech_id serial Primary key,
  tech_id int REFERENCES Tech(tech_id),
  skill_id int REFERENCES Skill (skill_id)
);
CREATE TABLE Project (
  project_id serial Primary key,
  project_name varchar(255),
  create_date timestamp,
  description varchar(255),
  deadline timestamp
);
create index index_project on Project (project_id);
CREATE TABLE Tech_project (
  tech_project serial Primary key,
  tech_id int REFERENCES Tech(tech_id),
  project_id int REFERENCES Project (project_id)
);
CREATE TABLE Roles (
  roles_id serial Primary key,
  roles_name varchar(255)
);
create index index_roles on Roles (roles_id);
CREATE TABLE UserBunbu (
  user_id serial Primary key,
  user_code varchar(255),
  user_password varchar(255),
  user_email varchar(255) UNIQUE  not null,
  joining_date timestamp,
  official_date timestamp,
  contact_type varchar(255),
  position varchar(255),
  id_card varchar(255),
  roles_id int REFERENCES Roles(roles_id)
);
create UNIQUE  index index_user on UserBunbu (user_email, user_password);
CREATE TABLE Profile (
  profile_id serial Primary key,
  avatar varchar(255),
  profile_name varchar(255),
  profile_phone varchar(255),
  profile_address varchar(255),
  sex varchar(255),
  date_of_birth varchar(255),
  user_id int REFERENCES UserBunbu(user_id) ON DELETE CASCADE
);
create index index_profile on Profile (profile_id);
CREATE TABLE provider (
  provider_id serial Primary key,
  access_token varchar(255),
  provider_name varchar(255),
  provider_email varchar(255),
  provider_avatar varchar(255),
  provider_type varchar(255),
  user_id int REFERENCES UserBunbu(user_id)
);
CREATE TABLE Staff_skill (
  staff_skill serial Primary key,
  user_id int REFERENCES UserBunbu(user_id),
  skill_id int REFERENCES Skill (skill_id),
  level_id int REFERENCES Skill_level (level_id)
);
CREATE TABLE Project_staff (
  project_staff serial Primary key,
  user_id int REFERENCES UserBunbu(user_id),
  project_id int REFERENCES Project (project_id),
  join_date timestamp,
  exit_date timestamp DEFAULT NULL
);
