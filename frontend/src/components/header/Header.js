import { AiOutlineSearch } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { FaBars } from "react-icons/fa"
import { useState } from "react";

import "./header.scss";

const Header = ({ handleToggleSidebar }) => {
  const [ input, setInput ] = useState();
  const history = useHistory();

  const handleSearch = search => {
    search.preventDefault()
    history.push(`/search/${input}`)
  }

  return (
    <div className="header">
      <FaBars className="header_menu" size={26} onClick={() => handleToggleSidebar()} />
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Search" value={input} onChange={search => setInput(search.target.value)} />
        <button type="submit">
          <AiOutlineSearch size={22} />
        </button>
      </form>
    </div>
  );
};

export default Header;
