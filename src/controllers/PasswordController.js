const { validationResult } = require('express-validator');
const Password = require('../models/Password');

class PasswordController {
    static async getAll(req, res) {
        try {
            const { search, subcategory_id, location_id } = req.query;
            const filters = {};
            
            if (search) filters.search = search;
            if (subcategory_id) filters.subcategory_id = parseInt(subcategory_id);
            if (location_id) filters.location_id = parseInt(location_id);

            const passwords = await Password.findAll(filters);
            
            // Ocultar senhas por padrão (apenas para usuários com permissão de loja)
            if (req.user.role === 'loja') {
                passwords.forEach(password => {
                    password.password = '***OCULTO***';
                });
            }

            res.json({ passwords });
        } catch (error) {
            console.error('Erro ao buscar senhas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const password = await Password.findById(id);

            if (!password) {
                return res.status(404).json({ error: 'Senha não encontrada' });
            }

            // Ocultar senha para usuários com permissão de loja
            if (req.user.role === 'loja') {
                password.password = '***OCULTO***';
            }

            res.json({ password });
        } catch (error) {
            console.error('Erro ao buscar senha:', error);
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

            const passwordData = {
                ...req.body,
                user_id: req.user.id,
                last_modified_by: req.user.id
            };

            const newPassword = await Password.create(passwordData);
            res.status(201).json({ 
                message: 'Senha criada com sucesso', 
                password: newPassword 
            });
        } catch (error) {
            console.error('Erro ao criar senha:', error);
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
            const passwordData = {
                ...req.body,
                last_modified_by: req.user.id
            };

            const updatedPassword = await Password.update(id, passwordData);
            
            if (!updatedPassword) {
                return res.status(404).json({ error: 'Senha não encontrada' });
            }

            res.json({ 
                message: 'Senha atualizada com sucesso', 
                password: updatedPassword 
            });
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedPassword = await Password.delete(id);

            if (!deletedPassword) {
                return res.status(404).json({ error: 'Senha não encontrada' });
            }

            res.json({ message: 'Senha excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getPasswordCountByCategory(req, res) {
        try {
            const counts = await Password.getPasswordCountByCategory();
            res.json({ counts });
        } catch (error) {
            console.error('Erro ao buscar contagem por categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getRecentPasswords(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const passwords = await Password.getRecentPasswords(limit);
            
            // Ocultar senhas para usuários com permissão de loja
            if (req.user.role === 'loja') {
                passwords.forEach(password => {
                    password.password = '***OCULTO***';
                });
            }

            res.json({ passwords });
        } catch (error) {
            console.error('Erro ao buscar senhas recentes:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getRecentlyModified(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const passwords = await Password.getRecentlyModified(limit);
            
            // Ocultar senhas para usuários com permissão de loja
            if (req.user.role === 'loja') {
                passwords.forEach(password => {
                    password.password = '***OCULTO***';
                });
            }

            res.json({ passwords });
        } catch (error) {
            console.error('Erro ao buscar senhas modificadas recentemente:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async revealPassword(req, res) {
        try {
            const { id } = req.params;
            
            // Apenas administradores e analistas podem ver senhas
            if (req.user.role === 'loja') {
                return res.status(403).json({ 
                    error: 'Acesso negado. Você não tem permissão para visualizar senhas.' 
                });
            }

            const password = await Password.findById(id);
            if (!password) {
                return res.status(404).json({ error: 'Senha não encontrada' });
            }

            res.json({ password: password.password });
        } catch (error) {
            console.error('Erro ao revelar senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = PasswordController;

