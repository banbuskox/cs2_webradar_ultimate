import { useState, useEffect } from "react";
import MaskedIcon from "./maskedicon";
import { playerColors, teamEnum, colorSchemePallette } from "../utilities/utilities";

const PlayerCard = ({ playerData, isOnRightSide, settings }) => {
  const [modelName, setModelName] = useState(playerData.m_model_name);

  function getArmor(armor) {
    if (armor<=100 && armor>0) {
      return armor;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    if (playerData.m_model_name&&!playerData.m_is_dead)
      setModelName(playerData.m_model_name);
    else
      setModelName("cs_observer");
  }, [playerData.m_model_name, playerData.m_is_dead]);

  return (
    <li
      style={{ opacity: `${(playerData.m_is_dead && `0.4`) || `1`}` }}
      className={`flex ${isOnRightSide && (`flex-row-reverse`)} hover:cursor-pointer hover:bg-radar-secondary/20 transition-colors py-1 px-1 rounded-[30px]`}
      onClick={() =>
        window.open(
          `https://steamcommunity.com/profiles/${playerData.m_steam_id}`,
          "_blank",
          "noopener,noreferrer"
        )
      }
    >
      <div className={`flex items-center ${isOnRightSide?(`ml-4`):(`mr-4`)}`}>

        <div
          className={`flex flex-col justify-center items-center`}
        >
          {playerData.m_name}
          <div className="flex">
          <img
            className={`h-[8rem] rounded-[30px] ${isOnRightSide && `scale-x-[-1]`}`}
            src={`./assets/characters/${modelName}.png`}
            style={{backgroundColor:`${playerData.m_color>4?(isOnRightSide?playerColors[0]:playerColors[2]):playerColors[playerData.m_color]}`}}
          ></img>
          <img
            className={`h-[8rem] absolute ${isOnRightSide && `scale-x-[-1]`}`}
            src={`./assets/icons/blind.png`}
            style={{
              backgroundColor:playerColors[playerData.m_color], 
              borderRadius:'30px', 
              transition: `opacity 100ms linear`,
              opacity:`${playerData.m_flashed}`}}
          ></img>
          </div>

        </div>

      </div>

      <div
        className={`flex flex-col ${
          isOnRightSide && `flex-row-reverse`
        } justify-center gap-2`}
      >
        <span
          className={`${isOnRightSide && `flex justify-end`} text-radar-green`}
        >
          ${playerData.m_money}
        </span>

        <div className={`flex ${isOnRightSide && `flex-row-reverse`} gap-2`}>
          <div className="flex gap-[4px] items-center">
            <MaskedIcon
              path={`./assets/icons/health.svg`}
              height={16}
              color={`${colorSchemePallette[settings.colorScheme][1]}`}
            />
            <div className="w-20 h-4 bg-neutral-700 overflow-hidden rounded-[5px] relative">
              <div
                className={`h-full rounded-[5px] absolute`}
                style={{ width: `${playerData.m_health}%`, backgroundColor: `rgb(170,0,0)`,transition: `width 200ms ease-in-out`, transitionDelay: `2s`}}
              />
              <div
                className={`h-full transition-all rounded-[5px] absolute`}
                style={{ width: `${playerData.m_health}%`, backgroundColor: colorSchemePallette[settings.colorScheme][1] }}
              />
            </div>
            <span className="text-radar-primary">{playerData.m_health}</span>
          </div>

          <div className="flex gap-[4px] items-center">
            <MaskedIcon
              path={`./assets/icons/${
                (playerData.m_has_helmet && `kevlar_helmet`) || `kevlar`
              }.svg`}
              height={16}
              color={`${colorSchemePallette[settings.colorScheme][1]}`}
            />
            <span className="text-radar-primary">{getArmor(playerData.m_armor)}</span>
          </div>
        </div>

        <div className={`flex ${isOnRightSide && `flex-row-reverse`} gap-3`}>
          {playerData.m_weapons && playerData.m_weapons.m_primary && (
            <MaskedIcon
              path={`./assets/icons/${playerData.m_weapons.m_primary}.svg`}
              height={28}
              color={`${
                (playerData.m_weapons.m_active ==
                  playerData.m_weapons.m_primary &&
                  `${colorSchemePallette[settings.colorScheme][0]}`) ||
                `${colorSchemePallette[settings.colorScheme][1]}`
              }`}
            />
          )}

          {playerData.m_weapons && playerData.m_weapons.m_secondary && (
            <MaskedIcon
              path={`./assets/icons/${playerData.m_weapons.m_secondary}.svg`}
              height={28}
              color={`${
                (playerData.m_weapons.m_active ==
                  playerData.m_weapons.m_secondary &&
                  `${colorSchemePallette[settings.colorScheme][0]}`) ||
                `${colorSchemePallette[settings.colorScheme][1]}`
              }`}
            />
          )}

          {playerData.m_weapons &&
            playerData.m_weapons.m_melee &&
            playerData.m_weapons.m_melee.map((melee) => (
              <MaskedIcon
                key={melee}
                path={`./assets/icons/${melee}.svg`}
                height={28}
                color={`${
                  (playerData.m_weapons.m_active == melee &&
                    `${colorSchemePallette[settings.colorScheme][0]}`) ||
                  `${colorSchemePallette[settings.colorScheme][1]}`
                }`}
              />
            ))}
        </div>

        <div className={`flex flex-col relative`}>
          <div
            className={`flex ${
              isOnRightSide && `flex-row-reverse`
            } gap-9 mt-3 items-center`}
          >
            {playerData.m_weapons &&
              playerData.m_weapons.m_utilities &&
              playerData.m_weapons.m_utilities.map((utility) => (
                <MaskedIcon
                  key={utility}
                  path={`./assets/icons/${utility}.svg`}
                  height={28}
                  color={`${
                    (playerData.m_weapons.m_active == utility &&
                      `${colorSchemePallette[settings.colorScheme][0]}`) ||
                    `${colorSchemePallette[settings.colorScheme][1]}`
                  }`}
                />
              ))}

            {[
              ...Array(
                Math.max(
                  4 -
                    ((playerData.m_weapons &&
                      playerData.m_weapons.m_utilities &&
                      playerData.m_weapons.m_utilities.length) ||
                      0),
                  0
                )
              ),
            ].map((_, i) => (
              <div
                key={i}
                className={`rounded-full w-[6px] h-[6px]`}
                style = {{backgroundColor:colorSchemePallette[settings.colorScheme][1]}}
              ></div>
            ))}

            {(playerData.m_team == teamEnum.counterTerrorist &&
              playerData.m_has_defuser && (
                <MaskedIcon
                  path={`./assets/icons/defuser.svg`}
                  height={28}
                  color={`${colorSchemePallette[settings.colorScheme][1]}`}
                />
              )) ||
              (playerData.m_team == teamEnum.terrorist &&
                playerData.m_has_bomb && (
                  <MaskedIcon
                    path={`./assets/icons/c4.svg`}
                    height={28}
                    color={
                      ((playerData.m_weapons &&
                        playerData.m_weapons.m_active) == `c4` &&
                        `${colorSchemePallette[settings.colorScheme][0]}`) ||
                      `${colorSchemePallette[settings.colorScheme][1]}`
                    }
                  />
                ))}
          </div>
        </div>
      </div>
    </li>
  );
};

export default PlayerCard;
