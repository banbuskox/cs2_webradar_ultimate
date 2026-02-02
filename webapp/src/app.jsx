import { useEffect, useState, useMemo } from "react";
import "./App.css";
import PlayerCard from "./components/playercard";
import Radar from "./components/radar";
import { getLatency, Latency } from "./components/latency";
import MaskedIcon from "./components/maskedicon";
import { colorSchemePallette } from "./utilities/utilities";

const CONNECTION_TIMEOUT = 5000;

/* change this to '1' if you want to use offline (your own pc only) */
const USE_LOCALHOST = 0;

/* you can get your public ip from https://ipinfo.io/ip */
const PUBLIC_IP = "PUBLIC_IP".trim();
const PORT = 22006;












let tempPlayer_ = null;
let languageData = {"choosing_yourself":{"main":"Select Yourself","explanation":"This is used for some features.","warning":"Please choose <b>YOURSELF</b>!"},"settings":{"button":"Settings","title":"Radar Settings","map_brightness":"Map Brightness","player_dot_size":"Player Dot Size","bomb_size":"Bomb Size","increase_player_contrast":"Increase Player Contrast","show_only_enemies":"Show Only Enemies","enemy_names":"Enemy Names","ally_names":"Ally Names","follow_yourself":"Follow Yourself","follow_yourself_rotation":"Follow Rotation","view_player_cones":"View Player Cones","show_grenades":"Show Grenades","show_grenades_color":"Grenade Color","show_greandes_size":"Grenade Size","show_dropped_weapons":"Show Dropped Weapons","show_dropped_weapons_lighter":"Use Lighter Color","show_dropped_weapons_ignore_grenades":"Ignore Grenades","show_dropped_weapons_size":"Weapon Size","language":"Language","theme_color_text":"Theme Color","theme_colors":{"default":"Default","white":"White","light_blue":"Light Blue","dark_blue":"Dark Blue","purple":"Purple","red":"Red","orange":"Orange","yellow":"Yellow","green":"Green","light_green":"Light Green","pink":"Pink"},"choose_yourself_again_button":"Choose Yourself Again"},"bomb_timer":{"lethal":"LETHAL"},"radar_messages":{"public_ip_not_set":["A public IP address is required! Currently detected IP (",") is a private/local IP"],"websocket_connection_failed":["WebSocket connection to '","' failed. Please check the IP address and try again."],"unsupported_map":"Current map is unsupported.","connected":"Connected! Please wait for the host to join match."}}

const EFFECTIVE_IP = USE_LOCALHOST ? "localhost" : PUBLIC_IP.match(/[a-zA-Z]/) ? window.location.hostname : PUBLIC_IP;

const DEFAULT_SETTINGS = {
  dotSize: 1,
  bombSize: 0.5,
  showAllNames: false,
  showEnemyNames: true,
  showViewCones: false,
  showOnlyEnemies: false,
  followYourself: false,
  followYourselfRotation: false,
  showDroppedWeapons: true,
  droppedWeaponSize: 0.5,
  droppedWeaponGlow: true,
  droppedWeaponIgnoreNade: false,
  showGrenades: true,
  thrownGrenadeSize: 0.5,
  thrownGrenadeColor: "#FF0000",
  whichPlayerAreYou: "0",
  mapBrightness: 100,
  increaseContrast: false,
  colorScheme: "default",
  language: "English",
  settings_version: "1.1"
};

const loadSettings = () => {
  const savedSettings = localStorage.getItem("radarSettings");
  let parsedSettings = JSON.parse(savedSettings);
  loadLanguageFile(parsedSettings ? parsedSettings.language : DEFAULT_SETTINGS.language);
  return (savedSettings && parsedSettings.settings_version && parsedSettings.settings_version == DEFAULT_SETTINGS.settings_version) ? parsedSettings : DEFAULT_SETTINGS;
};

const loadLanguageFile = async (language) => {
  await fetch(`/lang/${language}.json`).then((res) => res.text()).then((text) => languageData = JSON.parse(text))
}

