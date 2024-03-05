
import {getAllTasks,deleteATask, addTask, updateTask} from "../models/TasksModel.js";

export const  getTasks = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        await getAllTasks(user_id,res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
} 

export const postTask = async (req, res) => {
    const data = req.body.data;
    try {
        if (parseInt(data.submit_mode) == 0) {
            await addTask(data);
        } else {
            await updateTask(data)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to post data' });
    }
    finally {
        await getAllTasks(data.user_id,res);
    }
} 

export const  deleteTask = async (req, res) => {
    const task_id = req.params.task_id;
    try {
        await deleteATask(task_id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
} 


