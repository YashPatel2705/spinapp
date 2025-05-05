import { useState } from 'react';
import PlayerSpin from './components/PlayerSpin';
import TeamSpin from './components/TeamSpin';

function App() {
  const [tab, setTab] = useState('players');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4">
      <h1 className="text-4xl font-bold text-center text-orange-700 mb-6">Auction Spin</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab('players')}
          className={`px-6 py-2 rounded-full font-semibold ${
            tab === 'players' ? 'bg-orange-500 text-white' : 'bg-gray-200'
          }`}
        >
          Player Spin
        </button>
        <button
          onClick={() => setTab('teams')}
          className={`px-6 py-2 rounded-full font-semibold ${
            tab === 'teams' ? 'bg-orange-500 text-white' : 'bg-gray-200'
          }`}
        >
          Team Spin
        </button>
      </div>

      {tab === 'players' ? <PlayerSpin /> : <TeamSpin />}
    </div>
  );
}

export default App;