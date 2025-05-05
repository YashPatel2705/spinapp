const Controls = ({ onStart, onSold, onUndo, selectedPlayer, spinning }) => {
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <button
          onClick={onStart}
          disabled={spinning || selectedPlayer}
          className={`px-8 py-3 rounded-lg shadow-lg transition-all duration-200 text-lg font-semibold ${
            spinning || selectedPlayer
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'
          }`}
        >
          {spinning ? 'Spinning...' : 'Start'}
        </button>
        
        <button
          onClick={onSold}
          disabled={!selectedPlayer || spinning}
          className={`px-8 py-3 rounded-lg shadow-lg transition-all duration-200 text-lg font-semibold ${
            !selectedPlayer || spinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 active:scale-95 text-white'
          }`}
        >
          Sold
        </button>
        
        <button
          onClick={onUndo}
          disabled={spinning}
          className={`px-8 py-3 rounded-lg shadow-lg transition-all duration-200 text-lg font-semibold ${
            spinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-white'
          }`}
        >
          Undo
        </button>
      </div>
    );
  };
  
  export default Controls;
    
    