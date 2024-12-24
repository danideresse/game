'use client';

interface GameOverProps {
  winningNumber: number;
  winningAmount: number;
  onClose: () => void;
}

export default function GameOver({ winningNumber, winningAmount, onClose }: GameOverProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative bg-gaming-dark/95 rounded-2xl p-6 md:p-8 text-center
        transform transition-all duration-300 animate-slideUpAndFade max-w-md w-full shadow-2xl">
        
        <div className="text-6xl mb-6 animate-bounce">
          ⏰
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary animate-shimmer">
          Game Over!
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-white/70 mb-1">Winning Number</p>
            <div className="text-2xl font-bold text-primary">
              {winningNumber}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-white/70 mb-1">Prize Amount</p>
            <div className="text-2xl font-bold text-primary">
              {winningAmount} birr
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full"
        >
          Play Again
        </button>
      </div>
    </div>
  );
} 