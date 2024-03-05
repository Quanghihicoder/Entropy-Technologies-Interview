// import express
import express from "express";
import { deleteTask, getTasks, postTask } from "../controllers/tasks.js";

// init express router
const router = express.Router();

////////////////////////// TASKS ////////////////////////////////
router.get("/apis/tasks/:user_id", getTasks)
router.delete("/apis/tasks/:task_id", deleteTask)
router.post("/apis/tasks/", postTask)

// export default router
export default router;