CREATE TABLE Roles (
  role_id serial Primary key,
  roles_name varchar(255)
);
create index index_roles on Roles (role_id);

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
  role_id int REFERENCES Roles(role_id)
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
  user_id int REFERENCES UserBunbu (user_id) 
);
create index index_profile on Profile (profile_id);

CREATE TABLE provider (
  provider_id serial Primary key,
  access_token varchar(255),
  provider_name varchar(255),
  provider_email varchar(255),
  provider_avatar varchar(255),
  provider_type varchar(255),
  user_id int REFERENCES UserBunbu (user_id) 
);

create table user_roles(
  user_role_id SERIAL primary key,
  role_id int,
  user_id int,
  create_at timestamp,
  update_at timestamp,
  foreign key(role_id) references roles(role_id) ON DELETE CASCADE,
  foreign key(user_id) references UserBunbu(user_id) ON DELETE CASCADE
);
create index idx_role_id on user_roles(role_id);

