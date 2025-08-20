const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks (Read) with filtering and sorting
router.get('/', async (req, res) => {
    try {
        const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Build filter object
        const filter = {};
        if (status && ['pending', 'done'].includes(status)) {
            filter.status = status;
        }
        
        // Build sort object
        const sort = {};
        const validSortFields = ['title', 'description', 'status', 'createdAt'];
        if (validSortFields.includes(sortBy)) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sort.createdAt = -1; // Default sort by creation date descending
        }
        
        const tasks = await Task.find(filter).sort(sort);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new task (Create)
router.post('/', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        // Input validation
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!description || !description.trim()) {
            return res.status(400).json({ message: 'Description is required' });
        }
        if (status && !['pending', 'done'].includes(status)) {
            return res.status(400).json({ message: 'Status must be either "pending" or "done"' });
        }
        
        const task = new Task({
            title: title.trim(),
            description: description.trim(),
            status: status || 'pending',
        });
        
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT to update a task (Update)
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        // Input validation
        if (title !== undefined && (!title || !title.trim())) {
            return res.status(400).json({ message: 'Title cannot be empty' });
        }
        if (description !== undefined && (!description || !description.trim())) {
            return res.status(400).json({ message: 'Description cannot be empty' });
        }
        if (status && !['pending', 'done'].includes(status)) {
            return res.status(400).json({ message: 'Status must be either "pending" or "done"' });
        }
        
        // Build update object with only provided fields
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (status !== undefined) updateData.status = status;
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a task (Delete)
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;