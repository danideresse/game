'use client';

interface SignOutConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SignOutConfirm({ onConfirm, onCancel }: SignOutConfirmProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Sign Out</h2>
        <p className="text-theme-secondary mb-6">
          Are you sure you want to sign out? Your balance and history will be saved.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg font-bold transition-all duration-300
              bg-white/10 hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg font-bold transition-all duration-300
              bg-red-500 hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 