const Task = require('../models/Task.js');

// Função para CRIAR uma nova tarefa
exports.createTask = async (req, res) => {
  try {
    const { title, done } = req.body;
    const owner = req.user.id;
    const newTask = new Task({ title, done, owner });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar a tarefa.', error: error.message });
  }
};

// Função para LISTAR TODAS as tarefas do usuário autenticado
exports.getTasks = async (req, res) => {
  try {
    const owner = req.user.id;
    const tasks = await Task.find({ owner });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar as tarefas.', error: error.message });
  }
};

// Função para ATUALIZAR uma tarefa
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;
    const owner = req.user.id;
    const task = await Task.findOneAndUpdate(
      { _id: id, owner },
      { title, done },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence a você.' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar a tarefa.', error: error.message });
  }
};

// Função para DELETAR uma tarefa
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;
    const task = await Task.findOneAndDelete({ _id: id, owner });
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence a você.' });
    }
    res.status(200).json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar a tarefa.', error: error.message });
  }
};