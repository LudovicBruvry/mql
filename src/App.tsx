import React, { useState } from "react";
import "./App.css";

// Questions sur le maquillage avec choix multiples
const makeupQuestions = [
  {
    question: "Quelle est la première étape d'une routine maquillage ?",
    choices: [
      "La base/primer",
      "Le fond de teint",
      "L'anti-cernes",
      "La poudre",
    ],
    correctAnswer: 0,
  },
  {
    question: "Quel produit utilise-t-on pour fixer le maquillage ?",
    choices: ["Le mascara", "La poudre", "Le blush", "Le highlighter"],
    correctAnswer: 1,
  },
  {
    question: "Comment appelle-t-on le produit qui camoufle les cernes ?",
    choices: [
      "Le fond de teint",
      "La poudre",
      "Le correcteur/anti-cernes",
      "Le highlighter",
    ],
    correctAnswer: 2,
  },
  {
    question: "À quoi sert un highlighter ?",
    choices: [
      "À matifier le teint",
      "À camoufler les imperfections",
      "À colorer les joues",
      "À illuminer certaines zones du visage",
    ],
    correctAnswer: 3,
  },
];

// Défis rigolos
const funChallenges = [
  "Fais un tuto maquillage en accéléré en 30 secondes",
  "Applique du rouge à lèvres les yeux fermés",
  "Fais un maquillage complet avec ta main non dominante",
  "Dessine un cœur parfait avec un eye-liner",
  "Fais une vidéo GRWM en 1 minute",
];

// Cartes de déplacement
const moveCards = [1, 2, 2, 3, 3, 4];

// Configuration du plateau
const BOARD_CONFIG = {
  rows: 5,
  cols: 8,
  totalCells: 40,
};

// Création du plateau avec le chemin en serpentin
const createBoardLayout = () => {
  const cells = [];
  let id = 0;

  for (let row = 0; row < BOARD_CONFIG.rows; row++) {
    const rowCells = [];
    for (let col = 0; col < BOARD_CONFIG.cols; col++) {
      if (id < BOARD_CONFIG.totalCells) {
        const adjustedCol = row % 2 === 0 ? col : BOARD_CONFIG.cols - 1 - col;
        const cellType = id % 4;
        let color;
        switch (cellType) {
          case 0:
            color = "bg-yellow-200 hover:bg-yellow-300";
            break;
          case 1:
            color = "bg-blue-200 hover:bg-blue-300";
            break;
          case 2:
            color = "bg-pink-200 hover:bg-pink-300";
            break;
          case 3:
            color = "bg-green-200 hover:bg-green-300";
            break;
          default:
            color = "bg-gray-200";
        }

        rowCells.push({
          id,
          col: adjustedCol,
          row,
          color,
          isStart: id === 0,
          isEnd: id === BOARD_CONFIG.totalCells - 1,
          type: id % 2 === 0 ? "question" : "challenge",
        });
        id++;
      }
    }
    cells.push(rowCells);
  }
  return cells;
};

const BOARD_LAYOUT = createBoardLayout();

