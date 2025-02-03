import { useState } from "react";
import { FaArrowDown, FaBars, FaBell, FaSearch } from "react-icons/fa";
import { FaArrowDown19 } from "react-icons/fa6";

type Props = {
  menuOpen: boolean;
  setMenu: (x: boolean) => void;
};
export const HeaderPainel = ({ menuOpen, setMenu }: Props) => {
  const [inputSearch, setInputSearch] = useState("");
  const styleShowMenu = {
    width: menuOpen ? "calc(100% - 300px)" : "100%",
  };
  return (
    <div className="headerPainel" style={styleShowMenu}>
      <div className="initialHeader">
        <i onClick={() => setMenu(!menuOpen)}>
          <FaBars />
        </i>

        <div className="search">
          <i>
            <FaSearch />
          </i>

          <input
            type="text"
            placeholder="Pesquisar..."
            value={inputSearch}
            onChange={(e) => {
              setInputSearch(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="menuProfile">
        <i>
          <FaBell />
        </i>
        <div className="barH"></div>
        <div className="profileHeader">
          <img src="/logosymbol.png" className="miniatureProfile" />
          <span>
            Username
            <i>
              <FaArrowDown />
            </i>
          </span>
        </div>
      </div>
    </div>
  );
};
