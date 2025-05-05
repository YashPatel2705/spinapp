import { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import Controls from './components/Controls';
import logo from './assets/Main Logo.png';
import Confetti from 'react-confetti';

import db from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

function App() {
  const [players, setPlayers] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [history, setHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Real-time listener for players
  useEffect(() => {
    console.log("Players in Firestore:", players);
    const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
      const playerList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playerList);
    });

    return () => unsubscribe();
  }, []);

  // Confetti sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = () => {
    if (players.length === 0) return;
    setSpinning(true);
    setShowPopup(false);
    setShowConfetti(false);
    setShowCelebration(false);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * players.length);
      const randomPlayer = players[randomIndex];
      setSelectedPlayer(randomPlayer);
    }, 100);

    setTimeout(() => {
      setSpinning(false);
      setShowPopup(true);
    }, 5000);
  };

  const handleSold = async () => {
    if (!selectedPlayer) return;

    setShowPopup(false);
    setShowConfetti(true);
    setShowCelebration(true);

    setTimeout(async () => {
      setShowConfetti(false);
      setShowCelebration(false);
      setHistory(prev => [...prev, selectedPlayer]);

      // Save to soldPlayers
      await addDoc(collection(db, "soldPlayers"), selectedPlayer);

      // Remove from players
      await deleteDoc(doc(db, "players", selectedPlayer.id));

      setSelectedPlayer(null);
    }, 2000);
  };

  const handleUndo = async () => {
    if (history.length === 0) return;
    const lastSold = history[history.length - 1];

    // Add back to players
    await addDoc(collection(db, "players"), { name: lastSold.name });

    setHistory(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Confetti Celebration */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Background Elements */}
      <img
        src={logo}
        alt="Hariprabodham Box Cricket Tournament"
        className="absolute opacity-10 w-full max-w-[600px] top-20 left-1/2 -translate-x-1/2"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_0%,transparent_70%)] animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold text-orange-700 mb-8">
          Auction Wheel
        </h1>

        {!showCelebration && (
          <Wheel
            players={players}
            selectedPlayer={selectedPlayer}
            spinning={spinning}
          />
        )}

        {showCelebration && selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl transform scale-110 transition-transform duration-300">
              <h2 className="text-4xl font-bold text-orange-700 mb-4 text-center">
                Congratulations!
              </h2>
              <p className="text-3xl font-semibold text-orange-600 mb-6 text-center">
                {selectedPlayer.name}
              </p>
              <p className="text-2xl font-medium text-green-600 text-center">
                Sold Successfully!
              </p>
            </div>
          </div>
        )}

        {showPopup && selectedPlayer && !showCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl">
              <h2 className="text-3xl font-bold text-orange-700 mb-4">
                Selected Player
              </h2>
              <p className="text-2xl font-semibold text-orange-600 mb-6">
                {selectedPlayer.name}
              </p>
              <button
                onClick={handleSold}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Sold
              </button>
            </div>
          </div>
        )}

        {!showCelebration && (
          <Controls
            onStart={handleStart}
            onSold={handleSold}
            onUndo={handleUndo}
            selectedPlayer={selectedPlayer}
            spinning={spinning}
          />
        )}

        {!showCelebration && (
          <div className="mt-6 text-lg font-medium text-orange-700">
            Remaining Players: {players.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
