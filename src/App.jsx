import { useMemo, useState } from 'react'
import { Plus, Trash2, RotateCcw, Download, Presentation } from 'lucide-react'

const initialData = {
  strengths: [
    { id: crypto.randomUUID(), text: 'Equipe motivada', weight: 4 },
    { id: crypto.randomUUID(), text: 'Conhecimento técnico inicial', weight: 3 },
  ],
  weaknesses: [
    { id: crypto.randomUUID(), text: 'Pouca experiência em projetos reais', weight: 4 },
  ],
  opportunities: [
    { id: crypto.randomUUID(), text: 'Mercado busca soluções digitais', weight: 5 },
  ],
  threats: [
    { id: crypto.randomUUID(), text: 'Concorrentes com soluções prontas', weight: 4 },
  ],
}

const quadrants = {
  strengths: {
    title: 'Forças',
    subtitle: 'Fatores internos positivos',
    hint: 'O que favorece o projeto?',
    symbol: 'S',
    signal: '+',
  },
  weaknesses: {
    title: 'Fraquezas',
    subtitle: 'Fatores internos negativos',
    hint: 'O que precisa melhorar?',
    symbol: 'W',
    signal: '-',
  },
  opportunities: {
    title: 'Oportunidades',
    subtitle: 'Fatores externos positivos',
    hint: 'O que o ambiente favorece?',
    symbol: 'O',
    signal: '+',
  },
  threats: {
    title: 'Ameaças',
    subtitle: 'Fatores externos negativos',
    hint: 'O que pode prejudicar?',
    symbol: 'T',
    signal: '-',
  },
}

function sum(items) {
  return items.reduce((acc, item) => acc + Number(item.weight || 0), 0)
}

function getStatus(score) {
  if (score <= -10) {
    return {
      label: 'Projeto Inviável',
      description: 'O conjunto de fraquezas e ameaças compromete fortemente a proposta.',
      className: 'danger',
    }
  }
  if (score <= 0) {
    return {
      label: 'Alto Risco',
      description: 'O projeto ainda exige revisão antes de ser considerado viável.',
      className: 'warning',
    }
  }
  if (score <= 10) {
    return {
      label: 'Viável com Ajustes',
      description: 'A proposta tem potencial, mas precisa reduzir riscos e fragilidades.',
      className: 'adjust',
    }
  }
  if (score <= 20) {
    return {
      label: 'Bom Potencial',
      description: 'A matriz indica equilíbrio favorável para avançar com planejamento.',
      className: 'good',
    }
  }
  return {
    label: 'Excelente Potencial',
    description: 'A proposta apresenta forte aderência estratégica e boa perspectiva.',
    className: 'excellent',
  }
}

function clampScore(score) {
  return Math.max(-25, Math.min(25, score))
}

function QuadrantCard({ type, items, onAdd, onRemove, onUpdateWeight }) {
  const [text, setText] = useState('')
  const [weight, setWeight] = useState(3)
  const config = quadrants[type]

  function handleAdd(event) {
    event.preventDefault()
    if (!text.trim()) return
    onAdd(type, { text: text.trim(), weight: Number(weight) })
    setText('')
    setWeight(3)
  }

  return (
    <section className={`quadrant ${type}`}>
      <div className="quadrant-header">
        <div className="badge">{config.symbol}</div>
        <div>
          <h2>{config.title}</h2>
          <p>{config.subtitle}</p>
        </div>
      </div>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={config.hint}
          aria-label={`Adicionar item em ${config.title}`}
        />
        <select value={weight} onChange={(event) => setWeight(event.target.value)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <button type="submit" title="Adicionar item">
          <Plus size={18} />
        </button>
      </form>

      <div className="item-list">
        {items.length === 0 && <div className="empty">Nenhum item adicionado.</div>}
        {items.map((item) => (
          <div className="swot-item" key={item.id}>
            <span>{item.text}</span>
            <div className="item-actions">
              <select
                value={item.weight}
                onChange={(event) => onUpdateWeight(type, item.id, Number(event.target.value))}
                aria-label="Alterar peso"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
              <strong>{config.signal}{item.weight}</strong>
              <button onClick={() => onRemove(type, item.id)} title="Remover item">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  const [data, setData] = useState(initialData)
  const [projectName, setProjectName] = useState('Projeto em análise')

  const totals = useMemo(() => {
    const strengths = sum(data.strengths)
    const weaknesses = sum(data.weaknesses)
    const opportunities = sum(data.opportunities)
    const threats = sum(data.threats)
    const positive = strengths + opportunities
    const negative = weaknesses + threats
    const score = positive - negative
    return { strengths, weaknesses, opportunities, threats, positive, negative, score }
  }, [data])

  const status = getStatus(totals.score)
  const pointer = ((clampScore(totals.score) + 25) / 50) * 100

  function addItem(type, item) {
    setData((current) => ({
      ...current,
      [type]: [...current[type], { id: crypto.randomUUID(), ...item }],
    }))
  }

  function removeItem(type, id) {
    setData((current) => ({
      ...current,
      [type]: current[type].filter((item) => item.id !== id),
    }))
  }

  function updateWeight(type, id, weight) {
    setData((current) => ({
      ...current,
      [type]: current[type].map((item) => item.id === id ? { ...item, weight } : item),
    }))
  }

  function resetMatrix() {
    setData({ strengths: [], weaknesses: [], opportunities: [], threats: [] })
  }

  function exportJson() {
    const payload = {
      projectName,
      data,
      totals,
      status: status.label,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'matriz-swot-live.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <div>
          <span className="eyebrow">SWOT Live</span>
          <h1>Matriz SWOT Interativa</h1>
          <p>Preencha a matriz ao vivo e acompanhe a viabilidade estratégica do projeto em tempo real.</p>
        </div>
        <div className="hero-actions">
          <button className="ghost" onClick={toggleFullscreen}><Presentation size={18} /> Apresentar</button>
          <button className="ghost" onClick={exportJson}><Download size={18} /> Exportar</button>
          <button className="danger-btn" onClick={resetMatrix}><RotateCcw size={18} /> Limpar</button>
        </div>
      </header>

      <section className="project-panel">
        <label>
          Nome do projeto
          <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
        </label>
        <div className="formula">
          Índice SWOT = (Forças + Oportunidades) − (Fraquezas + Ameaças)
        </div>
      </section>

      <section className="dashboard">
        <div className={`score-card ${status.className}`}>
          <span>Índice SWOT</span>
          <strong>{totals.score}</strong>
          <h2>{status.label}</h2>
          <p>{status.description}</p>
        </div>

        <div className="gauge-card">
          <div className="gauge-labels">
            <span>Inviável</span>
            <span>Alto Risco</span>
            <span>Viável</span>
            <span>Excelente</span>
          </div>
          <div className="gauge-track">
            <div className="gauge-pointer" style={{ left: `${pointer}%` }} />
          </div>
          <div className="range-labels">
            <span>-25</span><span>-10</span><span>0</span><span>10</span><span>25</span>
          </div>
        </div>

        <div className="mini-cards">
          <div><span>Forças</span><strong>+{totals.strengths}</strong></div>
          <div><span>Oportunidades</span><strong>+{totals.opportunities}</strong></div>
          <div><span>Fraquezas</span><strong>-{totals.weaknesses}</strong></div>
          <div><span>Ameaças</span><strong>-{totals.threats}</strong></div>
        </div>
      </section>

      <section className="matrix-grid">
        {Object.keys(quadrants).map((type) => (
          <QuadrantCard
            key={type}
            type={type}
            items={data[type]}
            onAdd={addItem}
            onRemove={removeItem}
            onUpdateWeight={updateWeight}
          />
        ))}
      </section>

      <section className="teacher-note">
        <h2>Orientação para discussão em sala</h2>
        <p>
          Quando o índice ficar negativo, peça aos alunos que proponham ações para reduzir fraquezas e ameaças.
          Quando o índice ficar positivo, questione se as forças são sustentáveis e se as oportunidades são reais.
        </p>
      </section>
    </main>
  )
}
