import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import { NavbarMenu } from "../mockData/data";

const ResponsiveMenu = ({ open, toggleMenu }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1 , y: 0}}
                    exit={{ opacity: 0, y: -100}}
                    transition={{ duration: 0.5 }}
                    className="fixed top-0 left-0 w-full h-screen z-40 bg-black bg-opacity-50"
                    onClick={toggleMenu}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1 , y: 0}}
                        exit={{ opacity: 0, y: -100}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#263956] text-white py-8 px-6 mx-4 mt-20 rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ul className="flex flex-col justify-center items-center gap-6">
                            {NavbarMenu.map((item) => (
                                <li key={item.id} className="w-full">
                                    <Link
                                        to={item.link}
                                        onClick={toggleMenu}
                                        className="block w-full text-center py-3 px-4 text-lg font-semibold text-white hover:text-[#FFA500] hover:bg-blue-700 rounded-lg transition duration-300"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResponsiveMenu;