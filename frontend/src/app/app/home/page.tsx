export default function Home() {
  return (
    <div className="container">
      <h1 className="pageTitle">Dashboard</h1>
      <div className="containerMain">
        <div className="dash-relatory">
          <div className="dash">
            <h2>Total de compras</h2>
            <span>R$ 3534,54</span>
          </div>
          <div className="dash">
            <h2>Total Kg reciclados</h2>
            <span>5345 Tn</span>
          </div>
          <div className="dash">
            <h2>Compras feitas</h2>
            <span>235</span>
          </div>
          <div className="dash">
            <h2>Lucro estimado</h2>
            <span>R$ 9.435,32</span>
          </div>
        </div>
      </div>
    </div>
  );
}
