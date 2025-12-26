# cs2_webradar

Undetected Counter Strike 2 browser based radar cheat <br>
If you have any suggestions, issues or questions, feel free to join my [Discord](https://discord.gg/AnQeMAP6tR) server or create new issue in "issues" tab.

Credits: [Claudv](https://github.com/clauadv) - Thanks for creating the base


## requirements
- [NodeJS](https://nodejs.org/en/download/current)
- [Visual Studio IDE](https://visualstudio.microsoft.com/vs/community/)

## usage
- in the root folder, run `install.bat` to install dependencies
- in the root folder, run `start.bat` to start the webapp
- in `usermode` project, run `cs2_webradar.sln`
- in visual studio's toolbar, hover on `Build` and press `Build Solution` or press `Ctrl + Shift + B`
- in `release` folder, run `usermode.exe` and, in your browser navigate to `localhost:5173` <br>

## sharing
- after you built `usermode` project, open `config.json` and change `m_use_localhost` to `false`
- in `react` project, `App.jsx` line 10, change `const USE_LOCALHOST = 1;` to `const USE_LOCALHOST = 0;`
- in `react` project, `App.jsx` line 12, change `const PUBLIC_IP = "your ip";` with your ip address
- in `cmd`, type `ipconfig`, find `Default Gateway` and navigate to it in your browser
- in your router configuration, find `Port Forwarding` tab and forward port `22006/tcp` and `5173/tcp`
- now your friends can see the radar by navigating to `your public ip:5173`

## showcase
https://github.com/user-attachments/assets/15cfded6-e452-47bd-b08d-7cc821a70639

## license
this project is licensed under the [GPL-3.0 license](https://github.com/clauadv/cs2_webradar?tab=GPL-3.0-1-ov-file#readme)

## contributors
<a href="https://github.com/banbuskox/cs2_webradar_ultimate/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=banbuskox/cs2_webradar_ultimate" />
</a>
