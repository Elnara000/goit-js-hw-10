import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from "lodash.debounce";

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    infoCard: document.querySelector('.country-info')
}
let searchQuery = '';
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    searchQuery = e.target.value.trim();
     fetchCountries(searchQuery)
    .then((posts) => {
        if (posts.length > 10) {
           return Notify.info("Too many matches found. Please enter a more specific name.", {timeout: 1500})
        } else if (posts.length === 1 && refs.infoCard.innerHTML === '') {
            renderCard(posts)
            refs.list.innerHTML = '';
           return          
        } else if (posts.length > 2 && posts.length <= 10) {            
            renderPosts(posts)
            refs.infoCard.innerHTML = '';
        }
    })
    .catch((error) => Notify.failure("Oops, there is no country with that name", {timeout: 1500}));

    if (!searchQuery) {
        refs.list.innerHTML = '';
        refs.infoCard.innerHTML = '';
    }
}

function renderPosts(posts) {
    const markupList = posts.map(({name: {official}, flags: {svg}}) => 
    `<li class="list-item"><img src="${svg}" alt="${official}" width="50px"/>
    <p class="list-descr">${official}</p></li>`)
    .join('');
    refs.list.innerHTML = markupList;
}

function renderCard(posts) {
    const markupCard = posts.map(({name: {official},capital,population,flags: {svg}, languages}) => {
    const langArray = Object.values(languages).join(', ');
    return `<img src="${svg}" alt="official country name" width="100px" />
    <h1 class="header">${official}</h1>
    <p class="card-descr"><span class="card-span">Capital:</span> ${capital}</p>
    <p class="card-descr">
      <span class="card-span">Population</span>: ${population}
    </p>
    <p class="card-descr">
      <span class="card-span">Languages:</span> ${langArray}
    </p>`}).join('');
    refs.infoCard.insertAdjacentHTML('beforeend', markupCard);
}