const LanguageSelectionModal = ({ languages, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-[100]">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 max-w-[90vw] border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Select Language</h2>
                <ul className="max-h-60 overflow-y-auto pr-2 space-y-2">
                    {languages
                    .map((lang) => (
                        <li 
                            key={lang} 
                            onClick={() => onSelect(lang)}
                            className="p-3 bg-gray-700 hover:bg-radar-blue text-white rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center"
                        >
                            <span className="font-medium truncate">{lang}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const PlayerSelectionModal = ({ players, onSelect, localTeam, translation }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-[100]">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 max-w-[90vw] border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">{translation.choosing_yourself.main}</h2>
                <p className="text-sm text-gray-400 mb-6">{translation.choosing_yourself.explanation} <br></br> <a dangerouslySetInnerHTML={{ __html: translation.choosing_yourself.warning }} /></p>
                <ul className="max-h-60 overflow-y-auto pr-2 space-y-2">
                    {players
                    .filter(player => player.m_steam_id !== "0")
                    .filter(player => player.m_team === localTeam)
                    .map((player) => (
                        <li 
                            key={player.m_steam_id} 
                            onClick={() => onSelect(player.m_steam_id)}
                            className="p-3 bg-gray-700 hover:bg-radar-blue text-white rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center"
                        >
                            <span className="font-medium truncate">{player.m_name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full`}>
                                {player.m_steam_id}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const App = () => {
  const [averageLatency, setAverageLatency] = useState(0);
  const [playerArray, setPlayerArray] = useState([]);
  const [grenadeData, setGrenadeData] = useState([]);
  const [droppedWeaponsData, setDroppedWeaponsData] = useState([]);
  const [mapData, setMapData] = useState();
  const [localTeam, setLocalTeam] = useState();
  const [bombData, setBombData] = useState();
  const [settings, setSettings] = useState(loadSettings());
  const [translation, updateTranslation] = useState(languageData);
  const [showPlayerPrompt, setShowPlayerPrompt] = useState(false);
  const [showLangPrompt, setShowLangPrompt] = useState(false);
  const [radarScale, setRadarScale] = useState(1);

  const radarZoom = (e) => {
    const delta = e.deltaY * -0.001;
    const newScale = radarScale + delta;
    if (newScale>0.3&&newScale<4) setRadarScale(newScale)
  };

  const langFiles = import.meta.glob('/public/lang/*.json', { query: '?url', import: 'default' });
  const languageOptions = useMemo(() => {
    return Object.keys(langFiles).map((path) => {
      const fileName = path.split('/').pop();
      return fileName.replace('.json', '');
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("radarSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    loadLanguageFile(settings.language).then(() => {
      updateTranslation(languageData);
    });
  }, [settings.language]);

  useEffect(() => {
      if (settings.whichPlayerAreYou === "0" && playerArray.length > 0 || settings.whichPlayerAreYou === undefined && playerArray.length > 0 ) {
          setShowLangPrompt(true);
      } else if (settings.whichPlayerAreYou !== "0" && settings.whichPlayerAreYou !== undefined) {
          setShowLangPrompt(false);
      }
    }, [playerArray, settings.whichPlayerAreYou]);

  const handlePlayerSelect = (playerIdx) => {
    setSettings((prevSettings) => ({
        ...prevSettings,
        whichPlayerAreYou: playerIdx,
    }));
    setShowPlayerPrompt(false);
  };

  const handleLangSelect = (lang) => {
    setSettings((prevSettings) => ({
        ...prevSettings,
        language: lang,
    }));
    setShowLangPrompt(false);
    setShowPlayerPrompt(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      let webSocket = null;
      let webSocketURL = null;
      let connectionTimeout = null;

      if (PUBLIC_IP.startsWith("192.168")) {
        document.getElementsByClassName(
          "radar_message"
        )[0].textContent = `${translation.radar_messages.public_ip_not_set[0]}${PUBLIC_IP}${translation.radar_messages.public_ip_not_set[1]}`;
        return;
      }

      if (!webSocket) {
        try {
          if (USE_LOCALHOST) {
            webSocketURL = `ws://localhost:${PORT}/cs2_webradar`;
          } else {
            webSocketURL = `ws://${EFFECTIVE_IP}:${PORT}/cs2_webradar`;
          }

          if (!webSocketURL) return;
          webSocket = new WebSocket(webSocketURL);
        } catch (error) {
          document.getElementsByClassName(
            "radar_message"
          )[0].textContent = `${error}`;
        }
      }

      connectionTimeout = setTimeout(() => {
        webSocket.close();
      }, CONNECTION_TIMEOUT);

      webSocket.onopen = async () => {
        clearTimeout(connectionTimeout);
        console.info("connected to the web socket");
      };

      webSocket.onclose = async () => {
        clearTimeout(connectionTimeout);
        console.error("disconnected from the web socket");
      };

      webSocket.onerror = async (error) => {
        clearTimeout(connectionTimeout);
        document.getElementsByClassName(
          "radar_message"
        )[0].textContent = `${translation.radar_messages.websocket_connection_failed[0]}${webSocketURL}${translation.radar_messages.websocket_connection_failed[1]}`;
        console.error(error);
      };

      webSocket.onmessage = async (event) => {
        setAverageLatency(getLatency());

        const parsedData = JSON.parse(await event.data.text());
        setLocalTeam(parsedData.m_local_team);
        setBombData(parsedData.m_bomb);
        setGrenadeData(parsedData.m_grenades);
        setDroppedWeaponsData(parsedData.m_dropped_weapons);

        const map = parsedData.m_map;
        if (map !== "invalid") {
          if ((await fetch(`data/${map}/data.json`)).status == 200) {
            setPlayerArray(parsedData.m_players);
            setMapData({
              ...(await (await fetch(`data/${map}/data.json`)).json()),
              name: map,
            }); 
            document.body.style.backgroundImage = `url(./data/${map}/background.png)`;
          } else {
            setMapData({ name: "unsupported" });
            setPlayerArray([]);
            document.body.style.backgroundImage = `url(./data/de_mirage/background.png)`;
          }
        } else {
          setMapData({ name: "invalid" });
          setPlayerArray([]);
          document.body.style.backgroundImage = `url(./data/de_mirage/background.png)`;
        }
      };
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);
  
  if (playerArray && playerArray.length > 0) {
    tempPlayer_ = playerArray.find((player) => player.m_steam_id === settings.whichPlayerAreYou);
  }

  return (
    <div className="w-screen h-screen flex flex-col"
      style={{
        background: `radial-gradient(50% 50% at 50% 50%, rgba(20, 40, 55, 0.95) 0%, rgba(7, 20, 30, 0.95) 100%)`,
        backdropFilter: `blur(7.5px)`,
      }}
    >
        {showLangPrompt && (
            <LanguageSelectionModal
                languages={languageOptions}
                onSelect={handleLangSelect}
            />
        )}
        {showPlayerPrompt && playerArray.length > 0 && (
            <PlayerSelectionModal 
                players={playerArray} 
                onSelect={handlePlayerSelect} 
                localTeam={localTeam}
                translation={translation}
            />
        )}

      <div className={`w-full h-full flex flex-col justify-center overflow-hidden relative`} style={{transform: "rotate(0deg)"}}>
        {bombData && bombData.m_blow_time > 0 && !bombData.m_is_defused && (
          <div className={`absolute left-1/2 top-2 flex-col items-center gap-1 z-50`}>
            <div className={`flex justify-center items-center gap-1`}>
              <MaskedIcon
                path={`./assets/icons/c4_sml.png`}
                height={32}
                color={
                  (bombData.m_is_defusing &&
                    bombData.m_blow_time - bombData.m_defuse_time > 0 &&
                    `#00FF00`) ||
                  (bombData.m_blow_time - bombData.m_defuse_time < 0 &&
                    `#FF0000`) ||
                  `${colorSchemePallette[settings.colorScheme][1]}`
                }
              />
              <span>{`${bombData.m_blow_time.toFixed(1)}s ${(bombData.m_is_defusing &&
                `(${bombData.m_defuse_time.toFixed(1)}s)`) ||
                ""
                }`}</span>
            </div>
            {(tempPlayer_ && !tempPlayer_.m_is_dead &&
                  <div className={`flex justify-center`} style={{color: (() => {
                    const ratio = tempPlayer_.m_bomb_damage / tempPlayer_.m_health;

                    if (ratio >= 1.0) {
                      return 'rgb(255, 0, 0)';
                    } else if (ratio >= 0.5) {
                      const decimal = (ratio - 0.5) * 2;
                      return `rgb(255, ${Math.floor(255 * (1 - decimal))}, 0)`;
                    } else {
                      const decimal = ratio * 2;
                      return `rgb(${Math.floor(255 * decimal)}, 255, 0)`;
                    }
                  })(),
                  fontWeight: (() => {
                    const ratio = tempPlayer_.m_bomb_damage / tempPlayer_.m_health;
                    return ratio >= 1.0 ? `bold` : `normal`;
                  })()
                  }}>{`${tempPlayer_.m_bomb_damage<tempPlayer_.m_health?tempPlayer_.m_bomb_damage<7?`0 HP`:`-${tempPlayer_.m_bomb_damage} HP`:`⚠️ ${translation.bomb_timer.lethal} ⚠️`}`}</div>
                )}
          </div>
        )}

        <div className={`flex items-center justify-evenly`}>
          <Latency
            value={averageLatency}
            settings={settings}
            setSettings={setSettings}
            translation={translation}
            languages={languageOptions}
          />

          <ul 
            id="terrorist" 
            className="lg:flex hidden flex-col gap-1 m-0 p-0 w-[48vh]"
          >
            {(playerArray && playerArray.length > 0 && playerArray
              .filter((player) => player.m_team == 2)
              .map((player) => (
                <PlayerCard
                  isOnRightSide={false}
                  key={player.m_idx}
                  playerData={player}
                  settings={settings}
                />
              )))}
          </ul>

          {(playerArray && playerArray.length > 0 && mapData && mapData.name !== "invalid" && mapData.name !== "unsupported" && settings.whichPlayerAreYou && (
            <div className="flex flex-col items-center gap-2">
              <div>
                <Radar
                  playerArray={playerArray}
                  radarImage={(tempPlayer_ && (mapData.leveling && tempPlayer_.m_position.z < mapData.level_change) ? `./data/${mapData.name}/radar_lower.png` : `./data/${mapData.name}/radar.png`)}
                  mapData={mapData}
                  localTeam={localTeam}
                  averageLatency={averageLatency}
                  bombData={bombData}
                  settings={settings}
                  grenadeData={grenadeData}
                  droppedWeaponsData={droppedWeaponsData}
                  tempPlayer={tempPlayer_}
                  radarZoom={radarZoom}
                  radarScale={radarScale}
                />
              </div>
              <input
                  type="range"
                  min="0.3"
                  max="4"
                  step="0.1"
                  value={radarScale||1}
                  onChange={(e) => { setRadarScale(parseFloat(e.target.value)) }}
                  className="relative w-full h-2 rounded-lg appearance-none cursor-pointer accent-radar-primary"
                  style={{
                    background: `linear-gradient(to right, #b1d0e7 ${(((radarScale||1) - 0.3) / 3.7) * 100}%, rgba(59, 130, 246, 0.2) ${(((radarScale||1) - 0.3) / 3.7) * 100}%)`
                  }}
                />
            </div>
          )) || (mapData && mapData.name === "unsupported" && (
            <div id="radar" className={`relative overflow-hidden origin-center`}>
              <h1 className="radar_message">
                {translation.radar_messages.unsupported_map}
              </h1>
            </div>
          )) || (
              <div id="radar" className={`relative overflow-hidden origin-center`}>
                <h1 className="radar_message">
                  {translation.radar_messages.connected}
                </h1>
              </div>
            )}

          <ul
            id="counterTerrorist"
            className="lg:flex hidden flex-col gap-1 m-0 p-0 w-[48vh]"
          >
            {(playerArray && playerArray.length > 0 && playerArray
              .filter((player) => player.m_team == 3)
              .map((player) => (
                <PlayerCard
                  isOnRightSide={true}
                  key={player.m_idx}
                  playerData={player}
                  settings={settings}
                />
              )))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;