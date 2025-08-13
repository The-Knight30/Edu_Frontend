
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "./Context/ThemeContext";
import { useLocation } from "react-router-dom";
import DefaultComponet from "./Shared/DefaultComponet";
import SpinnerModal from "./Shared/SpinnerModal";
import Plyr from 'plyr-react'
import 'plyr/dist/plyr.css'
import Wave from "./Shared/Wave";

const MediaHub = () => {
  function getId(videoUrl){
    let id;
    if(videoUrl.includes("v="))
     id=`${videoUrl
      .slice(videoUrl.indexOf("="))
      .split("&")[0]
      .slice(
        1
      )}`
      else{
        const splited=videoUrl.split("/")
        id=splited[splited.length-1].split("?")[0]
      }
      return id 
  }
    const options = {
    youtube: {
      noCookie: true,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1
    },
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'
    ],
    hideControls: ['copyUrl'] // Add this line to hide the copy link button
  }
  const location = useLocation();
  const { videoUrl, pdfUrl, title } = location.state ? location.state : "";

  
  const [isLoading, setIsLoading] = useState(false);

  const preventContextMenu = (event) => {
    event.preventDefault();
  };

  const { isDarkMode } = useContext(ThemeContext);
  const dataFiles = [
    {
      name: "الملفات",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 ml-2 text-green-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      ),
      button: "محتوى الملفات ",
      url: pdfUrl,
    },
  ];




  return (
    <>
      <SpinnerModal isLoading={isLoading} />
      <Wave title={title} />

      <div
        className="pb-10 m-auto lg:w-[50rem]  md:w-[40rem] w-[18rem]"
        onContextMenu={preventContextMenu}
      >
        
        {videoUrl ? (
 
         <div>
        <Plyr
          source={{
            type: 'video',
            sources: [
              {
                src: getId(videoUrl),
                provider: 'youtube'
              }
            ]
          }}
          options={options}
        />
      </div>
        ) : (
          <DefaultComponet text="لا يوجد فيديو" />
        )}
        <div className="mt-10 md:mt-40">
          <h1 className="w-32 h-12 py-2 m-auto text-lg text-center text-yellow-500 bg-green-950 md:h-14 lg:h-16 lg:py-4 rounded-t-xl lg:w-36">
            محتوى الكورس
          </h1>

          <div
            className={`md:p-6 p-4 m-auto rounded-lg md:w-96 ${
              isDarkMode ? "bg-[#1E1F25]" : "bg-white"
            }`}
          >
            {dataFiles.map((data, index) => (
              <div
                className="flex items-center justify-between gap-3 mb-3"
                key={index}
              >
                <a href={data.url} target="_blank">
                  <button className="flex items-center justify-center w-48 font-bold text-white border-8 h-11 border-y-0 border-r-yellow-500 border-l-green-700 rounded-2xl bg-green-950">
                    <span>{data.button}</span>
                    {data.icon}
                  </button>
                </a>
                <p
                  className={`md:px-4 md:py-2 leading-10 font-bold text-center shadow-md w-28 bg-gray-50 rounded-xl ${
                    isDarkMode ? "bg-yellow-500 text-white" : "bg-gray-50"
                  }`}
                >
                  {data.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaHub;