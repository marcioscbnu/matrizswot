import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const quadrants = {
  strengths: { title: 'Forças', signal: 1, placeholder: 'Ex.: equipe qualificada', badge: 'Interno positivo' },
  weaknesses: { title: 'Fraquezas', signal: -1, placeholder: 'Ex.: pouca experiência', badge: 'Interno negativo' },
  opportunities: { title: 'Oportunidades', signal: 1, placeholder: 'Ex.: mercado em crescimento', badge: 'Externo positivo' },
  threats: { title: 'Ameaças', signal: -1, placeholder: 'Ex.: concorrência forte', badge: 'Externo negativo' },
};

const initialItems = {
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
};

function getStatus(score) {
  if (score <= -10) return { label: 'Projeto inviável', text: 'A matriz indica risco elevado. Revise fraquezas e ameaças antes de avançar.' };
  if (score <= 0) return { label: 'Alto risco', text: 'O projeto ainda precisa de ajustes estratégicos para se tornar mais seguro.' };
  if (score <= 10) return { label: 'Viável com ajustes', text: 'Há potencial, mas a equipe deve mitigar riscos e fortalecer pontos internos.' };
  if (score <= 20) return { label: 'Bom potencial', text: 'A análise indica boa viabilidade, mantendo atenção aos riscos externos.' };
  return { label: 'Excelente potencial', text: 'A matriz mostra um cenário muito favorável para o projeto.' };
}

function App() {
  const [items, setItems] = useState(initialItems);
  const [forms, setForms] = useState({
    strengths: { text: '', weight: 3 },
    weaknesses: { text: '', weight: 3 },
    opportunities: { text: '', weight: 3 },
    threats: { text: '', weight: 3 },
  });

  const totals = useMemo(() => {
    const sum = key => items[key].reduce((acc, item) => acc + Number(item.weight), 0);
    const positives = sum('strengths') + sum('opportunities');
    const negatives = sum('weaknesses') + sum('threats');
    const score = positives - negatives;
    return { positives, negatives, score, status: getStatus(score) };
  }, [items]);

  const percent = Math.max(0, Math.min(100, ((totals.score + 25) / 50) * 100));

  function addItem(key) {
    const text = forms[key].text.trim();
    if (!text) return;
    setItems(prev => ({
      ...prev,
      [key]: [...prev[key], { id: crypto.randomUUID(), text, weight: Number(forms[key].weight) }],
    }));
    setForms(prev => ({ ...prev, [key]: { text: '', weight: 3 } }));
  }

  function removeItem(key, id) {
    setItems(prev => ({ ...prev, [key]: prev[key].filter(item => item.id !== id) }));
  }

  function clearAll() {
    setItems(initialItems);
  }

  function exportJson() {
    const data = JSON.stringify({ items, totals }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matriz-swot-live.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Empreendedorismo • Planejamento Estratégico</p>
          <h1>Matriz SWOT Live</h1>
          <p className="subtitle">Preencha a análise com a turma e veja a viabilidade do projeto mudar em tempo real.</p>
        </div>
        <div className="scoreCard">
          <span>Índice SWOT</span>
          <strong>{totals.score}</strong>
          <em>{totals.status.label}</em>
        </div>
      </section>

      <section className="dashboard">
        <div className="meterPanel">
          <div className="meterHeader">
            <h2>Reação da matriz</h2>
            <p>{totals.status.text}</p>
          </div>
          <div className="bar">
            <div className="fill" style={{ width: `${percent}%` }} />
            <div className="pointer" style={{ left: `${percent}%` }} />
          </div>
          <div className="scale">
            <span>Inviável</span><span>Alto risco</span><span>Viável</span><span>Excelente</span>
          </div>
          <div className="numbers">
            <div><strong>{totals.positives}</strong><span>pontos favoráveis</span></div>
            <div><strong>{totals.negatives}</strong><span>pontos críticos</span></div>
          </div>
        </div>

        <div className="actions">
          <button onClick={exportJson}>Exportar JSON</button>
          <button onClick={clearAll} className="secondary">Limpar matriz</button>
        </div>
      </section>

      <section className="grid">
        {Object.entries(quadrants).map(([key, q]) => (
          <article className={`card ${key}`} key={key}>
            <div className="cardHeader">
              <div>
                <span className="badge">{q.badge}</span>
                <h2>{q.title}</h2>
              </div>
            </div>

            <div className="form">
              <input
                value={forms[key].text}
                onChange={e => setForms(prev => ({ ...prev, [key]: { ...prev[key], text: e.target.value } }))}
                placeholder={q.placeholder}
                onKeyDown={e => { if (e.key === 'Enter') addItem(key); }}
              />
              <select
                value={forms[key].weight}
                onChange={e => setForms(prev => ({ ...prev, [key]: { ...prev[key], weight: e.target.value } }))}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>Peso {n}</option>)}
              </select>
              <button onClick={() => addItem(key)}>Adicionar</button>
            </div>

            <ul className="items">
              {items[key].map(item => (
                <li key={item.id}>
                  <span>{item.text}</span>
                  <strong>{q.signal > 0 ? '+' : '-'}{item.weight}</strong>
                  <button onClick={() => removeItem(key, item.id)}>×</button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
