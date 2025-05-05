import { useEffect, useRef, useState } from 'react';

const Wheel = ({ players, selectedPlayer, spinning }) => {
  const wheelRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    if (spinning && selectedPlayer) {
      const index = players.findIndex(p => p.id === selectedPlayer.id);
      const anglePerSlice = 360 / players.length;
      // Generate random number of full rotations (between 5 and 8)
      const fullRotations = Math.floor(Math.random() * 4) + 5;
      const targetRotation = currentRotation + 360 * fullRotations + index * anglePerSlice;
      
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
        setCurrentRotation(targetRotation % 360);
      }
    }
  }, [spinning, selectedPlayer, players]);

  return (
    <div className="relative w-[350px] h-[350px] rounded-full border-[12px] border-orange-500 overflow-hidden bg-white/80 shadow-2xl">
      {/* Wheel Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-orange-500 border-4 border-white"></div>
      
      {/* Wheel Content */}
      <div
        ref={wheelRef}
        className="absolute w-full h-full origin-center"
      >
        {players.map((player, i) => {
          const rotate = (360 / players.length) * i;
          return (
            <div
              key={player.id}
              className="absolute w-1/2 h-1/2 origin-bottom left-1/2 top-0 text-center"
              style={{ transform: `rotate(${rotate}deg) translateX(-50%)` }}
            >
              <div 
                className={`p-2 rounded-lg shadow-md rotate-180 text-lg font-medium ${
                  selectedPlayer?.id === player.id 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {player.name}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
        border-l-[15px] border-r-[15px] border-b-[30px] 
        border-l-transparent border-r-transparent border-b-red-600
        shadow-lg"></div>
    </div>
  );
};

export default Wheel;