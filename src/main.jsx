import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const initialData = {
  strengths: [
    { id: makeId(), text: 'Equipe motivada', weight: 4 },
    { id: makeId(), text: 'Conhecimento técnico inicial', weight: 3 },
  ],
  weaknesses: [
    { id: makeId(), text: 'Pouca experiência em projetos reais', weight: 4 },
  ],
  opportunities: [
    { id: makeId(), text: 'Mercado busca soluções digitais', weight: 5 },
  ],
  threats: [
    { id: makeId(), text: 'Concorrentes com soluções prontas', weight: 4 },
  ],
};

const quadrantInfo = {
  strengths: { title: 'Forças', subtitle: 'Interno positivo', letter: 'S', sign: '+', placeholder: 'Ex.: equipe qualificada' },
  weaknesses: { title: 'Fraquezas', subtitle: 'Interno negativo', letter: 'W', sign: '-', placeholder: 'Ex.: pouca experiência' },
  opportunities: { title: 'Oportunidades', subtitle: 'Externo positivo', letter: 'O', sign: '+', placeholder: 'Ex.: mercado em crescimento' },
  threats: { title: 'Ameaças', subtitle: 'Externo negativo', letter: 'T', sign: '-', placeholder: 'Ex.: concorrência forte' },
};

function total(items) {
  return items.reduce((sum, item) => sum + Number(item.weight), 0);
}

function getStatus(score) {
  if (score <= -10) return { label: 'Projeto Inviável', level: 'danger', text: 'Os riscos superam bastante os fatores favoráveis.' };
  if (score <= 0) return { label: 'Alto Risco', level: 'warning', text: 'O projeto precisa ser revisto antes de avançar.' };
  if (score <= 10) return { label: 'Viável com Ajustes', level: 'adjust', text: 'Existe potencial, mas os alunos devem mitigar fraquezas e ameaças.' };
  if (score <= 20) return { label: 'Bom Potencial', level: 'good', text: 'A análise indica um cenário favorável para planejamento.' };
  return { label: 'Excelente Potencial', level: 'excellent', text: 'O projeto apresenta forte aderência estratégica.' };
}

function Quadrant({ type, items, onAdd, onRemove, onWeight }) {
  const [text, setText] = useState('');
  const [weight, setWeight] = useState(3);
  const info = quadrantInfo[type];

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(type, text.trim(), Number(weight));
    setText('');
    setWeight(3);
  }

  return (
    <section className={`quadrant ${type}`}>
      <div className="q-head">
        <div className="q-letter">{info.letter}</div>
        <div>
          <h2>{info.title}</h2>
          <p>{info.subtitle}</p>
        </div>
      </div>

      <form className="add" onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={info.placeholder} />
        <select value={weight} onChange={(e) => setWeight(e.target.value)}>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <button type="submit">+</button>
      </form>

      <div className="list">
        {items.length === 0 && <div className="empty">Nenhum item cadastrado.</div>}
        {items.map((item) => (
          <div className="item" key={item.id}>
            <span>{item.text}</span>
            <div className="item-tools">
              <select value={item.weight} onChange={(e) => onWeight(type, item.id, Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <strong>{info.sign}{item.weight}</strong>
              <button type="button" onClick={() => onRemove(type, item.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [data, setData] = useState(initialData);
  const [project, setProject] = useState('Projeto em análise');

  const results = useMemo(() => {
    const strengths = total(data.strengths);
    const weaknesses = total(data.weaknesses);
    const opportunities = total(data.opportunities);
    const threats = total(data.threats);
    const positive = strengths + opportunities;
    const negative = weaknesses + threats;
    const score = positive - negative;
    return { strengths, weaknesses, opportunities, threats, positive, negative, score };
  }, [data]);

  const status = getStatus(results.score);
  const pointer = Math.max(0, Math.min(100, ((Math.max(-25, Math.min(25, results.score)) + 25) / 50) * 100));

  function addItem(type, text, weight) {
    setData((old) => ({ ...old, [type]: [...old[type], { id: makeId(), text, weight }] }));
  }

  function removeItem(type, id) {
    setData((old) => ({ ...old, [type]: old[type].filter((item) => item.id !== id) }));
  }

  function updateWeight(type, id, weight) {
    setData((old) => ({ ...old, [type]: old[type].map((item) => item.id === id ? { ...item, weight } : item) }));
  }

  function clearAll() {
    setData({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
  }

  function presentationMode() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  function exportJson() {
    const content = JSON.stringify({ project, data, results, status: status.label }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matriz-swot.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="tag">SWOT LIVE</p>
          <h1>Matriz SWOT Interativa</h1>
          <p className="lead">Preencha a matriz ao vivo e acompanhe a viabilidade estratégica do projeto em tempo real.</p>
        </div>
        <div className="actions">
          <button onClick={presentationMode}>Modo apresentação</button>
          <button onClick={exportJson}>Exportar JSON</button>
          <button className="danger-button" onClick={clearAll}>Limpar</button>
        </div>
      </header>

      <section className="project">
        <label>Nome do projeto<input value={project} onChange={(e) => setProject(e.target.value)} /></label>
        <div className="formula">Índice SWOT = (Forças + Oportunidades) − (Fraquezas + Ameaças)</div>
      </section>

      <section className="dashboard">
        <div className={`score ${status.level}`}>
          <span>Índice SWOT</span>
          <strong>{results.score}</strong>
          <h2>{status.label}</h2>
          <p>{status.text}</p>
        </div>

        <div className="gauge">
          <div className="gauge-top"><span>Inviável</span><span>Alto risco</span><span>Viável</span><span>Excelente</span></div>
          <div className="bar"><div className="pointer" style={{ left: `${pointer}%` }} /></div>
          <div className="gauge-bottom"><span>-25</span><span>-10</span><span>0</span><span>10</span><span>25</span></div>
        </div>

        <div className="cards">
          <div><span>Forças</span><strong>+{results.strengths}</strong></div>
          <div><span>Oportunidades</span><strong>+{results.opportunities}</strong></div>
          <div><span>Fraquezas</span><strong>-{results.weaknesses}</strong></div>
          <div><span>Ameaças</span><strong>-{results.threats}</strong></div>
        </div>
      </section>

      <section className="matrix">
        {Object.keys(quadrantInfo).map((type) => (
          <Quadrant key={type} type={type} items={data[type]} onAdd={addItem} onRemove={removeItem} onWeight={updateWeight} />
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
