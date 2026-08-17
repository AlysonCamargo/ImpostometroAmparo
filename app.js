/**
 * PREFEITURA MUNICIPAL DE AMPARO - ESTADO DE SÃO PAULO
 * PORTAL DA TRANSPARÊNCIA FISCAL E PRESTAÇÃO DE CONTAS
 * Módulo de Processamento Orçamentário e Demonstrativos Fiscais (STN/LRF)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dados consolidados conforme relatórios do Tribunal de Contas do Estado de SP (TCESP)
    const DADOS_ORCAMENTARIOS = {
        '2026': {
            totalPrevisto: 295000000.00,
            populacao: 68000,
            receitas: [
                { categoria: 'Cota-Parte do ICMS', esfera: 'Estadual', valor: 103250000.00, percentual: 35.0 },
                { categoria: 'FPM e Repasses do FUNDEB', esfera: 'Federal', valor: 82600000.00, percentual: 28.0 },
                { categoria: 'IPTU (Imposto Predial e Territorial)', esfera: 'Municipal', valor: 41300000.00, percentual: 14.0 },
                { categoria: 'ISSQN (Imposto Sobre Serviços)', esfera: 'Municipal', valor: 35400000.00, percentual: 12.0 },
                { categoria: 'Cota-Parte do IPVA', esfera: 'Estadual', valor: 20650000.00, percentual: 7.0 },
                { categoria: 'ITBI, Taxas e Outras Receitas', esfera: 'Municipal', valor: 11800000.00, percentual: 4.0 }
            ],
            despesasFuncao: [
                { cod: '10', funcao: 'Saúde', valor: 82600000.00, percentual: 28.0 },
                { cod: '12', funcao: 'Educação', valor: 76110000.00, percentual: 25.8 },
                { cod: '15', funcao: 'Urbanismo e Infraestrutura', valor: 51920000.00, percentual: 17.6 },
                { cod: '04', funcao: 'Administração Geral', valor: 26550000.00, percentual: 9.0 },
                { cod: '08', funcao: 'Assistência Social', valor: 17700000.00, percentual: 6.0 },
                { cod: '06', funcao: 'Segurança Pública', valor: 11800000.00, percentual: 4.0 },
                { cod: '99', funcao: 'Demais Funções de Governo', valor: 28320000.00, percentual: 9.6 }
            ]
        },
        '2025': {
            totalPrevisto: 272500000.00,
            populacao: 68000,
            receitas: [
                { categoria: 'Cota-Parte do ICMS', esfera: 'Estadual', valor: 95375000.00, percentual: 35.0 },
                { categoria: 'FPM e Repasses do FUNDEB', esfera: 'Federal', valor: 76300000.00, percentual: 28.0 },
                { categoria: 'IPTU (Imposto Predial e Territorial)', esfera: 'Municipal', valor: 38150000.00, percentual: 14.0 },
                { categoria: 'ISSQN (Imposto Sobre Serviços)', esfera: 'Municipal', valor: 32700000.00, percentual: 12.0 },
                { categoria: 'Cota-Parte do IPVA', esfera: 'Estadual', valor: 19075000.00, percentual: 7.0 },
                { categoria: 'ITBI, Taxas e Outras Receitas', esfera: 'Municipal', valor: 10900000.00, percentual: 4.0 }
            ],
            despesasFuncao: [
                { cod: '10', funcao: 'Saúde', valor: 76300000.00, percentual: 28.0 },
                { cod: '12', funcao: 'Educação', valor: 70305000.00, percentual: 25.8 },
                { cod: '15', funcao: 'Urbanismo e Infraestrutura', valor: 47960000.00, percentual: 17.6 },
                { cod: '04', funcao: 'Administração Geral', valor: 24525000.00, percentual: 9.0 },
                { cod: '08', funcao: 'Assistência Social', valor: 16350000.00, percentual: 6.0 },
                { cod: '06', funcao: 'Segurança Pública', valor: 10900000.00, percentual: 4.0 },
                { cod: '99', funcao: 'Demais Funções de Governo', valor: 26160000.00, percentual: 9.6 }
            ]
        },
        '2024': {
            totalPrevisto: 248000000.00,
            populacao: 68000,
            receitas: [
                { categoria: 'Cota-Parte do ICMS', esfera: 'Estadual', valor: 86800000.00, percentual: 35.0 },
                { categoria: 'FPM e Repasses do FUNDEB', esfera: 'Federal', valor: 69440000.00, percentual: 28.0 },
                { categoria: 'IPTU (Imposto Predial e Territorial)', esfera: 'Municipal', valor: 34720000.00, percentual: 14.0 },
                { categoria: 'ISSQN (Imposto Sobre Serviços)', esfera: 'Municipal', valor: 29760000.00, percentual: 12.0 },
                { categoria: 'Cota-Parte do IPVA', esfera: 'Estadual', valor: 17360000.00, percentual: 7.0 },
                { categoria: 'ITBI, Taxas e Outras Receitas', esfera: 'Municipal', valor: 9920000.00, percentual: 4.0 }
            ],
            despesasFuncao: [
                { cod: '10', funcao: 'Saúde', valor: 69440000.00, percentual: 28.0 },
                { cod: '12', funcao: 'Educação', valor: 63984000.00, percentual: 25.8 },
                { cod: '15', funcao: 'Urbanismo e Infraestrutura', valor: 43648000.00, percentual: 17.6 },
                { cod: '04', funcao: 'Administração Geral', valor: 22320000.00, percentual: 9.0 },
                { cod: '08', funcao: 'Assistência Social', valor: 14880000.00, percentual: 6.0 },
                { cod: '06', funcao: 'Segurança Pública', valor: 9920000.00, percentual: 4.0 },
                { cod: '99', funcao: 'Demais Funções de Governo', valor: 23808000.00, percentual: 9.6 }
            ]
        }
    };

    let exercicioAtual = '2026';

    const getElement = (id) => document.getElementById(id);

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarDataDataAtual() {
        const data = new Date();
        const dataElement = getElement('data-atualizacao');
        if (dataElement) {
            dataElement.textContent = data.toLocaleDateString('pt-BR');
        }
    }
    formatarDataDataAtual();

    function atualizarPainel(exercicio) {
        const dados = DADOS_ORCAMENTARIOS[exercicio];
        if (!dados) return;

        const elTotal = getElement('valor-total-loa');
        if (elTotal) elTotal.textContent = formatarMoeda(dados.totalPrevisto);

        const elPerCapita = getElement('valor-per-capita');
        if (elPerCapita) {
            const perCapita = dados.totalPrevisto / dados.populacao;
            elPerCapita.textContent = formatarMoeda(perCapita);
        }

        const displaysExercicio = document.querySelectorAll('.exercicio-label');
        displaysExercicio.forEach(el => el.textContent = exercicio);

        // Preenchimento de Tabelas de Receitas se existirem na página
        if (getElement('tbl-receita-icms')) getElement('tbl-receita-icms').textContent = formatarMoeda(dados.receitas[0].valor);
        if (getElement('tbl-receita-fpm')) getElement('tbl-receita-fpm').textContent = formatarMoeda(dados.receitas[1].valor);
        if (getElement('tbl-receita-iptu')) getElement('tbl-receita-iptu').textContent = formatarMoeda(dados.receitas[2].valor);
        if (getElement('tbl-receita-iss')) getElement('tbl-receita-iss').textContent = formatarMoeda(dados.receitas[3].valor);
        if (getElement('tbl-receita-ipva')) getElement('tbl-receita-ipva').textContent = formatarMoeda(dados.receitas[4].valor);
        if (getElement('tbl-receita-itbi')) getElement('tbl-receita-itbi').textContent = formatarMoeda(dados.receitas[5].valor);

        // Preenchimento de Tabelas de Despesas se existirem na página
        if (getElement('tbl-desp-saude')) getElement('tbl-desp-saude').textContent = formatarMoeda(dados.despesasFuncao[0].valor);
        if (getElement('tbl-desp-educacao')) getElement('tbl-desp-educacao').textContent = formatarMoeda(dados.despesasFuncao[1].valor);
        if (getElement('tbl-desp-urbanismo')) getElement('tbl-desp-urbanismo').textContent = formatarMoeda(dados.despesasFuncao[2].valor);
        if (getElement('tbl-desp-admin')) getElement('tbl-desp-admin').textContent = formatarMoeda(dados.despesasFuncao[3].valor);
        if (getElement('tbl-desp-social')) getElement('tbl-desp-social').textContent = formatarMoeda(dados.despesasFuncao[4].valor);
        if (getElement('tbl-desp-seguranca')) getElement('tbl-desp-seguranca').textContent = formatarMoeda(dados.despesasFuncao[5].valor);
        if (getElement('tbl-desp-outras')) getElement('tbl-desp-outras').textContent = formatarMoeda(dados.despesasFuncao[6].valor);
    }

    const selectExercicio = getElement('select-exercicio');
    if (selectExercicio) {
        selectExercicio.addEventListener('change', (e) => {
            exercicioAtual = e.target.value;
            atualizarPainel(exercicioAtual);
        });
    }

    // Calculadora Tributária Pessoal (Estimativa Normativa)
    const btnCalcular = getElement('btn-calcular-tributos');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', () => {
            const rendaMensal = parseFloat(getElement('input-renda').value) || 0;
            const despesaConsumo = parseFloat(getElement('input-consumo').value) || 0;
            const iptuAnual = parseFloat(getElement('input-iptu').value) || 0;
            const ipvaAnual = parseFloat(getElement('input-ipva').value) || 0;

            let irpfMensal = 0;
            if (rendaMensal > 4664.68) {
                irpfMensal = (rendaMensal * 0.275) - 896.00;
            } else if (rendaMensal > 3751.05) {
                irpfMensal = (rendaMensal * 0.225) - 662.77;
            } else if (rendaMensal > 2826.65) {
                irpfMensal = (rendaMensal * 0.15) - 381.44;
            } else if (rendaMensal > 2259.20) {
                irpfMensal = (rendaMensal * 0.075) - 169.44;
            }

            const consumoAnualTributos = despesaConsumo * 12 * 0.275; // Alíquota média ICMS/PIS/COFINS
            const totalMunicipal = iptuAnual + (consumoAnualTributos * 0.20);
            const totalEstadual = ipvaAnual + (consumoAnualTributos * 0.50);
            const totalFederal = (irpfMensal * 12) + (consumoAnualTributos * 0.30);

            const totalGeral = totalMunicipal + totalEstadual + totalFederal;

            if (getElement('res-municipal')) getElement('res-municipal').textContent = formatarMoeda(totalMunicipal);
            if (getElement('res-estadual')) getElement('res-estadual').textContent = formatarMoeda(totalEstadual);
            if (getElement('res-federal')) getElement('res-federal').textContent = formatarMoeda(totalFederal);
            if (getElement('res-total-geral')) getElement('res-total-geral').textContent = formatarMoeda(totalGeral);
        });
    }

    // Gráfico de Receita Tributária (Chart.js Padrão)
    function inicializarGraficos() {
        if (typeof Chart === 'undefined') return;

        const ctxReceitas = getElement('chartReceitasCanvas');
        if (ctxReceitas) {
            new Chart(ctxReceitas, {
                type: 'bar',
                data: {
                    labels: ['ICMS (35%)', 'FPM/FUNDEB (28%)', 'IPTU (14%)', 'ISSQN (12%)', 'IPVA (7%)', 'Outros (4%)'],
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
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 40,
                            ticks: { callback: (v) => v + '%' }
                        }
                    }
                }
            });
        }
    }

    atualizarPainel(exercicioAtual);
    inicializarGraficos();
});
