const Controls = ({ onStart, onSold, onUndo, selectedPlayer, spinning }) => {
    return (
      <div className="flex flex-col items-center gap-4 mt-6">
        <button
          onClick={onStart}
          disabled={spinning}
          className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={onSold}
          disabled={!selectedPlayer || spinning}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 disabled:opacity-50"
        >
          Sold
        </button>
        <button
          onClick={onUndo}
          disabled={spinning}
          className="bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500 disabled:opacity-50"
        >
          Undo
        </button>
      </div>
    );
  };
  
  export default Controls;
  
  