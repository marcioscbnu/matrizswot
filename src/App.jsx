import { useMemo, useState } from "react";
import Formulario from "./components/Formulario";
import Matriz from "./components/Matriz";
import Score from "./components/Score";
import Suggestion from "./components/Suggestion";
import { calculateSwot, initialSwot } from "./utils/swotEngine";

export default function App() {
  const [data, setData] = useState(initialSwot);
  const [presentation, setPresentation] = useState(false);

  const totals = useMemo(() => calculateSwot(data), [data]);

  function addItem(item) {
    setData((current) => ({
      ...current,
      [item.categoria]: [...current[item.categoria], item],
    }));
  }

  function removeItem(categoria, id) {
    setData((current) => ({
      ...current,
      [categoria]: current[categoria].filter((item) => item.id !== id),
    }));
  }

  function clearMatrix() {
    if (confirm("Deseja limpar toda a matriz SWOT?")) {
      setData(initialSwot);
    }
  }

  return (
    <main className={presentation ? "app presentation" : "app"}>
      <header className="hero">
        <div>
          <span className="eyebrow">Empreendedorismo • Planejamento • Projetos</span>
          <h1>SWOT Live MVP</h1>
          <p>
            Preencha a matriz SWOT ao vivo e acompanhe a reação do score de viabilidade do projeto em tempo real.
          </p>
        </div>

        <div className="actions">
          <button className="btn ghost" onClick={() => setPresentation(!presentation)}>
            {presentation ? "Sair da apresentação" : "Modo apresentação"}
          </button>

          {!presentation && (
            <button className="btn danger-outline" onClick={clearMatrix}>
              Limpar matriz
            </button>
          )}
        </div>
      </header>

      {!presentation && <Formulario onAdd={addItem} />}

      <div className="dashboard">
        <div className="left">
          <Matriz data={data} onRemove={removeItem} presentation={presentation} />
        </div>

        <aside className="right">
          <Score totals={totals} />
          {!presentation && <Suggestion data={data} totals={totals} />}
        </aside>
      </div>
    </main>
  );
}
