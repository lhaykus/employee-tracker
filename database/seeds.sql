USE employee_db;

INSERT INTO department(name) VALUES ('Design Department');
INSERT INTO department(name) VALUES ('Development Department');
INSERT INTO department(name) VALUES ('Release and Management Department');
INSERT INTO department(name) VALUES ('Production Department');


INSERT INTO roles(title,salary,department_id) VALUES ('Story designer', 100, 1 );
INSERT INTO roles(title,salary,department_id) VALUES ('Game Developer', 90.5, 2 );
INSERT INTO roles(title,salary,department_id) VALUES ('Project Manager', 120, 3);
INSERT INTO roles(title,salary,department_id) VALUES ('3D animator', 100, 4);
INSERT INTO roles(title,salary,department_id) VALUES ('Sound Engineer', 80, 4);
INSERT INTO roles(title,salary,department_id) VALUES ('Level Design', 70.8, 1);
INSERT INTO roles(title,salary,department_id) VALUES ('QA Engineer', 70.5, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Lara', 'Croft', 2, 20);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Dragon', 'Born', 3, 30);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Jack', 'Sparrow', 1, 10);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Harley', 'Quinn', 6, 20);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Ezio', 'Auditore', 7, 10);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Sub', 'Zero', 5, 30);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Crash', 'Bandicoot', 4, 40);


