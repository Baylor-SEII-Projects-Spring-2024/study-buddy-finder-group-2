DROP TABLE IF EXISTS `schools`;
create table schools
(
    school_id serial,
    email_domain varchar(255) null,
    school_name  varchar(255) null
);
INSERT INTO schools(email_domain, school_name) 
VALUES ('baylor.edu', 'Baylor University'),
('tamu.edu', 'Texas A&M University'),
('utexas.edu', 'University of Texas at Austin');