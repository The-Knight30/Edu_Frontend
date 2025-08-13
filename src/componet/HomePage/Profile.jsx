import React, { useContext, useEffect } from "react";
import profileImage from "../../assets/profile.png";
import { ThemeContext } from "../Context/ThemeContext";
import AOS from "aos";
import "aos/dist/aos.css";

function Profile() {
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    AOS.init(); 
  }, []);

  return (
    <>
      <section
        className={`relative pt-8 ${isDarkMode ? "bg-neutral-900" : "bg-gradient-to-b from-amber-500 to-white"
          }`}
      >
        <div className="grid pt-4 md:grid-cols-10">
          <div className=" md:col-start-1 md:col-span-4 lg:col-start-3 lg:col-span-3">
            <img
              src={profileImage}
              alt="Mr.Ahmed Gaber"
              className="p-6 xl:p-10 "
              loading="lazy"
            />
          </div>
          <div>
            <div className="md:absolute md:top-48 xl:top-80">
              <div className="flex justify-center justify-items-center">
                <span
                  className={`${isDarkMode ? "text-white" : "text-black"
                    } text-2xl md:text-4xl lg:text-5xl font-black font-inter`}
                >
                  Mr.Ahmed
                </span>
                <span
                  className={`${isDarkMode ? "text-amber-400" : ""
                    } text-2xl md:text-4xl lg:text-5xl font-black font-inter`}
                >
                  {" "}
                </span>
                <span
                  className={`${isDarkMode ? "text-amber-400" : "text-black"
                    } text-2xl md:text-4xl lg:text-5xl font-black font-inter ml-2`}
                >
                  Gaber
                </span>
              </div>
              <div className="flex justify-center pb-5 mt-5 justify-items-center">
                <h2
                  className={`${isDarkMode ? "text-amber-400" : "text-gray-950 dark:text-white"
                    } font-normal text-3xl md:text-4xl font-freehand`}
                >
                  The Knight
                </h2>
                <span className={`${isDarkMode ? "text-white" : "text-black"
                  } text-base md:text-2xl font-normal leading-normal ml-3 mt-1`}>
                  Platform in English.
                  <br />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
