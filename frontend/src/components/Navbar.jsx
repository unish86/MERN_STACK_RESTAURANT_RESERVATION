import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
const Navbar = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <nav className="mainNav">
        <div className="logo">ZEESH</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <ScrollLink
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                onClick={() => setShow(false)}
                key={element.id}
              >
                {element.title}
              </ScrollLink>
            ))}
          </div>
          <div className="navActions">
            <ScrollLink
              to="menu"
              spy={true}
              smooth={true}
              duration={500}
              className="menuBtn"
              onClick={() => setShow(false)}
            >
              OUR MENU
            </ScrollLink>
            <RouterLink
              to="/admin"
              className="adminBtn"
              onClick={() => setShow(false)}
            >
              ADMIN
            </RouterLink>
          </div>
        </div>
        <button
          className="hamburger"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
        >
          <GiHamburgerMenu />
        </button>
      </nav>
    </>
  );
};

export default Navbar;
