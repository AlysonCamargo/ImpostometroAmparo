/**
 * app.js - Impostômetro de Amparo
 * Código simples e direto.
 */

// Dados da LOA (Lei Orçamentária Anual) para a base do contador
// Isso é público, você acha no Portal da Transparência da Prefeitura.
const DADOS_LOA = {
    '2026': {
        totalAnual: 295_000_000,
        populacao: 68_000,
        receitas: [
            { nome: 'Cota-Parte do ICMS', percentual: 35.0 },
            { nome: 'FPM e FUNDEB', percentual: 28.0 },
            { nome: 'IPTU', percentual: 14.0 },
            { nome: 'ISSQN', percentual: 12.0 },
            { nome: 'Cota-Parte do IPVA', percentual: 7.0  },
            { nome: 'ITBI e outras taxas', percentual: 4.0  },
        ],
        despesas: [
            { id: 'tbl-saude', percentual: 28.0 },
            { id: 'tbl-educacao', percentual: 25.8 },
            { id: 'tbl-urbanismo', percentual: 17.6 },
            { id: 'tbl-admin', percentual: 9.0  },
            { id: 'tbl-social', percentual: 6.0  },
            { id: 'tbl-seguranca', percentual: 4.0  },
            { id: 'tbl-outras', percentual: 9.6  },
        ],
    },
    '2025': { totalAnual: 272_500_000, populacao: 68_000, receitas: [], despesas: [] },
    '2024': { totalAnual: 248_000_000, populacao: 68_000, receitas: [], despesas: [] }
};

// Formata pra Reais (R$)
const formataReal = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function iniciaMenuMobile() {
    const btn = document.getElementById('btn-menu');
    const menu = document.getElementById('menu-principal');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('mostrar');
            btn.textContent = menu.classList.contains('mostrar') ? 'Fechar menu ✕' : 'Menu ☰';
        });
    }
}

// O motorzinho do impostômetro
function iniciaContador() {
    const elementoValor = document.getElementById('impostometro-valor');
    if (!elementoValor) return;

    // R$ 295 milhões por ano dividido pelos segundos do ano todo
    const segundosNoAno = 365 * 24 * 60 * 60;
    const taxaPorSegundo = DADOS_LOA['2026'].totalAnual / segundosNoAno; 
    
    // Começa sempre em 1º de Janeiro do ano atual (usando 2026 de base)
    const inicioDoAno = new Date('2026-01-01T00:00:00');

    function atualiza() {
        const agora = new Date();
        const segundosAteAgora = Math.max(0, (agora - inicioDoAno) / 1000);
        const valorAcumulado = segundosAteAgora * taxaPorSegundo;
        
        elementoValor.textContent = formataReal(valorAcumulado);
    }

    // Roda direto
    atualiza();
    setInterval(atualiza, 1000); // 1 vez por segundo
}

function iniciaCalculadora() {
    const btn = document.getElementById('btn-calcula');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const renda = Number(document.getElementById('renda')?.value || 0);
        const consumo = Number(document.getElementById('consumo')?.value || 0);
        const iptu = Number(document.getElementById('iptu')?.value || 0);
        const ipva = Number(document.getElementById('ipva')?.value || 0);

        // Tabela do IRPF simplificada
        let irpfMensal = 0;
        if (renda > 4664.68) irpfMensal = (renda * 0.275) - 896.00;
        else if (renda > 3751.05) irpfMensal = (renda * 0.225) - 662.77;
        else if (renda > 2826.65) irpfMensal = (renda * 0.15) - 381.44;
        else if (renda > 2259.20) irpfMensal = (renda * 0.075) - 169.44;

        // Impostos no consumo (média Brasil é uns 27,5% somando IPi, ICMS, Pis/Cofins etc)
        const impostoConsumo = consumo * 0.275;

        // Divisão por esfera (aproximada para fins educativos)
        const pagoMunicipio = iptu + (impostoConsumo * 0.15) * 12; // ICMS que volta, ISS
        const pagoEstado = ipva + (impostoConsumo * 0.45) * 12; // Fica boa parte do ICMS
        const pagoUniao = (irpfMensal * 12) + (impostoConsumo * 0.40) * 12; // IRPF, Pis/cofins
        
        const total = pagoMunicipio + pagoEstado + pagoUniao;

        document.getElementById('total-mun').textContent = formataReal(pagoMunicipio);
        document.getElementById('total-est').textContent = formataReal(pagoEstado);
        document.getElementById('total-fed').textContent = formataReal(pagoUniao);
        document.getElementById('total-tudo').textContent = formataReal(total);
        
        document.getElementById('area-resultado').style.display = 'block';
    });
}

function iniciaGrafico() {
    const canvas = document.getElementById('grafico-receitas');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = DADOS_LOA['2026'].receitas.map(r => r.nome);
    const dados = DADOS_LOA['2026'].receitas.map(r => r.percentual);

    new Chart(canvas, {
        type: 'pie', // Pizza fica mais agradável que barras
        data: {
            labels: labels,
            datasets: [{
                data: dados,
                backgroundColor: ['#1a365d', '#2b6cb0', '#3182ce', '#4299e1', '#63b3ed', '#90cdf4'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

function preencheTabelas() {
    // Para a página de despesas (retorno.html)
    const loaAtual = DADOS_LOA['2026'];
    if (!loaAtual || loaAtual.despesas.length === 0) return;
    
    loaAtual.despesas.forEach(d => {
        const cel = document.getElementById(d.id);
        if (cel) cel.textContent = formataReal(loaAtual.totalAnual * (d.percentual / 100));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    iniciaMenuMobile();
    iniciaContador();
    iniciaCalculadora();
    iniciaGrafico();
    preencheTabelas();
});
