//import { GiPirateFlag } from "react-icons/gi";
import { SiLbry, SiIpfs } from "react-icons/si";
import { GiPopcorn } from "react-icons/gi";
import { FaYoutube } from "react-icons/fa";
import { MdHome } from "react-icons/md";

import "./sidebar.scss"

const Sidebar = ({ sidebar }) => {
  return (
    <nav className={sidebar ? "sidebar" : "sidebar_closed"}>
      {sidebar && (
        <>
          <a href="/">
            <li>
              <MdHome size={23} />
              <span>Home</span>
            </li>
          </a>
          <a href="/lb">
            <li>
              <SiLbry size={23} />
              <span>Lbry / Odysee</span>
            </li>
          </a>
          <a href="/yt">
            <li>
              <FaYoutube size={23} />
              <span>YouTube</span>
            </li>
          </a>
          {/*
          <a href="/pb">
            <li>
              <GiPirateFlag size={23} />
              <span>The Pirate Bay</span>
            </li>
          </a>
          */}
          <a href="/pt">
            <li>
              <GiPopcorn size={23} />
              <span>Popcorn Time</span>
            </li>
          </a>
          <a href="/ip">
            <li>
              <SiIpfs size={23} />
              <span>IPFS</span>
            </li>
          </a>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
