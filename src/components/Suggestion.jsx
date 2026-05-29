import { getSuggestion } from "../utils/swotEngine";

export default function Suggestion({ data, totals }) {
  return (
    <section className="suggestion">
      <h3>Sugestão para discussão</h3>
      <p>{getSuggestion(data, totals)}</p>
    </section>
  );
}
