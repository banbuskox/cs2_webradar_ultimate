import { useRef, useState } from "react";
import Draggable from "./Draggable"
import Player from "./player";
import Bomb from "./bomb";
import Grenade from "./grenade";
import DroppedWeapon from "./droppedweapons";

const Radar = ({
  playerArray,
  radarImage,
  mapData,
  localTeam,
  averageLatency,
  bombData,
  settings,
  grenadeData,
  droppedWeaponsData,
  tempPlayer
}) => {
  const radarImageRef = useRef();
  const radarContentRef = useRef();
  const [radarScale, setRadarScale] = useState(1);

  const onScroll = (e) => {
    const delta = e.deltaY * -0.001;
    const newScale = radarScale + delta;
    if (newScale>0.3&&newScale<4) setRadarScale(newScale)
  };

  return (
    <div id="radar" className={`relative overflow-hidden origin-center`} ref={radarContentRef}>

      <Draggable
      imgref={radarImageRef.current}
      avrPing={averageLatency}
      radarContentRef={radarContentRef.current}
      >
        <img onWheelCapture={onScroll} ref={radarImageRef} className={`w-full h-auto rounded-[20px] ${bombData && bombData.m_blow_time <= 10 && tempPlayer.m_bomb_damage>=tempPlayer.m_health?`alertAnim`:``}`} src={radarImage} draggable={false} style={{scale: `${radarScale}`, transition: "scale 150ms linear"}}/>
      </Draggable>

      {playerArray && playerArray!=null && playerArray.map((player) => (
        <Player
          key={player.m_idx}
          playerData={player}
          mapData={mapData}
          radarImage={radarImageRef.current}
          radarScale={radarScale}
          localTeam={localTeam}
          averageLatency={averageLatency}
          settings={settings}
          tempPlayer={tempPlayer}
        />
      ))}

      {bombData && (
        <Bomb
          bombData={bombData}
          mapData={mapData}
          radarImage={radarImageRef.current}
          localTeam={localTeam}
          averageLatency={averageLatency}
          settings={settings}
        />
      )}

      {grenadeData && grenadeData["landed"]!=null && settings.showGrenades && grenadeData["landed"].map((grenade) => (
        <Grenade
          key={grenade.m_idx}
          grenadeData={grenade}
          mapData={mapData}
          settings={settings}
          averageLatency={averageLatency}
          radarImage={radarImageRef.current}
          type={"landed"}
        />
      ))}

      {grenadeData && grenadeData["thrown"]!=null && settings.showGrenades && grenadeData["thrown"].map((grenade) => (
        <Grenade
          key={grenade.m_idx}
          grenadeData={grenade}
          mapData={mapData}
          settings={settings}
          averageLatency={averageLatency}
          radarImage={radarImageRef.current}
          type={"thrown"}
        />
      ))}

      {settings.showDroppedWeapons && droppedWeaponsData && droppedWeaponsData!=null && droppedWeaponsData.map((droppedWeapon) => (
        <DroppedWeapon
          key={droppedWeapon.m_idx}
          droppedWeaponData={droppedWeapon}
          mapData={mapData}
          settings={settings}
          averageLatency={averageLatency}
          radarImage={radarImageRef.current}
        />
      ))}

    </div>
  );
};

export default Radar;