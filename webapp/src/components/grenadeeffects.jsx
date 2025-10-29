import { useRef } from "react";
import { getRadarPosition, teamEnum } from "../utilities/utilities";

const GrenadeEffects = ({ grenadeData, type, mapData, settings, averageLatency, radarImage }) => {

    const smokeSize = 3;
    const fireSize = 1.3;
    const radarPosition = getRadarPosition(mapData, { x: grenadeData.m_x, y: grenadeData.m_y });

    const grenRef = useRef();
    const grenBounding = (grenRef.current &&
      grenRef.current.getBoundingClientRect()) || { width: 0, height: 0 };

    const radarImageBounding = (radarImage !== undefined &&
      radarImage.getBoundingClientRect()) || { width: 0, height: 0 };

  if (type == "smoke") {
    const radarImageTranslation = {
      x: radarImageBounding.width * radarPosition.x - grenBounding.width * 0.5,
      y: radarImageBounding.width * radarPosition.y - grenBounding.height * 0.5,
    };
    return (
        <div 
        ref={grenRef}
        className={`absolute rounded-[100%] left-0 top-0`}
        style={{
          width: `${smokeSize}vw`,
          height: `${smokeSize}vw`,
          transform: `translate(${radarImageTranslation.x}px, ${radarImageTranslation.y}px)`,
          opacity: `0.7`,
          zIndex: `2`,
        }}
        >

        <div
          className={`absolute origin-center rounded-[100%] bg-gray-500`}
          style={{
            width: `100%`,
            height: `100%`,
            filter: `blur(4px)`,
          }}
        />

        <label
        className={`absolute w-full text-center text-white text-xs font-bold`}
        >

        {Math.round(grenadeData.m_timeleft)}s

        </label>

        </div>
    );
  } else if (type == "molo") {
    const radarImageTranslation = {
      x: radarImageBounding.width * radarPosition.x - grenBounding.width * 0.5,
      y: radarImageBounding.width * radarPosition.y - grenBounding.height * 0.5,
    };
    return ( 
      <div
        ref={grenRef}
        className={`absolute w-full h-full origin-center rounded-[100%] bg-orange-500`}
        style={{
          width: `${fireSize}vw`,
          height: `${fireSize}vw`,
          transform: `translate(${radarImageTranslation.x}px, ${radarImageTranslation.y}px)`,
          filter: `blur(2px)`,
          zIndex: `1`,
        }}
      />
    );
  }
};

export default GrenadeEffects;