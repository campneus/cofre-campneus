const express = require('express');
const { query } = require('express-validator');
const ReportController = require('../controllers/ReportController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validações para exportação
const exportValidation = [
    query('type')
        .isIn(['all', 'location', 'category', 'date', 'analyst'])
        .withMessage('Tipo de relatório inválido'),
    query('filters')
        .optional()
        .custom((value) => {
            if (value) {
                try {
                    JSON.parse(value);
                    return true;
                } catch (error) {
                    throw new Error('Filtros devem estar em formato JSON válido');
                }
            }
            return true;
        })
];

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de relatórios
router.get('/export', exportValidation, (req, res) => {
    // Parse dos filtros se existirem
    if (req.query.filters) {
        try {
            req.query.filters = JSON.parse(req.query.filters);
        } catch (error) {
            return res.status(400).json({ error: 'Filtros inválidos' });
        }
    }
    
    ReportController.exportData(req, res);
});

router.get('/filters', ReportController.getReportFilters);
router.get('/statistics', ReportController.getStatistics);

module.exports = router;

