export default function History() {
  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slide-up">
      <div className="card p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-primary">Game History</h1>
        <div className="space-y-4">
          {/* Add your history content here */}
          <p className="text-theme-secondary">No games played yet</p>
        </div>
      </div>
    </div>
  )
} 