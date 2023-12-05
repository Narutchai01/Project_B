import GameBoard from "./GameBoard";
import axios from "axios";
import { useState} from "react";
import { useParams } from "react-router-dom";

import "./GamePage.css";
import { IoMenu } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlineRestartAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const navigate = useNavigate();

  const gameDifficulty = {
    beginner: {
      size: 5,
      mine: 22,
    },
    intermediate: {
      size: 7,
      mine: 60,
    },
    expert: {
      size: 9,
      mine: 111,
    },
  };

  const { mode, username } = useParams();
  const [state, setState] = useState("NONE");
  const [time, setTime] = useState(0);
  const [flagNum, setFlagNum] = useState(0);
  const [checkMenu, setCheckMenu] = useState(false);

  let totalRevealedCell = 0;
  const addTotalRevealedCell = (num) => {
    totalRevealedCell += num;
  };

  let gameData = {
    setTime: setTime,
    setAppState: setState,
    setFlagNum: setFlagNum,
    size: gameDifficulty[mode].size,
    mineNum: gameDifficulty[mode].mine,
    addTotalRevealedCell: addTotalRevealedCell,
  };

  // toggle gameObject
  const [gameStart, setGameStart] = useState(false);
  const [gameObj, setGameObj] = useState(<GameBoard gameData={gameData} />);
  const toggleGameObj = () => {
    setGameStart(!gameStart);
    if (gameStart) setGameObj(<GameBoard gameData={gameData} />);
    else {
      setGameObj();
      setTime(0);
      setState("NONE");
      setFlagNum(0);
    }
  };

  let tileRevealed = (totalRevealedCell / (Math.pow(gameData.size, 2) * 6)) * 100;

  const data = {
    username: username,
    gameMode: mode,
    time: {
      minutes: Math.floor(time / 60),
      seconds: time % 60,
    },
    stageTus: state,
    tileRevealed: (totalRevealedCell / (Math.pow(gameData.size, 2) * 6)) * 100,
  };
  if (state === "WINNING" || state === "LOSING") {
    axios.post("http://localhost:8080/api/records", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setState("NONE");
  }

  const handleRestart = async () => {
    if (state === "LOSING" || state === "WINNING" || state === "NONE") {
      toggleGameObj();
      return;
    }
    await setState("LOSING");
    await toggleGameObj();
  };
  const handleHomePage = async () => {
    if (state === "LOSING" || state === "WINNING" || state === "NONE") {
      navigate(`/Homepage/${username}`);
      return;
    }
    await setState("LOSING");
    await navigate(`/Homepage/${username}`);
  };
  const handleAccount = async () => {
    if (state === "LOSING" || state === "WINNING" || state === "NONE") {
      navigate(`/account/${username}/beginner`);
      return;
    }
    await setState("LOSING");
    await navigate(`/account/${username}/beginner`);
  };

  console.log(tileRevealed);
  console.log(state);

  return (
    <>
      <div className="gamepage">
        <div className="widget-contanier">
          <div className="flag">FLAG: {flagNum}</div>
          <div className="menu" onClick={() => setCheckMenu(!checkMenu)}>
            <IoMenu />
            <div
              className={
                checkMenu ? "dropdown-content-active" : "dropdown-content"
              }
            >
              <div className="content-container">
                <button onClick={handleHomePage}>
                  <MdHome />
                </button>
                <button onClick={handleAccount}>
                  <MdAccountCircle />
                </button>
                <button onClick={handleRestart}>
                  <MdOutlineRestartAlt />
                </button>
              </div>
              <hr className="line"></hr>
            </div>
          </div>
          <div className="time">
            {Math.floor(time / 60)
              .toString()
              .padStart(2, "0")}
            :{(time % 60).toString().padStart(2, 0)}
          </div>
        </div>
        <div className="game-container">{gameObj}</div>
      </div>
    </>
  );
};

export default GamePage;
