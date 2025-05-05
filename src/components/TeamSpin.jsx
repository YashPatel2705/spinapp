import { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Wheel from './Wheel';
import Controls from './Controls';
import Confetti from 'react-confetti';

function TeamSpin() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'teams'), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = () => {
    if (teams.length === 0) return;
    setSpinning(true);
    setShowPopup(false);
    setShowConfetti(false);
    setShowCelebration(false);

    setTimeout(() => {
      const random = teams[Math.floor(Math.random() * teams.length)];
      setSelectedTeam(random);
    }, 100);

    setTimeout(() => {
      setSpinning(false);
      setShowPopup(true);
    }, 5000);
  };

  const handleSold = async () => {
    if (!selectedTeam) return;
    setShowPopup(false);
    setShowConfetti(true);
    setShowCelebration(true);

    setTimeout(async () => {
      setShowConfetti(false);
      setShowCelebration(false);
      setHistory(prev => [...prev, selectedTeam]);
      await addDoc(collection(db, 'soldTeams'), selectedTeam);
      await deleteDoc(doc(db, 'teams', selectedTeam.id));
      setSelectedTeam(null);
    }, 2000);
  };

  const handleUndo = async () => {
    const last = history[history.length - 1];
    if (!last) return;
    await addDoc(collection(db, 'teams'), { name: last.name });
    setHistory(prev => prev.slice(0, -1));
  };

  const handleReset = async () => {
    const currentTeamsSnap = await getDocs(collection(db, 'teams'));
    const currentNames = currentTeamsSnap.docs.map(doc => doc.data().name);
  
    const soldSnapshot = await getDocs(collection(db, 'soldTeams'));
    for (const docSnap of soldSnapshot.docs) {
      const { name } = docSnap.data();
  
      if (!currentNames.includes(name)) {
        await addDoc(collection(db, 'teams'), { name });
      }
  
      await deleteDoc(doc(db, 'soldTeams', docSnap.id));
    }
  
    setHistory([]);
    setSelectedTeam(null);
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
        <Wheel players={teams} selectedPlayer={selectedTeam} spinning={spinning} />
      )}

      {showCelebration && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl transform scale-110 transition-transform duration-300">
            <h2 className="text-4xl font-bold text-orange-700 mb-4 text-center">Congratulations!</h2>
            <p className="text-3xl font-semibold text-orange-600 mb-6 text-center">{selectedTeam.name}</p>
            <p className="text-2xl font-medium text-green-600 text-center">Sold Successfully!</p>
          </div>
        </div>
      )}

      {showPopup && selectedTeam && !showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-orange-700 mb-4">Selected Team</h2>
            <p className="text-2xl font-semibold text-orange-600 mb-6">{selectedTeam.name}</p>
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
          selectedPlayer={selectedTeam}
          spinning={spinning}
        />
      )}

      {!showCelebration && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="text-lg font-medium text-orange-700">
            Remaining Teams: {teams.length}
          </div>
          <button
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Reset & Start Again
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamSpin;
