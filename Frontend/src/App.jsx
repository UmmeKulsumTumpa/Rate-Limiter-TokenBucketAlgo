// frontend/src/App.js
import RateLimiterComparison from './components/RateLimiterComparison';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <header className="py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold">
            Rate Limiter Comparison Tool
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Analyze the differences between safe and unsafe rate limiters
          </p>
        </div>
      </header>
      <main className="py-12">
        <RateLimiterComparison />
      </main>
    </div>
  );
}

export default App;