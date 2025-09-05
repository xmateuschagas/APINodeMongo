const Account = require('../models/Account.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função de Login do Usuário (sem try...catch para a validação)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({ email }).select('+password');
  if (!user) {
    return res.status(400).json({ message: 'Credenciais inválidas.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Credenciais inválidas.' });
  }
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.status(200).json({
    message: 'Login bem-sucedido!',
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// Função para retornar os dados do usuário logado
exports.getMe = async (req, res) => {
  try {
    const user = await Account.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para renovar tokens
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token não fornecido.' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Refresh token inválido ou expirado.' });
  }
};