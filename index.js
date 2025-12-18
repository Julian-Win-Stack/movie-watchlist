const apiKey = '8d158d28'
const renderArea = document.getElementById('render-area')
const formSubmit = document.getElementById('index-form')
const watchlistArea = document.getElementById('watchlist-area')
let renderData = ``
let watchlist = ``
function saveId(imdbID){
    const ids = getSavedIds()
    if (ids.includes(imdbID)) return

    ids.push(imdbID)
    localStorage.setItem("watchListIds",JSON.stringify(ids))
}

function removeID(imdbID){
    const ids =getSavedIds()
    const newids = ids.filter(id => id !== imdbID)
    localStorage.setItem("watchListIds",JSON.stringify(newids))
    checkRenderWatchlist()
}

function getSavedIds(){
    return JSON.parse(localStorage.getItem("watchListIds") || "[]")
}

async function searchMovies(title) {
    renderData = ``
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${title}`)
    const data = await res.json()
    for(const element of data.Search){
        const movieDetails = await getMovieDetails(element.imdbID)
        renderData += `<div class="border">
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
                    <button class="add-movie-btn" data-imdbid = "${element.imdbID}">
                        <img src="img/plus-icon.svg">
                        <p>Watchlist</p>
                    </button>
                </div>
                <div class="movie-summary">
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </div>`
    }    
    render(renderData)
}

async function getMovieDetails(movieKey) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieKey}`)
    const data = await res.json()
    return data
}

if (formSubmit){
    formSubmit.addEventListener('submit',function(e){
        e.preventDefault()
        let movieName = document.getElementById('search-bar')
        searchMovies(movieName.value)
        movieName.value = ''
        document.getElementById('empty-space').style.display = 'none'
    })
}

document.addEventListener('click',function(e){
    const button = e.target.closest('.add-movie-btn')

    if(!button) return

    const imdbID = button.dataset.imdbid

    if(renderArea){
        saveId(imdbID)
    } else if (watchlistArea){
        removeID(imdbID)
    }
    
})

function render(movieData){
    renderArea.innerHTML = movieData
}

async function renderWatchList() {
    watchlist = ``
    watchlistArea.innerHTML = ``
    const ids = getSavedIds()
    for (const id of ids)
    {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
        const data = await res.json()
        watchlist += `<div class="border">
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
                    <button class="add-movie-btn" data-imdbid = "${id}">
                        <img src="img/minus-icon.svg">
                        <p>Watchlist</p>
                    </button>
                </div>
                <div class="movie-summary">
                    <p>${data.Plot}</p>
                </div>
            </div>
        </div>`
    }
    watchlistArea.innerHTML = watchlist
    watchlistBackgroundText()
    
}
function checkRenderWatchlist(){
    if (watchlistArea){
    renderWatchList()
}
}
checkRenderWatchlist()

function watchlistBackgroundText(){
        const saveIds = getSavedIds()
    if (saveIds.length > 0 && watchlistArea){
        document.getElementById('watchlist-background-text').style.display = 'none'
    } else if (saveIds.length === 0 && watchlistArea){
        document.getElementById('watchlist-background-text').style.display = 'flex'
    }
}

watchlistBackgroundText()


