const labels = {
  forcas: {
    title: "Forças",
    subtitle: "Fatores internos positivos",
    className: "green",
  },
  fraquezas: {
    title: "Fraquezas",
    subtitle: "Fatores internos negativos",
    className: "red",
  },
  oportunidades: {
    title: "Oportunidades",
    subtitle: "Fatores externos positivos",
    className: "blue",
  },
  ameacas: {
    title: "Ameaças",
    subtitle: "Fatores externos negativos",
    className: "orange",
  },
};

export default function Matriz({ data, onRemove, presentation }) {
  return (
    <section className="matrix-grid">
      {Object.keys(labels).map((key) => {
        const info = labels[key];
        const itens = data[key];

        return (
          <article className={`quadrant ${info.className}`} key={key}>
            <div className="quadrant-header">
              <div>
                <h2>{info.title}</h2>
                <p>{info.subtitle}</p>
              </div>
              <span className="counter">{itens.length}</span>
            </div>

            <div className="items-list">
              {itens.length === 0 && (
                <div className="empty">Nenhum item adicionado.</div>
              )}

              {itens.map((item) => (
                <div className="swot-item" key={item.id}>
                  <div>
                    <strong>{item.descricao}</strong>
                    <span>Peso {item.peso}</span>
                  </div>

                  {!presentation && (
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(key, item.id)}
                      title="Remover item"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
