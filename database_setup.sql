-- Criação das tabelas
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'loja' CHECK (role IN ('administrador', 'loja', 'analista')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, name)
);

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    cnpj VARCHAR(18),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(2),
    city VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passwords (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    analyst_responsible INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_passwords_subcategory ON passwords(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_passwords_location ON passwords(location_id);
CREATE INDEX IF NOT EXISTS idx_passwords_last_modified ON passwords(last_modified_at);
CREATE INDEX IF NOT EXISTS idx_passwords_analyst ON passwords(analyst_responsible);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);

-- Trigger para atualizar last_modified_at automaticamente
CREATE OR REPLACE FUNCTION update_last_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_passwords_last_modified_at
    BEFORE UPDATE ON passwords
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified_at();

-- Inserção de dados iniciais
INSERT INTO users (username, password, role) VALUES
    (\'admin\', \'$2b$12$r9zruDw64toZkPYVnJMebO/5JH1nhYFBJ9IzjIu0C3kaj5Yaq3hw6\', \'administrador\'), -- senha: admin123
    (\'loja_user\', \'$2b$12$r9zruDw64toZkPYVnJMebO/5JH1nhYFBJ9IzjIu0C3kaj5Yaq3hw6\', \'loja\'), -- senha: admin123
    (\'analista_user\', \'$2b$12$r9zruDw64toZkPYVnJMebO/5JH1nhYFBJ9IzjIu0C3kaj5Yaq3hw6\', \'analista\') -- senha: admin123
ON CONFLICT (username) DO NOTHING;

INSERT INTO categories (name) VALUES
    ('Prefeituras'),
    ('Locadoras'),
    ('Órgãos Governamentais'),
    ('Fornecedores')
ON CONFLICT (name) DO NOTHING;

INSERT INTO subcategories (category_id, name) VALUES
    (1, 'Prefeitura Municipal'),
    (1, 'Câmara Municipal'),
    (2, 'Locadora de Veículos'),
    (2, 'Locadora de Equipamentos'),
    (3, 'Receita Federal'),
    (3, 'INSS'),
    (3, 'Ministério do Trabalho'),
    (4, 'Fornecedor de Pneus'),
    (4, 'Fornecedor de Peças'),
    (4, 'Fornecedor de Combustível')
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO locations (code, cnpj, name, state, city) VALUES
    ('LOC001', '11.222.333/0001-44', 'Matriz São Paulo', 'SP', 'São Paulo'),
    ('LOC002', '55.666.777/0001-88', 'Filial Rio de Janeiro', 'RJ', 'Rio de Janeiro'),
    ('LOC003', '99.888.777/0001-66', 'Filial Belo Horizonte', 'MG', 'Belo Horizonte'),
    ('LOC004', '33.444.555/0001-22', 'Filial Brasília', 'DF', 'Brasília'),
    ('LOC005', '77.666.555/0001-99', 'Filial Porto Alegre', 'RS', 'Porto Alegre')
ON CONFLICT (code) DO NOTHING;

INSERT INTO passwords (user_id, subcategory_id, location_id, username, password, url, notes, last_modified_by, analyst_responsible) VALUES
    (1, 1, 1, 'admin_prefeitura_sp', 'senha_segura_123', 'https://prefeitura.sp.gov.br', 'Acesso ao sistema da prefeitura de São Paulo', 1, 3),
    (1, 3, 2, 'user_locadora_rj', 'locadora_456', 'https://locadorarj.com.br', 'Sistema de gestão da locadora do Rio de Janeiro', 1, 3),
    (1, 5, 3, 'receita_federal_mg', 'rf_789_mg', 'https://receita.fazenda.gov.br', 'Acesso à Receita Federal - Belo Horizonte', 1, 3),
    (1, 8, 4, 'fornecedor_pneus_df', 'pneus_abc_2024', 'https://fornecedorpneus.com.br', 'Sistema do fornecedor de pneus de Brasília', 1, 3),
    (1, 2, 5, 'camara_poa', 'camara_rs_2024', 'https://camarapoa.rs.gov.br', 'Sistema da Câmara Municipal de Porto Alegre', 1, 3)
ON CONFLICT DO NOTHING;

