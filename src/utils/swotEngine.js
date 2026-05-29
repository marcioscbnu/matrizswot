export const initialSwot = {
  forcas: [],
  fraquezas: [],
  oportunidades: [],
  ameacas: [],
};

export function sumWeights(items) {
  return items.reduce((total, item) => total + Number(item.peso || 0), 0);
}

export function calculateSwot(data) {
  const totalForcas = sumWeights(data.forcas);
  const totalFraquezas = sumWeights(data.fraquezas);
  const totalOportunidades = sumWeights(data.oportunidades);
  const totalAmeacas = sumWeights(data.ameacas);

  const positivos = totalForcas + totalOportunidades;
  const negativos = totalFraquezas + totalAmeacas;

  const scoreBruto = 50 + positivos - negativos;
  const score = Math.max(0, Math.min(100, scoreBruto));

  const risco = Math.max(0, Math.min(100, 100 - score));

  return {
    totalForcas,
    totalFraquezas,
    totalOportunidades,
    totalAmeacas,
    positivos,
    negativos,
    score,
    risco,
  };
}

export function getStatus(score) {
  if (score <= 25) {
    return {
      label: "Projeto Inviável",
      emoji: "🔴",
      className: "danger",
      message: "O projeto apresenta alto desequilíbrio estratégico.",
    };
  }

  if (score <= 50) {
    return {
      label: "Alto Risco",
      emoji: "🟠",
      className: "warning",
      message: "O projeto pode avançar, mas exige revisão dos pontos críticos.",
    };
  }

  if (score <= 75) {
    return {
      label: "Viável com Ajustes",
      emoji: "🟡",
      className: "attention",
      message: "O projeto tem potencial, mas ainda precisa de melhorias.",
    };
  }

  return {
    label: "Projeto Viável",
    emoji: "🟢",
    className: "success",
    message: "O projeto apresenta boa condição estratégica para avançar.",
  };
}

export function getSuggestion(data, totals) {
  const qtdForcas = data.forcas.length;
  const qtdFraquezas = data.fraquezas.length;
  const qtdOportunidades = data.oportunidades.length;
  const qtdAmeacas = data.ameacas.length;

  if (qtdForcas + qtdFraquezas + qtdOportunidades + qtdAmeacas === 0) {
    return "Adicione itens à matriz para iniciar a análise de viabilidade.";
  }

  if (totals.totalFraquezas > totals.totalForcas) {
    return "As fraquezas estão pesando mais que as forças. Discuta ações como capacitação, melhoria de processos ou reforço de recursos.";
  }

  if (totals.totalAmeacas > totals.totalOportunidades) {
    return "As ameaças estão maiores que as oportunidades. Reavalie o ambiente externo e proponha estratégias de mitigação.";
  }

  if (totals.negativos === 0 && totals.positivos > 0) {
    return "A análise está muito positiva. Verifique se os riscos reais foram considerados para evitar uma visão otimista demais.";
  }

  if (totals.score >= 76) {
    return "O projeto está bem posicionado. O próximo passo é transformar a SWOT em plano de ação.";
  }

  return "A matriz está relativamente equilibrada. Revise os itens com maior peso e discuta como melhorar o score.";
}
