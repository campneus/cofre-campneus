const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

class AuthController {
    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors.array() 
                });
            }

            const { username, password } = req.body;

            // Buscar usuário
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Verificar senha
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Gerar token
            const token = generateToken(user);

            // Remover senha da resposta
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Login realizado com sucesso',
                token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors.array() 
                });
            }

            const { username, password, role } = req.body;

            // Verificar se usuário já existe
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ error: 'Usuário já existe' });
            }

            // Hash da senha
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Criar usuário
            const newUser = await User.create({
                username,
                password: hashedPassword,
                role: role || 'loja'
            });

            // Remover senha da resposta
            const { password: _, ...userWithoutPassword } = newUser;

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors.array() 
                });
            }

            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            // Buscar usuário atual
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Verificar senha atual
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Senha atual incorreta' });
            }

            // Hash da nova senha
            const saltRounds = 12;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Atualizar senha
            await User.update(userId, { 
                username: user.username, 
                password: hashedNewPassword, 
                role: user.role 
            });

            res.json({ message: 'Senha alterada com sucesso' });

        } catch (error) {
            console.error('Erro na alteração de senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getProfile(req, res) {
        try {
            const { password: _, ...userWithoutPassword } = req.user;
            res.json({ user: userWithoutPassword });
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = AuthController;

