import prisma from '../utils/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, labels } = req.body
  const userId = req.user?.id

  if (!userId) {
    return sendError(res, 'User not authenticated', 401)
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        labels,
        userId
      },
      include: {
        subtasks: true
      }
    })

    return sendSuccess(res, 'Task created successfully', task)
  } catch (error) {
    console.error('Error creating task:', error)
    return sendError(res, 'Internal server error', 500)
  }
}

// Get all tasks for a user
export const getTasks = async (req, res) => {
  const userId = req.user?.id
  
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        subtasks: true
      }
    })

    return sendSuccess(res, 'Tasks retrieved successfully', tasks)
  } catch (error) {
    console.error('Error retrieving tasks:', error)
    return sendError(res, 'Internal server error', 500)
  }
}

// Get a single task by ID
export const getTaskById = async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId
      },
      include: {
        subtasks: true
      }
    })

    if (!task) {
      return sendError(res, 'Task not found', 404)
    }

    return sendSuccess(res, 'Task retrieved successfully', task)
  } catch (error) {
    console.error('Error retrieving task:', error)
    return sendError(res, 'Internal server error', 500)
  }
}

// Update a task
export const updateTask = async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id
  const { title, description, status, priority, dueDate, labels } = req.body

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }


    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (status !== undefined) updatedData.status = status;
    if (priority !== undefined) updatedData.priority = priority;
    if (dueDate !== undefined) updatedData.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (labels !== undefined) updatedData.labels = labels;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updatedData,
      include: {
        subtasks: true
      }
    });

    return sendSuccess(res, 'Task updated successfully', updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return sendError(res, 'Internal server error', 500);
  }
}

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id

  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!task) {
      return sendError(res, 'Task not found', 404)
    }

    await prisma.task.delete({
      where: { id }
    })

    return sendSuccess(res, 'Task deleted successfully', null)
  } catch (error) {
    console.error('Error deleting task:', error)
    return sendError(res, 'Internal server error', 500)
  }
}