import React from "react";
import { NavbarMenu } from "../mockData/data";
import { MdMenu } from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  // Toggle menu function
  const toggleMenu = () => {
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <>
      <nav className="w-full py-3 bg-red-100">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-2xl font-bold uppercase text-secondary hover:text-primary transition duration-300">
            SIG
          </Link>

          {/* Right-aligned desktop menu */}
          <div className="hidden md:block">
            <ul className="flex items-center">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className="inline-block py-1 px-3 hover:text-primary font-semibold transition duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden" onClick={toggleMenu}>
            <MdMenu className="text-4xl cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Responsive mobile menu */}
      <ResponsiveMenu open={open} toggleMenu={toggleMenu} />
    </>
  );
};

export default Navbar;