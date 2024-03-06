let search = document.getElementById("searchBtn");
var container = document.getElementById("container");
let card = document.getElementById("card");
let cardImage = document.getElementById("image");
let res = document.getElementById("res");
let card404 = document.getElementById("not-found");
let image404 = document.getElementById("image404");
let movieTitle = document.getElementById("movie-title");
let movieYear = document.getElementById("movie-year");
let input = document.getElementById("movie-name");

let closeButton = document.getElementById("closeButton");
//closeButton.addEventListener("click", closeModal);
$('#closeButton').on('click', closeModal)

let modalBG = document.getElementById("bg");

let cards = [];

bg.addEventListener("click", closeModal);

input.addEventListener("keypress", (e) =>
  e.key === "Enter" ? addMovies() : null,
);
search.addEventListener("click", addMovies);

function addMovies() {
  let movieName = document.getElementById("movie-name").value;
  const uri = "https://www.omdbapi.com/?apikey=7ec3e319&s=" + movieName;
  document.getElementById("movie-name").value = "";
  let webTitle = document.getElementById("web-title");
  webTitle.textContent = "Movie Search";

  if (movieName === "") {
    return;
  }

  fetch(uri)
    .then((response) => response.json())
    .then((json) => {
      res.innerHTML = "";
      if (json.Response == "False") {
        let radioContainer = document.getElementById("pages");
        radioContainer.innerHTML = "";
        let card404 = document.createElement("div");
        card404.className = "card404";
        card404.id = "not-found";

        let image404 = document.createElement("img");
        image404.src = "./images/404.png";
        image404.style.width = "300px";
        image404.id = "image404";

        card404.appendChild(image404);
        card404.classList.add("fadeIn");
        card404.style.padding = "25px 0 0 0";

        res.appendChild(card404);
        container.style.minWidth = '0';
        container.style.width = "400px";
        container.style.height = "485px";
        return;
      }
      webTitle.textContent += ` | ${movieName
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ")}`;
      createPages(json);
      let page1 = document.getElementById("page1");
      page1.checked = true;
      json.Search = json.Search.sort((a, b) => a.Year - b.Year);
      card404.classList.remove("fadeIn");
      res.innerHTML = "";
      container.style.width = "570px";
      setTimeout(() => {container.style.minWidth = "570px"}, 750);
      container.style.height = "528px";

      for (let i = 0; i < 3; i++) {
        let posterURL = json.Search[i].Poster;

        let card = document.createElement("div");
        card.className = "card";
        card.id = `card${i + 1}`;

        let cardImage = document.createElement("img");
        cardImage.style.width = "150px";
        cardImage.id = `image${i + 1}`;

        let movieInfo = document.createElement("div");
        movieInfo.className = "movie-info";

        let movieTitle = document.createElement("span");
        movieTitle.id = `movie-title${i + 1}`;

        let movieYear = document.createElement("span");
        movieYear.id = `movie-year${i + 1}`;

        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(movieYear);
        card.appendChild(cardImage);
        card.appendChild(movieInfo);
        res.appendChild(card);

        card.style.cursor = "pointer";

        card.addEventListener("mouseover", hoverCard);
        card.addEventListener("mouseout", unHoverCard);

        card.addEventListener("click", function () {
          openModal(json.Search[i].imdbID);
        });

        posterURL == "N/A"
          ? (cardImage.src = "./images/404.png")
          : (cardImage.src = `${posterURL}`);
        movieTitle.innerHTML = `<b>${json.Search[i].Title}</b>`;
        movieYear.innerHTML = `<b>${json.Search[i].Year}</b>`;
        card.classList.add("fadeIn");
      }
    });
}

function createPages(json) {
  let pagesCount = Math.ceil(json.Search.length / 3);
  let radioContainer = document.getElementById("pages");
  radioContainer.innerHTML = "";
  for (let i = 0; i < pagesCount; i++) {
    let radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "page";
    radioButton.id = `page${i + 1}`;
    radioButton.value = i + 1;

    let label = document.createElement("label");
    label.htmlFor = `page${i + 1}`;
    label.textContent = i + 1;

    radioButton.addEventListener("change", function () {
      if (this.checked) {
        res.innerHTML = "";

        createCard(json, this.value);
      }
    });

    radioContainer.appendChild(radioButton);
    radioContainer.appendChild(label);
  }
}

function createCard(json, pageNumber) {
  let startIndex = (pageNumber - 1) * 3;
  let endIndex = Math.min(startIndex + 3, json.Search.length);

  json.Search = json.Search.sort((a, b) => a.Year - b.Year);
  card404.classList.remove("fadeIn");
  res.innerHTML = "";
  container.style.width = "570px";
  setTimeout(() => {container.style.minWidth = "570px"}, 750);
  container.style.height = "528px";

  for (let i = startIndex; i < endIndex; i++) {
    let posterURL = json.Search[i].Poster;

    let card = document.createElement("div");
    card.className = "card";
    card.id = `card${i + 1}`;

    let cardImage = document.createElement("img");
    cardImage.style.width = "150px";
    cardImage.id = `image${i + 1}`;

    let movieInfo = document.createElement("div");
    movieInfo.className = "movie-info";

    let movieTitle = document.createElement("span");
    movieTitle.id = `movie-title${i + 1}`;

    let movieYear = document.createElement("span");
    movieYear.id = `movie-year${i + 1}`;

    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieYear);
    card.appendChild(cardImage);
    card.appendChild(movieInfo);
    res.appendChild(card);

    card.style.cursor = "pointer";

    card.addEventListener("mouseover", hoverCard);
    card.addEventListener("mouseout", unHoverCard);

    card.addEventListener("click", function () {
      openModal(json.Search[i].imdbID);
    });

    posterURL == "N/A"
      ? (cardImage.src = "./images/404.png")
      : (cardImage.src = `${posterURL}`);
    movieTitle.innerHTML = `<b>${json.Search[i].Title}</b>`;
    movieYear.innerHTML = `<b>${json.Search[i].Year}</b>`;
    card.classList.add("fadeIn");
  }
}

