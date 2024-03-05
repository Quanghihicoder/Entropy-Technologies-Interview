CREATE TABLE IF NOT EXISTS "tasks" (
    user_id INT NOT NULL,
    task_id SERIAL NOT NULL,
    task_date TIMESTAMP NOT NULL,
    task_desc TEXT NOT NULL,
    task_status INT NOT NULL,
    PRIMARY KEY (task_id)
);

INSERT INTO "tasks" (user_id, task_date, task_desc, task_status)
VALUES 
(1,'2024-03-04', 'Clean Room', 0), 
(1,'2024-03-04', 'Make Pasta' , 1), 

(1, CURRENT_DATE, 'Read Book',0), 
(1, CURRENT_DATE, 'Edit Video', 0);










