// Configuração da API
const API_BASE_URL = window.location.origin + '/api';

// Estado da aplicação
let currentUser = null;
let authToken = null;
let currentSection = 'dashboard';

// Elementos DOM
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const loadingOverlay = document.getElementById('loadingOverlay');

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
    setupEventListeners();
});

// Inicializar aplicação
function initializeApp() {
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        validateToken();
    } else {
        showLoginScreen();
    }
}

// Configurar event listeners
function setupEventListeners() {
    loginForm.addEventListener("submit", handleLogin);
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Menu
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Modais
    setupModalListeners();
    
    // Botões de ação
    setupActionButtons();
}

// Configurar listeners dos modais
function setupModalListeners() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => closeModal(modal));
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// Configurar botões de ação
function setupActionButtons() {
    const addPasswordBtn = document.getElementById('addPasswordBtn');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const exportBtn = document.getElementById('exportBtn');
    const passwordSearch = document.getElementById('passwordSearch');
    const subcategoryFilter = document.getElementById('subcategoryFilter');
    
    if (addPasswordBtn) {
        addPasswordBtn.addEventListener('click', () => openPasswordModal());
    }
    
    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', () => openLocationModal());
    }
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => openUserModal());
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }
    
    if (passwordSearch) {
        passwordSearch.addEventListener('input', debounce(filterPasswords, 300));
    }
    
    if (subcategoryFilter) {
        subcategoryFilter.addEventListener('change', filterPasswords);
    }
    
    // Event listener para formulário de localidades
    const locationForm = document.getElementById('locationForm');
    if (locationForm) {
        locationForm.addEventListener('submit', handleLocationSubmit);
    }
}

// Utilitário debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Autenticação
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            showMainApp();
        } else {
            showError(data.error || 'Erro ao fazer login');
        }
    } catch (error) {
        showError('Erro de conexão. Tente novamente.');
    } finally {
        hideLoading();
    }
}

async function validateToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showMainApp();
        } else {
            localStorage.removeItem('authToken');
            showLoginScreen();
        }
    } catch (error) {
        localStorage.removeItem('authToken');
        showLoginScreen();
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showLoginScreen();
}
rface
function showLoginScreen() {
    loginScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    document.body.className = '';
}

function showMainApp() {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    
    // Definir classe do body baseada no perfil do usuário
    document.body.className = currentUser.role;
    
    // Atualizar informações do usuário
    userInfo.textContent = `Olá, ${currentUser.username}`;
    
    // Carregar seção inicial
    loadSection('dashboard');
}

function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 5000);
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Navegação
function handleNavigation(e) {
    e.preventDefault();
    const section = e.currentTarget.getAttribute('data-section');
    loadSection(section);
}

