import React, { useState, useRef, useEffect } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundGif from "../assets/images/play.gif";
import backgroundMusic from "../assets/audio/background-music.mp3";
import buttonHoverSound from "../assets/audio/button-hover.mp3";
import buttonClickSound from "../assets/audio/button-click.mp3";
import axios from "axios";


const fetchGameData = async (userId) => {
  try {
    const response = await axios.get(
      `https://glowing-journey-p4wwpr5wj7pc65vx-5000.app.github.dev/api/memory/games/${userId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    return [];
  }
};

const History = () => {

  const [gameHistory, setGameHistory] = useState([]);
  const userID = localStorage.getItem("userID");
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [modalPlayIsOpen, setModalPlayIsOpen] = useState(false);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const bgAudioRef = useRef(null);
  const navigate = useNavigate();

  const [bgVolume, setBgVolume] = useState(
      localStorage.getItem("bgVolume") !== null ? parseInt(localStorage.getItem("bgVolume"), 10) : 50
    );

  const PlayopenModal = () => {
    playClickSound();
    setModalPlayIsOpen(true);
  };

  const playHoverSound = () => {
    hoverAudioRef.current.currentTime = 0;
    hoverAudioRef.current.play().catch((error) =>
      console.error("Hover sound playback failed:", error)
    );
  };

  const playClickSound = () => {
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch((error) =>
      console.error("Click sound playback failed:", error)
    );
  };

  useEffect(() => {
      bgAudioRef.current = new Audio(backgroundMusic);
      hoverAudioRef.current = new Audio(buttonHoverSound);
      clickAudioRef.current = new Audio(buttonClickSound);
  
      const bgAudio = bgAudioRef.current;
      bgAudio.loop = true;
      bgAudio.volume = bgVolume / 100;
  
      const startMusic = () => {
        bgAudio.play().catch((error) => console.error("Autoplay failed:", error));
      };
  
      document.addEventListener("click", startMusic, { once: true });
  
      return () => {
        document.removeEventListener("click", startMusic);
        bgAudio.pause();
        bgAudio.currentTime = 0;
      };
    }, []);
  
    useEffect(() => {
      if (bgAudioRef.current) {
        bgAudioRef.current.volume = bgVolume / 100;
      }
      localStorage.setItem("bgVolume", bgVolume);
    }, [bgVolume]);

  useEffect(() => {
    const loadGameData = async () => {
      if (userID) {
        const data = await fetchGameData(userID);
        setGameHistory(data);
      }
    };
    loadGameData();
    }, [userID]);  

    return (
        <div
          className="background-container"
          style={{
            backgroundImage: `url(${backgroundGif})`,
          }}
        >
          <Typography variant="h6" sx={{ 
            color: '#fff',
            mt: 4,
            fontFamily: '"Press Start 2P", cursive', 
            fontSize: 32,
            textAlign: 'center'
            }}>
            GAME HISTORY
          </Typography>
          <Box sx={{ 
            maxHeight: '600px',
            overflowY: 'auto',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',

            /* Cyberpunk Scrollbar */
            scrollbarWidth: 'thin',
            scrollbarColor: '#ffffff rgba(0, 10, 20, 0.8)',

            '&::-webkit-scrollbar': {
              width: '12px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(180deg, #00d9ff 0%, #0084ff 50%, #a200ff 100%)',
              borderRadius: '6px',
              border: '2px solid rgba(0, 0, 0, 0.5)',
              boxShadow: `
                inset 0 0 4px rgba(255, 255, 255, 0.3),
                0 0 10px rgba(0, 217, 255, 0.8)
              `,
              backgroundSize: '100% 200%',
              animation: 'scrollThumbGlow 2s infinite alternate',
            },
            '&::-webkit-scrollbar-track': {
              background: 'linear-gradient(90deg, rgba(0, 10, 20, 0.8) 0%, rgba(0, 20, 40, 0.6) 100%)',
              borderRadius: '6px',
              borderLeft: '1px solid rgba(0, 217, 255, 0.2)',
              margin: '4px 0',
            },
            '&::-webkit-scrollbar-corner': {
              background: 'transparent',
            },
            '@keyframes scrollThumbGlow': {
              '0%': { opacity: 0.8 },
              '100%': { opacity: 1, boxShadow: '0 0 15px rgba(0, 217, 255, 0.9)' }
            }
          }}> 
            {gameHistory.map((game) => (
              <Box key={game._id} sx={{ 
                backgroundColor: 'rgba(44, 44, 84, 0.7)',
                p: 2, 
                mb: 1,
                borderRadius: '4px',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 0 8px rgba(0, 217, 255, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}>
                <Typography sx={{ 
                  color: '#00d9ff',
                  fontFamily: '"Courier New", monospace',
                  textShadow: '0 0 5px rgba(0, 217, 255, 0.7)'
                }}>
                  {game.difficulty} - Attempts: {game.failed} -
                  Time: {game.timeTaken} seconds - 
                  {new Date(game.gameDate).toLocaleString()} 
                </Typography>
              </Box>
            ))}
          </Box>
          <button
            className={`game-button ${isCalmMode ? "calm-button" : ""}`}
            onClick={() => {
              playClickSound();
              navigate("/play");
            }}
            onMouseEnter={playHoverSound}
          >
            Back
          </button>
        </div>
        

    )

}

export default History;
