const Wave = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 230">
      <path
        fill="#FDB62F"
        fillOpacity="1"
        d="M0,224L80,186.7C160,149,320,75,480,74.7C640,75,800,149,960,181.3C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
      ></path>
      <text
        className="text-centertext-white text-[60px] font-bold font-playfair leading-normal "
        x="80%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#FFFFFF"
        
      >
        {props.title}
      </text>
    </svg>
  );
};

export default Wave;
