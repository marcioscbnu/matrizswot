import { useState } from "react";

export default function Formulario({ onAdd }) {
  const [descricao, setDescricao] = useState("");
  const [peso, setPeso] = useState(3);
  const [categoria, setCategoria] = useState("forcas");

  function handleSubmit(event) {
    event.preventDefault();

    const texto = descricao.trim();
    if (!texto) return;

    onAdd({
      id: crypto.randomUUID(),
      descricao: texto,
      peso: Number(peso),
      categoria,
    });

    setDescricao("");
    setPeso(3);
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <div className="field large">
        <label>Item da SWOT</label>
        <input
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Ex.: Equipe qualificada, pouca experiência..."
        />
      </div>

      <div className="field small">
        <label>Peso</label>
        <select value={peso} onChange={(event) => setPeso(event.target.value)}>
          <option value="1">1 - Baixo</option>
          <option value="2">2</option>
          <option value="3">3 - Médio</option>
          <option value="4">4</option>
          <option value="5">5 - Alto</option>
        </select>
      </div>

      <div className="field medium">
        <label>Categoria</label>
        <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
          <option value="forcas">Força</option>
          <option value="fraquezas">Fraqueza</option>
          <option value="oportunidades">Oportunidade</option>
          <option value="ameacas">Ameaça</option>
        </select>
      </div>

      <button className="btn primary" type="submit">
        Adicionar
      </button>
    </form>
  );
}
