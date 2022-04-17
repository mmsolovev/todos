import React from "react";
import {Link} from "react-router-dom";


function NavbarItem({name, href}) {
    return (
        <li>
          <Link to={href}>{name}</Link>
        </li>
    )
}


function Navbar({navbarItems}) {
    return (
        <nav>
            <ul>
                <li>
                  {navbarItems.map((item) => <NavbarItem name={item.name} href={item.href} />)}
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
