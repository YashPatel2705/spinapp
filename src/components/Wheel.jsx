import { useEffect, useRef, useState } from "react";

const Wheel = ({ players, selectedPlayer, spinning }) => {
  const wheelRef = useRef(null);
  const [totalRotation, setTotalRotation] = useState(0);

  const getRotation = () => {
    const index = players.findIndex(p => p.id === selectedPlayer?.id);
    const anglePerSlice = 360 / players.length;
    return totalRotation + 360 * 5 + index * anglePerSlice + anglePerSlice / 2;
  };

  useEffect(() => {
    if (spinning && selectedPlayer) {
      const rotation = getRotation();
      setTotalRotation(rotation);
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
        wheelRef.current.style.transform = `rotate(${rotation}deg)`;
      }
    }
  }, [spinning, selectedPlayer]);

  return (
    <div className="relative w-[300px] h-[300px] rounded-full border-[10px] border-orange-500 overflow-hidden bg-white/70 shadow-xl">
      <div
        ref={wheelRef}
        className="absolute w-full h-full origin-center"
      >
        {players.map((player, i) => {
          const rotate = (360 / players.length) * i;
          return (
            <div
              key={player.id}
              className="absolute w-1/2 h-1/2 origin-bottom left-1/2 top-0 text-xs text-center"
              style={{ transform: `rotate(${rotate}deg) translateX(-50%)` }}
            >
              <div className="bg-orange-200 p-1 rounded shadow rotate-180 text-blue-900">
                {player.name}
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600"></div>
    </div>
  );
};

export default Wheel;