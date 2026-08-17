/**
 * Portal da Transparência Fiscal - Município de Amparo / SP
 * Processamento e Apresentação da Execução Orçamentária Municipal
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dados Oficiais da LOA (Lei Orçamentária Anual) de Amparo - SP
    const AMPARO_CONFIG = {
        population: 68000,
        annualBudget: {
            '2026': { total: 295000000, goal: 295000000 },
            '2025': { total: 272500000, goal: 272500000 },
            '2024': { total: 248000000, goal: 248000000 }
        },
        costs: {
            basket: 780,          // Cesta básica (referência DIEESE/Procon)
            asphaltM2: 110,       // m² de recapeamento (referência DER-SP)
            ambulance: 320000,    // Ambulância UTI equipada (FNS)
            schoolMeal: 4.50,     // Merenda escolar por refeição (PNAE)
            ledLamp: 350,         // Ponto de iluminação pública LED
            teacherSalaryYear: 68000 // Custo anual médio por docente municipal
        }
    };

    let selectedYear = '2026';

    const getEl = (id) => document.getElementById(id);

    const elements = {
        yearSelect: getEl('year-select'),
        selectedYearDisplay: getEl('selected-year-display'),
        mainCounter: getEl('main-counter'),
        todayCounter: getEl('today-counter'),
        monthCounter: getEl('month-counter'),
        perCapitaCounter: getEl('per-capita-counter'),
        perHourCounter: getEl('per-hour-counter'),
        progressBarFill: getEl('progress-bar-fill'),
        progressPercentage: getEl('progress-percentage'),
        liveDate: getEl('live-date'),
        btnCalculate: getEl('btn-calculate'),

        // Tabela de Tributos
        tblIcms: getEl('tbl-icms'),
        tblFpm: getEl('tbl-fpm'),
        tblIptu: getEl('tbl-iptu'),
        tblIss: getEl('tbl-iss'),
        tblIpva: getEl('tbl-ipva'),
        tblItbi: getEl('tbl-itbi'),

        // Equivalências
        eqBasketsVal: getEl('eq-baskets-val'),
        eqAsphaltVal: getEl('eq-asphalt-val'),
        eqAmbulancesVal: getEl('eq-ambulances-val'),
        eqMealsVal: getEl('eq-meals-val'),
        eqLedVal: getEl('eq-led-val'),
        eqTeachersVal: getEl('eq-teachers-val'),

        // Calculadora
        calcSalary: getEl('calc-salary'),
        calcExpenses: getEl('calc-expenses'),
        calcIptu: getEl('calc-iptu'),
        calcIpva: getEl('calc-ipva'),

        // Extrato Resultados
        resTotalTax: getEl('res-total-tax'),
        resWorkDays: getEl('res-work-days'),
        resMunicipalVal: getEl('res-municipal-val'),
        resEstadualVal: getEl('res-estadual-val'),
        resFederalVal: getEl('res-federal-val')
    };

    // Data de Atualização Oficial
    function updateDateDisplay() {
        const now = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        if (elements.liveDate) {
            elements.liveDate.textContent = now.toLocaleDateString('pt-BR', options);
        }
    }
    updateDateDisplay();

    function formatCurrency(val, decimals = 2) {
        return val.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function formatNumber(val) {
        return Math.floor(val).toLocaleString('pt-BR');
    }

    function updateDashboardData(year) {
        const config = AMPARO_CONFIG.annualBudget[year];
        const now = new Date();
        const currentYear = now.getFullYear();
        
        let totalSoFar = config.total;
        let progressRatio = 1.0;
        
        if (parseInt(year) === currentYear) {
            const startOfYear = new Date(currentYear, 0, 1);
            const daysPassed = Math.max(1, (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
            totalSoFar = (config.total / 365) * daysPassed;
            progressRatio = Math.min(totalSoFar / config.goal, 1.0);
        }

        const todayVal = config.total / 365;
        const monthVal = config.total / 12;
        const perCapitaVal = totalSoFar / AMPARO_CONFIG.population;
        const perHourVal = config.total / (365 * 24);

        if (elements.mainCounter) elements.mainCounter.textContent = formatCurrency(totalSoFar, 2);
        if (elements.todayCounter) elements.todayCounter.textContent = 'R$ ' + formatCurrency(todayVal, 2);
        if (elements.monthCounter) elements.monthCounter.textContent = 'R$ ' + formatCurrency(monthVal, 2);
        if (elements.perCapitaCounter) elements.perCapitaCounter.textContent = 'R$ ' + formatCurrency(perCapitaVal, 2);
        if (elements.perHourCounter) elements.perHourCounter.textContent = 'R$ ' + formatCurrency(perHourVal, 2);

        if (elements.progressBarFill && elements.progressPercentage) {
            const pct = (progressRatio * 100).toFixed(1);
            elements.progressBarFill.style.width = `${pct}%`;
            elements.progressPercentage.textContent = `${pct}% da meta orçamentária realizada`;
        }

        // Atualização de Equivalências
        const costs = AMPARO_CONFIG.costs;
        if (elements.eqBasketsVal) elements.eqBasketsVal.textContent = formatNumber(totalSoFar / costs.basket);
        if (elements.eqAsphaltVal) elements.eqAsphaltVal.textContent = formatNumber(totalSoFar / costs.asphaltM2) + ' m²';
        if (elements.eqAmbulancesVal) elements.eqAmbulancesVal.textContent = formatNumber(totalSoFar / costs.ambulance);
        if (elements.eqMealsVal) elements.eqMealsVal.textContent = formatNumber(totalSoFar / costs.schoolMeal);
        if (elements.eqLedVal) elements.eqLedVal.textContent = formatNumber(totalSoFar / costs.ledLamp);
        if (elements.eqTeachersVal) elements.eqTeachersVal.textContent = formatNumber(totalSoFar / costs.teacherSalaryYear);

        // Tabela de Tributos
        if (elements.tblIcms) elements.tblIcms.textContent = 'R$ ' + formatCurrency(totalSoFar * 0.35, 2);
        if (elements.tblFpm) elements.tblFpm.textContent = 'R$ ' + formatCurrency(totalSoFar * 0.28, 2);
        if (elements.tblIptu) elements.tblIptu.textContent = 'R$ ' + formatCurrency(totalSoFar * 0.14, 2);
        if (elements.tblIss) elements.tblIss.textContent = 'R$ ' + formatCurrency(totalSoFar * 0.12, 2);
        if (elements.tblIpva) elements.tblIpva.textContent = 'R$ ' + formatCurrency(totalSoFar * 0.07, 2);
        if (elements.tblItbi) elements.tblItbi.textContent = 'R$ ' + formatCurrency(totalSoFar * 0.04, 2);
    }

    if (elements.yearSelect) {
        elements.yearSelect.addEventListener('change', (e) => {
            selectedYear = e.target.value;
            const displays = document.querySelectorAll('#selected-year-display');
            displays.forEach(el => el.textContent = selectedYear);
            updateDashboardData(selectedYear);
        });
    }

    // Calculadora Tributária Pessoal
    function calculatePersonalTax() {
        if (!elements.calcSalary) return;

        const salary = parseFloat(elements.calcSalary.value) || 0;
        const expenses = parseFloat(elements.calcExpenses.value) || 0;
        const iptu = parseFloat(elements.calcIptu.value) || 0;
        const ipva = parseFloat(elements.calcIpva.value) || 0;

        let monthlyIncomeTax = 0;
        if (salary > 4664.68) {
            monthlyIncomeTax = (salary * 0.275) - 896;
        } else if (salary > 3751.05) {
            monthlyIncomeTax = (salary * 0.225) - 662.77;
        } else if (salary > 2826.65) {
            monthlyIncomeTax = (salary * 0.15) - 381.44;
        } else if (salary > 2259.20) {
            monthlyIncomeTax = (salary * 0.075) - 169.44;
        }

        const monthlyConsumptionTax = expenses * 0.28;
        const totalAnnualTax = (monthlyIncomeTax * 12) + (monthlyConsumptionTax * 12) + iptu + ipva;
        const totalAnnualIncome = salary * 12;
        
        const workDays = totalAnnualIncome > 0 ? Math.round((totalAnnualTax / totalAnnualIncome) * 365) : 0;

        const municipalPart = totalAnnualTax * 0.22;
        const estadualPart = totalAnnualTax * 0.48;
        const federalPart = totalAnnualTax * 0.30;

        if (elements.resTotalTax) elements.resTotalTax.textContent = 'R$ ' + formatCurrency(totalAnnualTax, 2);
        if (elements.resWorkDays) elements.resWorkDays.textContent = workDays;

        if (elements.resMunicipalVal) elements.resMunicipalVal.textContent = 'R$ ' + formatCurrency(municipalPart, 2);
        if (elements.resEstadualVal) elements.resEstadualVal.textContent = 'R$ ' + formatCurrency(estadualPart, 2);
        if (elements.resFederalVal) elements.resFederalVal.textContent = 'R$ ' + formatCurrency(federalPart, 2);
    }

    if (elements.btnCalculate) {
        elements.btnCalculate.addEventListener('click', calculatePersonalTax);
    }

    // Gráfico de Receitas Institucional
    function initCharts() {
        if (typeof Chart === 'undefined') return;

        const ctxSources = getEl('chartTaxSources');
        if (ctxSources) {
            new Chart(ctxSources, {
                type: 'bar',
                data: {
                    labels: ['ICMS (35%)', 'FPM/FUNDEB (28%)', 'IPTU (14%)', 'ISSQN (12%)', 'IPVA (7%)', 'ITBI e Taxas (4%)'],
                    datasets: [{
                        label: 'Participação Orçamentária (%)',
                        data: [35, 28, 14, 12, 7, 4],
                        backgroundColor: '#1e40af',
                        borderColor: '#0f2b48',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 40,
                            ticks: {
                                callback: function(value) { return value + '%'; }
                            }
                        }
                    }
                }
            });
        }
    }

    // Inicialização
    updateDashboardData(selectedYear);
    calculatePersonalTax();
    initCharts();
});
