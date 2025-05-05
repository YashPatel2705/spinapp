import { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import Wheel from './Wheel';
import Controls from './Controls';
import Confetti from 'react-confetti';
import logo from '../assets/Main Logo.png';

function PlayerSpin() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'players'), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
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
      const random = players[Math.floor(Math.random() * players.length)];
      setSelectedPlayer(random);
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
      await addDoc(collection(db, 'soldPlayers'), selectedPlayer);
      await deleteDoc(doc(db, 'players', selectedPlayer.id));
      setSelectedPlayer(null);
    }, 2000);
  };

  const handleUndo = async () => {
    const last = history[history.length - 1];
    if (!last) return;
    await addDoc(collection(db, 'players'), { name: last.name });
    setHistory(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {!showCelebration && (
        <Wheel players={players} selectedPlayer={selectedPlayer} spinning={spinning} />
      )}

      {showCelebration && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl transform scale-110 transition-transform duration-300">
            <h2 className="text-4xl font-bold text-orange-700 mb-4 text-center">Congratulations!</h2>
            <p className="text-3xl font-semibold text-orange-600 mb-6 text-center">{selectedPlayer.name}</p>
            <p className="text-2xl font-medium text-green-600 text-center">Sold Successfully!</p>
          </div>
        </div>
      )}

      {showPopup && selectedPlayer && !showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-orange-700 mb-4">Selected Player</h2>
            <p className="text-2xl font-semibold text-orange-600 mb-6">{selectedPlayer.name}</p>
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
  );
}

export default PlayerSpin;
