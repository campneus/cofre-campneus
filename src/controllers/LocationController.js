const { validationResult } = require('express-validator');
const Location = require('../models/Location');
const { Category, Subcategory } = require('../models/Category');

class LocationController {
    static async getAll(req, res) {
        try {
            const locations = await Location.findAll();
            res.json({ locations });
        } catch (error) {
            console.error('Erro ao buscar localidades:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const location = await Location.findById(id);

            if (!location) {
                return res.status(404).json({ error: 'Localidade não encontrada' });
            }

            res.json({ location });
        } catch (error) {
            console.error('Erro ao buscar localidade:', error);
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

            const newLocation = await Location.create(req.body);
            res.status(201).json({ 
                message: 'Localidade criada com sucesso', 
                location: newLocation 
            });
        } catch (error) {
            console.error('Erro ao criar localidade:', error);
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
            const updatedLocation = await Location.update(id, req.body);
            
            if (!updatedLocation) {
                return res.status(404).json({ error: 'Localidade não encontrada' });
            }

            res.json({ 
                message: 'Localidade atualizada com sucesso', 
                location: updatedLocation 
            });
        } catch (error) {
            console.error('Erro ao atualizar localidade:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedLocation = await Location.delete(id);

            if (!deletedLocation) {
                return res.status(404).json({ error: 'Localidade não encontrada' });
            }

            res.json({ message: 'Localidade excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir localidade:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Métodos para categorias e subcategorias
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.json({ categories });
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getSubcategories(req, res) {
        try {
            const { category_id } = req.query;
            let subcategories;
            
            if (category_id) {
                subcategories = await Subcategory.findByCategory(category_id);
            } else {
                subcategories = await Subcategory.findAll();
            }
            
            res.json({ subcategories });
        } catch (error) {
            console.error('Erro ao buscar subcategorias:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async createCategory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors.array() 
                });
            }

            const newCategory = await Category.create(req.body);
            res.status(201).json({ 
                message: 'Categoria criada com sucesso', 
                category: newCategory 
            });
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async createSubcategory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: errors.array() 
                });
            }

            const newSubcategory = await Subcategory.create(req.body);
            res.status(201).json({ 
                message: 'Subcategoria criada com sucesso', 
                subcategory: newSubcategory 
            });
        } catch (error) {
            console.error('Erro ao criar subcategoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = LocationController;

