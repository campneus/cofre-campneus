const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validações
const userValidation = [
    body('username')
        .notEmpty()
        .withMessage('Nome de usuário é obrigatório')
        .isLength({ min: 3, max: 50 })
        .withMessage('Nome de usuário deve ter entre 3 e 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Nome de usuário deve conter apenas letras, números e underscore'),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Senha deve ter pelo menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
    body('role')
        .isIn(['administrador', 'loja', 'analista'])
        .withMessage('Papel deve ser: administrador, loja ou analista')
];

const userCreateValidation = [
    body('username')
        .notEmpty()
        .withMessage('Nome de usuário é obrigatório')
        .isLength({ min: 3, max: 50 })
        .withMessage('Nome de usuário deve ter entre 3 e 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Nome de usuário deve conter apenas letras, números e underscore'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Senha deve ter pelo menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
    body('role')
        .isIn(['administrador', 'loja', 'analista'])
        .withMessage('Papel deve ser: administrador, loja ou analista')
];

// Todas as rotas requerem autenticação e permissão de administrador
router.use(authenticateToken);
router.use(authorizeRoles('administrador'));

// Rotas CRUD
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', userCreateValidation, UserController.create);
router.put('/:id', userValidation, UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;

