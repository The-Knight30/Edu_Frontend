import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import image1 from "../../../src/assets/card1.jpeg";
import image2 from "../../../src/assets/card2.jpeg";
import image3 from "../../../src/assets/card3.jpeg";
import { Link } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext";
import Wave from "../Shared/Wave";
import AOS from "aos";
import "aos/dist/aos.css";

function AllCourses() {
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  const products = [
    {
      path: "firstgrade",
      imageUrl: image1,
      title: "الصف الأول الثانوي",
      coursStage: 0,
    },
    {
      path: "secondgrade",
      title: "الصف الثاني الثانوي",
      imageUrl: image2,
      coursStage: 1,
    },
    {
      path: "thirdgrade",
      title: "الصف الثالث الثانوي",
      imageUrl: image3,
      coursStage: 2,
    },
  ];

  return (
    <>
      <div className={`${isDarkMode ? "bg-gray-950" : "bg-amber-100"}`}>
        <Wave title="الصفوف الدراسية" />
        <div className="px-4 mt-10 pb-20">
          <div className="grid grid-cols-1 pb-10 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-5 xl:gap-0">
            {products.map((product, index) => (
              <div
                key={index}
                className="w-full max-w-sm relative mb-10 lg:mb-4"
                data-aos="fade-right" 
              >
                <Link
                  to={{
                    pathname: `/${product.path}`,
                  }}
                >
                  <img
                    draggable="false"
                    src={product.imageUrl}
                    className="h-60 lg:h-72 w-full lazy rounded-3xl"
                    alt="course image"
                  />
                </Link>
                <div className="absolute -bottom-5 ms:bottom-4 left-14 sm:left-24">
                  <Link
                    to={{
                      pathname: `/${product.path}`,
                    }}
                  >
                    <h5
                           className={` shadow  px-5 py-4 rounded-[20px] text-center text-xl font-bold transition duration-700 ${
                        isDarkMode
                          ? "bg-neutral-800 text-white hover:bg-neutral-900 "
                          : " bg-stone-50  text-black hover:bg-stone-300 "
                      }`}
                    >
                      {product.title}
                    </h5>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllCourses;
