// --- DATA INITIALIZATION & CONSTANTS ---
const UNITS_LIST = [
    "Campinas",
    "Belo Horizonte",
    "Goiânia",
    "Guarulhos",
    "Bauru",
    "Campo Grande",
    "São Paulo"
];

const MONTHS_NAMES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Default / Initial Demo Data to populate the dashboard on first load
const INITIAL_DEMO_DATA = [
    // January 2026
    { year: 2026, month: 0, unit: "Campinas", investment: 4500, first_orders: 98, total_orders: 220, roas: 3.8 },
    { year: 2026, month: 0, unit: "Belo Horizonte", investment: 5200, first_orders: 110, total_orders: 260, roas: 4.2 },
    { year: 2026, month: 0, unit: "Goiânia", investment: 3800, first_orders: 80, total_orders: 180, roas: 3.5 },
    { year: 2026, month: 0, unit: "Guarulhos", investment: 4100, first_orders: 85, total_orders: 190, roas: 3.9 },
    { year: 2026, month: 0, unit: "Bauru", investment: 3200, first_orders: 70, total_orders: 150, roas: 3.2 },
    { year: 2026, month: 0, unit: "Campo Grande", investment: 3500, first_orders: 75, total_orders: 160, roas: 3.4 },
    { year: 2026, month: 0, unit: "São Paulo", investment: 7800, first_orders: 175, total_orders: 410, roas: 4.8 },

    // February 2026
    { year: 2026, month: 1, unit: "Campinas", investment: 4700, first_orders: 105, total_orders: 240, roas: 3.9 },
    { year: 2026, month: 1, unit: "Belo Horizonte", investment: 5400, first_orders: 118, total_orders: 280, roas: 4.1 },
    { year: 2026, month: 1, unit: "Goiânia", investment: 3900, first_orders: 82, total_orders: 195, roas: 3.6 },
    { year: 2026, month: 1, unit: "Guarulhos", investment: 4300, first_orders: 90, total_orders: 205, roas: 4.0 },
    { year: 2026, month: 1, unit: "Bauru", investment: 3400, first_orders: 74, total_orders: 165, roas: 3.3 },
    { year: 2026, month: 1, unit: "Campo Grande", investment: 3700, first_orders: 80, total_orders: 175, roas: 3.5 },
    { year: 2026, month: 1, unit: "São Paulo", investment: 8200, first_orders: 190, total_orders: 450, roas: 4.9 },

    // March 2026
    { year: 2026, month: 2, unit: "Campinas", investment: 5000, first_orders: 115, total_orders: 270, roas: 4.1 },
    { year: 2026, month: 2, unit: "Belo Horizonte", investment: 5800, first_orders: 130, total_orders: 310, roas: 4.4 },
    { year: 2026, month: 2, unit: "Goiânia", investment: 4200, first_orders: 90, total_orders: 210, roas: 3.8 },
    { year: 2026, month: 2, unit: "Guarulhos", investment: 4500, first_orders: 98, total_orders: 220, roas: 4.2 },
    { year: 2026, month: 2, unit: "Bauru", investment: 3600, first_orders: 82, total_orders: 180, roas: 3.4 },
    { year: 2026, month: 2, unit: "Campo Grande", investment: 3900, first_orders: 88, total_orders: 190, roas: 3.6 },
    { year: 2026, month: 2, unit: "São Paulo", investment: 9000, first_orders: 215, total_orders: 510, roas: 5.2 },

    // April 2026
    { year: 2026, month: 3, unit: "Campinas", investment: 4900, first_orders: 110, total_orders: 255, roas: 4.0 },
    { year: 2026, month: 3, unit: "Belo Horizonte", investment: 5600, first_orders: 124, total_orders: 295, roas: 4.3 },
    { year: 2026, month: 3, unit: "Goiânia", investment: 4100, first_orders: 86, total_orders: 200, roas: 3.7 },
    { year: 2026, month: 3, unit: "Guarulhos", investment: 4400, first_orders: 95, total_orders: 210, roas: 4.0 },
    { year: 2026, month: 3, unit: "Bauru", investment: 3500, first_orders: 78, total_orders: 170, roas: 3.3 },
    { year: 2026, month: 3, unit: "Campo Grande", investment: 3800, first_orders: 84, total_orders: 180, roas: 3.5 },
    { year: 2026, month: 3, unit: "São Paulo", investment: 8800, first_orders: 205, total_orders: 490, roas: 5.0 },

    // May 2026
    { year: 2026, month: 4, unit: "Campinas", investment: 5300, first_orders: 122, total_orders: 285, roas: 4.2 },
    { year: 2026, month: 4, unit: "Belo Horizonte", investment: 6100, first_orders: 138, total_orders: 330, roas: 4.5 },
    { year: 2026, month: 4, unit: "Goiânia", investment: 4400, first_orders: 95, total_orders: 225, roas: 3.9 },
    { year: 2026, month: 4, unit: "Guarulhos", investment: 4800, first_orders: 105, total_orders: 235, roas: 4.3 },
    { year: 2026, month: 4, unit: "Bauru", investment: 3800, first_orders: 85, total_orders: 190, roas: 3.5 },
    { year: 2026, month: 4, unit: "Campo Grande", investment: 4100, first_orders: 92, total_orders: 200, roas: 3.7 },
    { year: 2026, month: 4, unit: "São Paulo", investment: 9500, first_orders: 230, total_orders: 540, roas: 5.3 },

    // June 2026
    { year: 2026, month: 5, unit: "Campinas", investment: 5600, first_orders: 130, total_orders: 310, roas: 4.3 },
    { year: 2026, month: 5, unit: "Belo Horizonte", investment: 6500, first_orders: 148, total_orders: 360, roas: 4.6 },
    { year: 2026, month: 5, unit: "Goiânia", investment: 4600, first_orders: 100, total_orders: 240, roas: 4.0 },
    { year: 2026, month: 5, unit: "Guarulhos", investment: 5100, first_orders: 112, total_orders: 250, roas: 4.4 },
    { year: 2026, month: 5, unit: "Bauru", investment: 4000, first_orders: 90, total_orders: 205, roas: 3.6 },
    { year: 2026, month: 5, unit: "Campo Grande", investment: 4300, first_orders: 98, total_orders: 215, roas: 3.8 },
    { year: 2026, month: 5, unit: "São Paulo", investment: 10200, first_orders: 250, total_orders: 590, roas: 5.5 },

    // July 2026 (Selected Default)
    { year: 2026, month: 6, unit: "Campinas", investment: 5800, first_orders: 135, total_orders: 320, roas: 4.4 },
    { year: 2026, month: 6, unit: "Belo Horizonte", investment: 6800, first_orders: 155, total_orders: 375, roas: 4.7 },
    { year: 2026, month: 6, unit: "Goiânia", investment: 4800, first_orders: 105, total_orders: 250, roas: 4.1 },
    { year: 2026, month: 6, unit: "Guarulhos", investment: 5300, first_orders: 118, total_orders: 265, roas: 4.5 },
    { year: 2026, month: 6, unit: "Bauru", investment: 4200, first_orders: 95, total_orders: 215, roas: 3.7 },
    { year: 2026, month: 6, unit: "Campo Grande", investment: 4500, first_orders: 102, total_orders: 225, roas: 3.9 },
    { year: 2026, month: 6, unit: "São Paulo", investment: 11000, first_orders: 270, total_orders: 630, roas: 5.6 }
];

// --- APP STATE ---
let appData = [];
let activeView = "overview";
let currentMonth = "6"; // Default July (6)
let currentYear = "2026";
let theme = "light";

// Charts instances
let trendChartInstance = null;
let shareChartInstance = null;

// --- DOMELEMENTS ---
const selectMonth = document.getElementById("select-month");
const selectYear = document.getElementById("select-year");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const viewTitle = document.getElementById("view-title");
const viewSubtitle = document.getElementById("view-subtitle");

// Menu elements
const menuItems = {
    overview: document.getElementById("menu-overview"),
    units: document.getElementById("menu-units"),
    editor: document.getElementById("menu-editor"),
    importer: document.getElementById("menu-importer")
};

// Section views
const views = {
    overview: document.getElementById("view-overview-section"),
    units: document.getElementById("view-units-section"),
    editor: document.getElementById("view-editor-section"),
    importer: document.getElementById("view-importer-section")
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupEventListeners();
    setupDropdowns();
    updateUI();
});

// Load state from localStorage or set defaults
function loadState() {
    const savedData = localStorage.getItem("paparica_dashboard_data");
    const savedTheme = localStorage.getItem("paparica_dashboard_theme");
    
    if (savedData) {
        appData = JSON.parse(savedData);
    } else {
        appData = [...INITIAL_DEMO_DATA];
        localStorage.setItem("paparica_dashboard_data", JSON.stringify(appData));
    }

    if (savedTheme) {
        theme = savedTheme;
        document.documentElement.setAttribute("data-theme", theme);
        updateThemeToggleButton();
    }
}

