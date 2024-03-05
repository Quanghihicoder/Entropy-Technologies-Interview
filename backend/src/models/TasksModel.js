// import connection
import db from "../config/database.js";

export const getAllTasks = (user_id, response) => {
    db.query(
        `SELECT task_id, task_desc, TO_CHAR(task_date, 'YYYY-MM-DD') AS task_date, task_status FROM tasks
        WHERE user_id = ${user_id}
        ORDER BY task_id ASC;`,
        (err, results) => {
            if (err) {
                console.log(err)
            } else {
                response.json(results.rows)
            }
        }
    );
};

export const addTask = (task) => {
    db.query(
        `
        INSERT INTO tasks (user_id, task_date, task_desc, task_status) VALUES ($1, $2, $3, $4)
        `, [task.user_id, task.task_date, task.task_desc, task.task_status],
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    );
};

export const updateTask = (task) => {
    try
    {
        deleteATask(task.task_id);
    }
    finally {
        db.query(
            `
            INSERT INTO tasks (user_id, task_id, task_date, task_desc, task_status) VALUES ($1, $2, $3, $4, $5);
            `, [task.user_id, task.task_id, task.task_date, task.task_desc, task.task_status],
            (err) => {
                if (err) {
                    console.log(err)
                }
            }
        );
    }
};

export const deleteATask = (task_id) => {
    db.query(
        `DELETE FROM tasks WHERE task_id = ${task_id}; `,
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    );
};
