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
      <nav className="w-full py-3 bg-[#263956] relative z-50">
        <div className="container mx-auto flex justify-between items-center px-4 lg:px-6">
          <div>
            <Link 
              to="/" 
              className="text-lg sm:text-xl font-bold text-secondary hover:text-white transition duration-300"
            >
              VisualJob.ID
            </Link>
          </div> 

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-1 lg:space-x-2">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className="inline-block py-2 px-3 lg:px-4 text-sm lg:text-base text-white hover:text-[#FFA500] font-semibold transition duration-300 rounded-md hover:bg-blue-700"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden" onClick={toggleMenu}>
            <MdMenu className="text-3xl sm:text-4xl cursor-pointer text-white hover:text-[#FFA500] transition duration-300" />
          </div>
        </div>
      </nav>

      {/* Responsive mobile menu */}
      <ResponsiveMenu open={open} toggleMenu={toggleMenu} />
    </>
  );
};

export default Navbar;