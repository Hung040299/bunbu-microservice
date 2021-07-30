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

CREATE TABLE Staff_skill (
  staff_skill serial Primary key,
  user_id int ,
  skill_id int REFERENCES Skill (skill_id),
  level_id int REFERENCES Skill_level (level_id)
);

CREATE TABLE Project_staff (
  project_staff serial Primary key,
  user_id int ,
  project_id int REFERENCES Project (project_id),
  join_date timestamp,
  exit_date timestamp DEFAULT NULL
);
