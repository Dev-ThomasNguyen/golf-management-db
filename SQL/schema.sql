create table yourcourse(
    id serial primary key,
    clubname VARCHAR(200),
    admin VARCHAR(100),
    employees VARCHAR(200),
    city VARCHAR(200),
    state VARCHAR(200)
);

create table employee(
    id serial primary key,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    phone VARCHAR(100),
    email VARCHAR(100),
    experience VARCHAR(100),
    datestarted VARCHAR(100),
    adminstatus VARCHAR(100),
    course_id INTEGER REFERENCES yourcourse(id),
    password VARCHAR(250)
);

create table sprayChart(
    id serial primary key,
    dateApplied varchar(100),
    employee_id integer references employee(id),
    holesTreated varchar(1000),
    lengthOfCutTreated varchar(1000),
    chemicalsBeingUsed text,
    rateApplied varchar(100),
    totalGallons varchar(100),
    sprayRig varchar(1000),
    pestOrDiseaseControlled varchar(1000)
);



-- create table jobtype(
--     id serial primary key,
--     jobtype VARCHAR(200),
--     instructions VARCHAR(200)  
-- );

create table jobboard(
    id serial primary key,
    date VARCHAR(100),
    jobtype VARCHAR(200),
    employee INTEGER REFERENCES employee(id),
    comments text
);


