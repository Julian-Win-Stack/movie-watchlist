const apiKey = "8d158d28";

// DOM
const renderArea = document.getElementById("render-area");
const formSubmit = document.getElementById("index-form");
const watchlistArea = document.getElementById("watchlist-area");

// State
let renderData = "";
let watchlist = "";


const STORAGE_KEY = "watchlistIds";

// --------------------
// LocalStorage
// --------------------
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

  // re-render watchlist page if you're on it
  if (watchlistArea) renderWatchList();
}

// --------------------
// API
// --------------------
async function getMovieDetails(imdbID) {

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
  return await res.json();
}

async function searchMovies(title) {
  renderData = "";

  
  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${title}`);
  const data = await res.json();

  //if no results, don't crash on data.Search
  if (!data.Search) {
    render(renderData);
    return;
  }

  for (const element of data.Search) {
    const movieDetails = await getMovieDetails(element.imdbID);

    renderData += `
      <div class="border">
        <div>
          <img src="${movieDetails.Poster}" class="render-img">
        </div>

        <div class="movie-detail">
          <div class="movie-title-section">
            <h2>${movieDetails.Title}</h2>
            <span>★</span>
            <p>${movieDetails.imdbRating}</p>
          </div>

          <div class="movie-section-second">
            <p>${movieDetails.Runtime}</p>
            <p>${movieDetails.Genre}</p>

            <button class="add-movie-btn" data-imdbid="${element.imdbID}">
              <img src="img/plus-icon.svg">
              <p>Watchlist</p>
            </button>
          </div>

          <div class="movie-summary">
            <p>${movieDetails.Plot}</p>
          </div>
        </div>
      </div>
    `;
  }

  render(renderData);
}

function render(movieData) {
  if (!renderArea) return;
  renderArea.innerHTML = movieData;
}

// --------------------
// Watchlist render
// --------------------
async function renderWatchList() {
  if (!watchlistArea) return;

  watchlist = "";
  watchlistArea.innerHTML = "";

  const ids = getSavedIds();

  for (const id of ids) {
    const data = await getMovieDetails(id);

    watchlist += `
      <div class="border">
        <div>
          <img src="${data.Poster}" class="render-img">
        </div>

        <div class="movie-detail">
          <div class="movie-title-section">
            <h2>${data.Title}</h2>
            <span>★</span>
            <p>${data.imdbRating}</p>
          </div>

          <div class="movie-section-second">
            <p>${data.Runtime}</p>
            <p>${data.Genre}</p>

            <button class="add-movie-btn" data-imdbid="${id}">
              <img src="img/minus-icon.svg">
              <p>Watchlist</p>
            </button>
          </div>

          <div class="movie-summary">
            <p>${data.Plot}</p>
          </div>
        </div>
      </div>
    `;
  }

  watchlistArea.innerHTML = watchlist;
  watchlistBackgroundText();
}

function watchlistBackgroundText() {
  if (!watchlistArea) return;

  const savedIds = getSavedIds();
  const el = document.getElementById("watchlist-background-text");
  if (!el) return;

  el.style.display = savedIds.length > 0 ? "none" : "flex";
}

// --------------------
// Events
// --------------------
if (formSubmit) {
  formSubmit.addEventListener("submit", function (e) {
    e.preventDefault();

    const movieName = document.getElementById("search-bar");
    searchMovies(movieName.value);

    movieName.value = "";

    const empty = document.getElementById("empty-space");
    if (empty) empty.style.display = "none";
  });
}

document.addEventListener("click", function (e) {
  const button = e.target.closest(".add-movie-btn");
  if (!button) return;

  const imdbID = button.dataset.imdbid;

  if (renderArea) {
    saveId(imdbID);
  } else if (watchlistArea) {
    removeId(imdbID);
  }
});

// Init
renderWatchList();
watchlistBackgroundText();
