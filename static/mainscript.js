var done = false;

async function fetchMovies() {

  try {
    if (document.getElementById('usernameInput').value != username || movies == null) {
      done = false;
      document.getElementById('error').hidden = true;
      loopUntilDone();
      const params = new URLSearchParams()
      params.append("username", document.getElementById('usernameInput').value);
      username = document.getElementById('usernameInput').value;

      const response = await fetch(`/getmoviedata?${params}`);
      console.log(response)
      if (!response.ok) {
        if (response.status == 429) {
          done = true;
          document.getElementById('error').hidden = false;
          document.getElementById('error').innerHTML = `Too many requests, in 60 seconds`;
          throw new Error('Too many requests, try again later');
        }
        throw new Error('Response status: ${response.status}');
      }

      const result = await response.json();
      console.log(result);
      movies = result[0];
      document.getElementById('movieinfo').hidden = false;
      document.getElementById('movieinfo').style.display = 'flex';
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
      console.log(movies[i].Genre);
      let genres;
      if (movies[i].Genre != null) {
        genres = movies[i].Genre.split(", ");
      }
      else {
        genres = [];
      }
      const movieRating = Number(movies[i].imdbRating);
      if ((genres.includes(genre) || genre == "All") 
          && (movieRating >= Number(rating) || rating == "All")) {
        list_of_possible_movies.push(movies[i]);
      }
    }
    const movieIndex = Math.floor(Math.random() * (list_of_possible_movies.length));
    const chosenMovie = list_of_possible_movies[movieIndex];

    document.getElementById('poster').src = chosenMovie.Poster;
    document.getElementById('movie-title').innerHTML = chosenMovie.Title;
    document.getElementById('movie-genre').innerHTML = chosenMovie.Genre;
    document.getElementById('movie-rating').innerHTML = chosenMovie.imdbRating;
    document.getElementById('movie-plot').innerHTML = chosenMovie.Plot;
    done = true;
  }
    
}


async function loopUntilDone() {
    if (done) {
        bar.set(1.0); // Finish at 100% when done
        return;
    }
    
    bar.animate(0, function() {
        bar.animate(1, loopUntilDone);
    });
}

var bar = new ProgressBar.Path('#heart-path', {
  easing: 'easeInOut',
  duration: 1400
});

bar.set(0);
bar.animate(1.0);  // Number from 0.0 to 1.0

const fetchButton = document.getElementById('FetchButton');
let username = document.getElementById('usernameInput').value; 
let movies;
fetchButton.addEventListener('click', fetchMovies);
