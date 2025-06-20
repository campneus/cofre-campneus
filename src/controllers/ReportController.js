const { validationResult } = require('express-validator');
const db = require('../config/database');

class ReportController {
    static async exportData(req, res) {
        try {
            const { type, filters } = req.query;
            let query = '';
            let params = [];
            let filename = 'relatorio';

            switch (type) {
                case 'location':
                    query = `
                        SELECT 
                            p.username,
                            p.url,
                            p.notes,
                            p.last_modified_at,
                            s.name as subcategoria,
                            c.name as categoria,
                            l.code as codigo_localidade,
                            l.name as localidade,
                            l.city as cidade,
                            l.state as estado,
                            lm.username as modificado_por,
                            ar.username as analista_responsavel
                        FROM passwords p
                        LEFT JOIN subcategories s ON p.subcategory_id = s.id
                        LEFT JOIN categories c ON s.category_id = c.id
                        LEFT JOIN locations l ON p.location_id = l.id
                        LEFT JOIN users lm ON p.last_modified_by = lm.id
                        LEFT JOIN users ar ON p.analyst_responsible = ar.id
                        WHERE l.id = $1
                        ORDER BY p.last_modified_at DESC
                    `;
                    params = [filters.location_id];
                    filename = `relatorio_localidade_${filters.location_id}`;
                    break;

                case 'category':
                    query = `
                        SELECT 
                            p.username,
                            p.url,
                            p.notes,
                            p.last_modified_at,
                            s.name as subcategoria,
                            c.name as categoria,
                            l.code as codigo_localidade,
                            l.name as localidade,
                            l.city as cidade,
                            l.state as estado,
                            lm.username as modificado_por,
                            ar.username as analista_responsavel
                        FROM passwords p
                        LEFT JOIN subcategories s ON p.subcategory_id = s.id
                        LEFT JOIN categories c ON s.category_id = c.id
                        LEFT JOIN locations l ON p.location_id = l.id
                        LEFT JOIN users lm ON p.last_modified_by = lm.id
                        LEFT JOIN users ar ON p.analyst_responsible = ar.id
                        WHERE c.id = $1
                        ORDER BY p.last_modified_at DESC
                    `;
                    params = [filters.category_id];
                    filename = `relatorio_categoria_${filters.category_id}`;
                    break;

                case 'date':
                    query = `
                        SELECT 
                            p.username,
                            p.url,
                            p.notes,
                            p.last_modified_at,
                            s.name as subcategoria,
                            c.name as categoria,
                            l.code as codigo_localidade,
                            l.name as localidade,
                            l.city as cidade,
                            l.state as estado,
                            lm.username as modificado_por,
                            ar.username as analista_responsavel
                        FROM passwords p
                        LEFT JOIN subcategories s ON p.subcategory_id = s.id
                        LEFT JOIN categories c ON s.category_id = c.id
                        LEFT JOIN locations l ON p.location_id = l.id
                        LEFT JOIN users lm ON p.last_modified_by = lm.id
                        LEFT JOIN users ar ON p.analyst_responsible = ar.id
                        WHERE p.last_modified_at >= $1 AND p.last_modified_at <= $2
                        ORDER BY p.last_modified_at DESC
                    `;
                    params = [filters.start_date, filters.end_date];
                    filename = `relatorio_data_${filters.start_date}_${filters.end_date}`;
                    break;

                case 'analyst':
                    query = `
                        SELECT 
                            p.username,
                            p.url,
                            p.notes,
                            p.last_modified_at,
                            s.name as subcategoria,
                            c.name as categoria,
                            l.code as codigo_localidade,
                            l.name as localidade,
                            l.city as cidade,
                            l.state as estado,
                            lm.username as modificado_por,
                            ar.username as analista_responsavel
                        FROM passwords p
                        LEFT JOIN subcategories s ON p.subcategory_id = s.id
                        LEFT JOIN categories c ON s.category_id = c.id
                        LEFT JOIN locations l ON p.location_id = l.id
                        LEFT JOIN users lm ON p.last_modified_by = lm.id
                        LEFT JOIN users ar ON p.analyst_responsible = ar.id
                        WHERE ar.id = $1
                        ORDER BY p.last_modified_at DESC
                    `;
                    params = [filters.analyst_id];
                    filename = `relatorio_analista_${filters.analyst_id}`;
                    break;

                default:
                    query = `
                        SELECT 
                            p.username,
                            p.url,
                            p.notes,
                            p.last_modified_at,
                            s.name as subcategoria,
                            c.name as categoria,
                            l.code as codigo_localidade,
                            l.name as localidade,
                            l.city as cidade,
                            l.state as estado,
                            lm.username as modificado_por,
                            ar.username as analista_responsavel
                        FROM passwords p
                        LEFT JOIN subcategories s ON p.subcategory_id = s.id
                        LEFT JOIN categories c ON s.category_id = c.id
                        LEFT JOIN locations l ON p.location_id = l.id
                        LEFT JOIN users lm ON p.last_modified_by = lm.id
                        LEFT JOIN users ar ON p.analyst_responsible = ar.id
                        ORDER BY p.last_modified_at DESC
                    `;
                    filename = 'relatorio_completo';
                    break;
            }

            const result = await db.query(query, params);
            const data = result.rows;

            // Gerar CSV
            const csv = generateCSV(data);
            
            // Configurar headers para download
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}_${new Date().toISOString().split('T')[0]}.csv"`);
            
            // Adicionar BOM para UTF-8
            res.write('\ufeff');
            res.end(csv);

        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getReportFilters(req, res) {
        try {
            // Buscar localidades
            const locationsResult = await db.query('SELECT id, code, name FROM locations ORDER BY name');
            
            // Buscar categorias
            const categoriesResult = await db.query('SELECT id, name FROM categories ORDER BY name');
            
            // Buscar analistas
            const analystsResult = await db.query("SELECT id, username FROM users WHERE role = 'analista' ORDER BY username");

            res.json({
                locations: locationsResult.rows,
                categories: categoriesResult.rows,
                analysts: analystsResult.rows
            });

        } catch (error) {
            console.error('Erro ao buscar filtros de relatório:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async getStatistics(req, res) {
        try {
            // Total de senhas
            const totalPasswordsResult = await db.query('SELECT COUNT(*) as total FROM passwords');
            const totalPasswords = parseInt(totalPasswordsResult.rows[0].total);

            // Senhas por categoria
            const passwordsByCategoryResult = await db.query(`
                SELECT c.name, COUNT(p.id) as count
                FROM categories c
                LEFT JOIN subcategories s ON c.id = s.category_id
                LEFT JOIN passwords p ON s.id = p.subcategory_id
                GROUP BY c.id, c.name
                ORDER BY count DESC
            `);

            // Senhas por localidade
            const passwordsByLocationResult = await db.query(`
                SELECT l.name, l.code, COUNT(p.id) as count
                FROM locations l
                LEFT JOIN passwords p ON l.id = p.location_id
                GROUP BY l.id, l.name, l.code
                ORDER BY count DESC
                LIMIT 10
            `);

            // Atividade recente (últimos 30 dias)
            const recentActivityResult = await db.query(`
                SELECT 
                    DATE(last_modified_at) as date,
                    COUNT(*) as count
                FROM passwords 
                WHERE last_modified_at >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY DATE(last_modified_at)
                ORDER BY date DESC
            `);

            // Analistas mais ativos
            const activeAnalystsResult = await db.query(`
                SELECT 
                    u.username,
                    COUNT(p.id) as passwords_managed
                FROM users u
                LEFT JOIN passwords p ON u.id = p.analyst_responsible
                WHERE u.role = 'analista'
                GROUP BY u.id, u.username
                ORDER BY passwords_managed DESC
            `);

            res.json({
                totalPasswords,
                passwordsByCategory: passwordsByCategoryResult.rows,
                passwordsByLocation: passwordsByLocationResult.rows,
                recentActivity: recentActivityResult.rows,
                activeAnalysts: activeAnalystsResult.rows
            });

        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

function generateCSV(data) {
    if (data.length === 0) {
        return 'Nenhum dado encontrado';
    }

    // Headers
    const headers = [
        'Usuario',
        'URL',
        'Observacoes',
        'Data_Modificacao',
        'Subcategoria',
        'Categoria',
        'Codigo_Localidade',
        'Localidade',
        'Cidade',
        'Estado',
        'Modificado_Por',
        'Analista_Responsavel'
    ];

    // Criar CSV
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = [
            escapeCsvValue(row.username),
            escapeCsvValue(row.url),
            escapeCsvValue(row.notes),
            row.last_modified_at ? new Date(row.last_modified_at).toLocaleString('pt-BR') : '',
            escapeCsvValue(row.subcategoria),
            escapeCsvValue(row.categoria),
            escapeCsvValue(row.codigo_localidade),
            escapeCsvValue(row.localidade),
            escapeCsvValue(row.cidade),
            escapeCsvValue(row.estado),
            escapeCsvValue(row.modificado_por),
            escapeCsvValue(row.analista_responsavel)
        ];

        csv += values.join(',') + '\n';
    });

    return csv;
}

function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }

    const stringValue = String(value);
    
    // Se contém vírgula, quebra de linha ou aspas, envolver em aspas
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        // Escapar aspas duplicando-as
        const escapedValue = stringValue.replace(/"/g, '""');
        return `"${escapedValue}"`;
    }

    return stringValue;
}

module.exports = ReportController;

