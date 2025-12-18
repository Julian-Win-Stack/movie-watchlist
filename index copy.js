const apiKey = '8d158d28'
const renderArea = document.getElementById('render-area')
const formSubmit = document.getElementById('index-form')
let renderData = ``
async function searchMovies(title) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${title}`)
    const data = await res.json()
    for(const element of data.Search){
        const movieDetails = await getMovieDetails(element.imdbID)
        console.log(movieDetails)
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
                    <button class="add-movie-btn">
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

formSubmit.addEventListener('submit',function(e){
    e.preventDefault()
    let movieName = document.getElementById('search-bar')
    searchMovies(movieName.value)
    movieName.value = ''
    document.getElementById('empty-space').style.display = 'none'


})

function render(movieData){
    renderArea.innerHTML = movieData
}