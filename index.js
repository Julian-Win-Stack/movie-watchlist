// =====================
// Config + DOM refs
// =====================
const apiKey = "8d158d28";
const STORAGE_KEY = "watchlistIds";

const renderArea = document.getElementById("render-area");
const watchlistArea = document.getElementById("watchlist-area");
const formSubmit = document.getElementById("index-form");

// =====================
// LocalStorage helpers
// =====================
function getSavedIds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveId(imdbID) {
  const ids = getSavedIds();
  if (ids.includes(imdbID)) return;

  ids.push(imdbID);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function removeId(imdbID) {
  const ids = getSavedIds();
  const newIds = ids.filter((id) => id !== imdbID);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
}

// =====================
// API helpers
// =====================
async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

function getMovieDetails(imdbID) {
  return fetchJSON(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
}

function searchByTitle(title) {
  return fetchJSON(`http://www.omdbapi.com/?apikey=${apiKey}&s=${title}`);
}

// =====================
// HTML builder
// =====================
function movieCardHTML(movie, buttonIcon) {
  // movie is OMDb "full details" response
  return `
    <div class="border">
      <div>
        <img src="${movie.Poster}" class="render-img">
      </div>

      <div class="movie-detail">
        <div class="movie-title-section">
          <h2>${movie.Title}</h2>
          <span>★</span>
          <p>${movie.imdbRating}</p>
        </div>

        <div class="movie-section-second">
          <p>${movie.Runtime}</p>
          <p>${movie.Genre}</p>

          <button class="add-movie-btn" data-imdbid="${movie.imdbID}">
            <img src="img/${buttonIcon}">
            <p>Watchlist</p>
          </button>
        </div>

        <div class="movie-summary">
          <p>${movie.Plot}</p>
        </div>
      </div>
    </div>
  `;
}

// =====================
// Index page: search + render
// =====================
async function searchMovies(title) {
  const data = await searchByTitle(title);

  // Guard: if API returns no Search array
  if (!data.Search) {
    if (renderArea) renderArea.innerHTML = "";
    return;
  }

  let html = "";

  for (const item of data.Search) {
    const details = await getMovieDetails(item.imdbID);
    html += movieCardHTML(details, "plus-icon.svg");
  }

  if (renderArea) renderArea.innerHTML = html;
}

// =====================
// Watchlist page: render + empty state
// =====================
async function renderWatchlist() {
  if (!watchlistArea) return;

  const ids = getSavedIds();
  let html = "";

  for (const id of ids) {
    const details = await getMovieDetails(id);
    html += movieCardHTML(details, "minus-icon.svg");
  }

  watchlistArea.innerHTML = html;
  updateWatchlistEmptyState();
}

function updateWatchlistEmptyState() {
  const emptyEl = document.getElementById("watchlist-background-text");
  if (!emptyEl || !watchlistArea) return;

  const ids = getSavedIds();
  emptyEl.style.display = ids.length > 0 ? "none" : "flex";
}

// =====================
// Events
// =====================
if (formSubmit) {
  formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = document.getElementById("search-bar");
    const title = input.value.trim();
    if (!title) return;

    searchMovies(title);
    input.value = "";

    const emptySpace = document.getElementById("empty-space");
    if (emptySpace) emptySpace.style.display = "none";
  });
}

document.addEventListener("click", (e) => {
  const button = e.target.closest(".add-movie-btn");
  if (!button) return;

  const imdbID = button.dataset.imdbid;

  if (renderArea) {
    saveId(imdbID);
  } else if (watchlistArea) {
    removeId(imdbID);
    renderWatchlist();
  }
});

// =====================
// Init
// =====================
renderWatchlist();
updateWatchlistEmptyState();
