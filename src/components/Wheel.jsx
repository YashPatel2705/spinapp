import { useEffect, useRef, useState } from 'react';

const Wheel = ({ players, selectedPlayer, spinning }) => {
  const wheelRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    if (spinning && selectedPlayer) {
      const index = players.findIndex(p => p.id === selectedPlayer.id);
      const anglePerSlice = 360 / players.length;
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
    <div className="relative w-[350px] h-[350px] rounded-full border-[12px] border-orange-500 overflow-hidden bg-white/80 shadow-2xl mx-auto mb-6">
      {/* Center Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-orange-500 border-4 border-white z-20"></div>

      {/* Spinning Wheel */}
      <div ref={wheelRef} className="absolute w-full h-full origin-center">
        {players.map((player, i) => {
          const angle = (360 / players.length) * i;
          return (
            <div
              key={player.id}
              className="absolute top-1/2 left-1/2 w-1/2"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0% 0%',
              }}
            >
              <div
                className={`transform -translate-y-full origin-bottom px-2 py-1 text-sm sm:text-base font-semibold text-center rounded-lg shadow ${
                  selectedPlayer?.id === player.id
                    ? 'bg-green-200 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
                style={{
                  transform: `rotate(-${angle}deg)`,
                }}
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
        shadow-lg z-30"
      ></div>
    </div>
  );
};

export default Wheel;