function hoverCard() {
  let currentCardInfo = this.querySelector(".movie-info");
  currentCardInfo.style.opacity = "1";
  currentCardInfo.style.bottom = "-20px";
}
function unHoverCard() {
  let currentCardInfo = this.querySelector(".movie-info");
  currentCardInfo.style.opacity = "0";
  currentCardInfo.style.bottom = "10px";
}

function openModal(imdbID) {
  let modal = document.getElementById("myModal");
  let modalTitle = document.getElementById("modalTitle");
  let modalYear = document.getElementById("modalYear");
  let modalPoster = document.getElementById("modalPoster");
  let modalLength = document.getElementById("modalLength");
  let modalGenre = document.getElementById("modalGenre");
  let modalDirector = document.getElementById("modalDirector");
  let modalPlot = document.getElementById("modalPlot");
  let modalContainer = document.getElementById("modalContainer");
  let rating = document.getElementById("modalRating");
  let metacritic = document.getElementById("modalMetacritic");

  let modalBG = document.getElementById("imageBg");
  let playIcon = document.getElementById("playIcon");

  let bg = document.getElementById("bg");
  let loadingIndicator = document.getElementById("loading");
  loadingIndicator.style.display = "block";

  fetch(`https://www.omdbapi.com/?apikey=7ec3e319&i=${imdbID}`)
    .then((response) => response.json())
    .then((json) => {
      rating.textContent = json.imdbRating;
      let a = document.createElement("a");
      a.href = `https://www.imdb.com/title/${imdbID}`;
      a.target = "_blank";
      modalBG.onclick = function () {
        window.open(
          `https://uaserial.club/search?query=${json.Title.split("")
            .map((w) => (w === "'" ? "" : w.toLowerCase()))
            .map((w) => (w === ":" ? "" : w))
            .join("")}`,
        );
      };
      modalBG.onmouseover = function () {
        modalBG.style.opacity = "0.8";
        let ico = modalBG.querySelector("i");
        ico.classList.add("spin");
      };
      modalBG.onmouseout = function () {
        modalBG.style.opacity = "0";
        let ico = modalBG.querySelector("i");
        ico.classList.remove("spin");
      };
      rating.appendChild(a);
      modalTitle.textContent = json.Title;
      modalYear.textContent = json.Released;
      modalLength.textContent = json.Runtime;
      modalGenre.textContent = json.Genre;
      modalPlot.textContent = json.Plot;
      modalDirector.textContent = json.Director;
      metacritic.textContent = json.Metascore;
      modalPoster.src =
        json.Poster === "N/A" ? "./images/404.png" : json.Poster;
      modalPoster.width = 300;
      modalPoster.height = 444;
      loadingIndicator.style.display = "none";
      modalContainer.style.display = "block";
    });

  bg.style.opacity = "0.5";
  bg.style.display = "block";

  modal.style.opacity = "1";
  modal.style.scale = "1";
}

function closeModal() {
  let modalTitle = document.getElementById("modalTitle");
  let modalYear = document.getElementById("modalYear");
  let modalPoster = document.getElementById("modalPoster");
  let modalLength = document.getElementById("modalLength");
  let modalGenre = document.getElementById("modalGenre");
  let modalDirector = document.getElementById("modalDirector");
  let modalPlot = document.getElementById("modalPlot");
  let rating = document.getElementById("modalRating");
  let metacritic = document.getElementById("modalMetacritic");
  let modalContainer = document.getElementById("modalContainer");

  modalTitle.textContent = "";
  modalYear.textContent = "";
  modalLength.textContent = "";
  modalGenre.textContent = "";
  modalPlot.textContent = "";
  modalDirector.textContent = "";
  rating.textContent = "";
  metacritic.textContent = "";
  modalPoster.src = "";
  modalContainer.style.display = "none";

  let modal = document.getElementById("myModal");

  bg.style.opacity = "0";
  bg.style.display = "none";

  modal.style.opacity = "0";
  modal.style.scale = "0";
}

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const availableTags = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Home Alone",
  "The Lord of the Rings",
  "Harry Potter",
  "The Matrix",
  "The Lion King",
  "The Terminator",
  "The Shining",
  "The Exorcist",
  "The Sixth Sense",
  "The Silence of the Lambs",
  "The Green Mile"
]

$(function () {
  $("#movie-name").autocomplete({
    source: availableTags
  });
});
