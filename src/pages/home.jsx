import React from 'react';
import HomeImg from '@/assets/job.jpeg';
import PKImg from '@/assets/PK.jpeg';
import LKImg from '@/assets/LK.jpeg';
import { Link } from 'react-router-dom';
import { useTypewriter, Cursor } from 'react-simple-typewriter'; 

const Home = () => {

  const [text] = useTypewriter({
    words: ['PENCARI KERJA & LOWONGAN PEKERJAAN BERDASARKAN GENDER'],
    loop: {}, 
    typeSpeed: 120, 
    deleteSpeed: 50, 
    delaySpeed: 2000, 
  });

  return (
    <div className="min-h-screen flex flex-col bg-blue-900">
      <section
        className="relative flex flex-col items-start justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${HomeImg})`,
        }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-80"></div>

        {/* Main content */}
        <div className="relative z-10 text-left text-white px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-4 sm:mb-6">
            SISTEM INFORMASI GEOGRAFIS <br />
            <span className="text-[#FFA500]">{text}</span> <Cursor cursorStyle='|' />
          </h1>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-none lg:max-w-4xl font-medium">
            Selamat datang di situs yang didedikasikan untuk memberikan informasi tentang
            banyaknya pencari kerja yang tak sebanding dengan lowongan pekerjaan. Situs ini
            bertujuan untuk memberikan wawasan, data, dan analisis susahnya mencari pekerjaan di Indonesia. Dengan adanya informasi ini, diharapkan
            dapat membantu dalam penyusunan kebijakan dan penelitian.
          </p>

          <Link to="/peta">
            <button
              type="button"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 
              focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 
              font-bold rounded-lg text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 text-center transition duration-300 transform hover:scale-105"
            >
              Explore Now
            </button>
          </Link>
        </div>
      </section>

      {/* Cards Section */}
      <section className="bg-blue-800 text-white py-8 sm:py-12 lg:py-16 min-h-screen flex flex-col justify-center">
        <h1 className="text-black-800 text-lg sm:text-xl lg:text-2xl text-center font-bold mb-8 sm:mb-12 px-4">
          SEBENERNYA APA SIH DEFINISI DARI PENCARI KERJA & LOWONGAN KERJA ITU...?
        </h1>
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-gray-800 text-lg sm:text-xl text-center font-semibold mb-3 sm:mb-4">
                Apa sih Pencari Kerja itu?
              </h3>
              <img 
                src={PKImg} 
                alt="Pencari Kerja" 
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-md mb-4 sm:mb-6" 
              />
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Pencari kerja adalah individu yang sedang dalam proses mencari pekerjaan atau posisi pekerjaan yang sesuai dengan keahlian, 
                kualifikasi, dan minatnya. Mereka bisa terdiri dari lulusan baru, individu yang menganggur, atau orang yang sedang mencari perubahan karier. 
                Pencari kerja dapat melibatkan diri dalam berbagai aktivitas, seperti mencari lowongan pekerjaan, menghadiri wawancara, 
                atau memperbarui resume dan portofolio, serta menggunakan platform pencarian kerja, jaringan profesional, 
                atau lembaga tenaga kerja untuk menemukan peluang pekerjaan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-gray-800 text-lg sm:text-xl text-center font-semibold mb-3 sm:mb-4">
                Apa sih Lowongan Kerja itu?
              </h3>
              <img 
                src={LKImg} 
                alt="Lowongan Kerja" 
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-md mb-4 sm:mb-6" 
              />
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Lowongan kerja adalah posisi atau jabatan yang tersedia di suatu perusahaan atau organisasi yang belum terisi dan membutuhkan karyawan atau pekerja baru. 
                Lowongan kerja biasanya diumumkan oleh perusahaan melalui berbagai media, seperti situs web, papan pengumuman, atau platform pencarian kerja, 
                dan mencakup informasi penting seperti deskripsi pekerjaan, kualifikasi yang diperlukan, tanggung jawab, gaji, dan lokasi kerja. 
                Tujuannya adalah untuk menarik pencari kerja yang memiliki keterampilan dan pengalaman yang sesuai untuk mengisi posisi tersebut.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;