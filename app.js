/**
 * IMPOSTÔMETRO DE AMPARO
 * Iniciativa independente de um morador de Amparo - SP.
 * Dados baseados na Lei Orçamentária Anual (LOA) aprovada anualmente.
 */

const DADOS_LOA = {
    '2026': {
        totalAnual: 295_000_000,
        populacao: 68_000,
        leiNumero: 'Lei Municipal nº 4.321/2025',
        receitas: [
            { nome: 'Cota-Parte do ICMS', esfera: 'est', percentual: 35.0 },
            { nome: 'FPM e FUNDEB',        esfera: 'fed', percentual: 28.0 },
            { nome: 'IPTU',                esfera: 'mun', percentual: 14.0 },
            { nome: 'ISSQN',               esfera: 'mun', percentual: 12.0 },
            { nome: 'Cota-Parte do IPVA',  esfera: 'est', percentual: 7.0  },
            { nome: 'ITBI e Taxas',        esfera: 'mun', percentual: 4.0  },
        ],
        despesas: [
            { cod: '10', nome: 'Saúde',                        percentual: 28.0 },
            { cod: '12', nome: 'Educação',                     percentual: 25.8 },
            { cod: '15', nome: 'Urbanismo e Infraestrutura',   percentual: 17.6 },
            { cod: '04', nome: 'Administração Geral',          percentual: 9.0  },
            { cod: '08', nome: 'Assistência Social',           percentual: 6.0  },
            { cod: '06', nome: 'Segurança Pública',            percentual: 4.0  },
            { cod: '99', nome: 'Demais Funções',               percentual: 9.6  },
        ],
    },
    '2025': {
        totalAnual: 272_500_000,
        populacao: 68_000,
        leiNumero: 'Lei Municipal nº 4.214/2024',
        receitas: [
            { nome: 'Cota-Parte do ICMS', esfera: 'est', percentual: 35.0 },
            { nome: 'FPM e FUNDEB',        esfera: 'fed', percentual: 28.0 },
            { nome: 'IPTU',                esfera: 'mun', percentual: 14.0 },
            { nome: 'ISSQN',               esfera: 'mun', percentual: 12.0 },
            { nome: 'Cota-Parte do IPVA',  esfera: 'est', percentual: 7.0  },
            { nome: 'ITBI e Taxas',        esfera: 'mun', percentual: 4.0  },
        ],
        despesas: [
            { cod: '10', nome: 'Saúde',                        percentual: 28.0 },
            { cod: '12', nome: 'Educação',                     percentual: 25.8 },
            { cod: '15', nome: 'Urbanismo e Infraestrutura',   percentual: 17.6 },
            { cod: '04', nome: 'Administração Geral',          percentual: 9.0  },
            { cod: '08', nome: 'Assistência Social',           percentual: 6.0  },
            { cod: '06', nome: 'Segurança Pública',            percentual: 4.0  },
            { cod: '99', nome: 'Demais Funções',               percentual: 9.6  },
        ],
    },
    '2024': {
        totalAnual: 248_000_000,
        populacao: 68_000,
        leiNumero: 'Lei Municipal nº 4.087/2023',
        receitas: [
            { nome: 'Cota-Parte do ICMS', esfera: 'est', percentual: 35.0 },
            { nome: 'FPM e FUNDEB',        esfera: 'fed', percentual: 28.0 },
            { nome: 'IPTU',                esfera: 'mun', percentual: 14.0 },
            { nome: 'ISSQN',               esfera: 'mun', percentual: 12.0 },
            { nome: 'Cota-Parte do IPVA',  esfera: 'est', percentual: 7.0  },
            { nome: 'ITBI e Taxas',        esfera: 'mun', percentual: 4.0  },
        ],
        despesas: [
            { cod: '10', nome: 'Saúde',                        percentual: 28.0 },
            { cod: '12', nome: 'Educação',                     percentual: 25.8 },
            { cod: '15', nome: 'Urbanismo e Infraestrutura',   percentual: 17.6 },
            { cod: '04', nome: 'Administração Geral',          percentual: 9.0  },
            { cod: '08', nome: 'Assistência Social',           percentual: 6.0  },
            { cod: '06', nome: 'Segurança Pública',            percentual: 4.0  },
            { cod: '99', nome: 'Demais Funções',               percentual: 9.6  },
        ],
    }
};

// ── Helpers ────────────────────────────────────────────────────

function brl(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

function el(id) { return document.getElementById(id); }

// ── Data de hoje ───────────────────────────────────────────────

function carregarData() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const targets = document.querySelectorAll('.js-data-hoje');
    targets.forEach(t => t.textContent = hoje);
}

// ── Impostômetro ao vivo ────────────────────────────────────────
// Calcula quanto o município já arrecadou desde 00h00 de 01/01/2026
// baseado na projeção linear da LOA 2026.

function iniciarImpostometro() {
    const loa = DADOS_LOA['2026'];
    const SEGUNDOS_ANO = 365 * 24 * 60 * 60;          // 31.536.000 s
    const TAXA_POR_SEGUNDO = loa.totalAnual / SEGUNDOS_ANO; // ≈ R$ 9,35/s

    const inicioAno = new Date('2026-01-01T00:00:00');
    const exibirValor = el('impostometro-value');
    const exibirTaxa  = el('impostometro-rate-value');

    if (!exibirValor) return;

    if (exibirTaxa) {
        exibirTaxa.textContent = brl(TAXA_POR_SEGUNDO) + '/s';
    }

    function calcularAtual() {
        const agora = new Date();
        const segundosdecorridos = Math.max(0, (agora - inicioAno) / 1000);
        return segundosdecorridos * TAXA_POR_SEGUNDO;
    }

    // Inicializar
    exibirValor.textContent = brl(calcularAtual());

    // Atualizar a cada segundo
    setInterval(() => {
        exibirValor.textContent = brl(calcularAtual());
    }, 1000);
}

// ── Tabelas de Receitas ────────────────────────────────────────

function preencherReceitas(exercicio) {
    const loa = DADOS_LOA[exercicio];
    if (!loa) return;

    const ids = [
        'tbl-icms', 'tbl-fpm', 'tbl-iptu',
        'tbl-iss',  'tbl-ipva', 'tbl-itbi'
    ];

    loa.receitas.forEach((r, i) => {
        const cel = el(ids[i]);
        if (cel) cel.textContent = brl(loa.totalAnual * r.percentual / 100);
    });
}

// ── Tabelas de Despesas ────────────────────────────────────────

function preencherDespesas(exercicio) {
    const loa = DADOS_LOA[exercicio];
    if (!loa) return;

    const ids = [
        'tbl-saude', 'tbl-educacao', 'tbl-urbanismo',
        'tbl-admin', 'tbl-social',   'tbl-seguranca', 'tbl-outras'
    ];

    loa.despesas.forEach((d, i) => {
        const cel = el(ids[i]);
        if (cel) cel.textContent = brl(loa.totalAnual * d.percentual / 100);
    });
}

// ── Seletor de Exercício ───────────────────────────────────────

function ativarSeletor() {
    const sel = el('select-exercicio');
    if (!sel) return;

    function atualizar(ex) {
        document.querySelectorAll('.js-exercicio').forEach(x => x.textContent = ex);
        preencherReceitas(ex);
        preencherDespesas(ex);

        const loa = DADOS_LOA[ex];
        if (!loa) return;

        const elTotal = el('js-total-loa');
        if (elTotal) elTotal.textContent = brl(loa.totalAnual);

        const elPc = el('js-per-capita');
        if (elPc) elPc.textContent = brl(loa.totalAnual / loa.populacao);
    }

    sel.addEventListener('change', e => atualizar(e.target.value));
    atualizar(sel.value);
}

// ── Calculadora Tributária ─────────────────────────────────────

function ativarCalculadora() {
    const btn = el('btn-calcular');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const renda   = parseFloat(el('input-renda')?.value)   || 0;
        const consumo = parseFloat(el('input-consumo')?.value) || 0;
        const iptu    = parseFloat(el('input-iptu')?.value)    || 0;
        const ipva    = parseFloat(el('input-ipva')?.value)    || 0;

        // IRPF 2026 (tabela progressiva)
        let irpf = 0;
        if      (renda > 4664.68) irpf = renda * 0.275 - 896.00;
        else if (renda > 3751.05) irpf = renda * 0.225 - 662.77;
        else if (renda > 2826.65) irpf = renda * 0.150 - 381.44;
        else if (renda > 2259.20) irpf = renda * 0.075 - 169.44;

        const icmsConsumo = consumo * 12 * 0.275; // encargo estimado sobre consumo

        const totalMun  = iptu + icmsConsumo * 0.20;
        const totalEst  = ipva + icmsConsumo * 0.50;
        const totalFed  = irpf * 12 + icmsConsumo * 0.30;
        const totalGeral = totalMun + totalEst + totalFed;

        if (el('res-mun'))   el('res-mun').textContent   = brl(totalMun);
        if (el('res-est'))   el('res-est').textContent   = brl(totalEst);
        if (el('res-fed'))   el('res-fed').textContent   = brl(totalFed);
        if (el('res-total')) el('res-total').textContent = brl(totalGeral);
    });
}

// ── Gráfico de Barras (Chart.js) ────────────────────────────────

function iniciarGrafico() {
    if (typeof Chart === 'undefined') return;
    const canvas = el('chart-receitas');
    if (!canvas) return;

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['ICMS\n35%', 'FPM/FUNDEB\n28%', 'IPTU\n14%', 'ISSQN\n12%', 'IPVA\n7%', 'Outros\n4%'],
            datasets: [{
                label: 'Participação (%)',
                data: [35, 28, 14, 12, 7, 4],
                backgroundColor: '#2563eb',
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true, max: 40,
                    ticks: { callback: v => v + '%' }
                }
            }
        }
    });
}

// ── Init ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    carregarData();
    iniciarImpostometro();
    ativarSeletor();
    ativarCalculadora();
    iniciarGrafico();
});
