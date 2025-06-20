const express = require('express');
const { body } = require('express-validator');
const PasswordController = require('../controllers/PasswordController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validações
const passwordValidation = [
    body('subcategory_id')
        .isInt({ min: 1 })
        .withMessage('Subcategoria é obrigatória'),
    body('location_id')
        .isInt({ min: 1 })
        .withMessage('Localidade é obrigatória'),
    body('username')
        .notEmpty()
        .withMessage('Nome de usuário é obrigatório')
        .isLength({ max: 255 })
        .withMessage('Nome de usuário deve ter no máximo 255 caracteres'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    body('url')
        .optional()
        .isURL()
        .withMessage('URL deve ser válida'),
    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Observações devem ter no máximo 1000 caracteres'),
    body('analyst_responsible')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Analista responsável deve ser um ID válido')
];

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas GET (todos os perfis podem acessar)
router.get('/', PasswordController.getAll);
router.get('/count-by-category', PasswordController.getPasswordCountByCategory);
router.get('/recent', PasswordController.getRecentPasswords);
router.get('/recently-modified', PasswordController.getRecentlyModified);
router.get('/:id', PasswordController.getById);

// Rota para revelar senha (apenas administradores e analistas)
router.get('/:id/reveal', 
    authorizeRoles('administrador', 'analista'), 
    PasswordController.revealPassword
);

// Rotas POST/PUT/DELETE (apenas administradores e analistas)
router.post('/', 
    authorizeRoles('administrador', 'analista'), 
    passwordValidation, 
    PasswordController.create
);

router.put('/:id', 
    authorizeRoles('administrador', 'analista'), 
    passwordValidation, 
    PasswordController.update
);

// Apenas administradores podem excluir
router.delete('/:id', 
    authorizeRoles('administrador'), 
    PasswordController.delete
);

module.exports = router;

