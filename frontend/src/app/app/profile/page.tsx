export default function Page() {
  return (
    <div className="containerMain">
      <div className="profile">
        <div className="profileHeader">
          <h3>Meus dados</h3>
          <div className="line">&nbsp;</div>
        </div>
        <div className="profileBody">
          <div className="inputGroup">
            <label>Nome:</label>
            <input typeof="text" />
          </div>
          <div className="inputGroup">
            <label>E-mail</label>
            <input typeof="text" />
          </div>
          <div className="inputGroup">
            <label>Telefone:</label>
            <input typeof="text" />
          </div>
        </div>
      </div>
    </div>
  );
}
