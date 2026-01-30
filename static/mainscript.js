
async function fetchMovies() {
  try {
    if (document.getElementById('usernameInput').value != username) {
      const params = new URLSearchParams()
      params.append("username", document.getElementById('usernameInput').value);
      username = document.getElementById('usernameInput').value;

      const response = await fetch(`/getmoviedata?${params}`);
      if (!response.ok) {
        throw new Error('Response status: ${response.status}');
      }

      const result = await response.json();
      console.log(result);
      movies = result;
      document.getElementById('banner').hidden = true;
      document.getElementById('movieinfo').hidden = false;
      pickMovie();
    }
    else { 
      pickMovie();
    }

  } catch (error) {
    console.error(error.message);
  }

}

async function pickMovie() {
  if (movies != null) {
    const genre = document.getElementById('genreSelect').value;
    const rating = document.getElementById('ratingSelect').value;
    let list_of_possible_movies = [];
    for (let i = 0; i < movies.length; i++) {
      var genres = movies[i].Genre.split(", ");
      const movieRating = Number(movies[i].imdbRating);
      if ((genres.includes(genre) || genre == "All") 
          && (movieRating >= Number(rating) || rating == "All")) {
        list_of_possible_movies.push(movies[i]);
      }
    }
    const movieIndex = Math.floor(Math.random() * (list_of_possible_movies.length + 1));
    const chosenMovie = list_of_possible_movies[movieIndex];

    document.getElementById('poster').src = chosenMovie.Poster;
    document.getElementById('movie-name').innerHTML = chosenMovie.Title;
    document.getElementById('movie-genre').innerHTML = chosenMovie.Genre;
    document.getElementById('movie-rating').innerHTML = chosenMovie.imdbRating;
  }
    
}


const fetchButton = document.getElementById('FetchButton');
let username = document.getElementById('usernameInput').value; 
let movies;

fetchButton.addEventListener('click', fetchMovies);
