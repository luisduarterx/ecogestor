import { useAuthContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowDown, FaBars, FaBell, FaSearch } from "react-icons/fa";
import { FaArrowDown19, FaX } from "react-icons/fa6";

type Props = {
  menuOpen: boolean;
  setMenu: (x: boolean) => void;
};
export const HeaderPainel = ({ menuOpen, setMenu }: Props) => {
  const router = useRouter();
  const [inputSearch, setInputSearch] = useState("");
  const styleShowMenu = {
    width: menuOpen ? "calc(100% - 300px)" : "100%",
  };
  const [showProfileMenu, setProfileMenu] = useState(false);
  const { user, logout } = useAuthContext();
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
          {showProfileMenu && (
            <div className="profileMenu">
              <ul>
                <li
                  onClick={() => {
                    router.push("/app/profile");
                  }}
                >
                  Minhas informaçoes
                </li>
                <li>Minhas Preferencias</li>
                <li
                  onClick={() => {
                    logout();
                  }}
                >
                  Sair
                </li>
              </ul>
            </div>
          )}

          <img src="/logosymbol.png" className="miniatureProfile" />
          <span>
            {user?.name}
            <i
              onClick={() => {
                setProfileMenu(!showProfileMenu);
              }}
            >
              <FaArrowDown />
            </i>
          </span>
        </div>
      </div>
    </div>
  );
};
