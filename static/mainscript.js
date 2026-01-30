
async function fetchMovies() {
  try {
    if (document.getElementById('usernameInput').value != username) {
      const params = new URLSearchParams()
      params.append("username", document.getElementById('usernameInput').value);

      const response = await fetch(`/getmoviedata?${params}`);
      if (!response.ok) {
        throw new Error('Response status: ${response.status}');
      }

      const result = await response.json();
      console.log(result);
      movies = result;
      document.getElementById('movieinfo').hidden = false;
      pickMovie
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
    const movieIndex = Math.floor(Math.random() * (movies.length + 1));
    const chosenMovie = movies[movieIndex];
    document.getElementById('poster').src = chosenMovie.Poster;
    document.getElementById('movie-name').innerHTML = chosenMovie.Title;
  }
    
}


const fetchButton = document.getElementById('FetchButton');
let username = document.getElementById('usernameInput').value; 
let movies;

fetchButton.addEventListener('click', fetchMovies);
