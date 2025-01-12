import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask: Task = {
    _id: uuidv4(),
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t._id === req.params.id);
  if (task) {
    task.completed = req.body.completed;
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t._id !== req.params.id);
  res.status(204).send();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

