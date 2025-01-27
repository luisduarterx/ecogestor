import "@/app/app/estoque/estoque.css";
export default function page() {
  return (
    <>
      <div className="line-estoque">
        <div className="dash-item red">
          <span>1234.05 KG</span>
          <p>Estoque Total</p>
        </div>
        <div className="dash-item blue">
          <span>456.4 KG</span>
          <p>Entrada hoje</p>
        </div>
        <div className="dash-item green">
          <span>13.456,98</span>
          <p>Valor Total</p>
        </div>
      </div>
      <div className="containerMain">oi</div>
    </>
  );
}