const GameBoard = ({ players, currentPlayer, isMoving }) => {
  return (
    <div className="relative w-full max-h-[60vh] overflow-auto bg-white rounded-xl shadow-2xl p-2 md:p-4">
      <div className="grid grid-rows-5 gap-1 md:gap-2">
        {BOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-8 gap-2">
            {row.map((cell) => (
              <div
                key={cell.id}
                className={`
                  relative rounded-lg shadow-md border-2 border-gray-200
                  ${cell.color}
                  flex items-center justify-center
                  transition-all duration-300 ease-in-out h-10 md:h-14
                  ${cell.isStart ? "border-green-500 border-4" : ""}
                  ${cell.isEnd ? "border-red-500 border-4" : ""}
                `}
              >
                <span className="text-gray-600 text-sm font-bold">
                  {cell.isStart
                    ? "DÉPART"
                    : cell.isEnd
                      ? "ARRIVÉE"
                      : cell.id + 1}
                </span>

                {/* Pions des joueurs */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  {players.map(
                    (player, index) =>
                      player.position === cell.id && (
                        <div
                          key={`player-${index}`}
                          className={`
                          absolute w-8 h-8 rounded-full border-4
                          ${index === currentPlayer && !isMoving ? "animate-bounce" : ""}
                          ${isMoving ? "transition-all duration-500 ease-in-out" : ""}
                          player-piece
                        `}
                          style={{
                            backgroundColor: [
                              "#FF1493", // Rose vif
                              "#00BFFF", // Bleu vif
                              "#32CD32", // Vert vif
                              "#FFD700", // Or
                            ][index],
                            borderColor: [
                              "#FF69B4", // Rose clair
                              "#87CEEB", // Bleu clair
                              "#98FB98", // Vert clair
                              "#FFF68F", // Jaune clair
                            ][index],
                            transform: `translate(${(index - 1.5) * 12}px, ${(index - 1.5) * 12}px)`,
                          }}
                        >
                          <span className="flex items-center justify-center w-full h-full text-white font-bold text-xs">
                            {player.name[0].toUpperCase()}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
const WinnerScreen = ({ winner, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full mx-4 text-center transform animate-winner-appear">
        {/* Confetti animés */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                backgroundColor: [
                  "#FF1493",
                  "#00BFFF",
                  "#32CD32",
                  "#FFD700",
                  "#FF69B4",
                ][Math.floor(Math.random() * 5)],
                width: "8px",
                height: "8px",
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Contenu */}
        <div className="relative z-10">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">🎉</span>
            <h2 className="text-4xl font-bold text-pink-500 mb-2">
              Félicitations !
            </h2>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {winner.name}
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              Tu es la star du maquillage ! 💄✨
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              Tu as brillamment terminé ce parcours beauté !
            </p>
            <button
              onClick={onRestart}
              className="btn-makeup bg-pink-500 hover:bg-pink-600 transform transition-all duration-300 hover:scale-105"
            >
              Nouvelle Partie
            </button>
          </div>

          {/* Décorations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 text-3xl animate-bounce-slow">
              💄
            </div>
            <div className="absolute top-4 right-4 text-3xl animate-bounce-delayed">
              💅
            </div>
            <div className="absolute bottom-4 left-4 text-3xl animate-bounce">
              ✨
            </div>
            <div className="absolute bottom-4 right-4 text-3xl animate-bounce-delayed">
              ⭐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [winner, setWinner] = useState(null);

  const handleRestart = () => {
    setPlayers([]);
    setGameStarted(false);
    setCurrentPlayer(0);
    setDiceValue(null);
    setCurrentQuestion(null);
    setCurrentChallenge(null);
    setShowQuestion(false);
    setShowChallenge(false);
    setIsMoving(false);
    setSelectedAnswer(null);
    setWinner(null);
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const playerName = formData.get("playerName").trim();

    if (playerName && players.length < 4) {
      setPlayers([...players, { name: playerName, position: 0 }]);
      e.target.reset();
    }
  };

  const rollDice = () => {
    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValue(value);
    setIsMoving(true);

    const updatedPlayers = [...players];
    const newPosition = Math.min(
      players[currentPlayer].position + value,
      BOARD_CONFIG.totalCells - 1,
    );
    updatedPlayers[currentPlayer].position = newPosition;
    setPlayers(updatedPlayers);

    setTimeout(() => {
      setIsMoving(false);
      if (newPosition % 2 === 0) {
        setCurrentQuestion(
          makeupQuestions[Math.floor(Math.random() * makeupQuestions.length)],
        );
        setShowQuestion(true);
        setShowChallenge(false);
      } else {
        setCurrentChallenge(
          funChallenges[Math.floor(Math.random() * funChallenges.length)],
        );
        setShowChallenge(true);
        setShowQuestion(false);
      }

      if (newPosition >= BOARD_CONFIG.totalCells - 1) {
        setWinner(players[currentPlayer]);
      }
    }, 1000);
  };

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;

    const moveCard = moveCards[Math.floor(Math.random() * moveCards.length)];
    setIsMoving(true);

    const updatedPlayers = [...players];
    let newPosition = updatedPlayers[currentPlayer].position;

    setTimeout(() => {
      if (isCorrect) {
        newPosition = Math.min(
          newPosition + moveCard,
          BOARD_CONFIG.totalCells - 1,
        );
      } else {
        newPosition = Math.max(newPosition - moveCard, 0);
      }

      updatedPlayers[currentPlayer].position = newPosition;
      setPlayers(updatedPlayers);

      // Vérifier si le joueur a gagné
      if (newPosition >= BOARD_CONFIG.totalCells - 1) {
        setWinner(updatedPlayers[currentPlayer]);
      } else {
        setTimeout(() => {
          setShowQuestion(false);
          setShowChallenge(false);
          setDiceValue(null);
          setIsMoving(false);
          setSelectedAnswer(null);
          setCurrentPlayer((currentPlayer + 1) % players.length);
        }, 1500);
      }
    }, 1000);
  };

  const handleChallenge = (success) => {
    const moveCard = moveCards[Math.floor(Math.random() * moveCards.length)];
    setIsMoving(true);

    const updatedPlayers = [...players];
    let newPosition = updatedPlayers[currentPlayer].position;

    if (success) {
      newPosition = Math.min(
        newPosition + moveCard,
        BOARD_CONFIG.totalCells - 1,
      );
    } else {
      newPosition = Math.max(newPosition - moveCard, 0);
    }

    updatedPlayers[currentPlayer].position = newPosition;
    setPlayers(updatedPlayers);

    if (newPosition >= BOARD_CONFIG.totalCells - 1) {
      setWinner(updatedPlayers[currentPlayer]);
    } else {
      setTimeout(() => {
        setShowQuestion(false);
        setShowChallenge(false);
        setDiceValue(null);
        setIsMoving(false);
        setCurrentPlayer((currentPlayer + 1) % players.length);
      }, 1000);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-pink-500">
            Jeu de Maquillage
          </h1>

          <form onSubmit={handleAddPlayer} className="space-y-4">
            <input
              type="text"
              name="playerName"
              placeholder="Nom du joueur"
              className="w-full p-2 bg-white border-2 border-pink-500 rounded-lg text-gray-800 placeholder-gray-400"
              maxLength="20"
              required
            />
            <button
              type="submit"
              disabled={players.length >= 4}
              className="w-full btn-makeup bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300"
            >
              Ajouter un joueur ({players.length}/4)
            </button>
          </form>

          <div className="mt-6">
            <h2 className="font-bold mb-2 text-gray-800">Joueurs inscrits :</h2>
            {players.map((player, index) => (
              <div
                key={index}
                className="bg-pink-50 p-2 rounded-lg mb-2 border-2 border-pink-300 text-gray-800"
              >
                {player.name}
              </div>
            ))}
          </div>

          {players.length >= 2 && (
            <button
              onClick={() => setGameStarted(true)}
              className="w-full mt-6 btn-makeup bg-green-500 hover:bg-green-600"
            >
              Commencer la partie
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-pink-600 text-white p-4 overflow-y-auto">
      {winner && <WinnerScreen winner={winner} onRestart={handleRestart} />}

      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 pb-4 md:pb-8">

        {/* Plateau de jeu */}
        <div className="bg-white p-2 md:p-4 rounded-xl shadow-2xl">
          <GameBoard
            players={players}
            currentPlayer={currentPlayer}
            isMoving={isMoving}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Section du joueur actif */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-pink-500">
              Tour de {players[currentPlayer]?.name}
            </h2>

            <button
              onClick={rollDice}
              disabled={showQuestion || showChallenge || isMoving}
              className="w-full btn-makeup disabled:opacity-70"
            >
              Lancer le dé
            </button>

            {diceValue && (
              <div className="mt-4 text-center">
                <span className="text-4xl">🎲</span>
                <p className="text-2xl font-bold text-gray-800">{diceValue}</p>
              </div>
            )}
          </div>

          {/* Section Questions/Défis */}
          {showQuestion && currentQuestion && (
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h3 className="font-bold text-pink-500 mb-4">Question :</h3>
              <p className="text-lg mb-6 text-gray-800">
                {currentQuestion.question}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`
                        w-full p-3 text-left rounded-lg transition-all duration-200
                        ${
                          selectedAnswer === null
                            ? "bg-white hover:bg-pink-50 border-2 border-gray-200 hover:border-pink-500"
                            : selectedAnswer === index
                              ? index === currentQuestion.correctAnswer
                                ? "bg-green-100 border-2 border-green-500"
                                : "bg-red-100 border-2 border-red-500"
                              : index === currentQuestion.correctAnswer
                                ? "bg-green-100 border-2 border-green-500"
                                : "bg-white border-2 border-gray-200"
                        }
                        disabled:cursor-not-allowed
                      `}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showChallenge && (
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h3 className="font-bold text-pink-500 mb-4">Défi :</h3>
              <p className="text-lg mb-6 text-gray-800">{currentChallenge}</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChallenge(true)}
                  className="btn-makeup bg-green-500 hover:bg-green-600"
                >
                  Réussi
                </button>
                <button
                  onClick={() => handleChallenge(false)}
                  className="btn-makeup bg-red-500 hover:bg-red-600"
                >
                  Raté
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
