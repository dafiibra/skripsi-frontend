import React from 'react';
import HomeImg from '@/assets/homepage.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section
      className="relative flex flex-col items-start justify-start min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${HomeImg})`,
      }}
    >
      {/* Blue overlay for image */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>

      {/* Main content */}
      <div className="relative z-10 text-left text-white px-7 mt-16 max-w-1xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
          SISTEM INFORMASI GEOGRAFIS <br />
          PENCARI KERJA & LOWONGAN PEKERJAAN DI INDONESIA 
        </h1>
        <p className="text-lg leading-relaxed mb-8 max-w-4xl">
          Selamat datang di situs yang didedikasikan untuk memberikan informasi tentang
          banyaknya pencari kerja yang tak sebanding dengan lowongan pekerjaan. Situs ini
          bertujuan untuk memberikan wawasan, data, dan analisis mendalam mengenai isu
          kemiskinan di berbagai wilayah Indonesia. Dengan adanya informasi ini, diharapkan
          dapat membantu dalam penyusunan kebijakan dan penelitian.
        </p>

        <Link to="/peta">
        <button className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition duration-300">
          Explore Now
        </button>
        </Link>
        
      </div>
    </section>
  );
};

export default Home;    