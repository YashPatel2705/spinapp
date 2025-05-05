import { useEffect, useState } from "react";
import Wheel from "./components/Wheel";
import Controls from "./components/Controls";
import logo from "./assets/Main Logo.png";

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' },
  { id: '3', name: 'Player 3' },
  { id: '4', name: 'Player 4' },
  { id: '5', name: 'Player 5' },
];

function App() {
  const [players, setPlayers] = useState(mockPlayers);
  const [spinning, setSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [history, setHistory] = useState([]);

  const handleStart = () => {
    if (players.length === 0) return;
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    setSelectedPlayer(randomPlayer);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 4000);
  };

  const handleSold = () => {
    if (!selectedPlayer) return;
    setHistory(prev => [...prev, selectedPlayer]);
    setPlayers(prev => prev.filter(p => p.id !== selectedPlayer.id));
    setSelectedPlayer(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastSold = history[history.length - 1];
    setPlayers(prev => [...prev, lastSold]);
    setHistory(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-100 to-white overflow-hidden">
      <img
        src={logo}
        alt="Tournament Logo"
        className="absolute opacity-10 w-full max-w-[500px] top-20 left-1/2 -translate-x-1/2"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.2)_0%,transparent_70%)] animate-pulse"></div>

      <h1 className="text-3xl font-bold text-orange-700 mb-4 z-10">Auction Wheel</h1>
      <Wheel players={players} selectedPlayer={selectedPlayer} spinning={spinning} />
      {selectedPlayer && !spinning && (
        <div className="mt-4 text-xl font-semibold text-blue-800 z-10">
          Selected: {selectedPlayer.name}
        </div>
      )}
      <Controls onStart={handleStart} onSold={handleSold} onUndo={handleUndo} selectedPlayer={selectedPlayer} spinning={spinning} />
      <div className="mt-6 text-blue-800 z-10">Remaining: {players.length}</div>
    </div>
  );
}

export default App;
