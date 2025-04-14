import prisma from '../utils/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

// Create a new subtask
export const createSubtask = async (req, res) => {
  const { taskId, title } = req.body
  const userId = req.user?.id

  try {
    // Verify the task belongs to the user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    })

    if (!task) {
      return sendError(res, 'Task not found', 404)
    }

    const subtask = await prisma.subtask.create({
      data: {
        title,
        taskId
      }
    })

    return sendSuccess(res, 'Subtask created successfully', subtask)
  } catch (error) {
    console.error('Error creating subtask:', error)
    return sendError(res, 'Internal server error', 500)
  }
}

// Update a subtask
export const updateSubtask = async (req, res) => {
  const { id } = req.params
  const { title, completed } = req.body
  const userId = req.user?.id

  try {
    // Verify the subtask belongs to a task owned by the user
    const subtask = await prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId
        }
      }
    })

    if (!subtask) {
      return sendError(res, 'Subtask not found', 404)
    }

    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: {
        title,
        completed
      }
    })

    return sendSuccess(res, 'Subtask updated successfully', updatedSubtask)
  } catch (error) {
    console.error('Error updating subtask:', error)
    return sendError(res, 'Internal server error', 500)
  }
}

// Delete a subtask
export const deleteSubtask = async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id

  try {
    // Verify the subtask belongs to a task owned by the user
    const subtask = await prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId
        }
      }
    })

    if (!subtask) {
      return sendError(res, 'Subtask not found', 404)
    }

    await prisma.subtask.delete({
      where: { id }
    })

    return sendSuccess(res, 'Subtask deleted successfully', null)
  } catch (error) {
    console.error('Error deleting subtask:', error)
    return sendError(res, 'Internal server error', 500)
  }
}

// Toggle subtask completion
export const toggleSubtask = async (req, res) => {
  const { id } = req.params
  const userId = req.user?.id

  try {
    // Verify the subtask belongs to a task owned by the user
    const subtask = await prisma.subtask.findFirst({
      where: {
        id,
        task: {
          userId
        }
      }
    })

    if (!subtask) {
      return sendError(res, 'Subtask not found', 404)
    }

    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: {
        completed: !subtask.completed
      }
    })

    return sendSuccess(res, 'Subtask toggled successfully', updatedSubtask)
  } catch (error) {
    console.error('Error toggling subtask:', error)
    return sendError(res, 'Internal server error', 500)
  }
}