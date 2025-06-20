const express = require('express');
const { body } = require('express-validator');
const LocationController = require('../controllers/LocationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validações
const locationValidation = [
    body('code')
        .notEmpty()
        .withMessage('Código é obrigatório')
        .isLength({ max: 50 })
        .withMessage('Código deve ter no máximo 50 caracteres'),
    body('cnpj')
        .optional()
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
    body('name')
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ max: 255 })
        .withMessage('Nome deve ter no máximo 255 caracteres'),
    body('state')
        .optional()
        .isLength({ min: 2, max: 2 })
        .withMessage('Estado deve ter 2 caracteres'),
    body('city')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Cidade deve ter no máximo 255 caracteres')
];

const categoryValidation = [
    body('name')
        .notEmpty()
        .withMessage('Nome da categoria é obrigatório')
        .isLength({ max: 255 })
        .withMessage('Nome deve ter no máximo 255 caracteres')
];

const subcategoryValidation = [
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('ID da categoria é obrigatório'),
    body('name')
        .notEmpty()
        .withMessage('Nome da subcategoria é obrigatório')
        .isLength({ max: 255 })
        .withMessage('Nome deve ter no máximo 255 caracteres')
];

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas GET (todos os perfis podem acessar)
router.get('/', LocationController.getAll);
router.get('/categories', LocationController.getCategories);
router.get('/subcategories', LocationController.getSubcategories);
router.get('/:id', LocationController.getById);

// Rotas POST/PUT/DELETE para localidades (apenas administradores)
router.post('/', 
    authorizeRoles('administrador'), 
    locationValidation, 
    LocationController.create
);

router.put('/:id', 
    authorizeRoles('administrador'), 
    locationValidation, 
    LocationController.update
);

router.delete('/:id', 
    authorizeRoles('administrador'), 
    LocationController.delete
);

// Rotas para categorias e subcategorias (apenas administradores)
router.post('/categories', 
    authorizeRoles('administrador'), 
    categoryValidation, 
    LocationController.createCategory
);

router.post('/subcategories', 
    authorizeRoles('administrador'), 
    subcategoryValidation, 
    LocationController.createSubcategory
);

module.exports = router;

