const API_KEY = '4e8697e0'; // Replace with your OMDb API key
const searchBtn = document.getElementById('searchBtn');
const queryInput = document.getElementById('query');
const moviesContainer = document.getElementById('movies');

// Event Listener
searchBtn.addEventListener('click', () => {
  const query = queryInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

// Fetch data from OMDb API
async function fetchMovies(searchTerm) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === 'True') {
      displayMovies(data.Search);
    } else {
      moviesContainer.innerHTML = `<p>No results found.</p>`;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    moviesContainer.innerHTML = `<p>Failed to load data. Please try again later.</p>`;
  }
}

// Render movie cards
function displayMovies(movies) {
  moviesContainer.innerHTML = movies
    .map(movie => {
      const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
      return `
        <div class="movie-card">
          <img src="${poster}" alt="${movie.Title}" />
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
        </div>
      `;
    })
    .join('');
}

function displayMovies(movies) {
  moviesContainer.innerHTML = movies
    .map(movie => {
      const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
      return `
        <div class="movie-card" data-id="${movie.imdbID}">
          <img src="${poster}" alt="${movie.Title}" />
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
        </div>
      `;
    })
    .join('');

  // Add click listeners
  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const imdbID = card.getAttribute('data-id');
      fetchMovieDetails(imdbID);
    });
  });
}

async function fetchMovieDetails(imdbID) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === 'True') {
      showModal(data);
    } else {
      alert('Failed to load movie details.');
    }
  } catch (err) {
    console.error('Detail fetch error:', err);
    alert('Something went wrong.');
  }
}

function showModal(movie) {
  const modal = document.getElementById('modal');
  const modalDetails = document.getElementById('modalDetails');

  modalDetails.innerHTML = `
    <h2>${movie.Title} (${movie.Year})</h2>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
  `;

  modal.classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// Optional: Close on outside click
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    e.target.classList.add('hidden');
  }
});
