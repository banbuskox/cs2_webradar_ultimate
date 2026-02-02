import { useState, useRef } from "react";

const SettingsButton = ({ settings, onSettingsChange, translation, languageOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsMenu = useRef(null);
  const settingsBut = useRef(null);

  const closeSettingsIfOpen = (e)=>{
    if(isOpen && !settingsMenu.current?.contains(e.target) && !settingsBut.current?.contains(e.target)){
      setIsOpen(false)
    }
  }

  document.addEventListener('mousedown',closeSettingsIfOpen)

  return (
    <div className="z-50" ref={settingsBut}>
      {window.innerHeight>600 && (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 transition-all rounded-xl"
      >
        <img className={`w-[1.3rem]`} src={`./assets/icons/cog.svg`} />
        <span className="text-radar-primary">{translation.settings.button}</span>
      </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-black bg-opacity-80 w-80 backdrop-blur-lg rounded-xl p-4 pr-2 shadow-xl border border-radar-secondary/20" ref={settingsMenu}>
          <h3 className="text-radar-primary text-lg font-semibold mb-4">{translation.settings.title}</h3>

          <div className="space-y-3 overflow-y-auto max-h-[715px] h-screen pr-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-radar-secondary text-sm">{translation.settings.map_brightness}</span>
                <span className="text-radar-primary text-sm font-mono">{settings.mapBrightness||100}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="195"
                step="5"
                value={settings.mapBrightness||100}
                onChange={(e) => onSettingsChange({ ...settings, mapBrightness: parseFloat(e.target.value) })}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-radar-primary"
                style={{
                  background: `linear-gradient(to right, #b1d0e7 ${(((settings.mapBrightness||100) - 10) / 190) * 100}%, rgba(59, 130, 246, 0.2) ${(((settings.mapBrightness||100) - 10) / 190) * 100}%)`
                }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-radar-secondary text-sm">{translation.settings.player_dot_size}</span>
                <span className="text-radar-primary text-sm font-mono">{settings.dotSize}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.dotSize}
                onChange={(e) => onSettingsChange({ ...settings, dotSize: parseFloat(e.target.value) })}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-radar-primary"
                style={{
                  background: `linear-gradient(to right, #b1d0e7 ${((settings.dotSize - 0.5) / 1.5) * 100}%, rgba(59, 130, 246, 0.2) ${((settings.dotSize - 0.5) / 1.5) * 100}%)`
                }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-radar-secondary text-sm">{translation.settings.bomb_size}</span>
                <span className="text-radar-primary text-sm font-mono">{settings.bombSize}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.bombSize}
                onChange={(e) => onSettingsChange({ ...settings, bombSize: parseFloat(e.target.value) })}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-radar-primary"
                style={{
                  background: `linear-gradient(to right, #b1d0e7 ${((settings.bombSize - 0.1) / 1.9) * 100}%, rgba(59, 130, 246, 0.2) ${((settings.bombSize - 0.1) / 1.9) * 100}%)`
                }}
              />
            </div>
            
            <div className="space-y-1">

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary_default/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.increase_player_contrast}</span>
                <input
                  type="checkbox"
                  checked={settings.increaseContrast}
                  onChange={(e) => onSettingsChange({ ...settings, increaseContrast: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary_default/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.show_only_enemies}</span>
                <input
                  type="checkbox"
                  checked={settings.showOnlyEnemies}
                  onChange={(e) => onSettingsChange({ ...settings, showOnlyEnemies: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.enemy_names}</span>
                <input
                  type="checkbox"
                  checked={settings.showEnemyNames}
                  onChange={(e) => onSettingsChange({ ...settings, showEnemyNames: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              {(!settings.showOnlyEnemies) && (
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.ally_names}</span>
                <input
                  type="checkbox"
                  checked={settings.showAllNames}
                  onChange={(e) => onSettingsChange({ ...settings, showAllNames: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>
              )}

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.follow_yourself}</span>
                <input
                  type="checkbox"
                  checked={settings.followYourself}
                  onChange={(e) => onSettingsChange({ ...settings, followYourself: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              { settings.followYourself && (
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">ㅤㅤ↑ {translation.settings.follow_yourself_rotation}</span>
                <input
                  type="checkbox"
                  checked={settings.followYourselfRotation}
                  onChange={(e) => onSettingsChange({ ...settings, followYourselfRotation: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>
              )}

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.view_player_cones}</span>
                <input
                  type="checkbox"
                  checked={settings.showViewCones}
                  onChange={(e) => onSettingsChange({ ...settings, showViewCones: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.show_grenades}</span>
                <input
                  type="checkbox"
                  checked={settings.showGrenades}
                  onChange={(e) => onSettingsChange({ ...settings, showGrenades: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              {settings.showGrenades && (
                <div>

                  <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                  <span className="text-radar-secondary text-sm">ㅤㅤ↑ {translation.settings.show_grenades_color}</span>
                  <input
                    type="color"
                    value={settings.thrownGrenadeColor}
                    onChange={(e) => onSettingsChange({ ...settings, thrownGrenadeColor: e.target.value })}
                    className="relative h-5 w-9 rounded-full bg-radar-secondary/0"
                  />
                  </label>

                  <div className="flex justify-between items-center mb-2 mt-1.5 space-y-2">
                  <span className="text-radar-secondary text-sm">ㅤㅤㅤ↑ {translation.settings.show_greandes_size}</span>
                  <span className="text-radar-primary text-sm font-mono">{settings.thrownGrenadeSize}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={settings.thrownGrenadeSize}
                    onChange={(e) => onSettingsChange({ ...settings, thrownGrenadeSize: parseFloat(e.target.value) })}
                    className="w-full ml-11 mb-2 h-2 rounded-lg appearance-none cursor-pointer accent-radar-primary"
                    style={{
                      background: `linear-gradient(to right, #b1d0e7 ${((settings.thrownGrenadeSize - 0.1) / 1.9) * 100}%, rgba(59, 130, 246, 0.2) ${((settings.thrownGrenadeSize - 0.1) / 1.9) * 100}%)`,
                      width: "80%"
                    }}
                  />

                </div>
              )}

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.show_dropped_weapons}</span>
                <input
                  type="checkbox"
                  checked={settings.showDroppedWeapons}
                  onChange={(e) => onSettingsChange({ ...settings, showDroppedWeapons: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
              </label>

              {settings.showDroppedWeapons && (
              <div>

                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">ㅤㅤ↑ {translation.settings.show_dropped_weapons_lighter}</span>
                <input
                  type="checkbox"
                  checked={settings.droppedWeaponGlow}
                  onChange={(e) => onSettingsChange({ ...settings, droppedWeaponGlow: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">ㅤㅤ↑ {translation.settings.show_dropped_weapons_ignore_grenades}</span>
                <input
                  type="checkbox"
                  checked={settings.droppedWeaponIgnoreNade}
                  onChange={(e) => onSettingsChange({ ...settings, droppedWeaponIgnoreNade: e.target.checked })}
                  className="relative h-5 w-9 rounded-full shadow-sm bg-radar-secondary/30 checked:bg-radar-secondary transition-colors duration-200 appearance-none before:absolute before:h-4 before:w-4 before:top-0.5 before:left-0.5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-4"
                />
                </label>

                <div className="flex justify-between items-center mb-2 mt-1.5 space-y-2">
                  <span className="text-radar-secondary text-sm">ㅤㅤㅤ↑ {translation.settings.show_dropped_weapons_size}</span>
                  <span className="text-radar-primary text-sm font-mono">{settings.droppedWeaponSize}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={settings.droppedWeaponSize}
                  onChange={(e) => onSettingsChange({ ...settings, droppedWeaponSize: parseFloat(e.target.value) })}
                  className="w-full ml-11 mb-2 h-2 rounded-lg appearance-none cursor-pointer accent-radar-primary"
                  style={{
                    background: `linear-gradient(to right, #b1d0e7 ${((settings.droppedWeaponSize - 0.1) / 1.9) * 100}%, rgba(59, 130, 246, 0.2) ${((settings.droppedWeaponSize - 0.1) / 1.9) * 100}%)`,
                    width: "80%"
                  }}
                />

              </div>
              )}

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.theme_color_text}</span>
                <select 
                  value={settings.colorScheme} 
                  onChange={(e) => onSettingsChange({ ...settings, colorScheme: e.target.value })} 
                  className="ml-2 bg-radar-panel text-radar-primary rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-radar-primary"
                  style={{
                  background: `rgba(59, 130, 246, 0.2)`,
                  border: `none`
                  }}
                  >
                  <option value="default">{translation.settings.theme_colors.default}</option>
                  <option value="white">{translation.settings.theme_colors.white}</option>
                  <option value="light_blue">{translation.settings.theme_colors.light_blue}</option>
                  <option value="dark_blue">{translation.settings.theme_colors.dark_blue}</option> 
                  <option value="purple">{translation.settings.theme_colors.purple}</option>
                  <option value="red">{translation.settings.theme_colors.red}</option>
                  <option value="orange">{translation.settings.theme_colors.orange}</option>
                  <option value="yellow">{translation.settings.theme_colors.yellow}</option>
                  <option value="green">{translation.settings.theme_colors.green}</option>
                  <option value="light_green">{translation.settings.theme_colors.light_green}</option>
                  <option value="pink">{translation.settings.theme_colors.pink}</option>
                </select>
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-radar-secondary/20 transition-colors cursor-pointer">
                <span className="text-radar-secondary text-sm">{translation.settings.language}</span>
                <select 
                  value={settings.language} 
                  onChange={(e) => onSettingsChange({ ...settings, language: e.target.value })} 
                  className="ml-2 bg-radar-panel text-radar-primary rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-radar-primary"
                  style={{
                  background: `rgba(59, 130, 246, 0.2)`,
                  border: `none`
                  }}
                  >
                    {languageOptions.map((langName) => (
                      <option key={langName} value={langName}>
                    {langName}
          </option>
        ))}
                </select>
              </label>

              <button className="flex items-center justify-center p-3 bg-radar-redbutton rounded-lg hover:bg-radar-redbutton_hover transition-colors cursor-pointer w-full" onClick={(e) => onSettingsChange({ ...settings, whichPlayerAreYou: "0" })}>
                  <span className="text-white text-sm">{translation.settings.choose_yourself_again_button}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;