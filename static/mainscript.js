
async function fetchMovies() {
  const url = ''
  try {
    const params = new URLSearchParams();
    params.append("username", document.getElementById('usernameInput').value)

    const response = await fetch(url, '/${params}');
    if (!response.ok) {
      throw new Error('Response status: ${response.status}');
    }

    const result = await response.json();
    console.log(result);
    document.getElementById('movieinfo').hidden = false
  } catch (error) {
    console.error(error.message);
  }

}



const fetchButton = document.getElementById('FetchButton');


fetchButton.addEventListener('click', fetchMovies);
