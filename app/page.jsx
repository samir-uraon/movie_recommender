"use client";

import { useEffect, useState } from "react";
import { BiCameraMovie } from "react-icons/bi";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_URL}/movies`);
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, [API_URL]);

  const getRecommendations = async () => {
    if (!selectedMovie) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/recommend/${encodeURIComponent(selectedMovie)}`
      );

      const data = await res.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden relative scroll-smooth">

      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20 bg-fit-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop')",
          }}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-600/20 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600/20 blur-[180px]" />
      </div>

      {/* HERO */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center flex flex-col items-center justify-center">
            <h1 className="flex items-center gap-3 text-5xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              <BiCameraMovie className="text-purple-500 text-5xl sm:text-6xl md:text-8xl" />
              CineMatch
            </h1>

            <p className="mt-4 sm:mt-5 text-zinc-400 text-base sm:text-lg md:text-xl">
              Discover Movies You'll Love With AI
            </p>
          </div>

          {/* SEARCH CARD */}
          <div className="max-w-3xl mx-auto mt-10 sm:mt-14 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.15)]">

            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
              Find Similar Movies
            </h2>

            {/* INPUT */}
            <div className="relative w-full">
              <input
                type="text"
                value={selectedMovie}
                onChange={(e) => {
                  setSelectedMovie(e.target.value);
                  setShowDropdown(true);
                  setRecommendations([]);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowDropdown(false), 150)
                }
                placeholder="Search movie..."
                className="w-full bg-black/40 border border-zinc-700 rounded-2xl p-3 sm:p-4 outline-none focus:border-red-500"
              />

              {/* DROPDOWN */}
              {showDropdown && selectedMovie && (
                <ul className="absolute z-50 w-full bg-black/95 backdrop-blur-lg border border-zinc-700 rounded-2xl mt-2 max-h-60 overflow-y-auto shadow-xl">
                  {movies
                    .filter((m) =>
                      m.toLowerCase().includes(selectedMovie.toLowerCase())
                    )
                    .slice(0, 8)
                    .map((movie, i) => (
                      <li
                        key={i}
                        onMouseDown={() => {
                          setSelectedMovie(movie);
                          setShowDropdown(false);
                          setRecommendations([]);
                        }}
                        className="p-3 hover:bg-red-600 cursor-pointer text-sm sm:text-base"
                      >
                        {movie}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={getRecommendations}
              disabled={loading}
              className="w-full mt-4 sm:mt-5 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg bg-gradient-to-r from-red-600 to-pink-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
            >
              {loading ? "Finding Movies..." : "Get Recommendations"}
            </button>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-72 sm:h-80 rounded-3xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </section>
      )}

      {/* RECOMMENDATIONS */}
      {!loading && recommendations.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">

          <h2 className="text-3xl sm:text-4xl font-black mb-8 sm:mb-10 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Recommended For You
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-4 gap-y-8 sm:gap-8">

            {recommendations.map((movie, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-red-500 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={
                      movie.poster ||
                      "https://placehold.co/500x750/111827/ffffff?text=No+Poster"
                    }
                    alt={movie.title}
                    className="w-full h-72 sm:h-80 object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-yellow-500 text-black font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    ⭐ {movie.rating || "N/A"}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-full group-hover:translate-y-0 transition duration-500">
                  <h3 className="font-bold text-base sm:text-lg">
                    {movie.title}
                  </h3>

                  <p className="text-yellow-400 text-xs sm:text-sm mt-1">
                    ⭐ Rating: {movie.rating || "N/A"}
                  </p>

                  <button
                    onClick={() =>
                      window.open(
                        "https://new1.hdhub4u.cl/search.html?q=" +
                          movie.title
                      )
                    }
                    className="mt-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-sm"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}

          </div>

          {/* SHOW MORE */}
          <div className="w-full flex justify-center mt-12 sm:mt-20">
            <button
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-semibold
              hover:opacity-90 active:scale-95 transition-all shadow-lg"
              onClick={() =>
                window.open(
                  "https://new1.hdhub4u.cl/search.html?q=" +
                    selectedMovie
                )
              }
            >
              Show More
            </button>
          </div>

        </section>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-6 sm:py-8 text-center text-zinc-500 text-sm sm:text-base">
        Built with Next.js • FastAPI • Machine Learning
      </footer>

    </main>
  );
}