function loadSection(section) {
    // Atualizar navegação ativa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Mostrar seção
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');
    
    currentSection = section;
    
    // Carregar dados da seção
    switch (section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'passwords':
            loadPasswords();
            break;
        case 'locations':
            loadLocations();
            break;
        case 'users':
            loadUsers();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Dashboard
async function loadDashboard() {
    try {
        showLoading();
        
        // Carregar contagem por categoria
        const categoryResponse = await fetch(`${API_BASE_URL}/passwords/count-by-category`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const categoryData = await categoryResponse.json();
        displayCategoryChart(categoryData.counts);
        
        // Carregar senhas recentes
        const recentResponse = await fetch(`${API_BASE_URL}/passwords/recent?limit=5`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const recentData = await recentResponse.json();
        displayRecentPasswords(recentData.passwords);
        
        // Carregar senhas modificadas recentemente
        const modifiedResponse = await fetch(`${API_BASE_URL}/passwords/recently-modified?limit=5`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const modifiedData = await modifiedResponse.json();
        displayRecentlyModified(modifiedData.passwords);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    } finally {
        hideLoading();
    }
}

function displayCategoryChart(counts) {
    const container = document.getElementById('categoryChart');
    container.innerHTML = '';
    
    if (counts.length === 0) {
        container.innerHTML = '<p>Nenhum dado disponível</p>';
        return;
    }
    
    const chartHtml = counts.map(item => `
        <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${item.category_name}</span>
                <span style="font-weight: bold; color: var(--primary-color);">${item.count}</span>
            </div>
            <div style="background: var(--border-color); height: 8px; border-radius: 4px; margin-top: 4px;">
                <div style="background: var(--primary-color); height: 100%; width: ${Math.max(10, (item.count / Math.max(...counts.map(c => c.count))) * 100)}%; border-radius: 4px;"></div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = chartHtml;
}

function displayRecentPasswords(passwords) {
    const container = document.getElementById('recentPasswords');
    container.innerHTML = '';
    
    if (passwords.length === 0) {
        container.innerHTML = '<p>Nenhuma senha cadastrada</p>';
        return;
    }
    
    const html = passwords.map(password => `
        <div class="recent-item">
            <div class="recent-item-info">
                <h4>${password.username}</h4>
                <p>${password.subcategory_name} - ${password.location_name}</p>
            </div>
            <div class="recent-item-date">
                ${new Date(password.last_modified_at).toLocaleDateString('pt-BR')}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function displayRecentlyModified(passwords) {
    const container = document.getElementById('recentlyModified');
    container.innerHTML = '';
    
    if (passwords.length === 0) {
        container.innerHTML = '<p>Nenhuma senha modificada</p>';
        return;
    }
    
    const html = passwords.map(password => `
        <div class="recent-item">
            <div class="recent-item-info">
                <h4>${password.username}</h4>
                <p>${password.subcategory_name} - ${password.location_name}</p>
            </div>
            <div class="recent-item-date">
                ${new Date(password.last_modified_at).toLocaleDateString('pt-BR')}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Senhas
async function loadPasswords() {
    try {
        showLoading();
        
        // Carregar subcategorias para o filtro
        await loadSubcategoriesFilter();
        
        // Carregar senhas
        await fetchPasswords();
        
    } catch (error) {
        console.error('Erro ao carregar senhas:', error);
    } finally {
        hideLoading();
    }
}

async function loadSubcategoriesFilter() {
    try {
        const response = await fetch(`${API_BASE_URL}/locations/subcategories`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        
        const select = document.getElementById('subcategoryFilter');
        select.innerHTML = '<option value="">Todas as subcategorias</option>';
        
        data.subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = `${sub.category_name} - ${sub.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar subcategorias:', error);
    }
}

async function fetchPasswords() {
    try {
        const search = document.getElementById('passwordSearch').value;
        const subcategoryId = document.getElementById('subcategoryFilter').value;
        
        let url = `${API_BASE_URL}/passwords`;
        const params = new URLSearchParams();
        
        if (search) params.append('search', search);
        if (subcategoryId) params.append('subcategory_id', subcategoryId);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        
        displayPasswordsTable(data.passwords);
    } catch (error) {
        console.error('Erro ao buscar senhas:', error);
    }
}

function displayPasswordsTable(passwords) {
    const tbody = document.querySelector('#passwordsTable tbody');
    tbody.innerHTML = '';
    
    if (passwords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Nenhuma senha encontrada</td></tr>';
        return;
    }
    
    passwords.forEach(password => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${password.username}</td>
            <td>
                <div class="password-field">
                    <span class="password-hidden">••••••••</span>
                    ${currentUser.role !== 'loja' ? `
                        <button class="btn-icon" onclick="togglePassword(${password.id}, this)" title="Mostrar/Ocultar senha">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="copyPassword(${password.id})" title="Copiar senha">
                            <i class="fas fa-copy"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
            <td>
                ${password.url ? `<a href="${password.url}" target="_blank" class="url-link">${password.url}</a>` : '-'}
            </td>
            <td>${password.category_name} - ${password.subcategory_name}</td>
            <td>${password.location_name}</td>
            <td>${new Date(password.last_modified_at).toLocaleDateString('pt-BR')}</td>
            <td>${password.last_modified_by_username || '-'}</td>
            <td>
                ${currentUser.role !== 'loja' ? `
                    <button class="btn-icon" onclick="editPassword(${password.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                ` : ''}
                ${currentUser.role === 'administrador' ? `
                    <button class="btn-icon" onclick="deletePassword(${password.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterPasswords() {
    fetchPasswords();
}

// Funções de senha
async function togglePassword(passwordId, button) {
    const passwordSpan = button.parentElement.querySelector('.password-hidden');
    const icon = button.querySelector('i');
    
    if (passwordSpan.textContent === '••••••••') {
        try {
            const response = await fetch(`${API_BASE_URL}/passwords/${passwordId}/reveal`, {
(Content truncated due to size limit. Use line ranges to read in chunks)