// Setup dropdown selections
function setupDropdowns() {
    // Populate unit choices in the editor select
    const formUnitSelect = document.getElementById("form-unit");
    formUnitSelect.innerHTML = '<option value="" disabled selected>Selecione a unidade</option>';
    UNITS_LIST.forEach(unit => {
        const option = document.createElement("option");
        option.value = unit;
        option.textContent = unit;
        formUnitSelect.appendChild(option);
    });
}

// Setup actions and views routing
function setupEventListeners() {
    // Navigation routing
    Object.keys(menuItems).forEach(key => {
        menuItems[key].addEventListener("click", () => {
            switchView(key);
        });
    });

    // Date Filters
    selectMonth.addEventListener("change", (e) => {
        currentMonth = e.target.value;
        updateUI();
    });

    selectYear.addEventListener("change", (e) => {
        currentYear = e.target.value;
        updateUI();
    });

    // Theme Toggle
    themeToggle.addEventListener("click", toggleTheme);

    // Form inputs and editor actions
    const editorForm = document.getElementById("editor-form");
    editorForm.addEventListener("submit", handleEditorSubmit);

    const formUnitSelect = document.getElementById("form-unit");
    formUnitSelect.addEventListener("change", (e) => {
        updateUnitHistoryTable(e.target.value);
    });

    document.getElementById("btn-fill-mock").addEventListener("click", () => {
        if (confirm("Deseja redefinir e carregar os dados de demonstração da Papa Rica?")) {
            appData = [...INITIAL_DEMO_DATA];
            localStorage.setItem("paparica_dashboard_data", JSON.stringify(appData));
            updateUI();
            alert("Dados de demonstração carregados com sucesso!");
        }
    });

    document.getElementById("btn-reset-data").addEventListener("click", () => {
        if (confirm("ATENÇÃO: Isso limpará permanentemente todos os dados inseridos. Deseja prosseguir?")) {
            appData = [];
            localStorage.setItem("paparica_dashboard_data", JSON.stringify(appData));
            updateUI();
            updateUnitHistoryTable(formUnitSelect.value);
            alert("Todos os dados foram limpos.");
        }
    });

    // Overview excel exporter
    document.getElementById("btn-export-overview").addEventListener("click", exportToExcel);
    document.getElementById("btn-download-template").addEventListener("click", downloadExcelTemplate);

    // Importer Drag & Drop Setup
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");

    dropZone.addEventListener("click", () => fileInput.click());
    
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--accent-red)";
        dropZone.style.background = "rgba(var(--brand-red-rgb), 0.05)";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.background = "var(--bg-card)";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.background = "var(--bg-card)";
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFileUpload(files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

// Tab Switching Lógica
function switchView(viewKey) {
    activeView = viewKey;
    
    // Toggle active menu class
    Object.keys(menuItems).forEach(key => {
        if (key === viewKey) {
            menuItems[key].classList.add("active");
        } else {
            menuItems[key].classList.remove("active");
        }
    });

    // Toggle active section view
    Object.keys(views).forEach(key => {
        if (key === viewKey) {
            views[key].classList.add("active");
        } else {
            views[key].classList.remove("active");
        }
    });

    // Update Headers Text
    const titles = {
        overview: { title: "Visão Geral do Negócio", subtitle: "Acompanhe as métricas agregadas de todas as unidades." },
        units: { title: "Monitoramento de Unidades", subtitle: "Visualize a performance individual de cada franquia Papa Rica." },
        editor: { title: "Editor Manual de Dados", subtitle: "Insira, modifique ou gerencie os dados das unidades mês a mês." },
        importer: { title: "Importação e Configurações", subtitle: "Envie planilhas Excel para atualizar o dashboard automaticamente." }
    };

    viewTitle.textContent = titles[viewKey].title;
    viewSubtitle.textContent = titles[viewKey].subtitle;

    // Refresh charts if viewing overview
    if (viewKey === "overview") {
        setTimeout(renderCharts, 50);
    }
}

// Toggle Theme (Light / Dark Mode)
function toggleTheme() {
    theme = (theme === "light") ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("paparica_dashboard_theme", theme);
    updateThemeToggleButton();
    
    // Reload charts to update text/border colors matching theme
    if (activeView === "overview") {
        renderCharts();
    }
}

function updateThemeToggleButton() {
    if (theme === "dark") {
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        themeToggle.querySelector("span").textContent = "Tema Claro";
    } else {
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        themeToggle.querySelector("span").textContent = "Tema Escuro";
    }
}

// --- CORE DATA COMPUTATION ---

// Format numbers as Currency
function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

// Get metrics for selection (filtered by month and year)
function getFilteredData() {
    const yearNum = parseInt(currentYear);
    let filtered = appData.filter(d => d.year === yearNum);
    
    if (currentMonth !== "all") {
        const monthNum = parseInt(currentMonth);
        filtered = filtered.filter(d => d.month === monthNum);
    }
    
    return filtered;
}

// Calculate aggregate totals
function computeTotals(data) {
    let investment = 0;
    let first_orders = 0;
    let total_orders = 0;
    let total_roas_weighted_sum = 0;

    data.forEach(row => {
        investment += row.investment || 0;
        first_orders += row.first_orders || 0;
        total_orders += row.total_orders || 0;
        total_roas_weighted_sum += (row.roas || 0) * (row.investment || 0);
    });

    const avg_cac = first_orders > 0 ? (investment / first_orders) : 0;
    const avg_cost_per_order = total_orders > 0 ? (investment / total_orders) : 0;
    const avg_roas = investment > 0 ? (total_roas_weighted_sum / investment) : 0;

    return {
        investment,
        first_orders,
        total_orders,
        avg_cac,
        avg_cost_per_order,
        avg_roas
    };
}

// --- UI RENDERERS ---

function updateUI() {
    const filtered = getFilteredData();
    const totals = computeTotals(filtered);

    // 1. Update KPI Values
    document.getElementById("kpi-total-invest").textContent = formatCurrency(totals.investment);
    document.getElementById("kpi-avg-cac").textContent = formatCurrency(totals.avg_cac);
    document.getElementById("kpi-total-orders").textContent = totals.total_orders.toLocaleString();
    document.getElementById("kpi-avg-roas").textContent = totals.avg_roas.toFixed(1) + "x";

    // KPI Subtitles/Metadata
    const firstPercentage = totals.total_orders > 0 ? Math.round((totals.first_orders / totals.total_orders) * 100) : 0;
    document.getElementById("kpi-orders-meta").textContent = `${totals.first_orders.toLocaleString()} prim. pedidos (${firstPercentage}%)`;
    
    if (currentMonth === "all") {
        document.getElementById("kpi-invest-meta").textContent = `Total gasto em ${currentYear}`;
    } else {
        document.getElementById("kpi-invest-meta").textContent = `Gasto em ${MONTHS_NAMES[parseInt(currentMonth)]} ${currentYear}`;
    }

    // 2. Render Tables and Grid Views
    renderOverviewTable(filtered);
    renderUnitsGrid(filtered);
    renderCharts();
}

// Render Overview Table
function renderOverviewTable(filtered) {
    const tbody = document.getElementById("table-overview-body");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">Sem dados disponíveis para o período selecionado. Inicie inserindo dados na aba "Editor de Dados".</td></tr>`;
        return;
    }

    // Group data by unit if "All Months" is selected, to sum them up properly
    let tableRows = [];
    if (currentMonth === "all") {
        // Aggregate units
        const unitsData = {};
        UNITS_LIST.forEach(u => {
            unitsData[u] = { investment: 0, first_orders: 0, total_orders: 0, weighted_roas: 0 };
        });

        filtered.forEach(row => {
            if (unitsData[row.unit]) {
                unitsData[row.unit].investment += row.investment || 0;
                unitsData[row.unit].first_orders += row.first_orders || 0;
                unitsData[row.unit].total_orders += row.total_orders || 0;
                unitsData[row.unit].weighted_roas += (row.roas || 0) * (row.investment || 0);
            }
        });

        UNITS_LIST.forEach(unit => {
            const data = unitsData[unit];
            if (data.investment > 0 || data.total_orders > 0) {
                const cac = data.first_orders > 0 ? (data.investment / data.first_orders) : 0;
                const cost_per_order = data.total_orders > 0 ? (data.investment / data.total_orders) : 0;
                const roas = data.investment > 0 ? (data.weighted_roas / data.investment) : 0;
                tableRows.push({ unit, ...data, cac, cost_per_order, roas });
            }
        });
    } else {
        // Individual month row mapping
        filtered.forEach(row => {
            const cac = row.first_orders > 0 ? (row.investment / row.first_orders) : 0;
            const cost_per_order = row.total_orders > 0 ? (row.investment / row.total_orders) : 0;
            tableRows.push({
                unit: row.unit,
                investment: row.investment,
                first_orders: row.first_orders,
                total_orders: row.total_orders,
                cac,
                cost_per_order,
                roas: row.roas
            });
        });
    }

    // Sort by investment desc
    tableRows.sort((a, b) => b.investment - a.investment);

    // Build DOM
    tableRows.forEach(row => {
        // Status Badge Logic based on ROAS
        let efficiencyClass = "badge-warning";
        let efficiencyLabel = "Média";
        if (row.roas >= 4.0) {
            efficiencyClass = "badge-success";
            efficiencyLabel = "Excelente";
        } else if (row.roas < 3.0) {
            efficiencyClass = "badge-danger";
            efficiencyLabel = "Alerta";
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="unit-name">${row.unit}</td>
            <td>${formatCurrency(row.investment)}</td>
            <td>${row.first_orders.toLocaleString()}</td>
            <td>${row.total_orders.toLocaleString()}</td>
            <td>${formatCurrency(row.cac)}</td>
            <td>${formatCurrency(row.cost_per_order)}</td>
            <td style="font-weight: 700;">${row.roas.toFixed(1)}x</td>
            <td><span class="badge ${efficiencyClass}">${efficiencyLabel}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Unit Cards View
function renderUnitsGrid(filtered) {
    const container = document.getElementById("units-grid-container");
    container.innerHTML = "";

    // Again, handle aggregation if "All Months" is active
    let displayUnits = [];
    if (currentMonth === "all") {
        const unitsData = {};
        UNITS_LIST.forEach(u => unitsData[u] = { investment: 0, first_orders: 0, total_orders: 0, weighted_roas: 0 });
        
        filtered.forEach(row => {
            if (unitsData[row.unit]) {
                unitsData[row.unit].investment += row.investment || 0;
                unitsData[row.unit].first_orders += row.first_orders || 0;
                unitsData[row.unit].total_orders += row.total_orders || 0;
                unitsData[row.unit].weighted_roas += (row.roas || 0) * (row.investment || 0);
            }
        });

        UNITS_LIST.forEach(unit => {
            const data = unitsData[unit];
            if (data.investment > 0) {
                const cac = data.first_orders > 0 ? (data.investment / data.first_orders) : 0;
                const cost_per_order = data.total_orders > 0 ? (data.investment / data.total_orders) : 0;
                const roas = data.investment > 0 ? (data.weighted_roas / data.investment) : 0;
                displayUnits.push({ unit, ...data, cac, cost_per_order, roas });
            }
        });
    } else {
        filtered.forEach(row => {
            const cac = row.first_orders > 0 ? (row.investment / row.first_orders) : 0;
            const cost_per_order = row.total_orders > 0 ? (row.investment / row.total_orders) : 0;
            displayUnits.push({
                unit: row.unit,
                investment: row.investment,
                first_orders: row.first_orders,
                total_orders: row.total_orders,
                cac,
                cost_per_order,
                roas: row.roas
            });
        });
    }

    if (displayUnits.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Nenhum dado disponível. Preencha informações no painel "Editor de Dados".</div>`;
        return;
    }

    displayUnits.forEach(u => {
        let cardColor = "var(--accent-red)";
        if (u.roas >= 4.5) cardColor = "var(--accent-green)";
        else if (u.roas < 3.0) cardColor = "var(--accent-yellow)";

        const card = document.createElement("div");
        card.className = "unit-card";
        card.style.borderTop = `5px solid ${cardColor}`;
        card.innerHTML = `
            <div class="unit-card-header">
                <span class="unit-card-title">${u.unit}</span>
                <span class="badge ${u.roas >= 4.0 ? 'badge-success' : (u.roas < 3.0 ? 'badge-danger' : 'badge-warning')}">
                    ROAS: ${u.roas.toFixed(1)}x
                </span>
            </div>
            <div class="unit-metrics-list">
                <div class="unit-metric-item">
                    <span class="unit-metric-label">Investimento</span>
                    <span class="unit-metric-value">${formatCurrency(u.investment)}</span>
                </div>
                <div class="unit-metric-item">
                    <span class="unit-metric-label">CAC</span>
                    <span class="unit-metric-value">${formatCurrency(u.cac)}</span>
                </div>
                <div class="unit-metric-item">
                    <span class="unit-metric-label">Primeiro Pedido</span>
                    <span class="unit-metric-value">${u.first_orders.toLocaleString()}</span>
                </div>
                <div class="unit-metric-item">
                    <span class="unit-metric-label">Pedidos Totais</span>
                    <span class="unit-metric-value">${u.total_orders.toLocaleString()}</span>
                </div>
                <div class="unit-metric-item" style="border-top: 1px solid var(--border-color); padding-top: 8px;">
                    <span class="unit-metric-label">Custo por Pedido</span>
                    <span class="unit-metric-value">${formatCurrency(u.cost_per_order)}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render dynamic charts using Chart.js
function renderCharts() {
    if (activeView !== "overview") return;

    const ctxTrend = document.getElementById("trendChart");
    const ctxShare = document.getElementById("shareChart");
    if (!ctxTrend || !ctxShare) return;

    // Destroy existing instances to prevent overlays
    if (trendChartInstance) trendChartInstance.destroy();
    if (shareChartInstance) shareChartInstance.destroy();

    const isDark = theme === "dark";
    const textThemeColor = isDark ? "#a39b95" : "#656565";
    const gridThemeColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(65, 65, 65, 0.08)";

    // --- DATA PREPARATION FOR TREND LINE CHART ---
    // Prepare monthly aggregated historical arrays
    const monthlyInvest = Array(12).fill(0);
    const monthlyOrders = Array(12).fill(0);
    const yearNum = parseInt(currentYear);

    appData.filter(d => d.year === yearNum).forEach(d => {
        monthlyInvest[d.month] += d.investment || 0;
        monthlyOrders[d.month] += d.total_orders || 0;
    });

    trendChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: MONTHS_NAMES,
            datasets: [
                {
                    label: 'Investimento (R$)',
                    data: monthlyInvest,
                    borderColor: 'rgb(230, 43, 76)',
                    backgroundColor: 'rgba(230, 43, 76, 0.1)',
                    yAxisID: 'yInvest',
                    tension: 0.3,
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: 'Pedidos Totais',
                    data: monthlyOrders,
                    borderColor: '#0088cb',
                    backgroundColor: 'rgba(0, 136, 203, 0.1)',
                    yAxisID: 'yOrders',
                    tension: 0.3,
                    borderWidth: 3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textThemeColor, font: { family: 'Outfit' } }
                }
            },
            scales: {
                x: {
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor, font: { family: 'Plus Jakarta Sans' } }
                },
                yInvest: {
                    type: 'linear',
                    position: 'left',
                    grid: { color: gridThemeColor },
                    ticks: {
                        color: textThemeColor,
                        font: { family: 'Plus Jakarta Sans' },
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                },
                yOrders: {
                    type: 'linear',
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: textThemeColor, font: { family: 'Plus Jakarta Sans' } }
                }
            }
        }
    });

    // --- DATA PREPARATION FOR SHARE PIE CHART ---
    // Prepare investment share for selected period
    const filtered = getFilteredData();
    const unitInvestment = {};
    UNITS_LIST.forEach(u => unitInvestment[u] = 0);
    filtered.forEach(d => {
        if (unitInvestment[d.unit] !== undefined) {
            unitInvestment[d.unit] += d.investment || 0;
        }
    });

    const labels = [];
    const values = [];
    UNITS_LIST.forEach(u => {
        if (unitInvestment[u] > 0) {
            labels.push(u);
            values.push(unitInvestment[u]);
        }
    });

    // If empty, supply placeholder data
    const chartLabels = labels.length ? labels : ["Sem dados"];
    const chartValues = values.length ? values : [1];
    const chartColors = [
        '#E62B4C', // Brand Red
        '#FFCD01', // Brand Yellow
        '#94AA35', // Olive Green
        '#0088cb', // Soft Blue
        '#a39b95', // Muted Gray
        '#e05c75', // Light Coral
        '#e6b800'  // Darker Gold
    ];

    shareChartInstance = new Chart(ctxShare, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartValues,
                backgroundColor: chartColors.slice(0, chartLabels.length),
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? '#1a1817' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textThemeColor, font: { family: 'Outfit', size: 11 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            if (!labels.length) return "Nenhum dado cadastrado";
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return ` ${context.label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// --- DATA EDITOR OPERATIONS ---

// Handles manual entry submission
function handleEditorSubmit(e) {
    e.preventDefault();

    const unit = document.getElementById("form-unit").value;
    const investment = parseFloat(document.getElementById("form-invest").value);
    const roas = parseFloat(document.getElementById("form-roas").value);
    const first_orders = parseInt(document.getElementById("form-first-orders").value);
    const total_orders = parseInt(document.getElementById("form-total-orders").value);

    // Simple validations
    if (first_orders > total_orders) {
        alert("O número de primeiros pedidos não pode ser maior que o número total de pedidos!");
        return;
    }

    const monthIndex = parseInt(currentMonth === "all" ? "6" : currentMonth); // Defaults to July if "all"
    const yearVal = parseInt(currentYear);

    // Find and update row, or push new
    const existingIndex = appData.findIndex(d => d.year === yearVal && d.month === monthIndex && d.unit === unit);

    const dataRow = { year: yearVal, month: monthIndex, unit, investment, first_orders, total_orders, roas };

    if (existingIndex > -1) {
        appData[existingIndex] = dataRow;
    } else {
        appData.push(dataRow);
    }

    localStorage.setItem("paparica_dashboard_data", JSON.stringify(appData));
    updateUI();
    updateUnitHistoryTable(unit);
    
    // Reset form fields except the unit
    document.getElementById("form-invest").value = "";
    document.getElementById("form-roas").value = "";
    document.getElementById("form-first-orders").value = "";
    document.getElementById("form-total-orders").value = "";

    alert(`Dados salvos com sucesso para ${unit} em ${MONTHS_NAMES[monthIndex]} de ${yearVal}!`);
}

// Update table showing selected unit history inside the Editor tab
function updateUnitHistoryTable(unitName) {
    const tbody = document.getElementById("table-unit-history-body");
    const title = document.getElementById("unit-history-title");
    tbody.innerHTML = "";

    if (!unitName) {
        title.textContent = "Histórico da Unidade";
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Selecione uma unidade para ver seu histórico.</td></tr>`;
        return;
    }

    title.textContent = `Histórico de Performance - ${unitName}`;
    const unitHistory = appData.filter(d => d.unit === unitName && d.year === parseInt(currentYear));

    // Sort by month ascending
    unitHistory.sort((a, b) => a.month - b.month);

    if (unitHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum dado cadastrado para esta unidade em ${currentYear}.</td></tr>`;
        return;
    }

    unitHistory.forEach(h => {
        const cac = h.first_orders > 0 ? (h.investment / h.first_orders) : 0;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight:700;">${MONTHS_NAMES[h.month]}</td>
            <td>${formatCurrency(h.investment)}</td>
            <td>${formatCurrency(cac)}</td>
            <td>${h.total_orders.toLocaleString()}</td>
            <td style="font-weight:700; color:var(--accent-green);">${h.roas.toFixed(1)}x</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- SPREADSHEET IMPORTER / EXPORTER ---

// Excel File parser using SheetJS
function handleFileUpload(file) {
    const reader = new FileReader();
    const statusContainer = document.getElementById("import-status");
    
    statusContainer.innerHTML = `<span style="color: var(--accent-blue);">Lendo arquivo, aguarde...</span>`;

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        try {
            const workbook = XLSX.read(data, { type: 'array' });
            // Read first worksheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length <= 1) {
                throw new Error("A planilha parece estar vazia ou não possui cabeçalho.");
            }

            processSpreadsheetData(jsonData, statusContainer);
        } catch (err) {
            statusContainer.innerHTML = `<span style="color: var(--accent-red);">Erro ao importar: ${err.message}</span>`;
        }
    };

    reader.onerror = function() {
        statusContainer.innerHTML = `<span style="color: var(--accent-red);">Erro ao ler arquivo.</span>`;
    };

    reader.readAsArrayBuffer(file);
}

// Process 2D spreadsheet array and update the state
function processSpreadsheetData(rows, statusContainer) {
    const headers = rows[0].map(h => String(h).trim().toLowerCase());
    
    // Map headers to target fields
    const mappings = {
        month: headers.findIndex(h => h.includes("mês") || h.includes("mes") || h.includes("month")),
        unit: headers.findIndex(h => h.includes("unidade") || h.includes("loja") || h.includes("unit")),
        investment: headers.findIndex(h => h.includes("investimento") || h.includes("gasto") || h.includes("spent") || h.includes("valor")),
        first_orders: headers.findIndex(h => h.includes("primeiro") || h.includes("novos") || h.includes("first")),
        total_orders: headers.findIndex(h => h.includes("pedido") || h.includes("total") || h.includes("orders")),
        roas: headers.findIndex(h => h.includes("roas"))
    };

    // Check for essential columns (unit, investment)
    if (mappings.unit === -1 || mappings.investment === -1) {
        statusContainer.innerHTML = `<span style="color: var(--accent-red);">Erro: Colunas essenciais ('Unidade' e 'Investimento') não foram encontradas.</span>`;
        return;
    }

    let parsedCount = 0;
    let errorCount = 0;

    // Loop through row entries
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row.length || !row[mappings.unit]) continue; // Skip empty rows

        try {
            // 1. Resolve month
            let monthIndex = 6; // Default to July
            if (mappings.month !== -1 && row[mappings.month]) {
                const monthStr = String(row[mappings.month]).trim().toLowerCase();
                const matchedMonthIndex = MONTHS_NAMES.findIndex(m => monthStr.includes(m.toLowerCase()));
                if (matchedMonthIndex !== -1) {
                    monthIndex = matchedMonthIndex;
                } else {
                    // Try parsing as integer (1-12)
                    const monthInt = parseInt(monthStr);
                    if (!isNaN(monthInt) && monthInt >= 1 && monthInt <= 12) {
                        monthIndex = monthInt - 1;
                    }
                }
            }

            // 2. Resolve unit name
            const rawUnit = String(row[mappings.unit]).trim();
            // Fuzzy match to standard Papa Rica units
            let matchedUnit = UNITS_LIST.find(u => u.toLowerCase() === rawUnit.toLowerCase());
            if (!matchedUnit) {
                // If not found in default list, add it to list or map it
                matchedUnit = rawUnit;
                if (!UNITS_LIST.includes(matchedUnit)) {
                    UNITS_LIST.push(matchedUnit);
                    setupDropdowns();
                }
            }

            // 3. Resolve numeric values safely
            const parseNum = (val) => {
                if (typeof val === 'number') return val;
                if (!val) return 0;
                const clean = String(val).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
                return parseFloat(clean) || 0;
            };

            const investment = parseNum(row[mappings.investment]);
            const first_orders = mappings.first_orders !== -1 ? Math.round(parseNum(row[mappings.first_orders])) : 0;
            const total_orders = mappings.total_orders !== -1 ? Math.round(parseNum(row[mappings.total_orders])) : 0;
            const roas = mappings.roas !== -1 ? parseNum(row[mappings.roas]) : 0;

            const yearVal = parseInt(currentYear);

            // Update appData state
            const existingIndex = appData.findIndex(d => d.year === yearVal && d.month === monthIndex && d.unit === matchedUnit);
            const dataRow = { year: yearVal, month: monthIndex, unit: matchedUnit, investment, first_orders, total_orders, roas };

            if (existingIndex > -1) {
                appData[existingIndex] = dataRow;
            } else {
                appData.push(dataRow);
            }
            parsedCount++;
        } catch (e) {
            errorCount++;
        }
    }

    // Persist and refresh UI
    localStorage.setItem("paparica_dashboard_data", JSON.stringify(appData));
    updateUI();

    statusContainer.innerHTML = `
        <span style="color: var(--accent-green); font-weight: 700;">Importação Concluída com Sucesso!</span>
        <span style="font-size: 13px; margin-top: 5px; color: var(--text-main);">
            ${parsedCount} registros importados/atualizados. ${errorCount ? `${errorCount} falhas.` : ''}
        </span>
    `;
}

// Download dynamic excel template with columns
function downloadExcelTemplate() {
    const headers = [["Mês", "Unidade", "Investimento", "Primeiro Pedido", "Pedidos", "ROAS"]];
    const demoDataRows = [
        ["Julho", "Campinas", 5800.00, 135, 320, 4.4],
        ["Julho", "Belo Horizonte", 6800.00, 155, 375, 4.7],
        ["Julho", "Goiânia", 4800.00, 105, 250, 4.1],
        ["Julho", "Guarulhos", 5300.00, 118, 265, 4.5]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(headers.concat(demoDataRows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modelo Papa Rica");
    
    XLSX.writeFile(wb, "modelo_dashboard_paparica.xlsx");
}

// Export dashboard current view data to excel sheet
function exportToExcel() {
    const filtered = getFilteredData();
    if (filtered.length === 0) {
        alert("Nenhum dado disponível para exportar.");
        return;
    }

    const tableRows = [];
    filtered.forEach(row => {
        const cac = row.first_orders > 0 ? (row.investment / row.first_orders) : 0;
        const cost_per_order = row.total_orders > 0 ? (row.investment / row.total_orders) : 0;
        tableRows.push({
            "Mês": MONTHS_NAMES[row.month],
            "Ano": row.year,
            "Unidade": row.unit,
            "Investimento (R$)": row.investment,
            "Primeiro Pedido": row.first_orders,
            "Pedidos Totais": row.total_orders,
            "CAC (R$)": parseFloat(cac.toFixed(2)),
            "Custo por Pedido (R$)": parseFloat(cost_per_order.toFixed(2)),
            "ROAS": row.roas
        });
    });

    const ws = XLSX.utils.json_to_sheet(tableRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório Unidades");

    const dateStr = currentMonth === "all" ? currentYear : `${MONTHS_NAMES[parseInt(currentMonth)]}_${currentYear}`;
    XLSX.writeFile(wb, `relatorio_paparica_${dateStr}.xlsx`);
}
