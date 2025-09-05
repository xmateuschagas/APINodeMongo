const Account = require('../models/Account.js');
const bcrypt = require('bcryptjs');

// Lista usuários - GET
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Account.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Erro ao tentar listar usuários" });
  }
};

// Cria usuário - POST (sem try...catch para a validação)
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new Account({
    name,
    email,
    password: hashedPassword
  });
  await newUser.save();
  res.status(201).json(newUser);
};

// Atualiza um usuário existente pelo id - PUT
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  try {
    const user = await Account.findById(userId);
    Object.assign(user, updates);
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Erro ao tentar atualizar um usuário" });
  }
};

// Exclui usuário pelo id - DELETE
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await Account.findByIdAndDelete(userId);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({ message: "Erro ao tentar excluir usuário" });
  }
};