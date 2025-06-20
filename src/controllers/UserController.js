const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserController {
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.json({ users });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Remover senha da resposta
            const { password: _, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async create(req, res) {
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
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors.array() 
                });
            }

            const { id } = req.params;
            const { username, password, role } = req.body;

            let userData = { username, role };

            // Se uma nova senha foi fornecida, fazer hash
            if (password) {
                const saltRounds = 12;
                userData.password = await bcrypt.hash(password, saltRounds);
            }

            const updatedUser = await User.update(id, userData);
            
            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Remover senha da resposta
            const { password: _, ...userWithoutPassword } = updatedUser;
            res.json({ 
                message: 'Usuário atualizado com sucesso', 
                user: userWithoutPassword 
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            
            // Não permitir que o usuário delete a si mesmo
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
            }

            const deletedUser = await User.delete(id);

            if (!deletedUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = UserController;

