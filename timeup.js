// Selector variables
const searchBar = document.querySelector('.search__bar');
const header = document.querySelector('.header');
const login = document.querySelector('.login');
const loginBtn = document.querySelector('.login__btn');
const settingsBtn = document.querySelector('.settings');
const profileBox = document.querySelector('.profile__box');
const profileName = document.querySelector('.profile__name');
const btns = document.querySelectorAll('.btn');
const loginContainer = document.querySelector('.login__container');
const usernameInput = document.querySelector('.username__input');
const passwordInput = document.querySelector('.password__input');
const submitBtn = document.querySelector('.submit__btn');
const timeUpLogo = document.querySelector('.timeup__logo');
const searchContainer = document.querySelector('.search__container');
const moviesContainer = document.querySelector('.movie__searches__container');
const runtimeContainer = document.querySelector('.runtime__container');

let accountName;
let runtimeTotal = 0;
//------------------------------------------------------------------------------------------
//functions
const profClickedOpen = function () {
  profileBox.style.backgroundColor = 'rgba(236, 239, 240, 1)';
  settingsBtn.classList.remove('hidden');
  login.classList.remove('hidden');
  profileName.style.visibility = 'visible';
};

const profClickedClose = function () {
  profileBox.style.backgroundColor = 'rgba(236, 239, 240, 0)';
  settingsBtn.classList.add('hidden');
  login.classList.add('hidden');
  profileName.style.visibility = 'hidden';
};

const showLoginContainer = function () {
  header.style.backgroundImage = 'none';
  loginContainer.classList.remove('hidden');
  header.style.visibility = 'hidden';
  profileBox.style.visibility = 'hidden';
  timeUpLogo.style.visibility = 'hidden';
};
const checkHidden = function () {
  document.querySelectorAll('.time__text').forEach(el => {
    if (
      !el.parentElement.classList.contains('hidden') ||
      el.previousElementSibling.textContent < '1'
    ) {
      return;
    } else {
      el.parentElement.classList.remove('hidden');
    }
  });
};

const checkTimePlurality = function () {
  const timeYears = document.querySelector('.years');
  const timeDays = document.querySelector('.days');
  const timeHours = document.querySelector('.hours');
  const timeMin = document.querySelector('.min');
  const yearsContainer = document.querySelector('.years__container');
  const daysContainer = document.querySelector('.days__container');
  const hoursContainer = document.querySelector('.hours__container');
  const minContainer = document.querySelector('.min__container');
  yearsContainer.lastElementChild.textContent =
    parseInt(timeYears.textContent) > 1 ? 'years' : 'year';
  daysContainer.lastElementChild.textContent =
    parseInt(timeDays.textContent) > 1 ? 'days' : 'day';
  hoursContainer.lastElementChild.textContent =
    parseInt(timeHours.textContent) > 1 ? 'hours' : 'hour';
  minContainer.lastElementChild.textContent =
    parseInt(timeMin.textContent) > 1 ? 'minutes' : 'minute';
};

const closeLoginContainer = function () {
  header.style.backgroundImage = "url('/imgs/header.png')";
  loginContainer.classList.add('hidden');
  header.style.visibility = 'visible';
  profileBox.style.visibility = 'visible';
  timeUpLogo.style.visibility = 'visible';
};
const search = async function () {
  const searchInput = searchBar.value;
  if (!searchInput) return;
  const res = await fetch(`https://api.timeup.app/?s=${searchBar.value}`);
  const data = await res.json();
  renderSearch(data.Search);
};
const fetchImdb = async function (imdb) {
  const res = await fetch(`https://api.timeup.app/?i=${imdb}`);
  const data = await res.json();
  const parsedRuntime = parseInt(data.Runtime);
  renderTime(parsedRuntime);
};

const renderTime = function (parsedRuntime) {
  runtimeTotal += parsedRuntime;
  const runtimeCounter = Math.trunc(runtimeTotal / (60 * 24));
  const timeYears = document.querySelector('.years');
  const timeDays = document.querySelector('.days');
  const timeHours = document.querySelector('.hours');
  const timeMin = document.querySelector('.min');
  timeHours.textContent = Math.trunc(runtimeTotal / 60) + ':';
  timeMin.textContent = runtimeTotal % 60;
  timeHours.textContent =
    parseInt(timeHours.textContent) >= 24
      ? Math.trunc(runtimeTotal / 60 - 24 * runtimeCounter) + ':'
      : Math.trunc(runtimeTotal / 60) + ':';
  timeDays.textContent =
    Math.trunc(runtimeTotal / (60 * 24)) >= 365
      ? parseInt(timeDays.textContent) - 365 + ':'
      : Math.trunc(runtimeTotal / (60 * 24)) + ':';
  timeYears.textContent = Math.trunc(runtimeTotal / (60 * 24 * 365));
  checkTimePlurality();
  checkHidden();
};
const renderSearch = async function (data) {
  const searchArr = [];
  moviesContainer.innerHTML = '';
  data.forEach(movie => {
    if (movie.Poster === 'N/A') return;
    if (movie.Poster && movie.Type === 'movie') {
      moviesContainer.insertAdjacentHTML(
        'afterbegin',
        `<div class='render__movie'>
        <img class='movie__poster' src="${movie.Poster}" />
        ${movie.Title}
        </div>`
      );
    }
    searchArr.push({ poster: movie.Poster, imdb: movie.imdbID });
  });
  moviesContainer.addEventListener('click', function (e) {
    searchArr.forEach(movie => {
      if (movie.poster === e.target.src) {
        fetchImdb(movie.imdb);
      }
    });
  });
};

searchContainer.addEventListener('submit', function (e) {
  e.preventDefault();
  try {
    search();
    searchBar.value = '';
  } catch (err) {
    console.log(err);
  }
});
