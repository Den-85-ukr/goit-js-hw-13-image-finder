import axios from 'axios';
import makeMarkup from '../templates/img-markup.hbs';
import { debounce } from 'debounce';

const refs = {
    listRef: document.querySelector('.gallery'),
    btnRef: document.querySelector('.load-more'),
    inputRef: document.querySelector('input'),
    sumbitRef: document.querySelector('.submit'),
}
    
const keyApi = '20406911-f22ead56d7a6718c622225634';
const baseURL = 'https://pixabay.com/api/';

let hasEventListener = false;
refs.sumbitRef.addEventListener('click', search);

let page = 1;

function search(data) {
    data.preventDefault();
    refs.listRef.innerHTML = '';
    page = 1;
    makeRequest();
    if (!hasEventListener) {
        window.addEventListener('scroll', debounce(loadMorePgs, 500));
    }
}

async function makeRequest() {
    const requestWord = refs.inputRef.value;

    try {
        const request = await axios.get(
          `${baseURL}?image_type=photo&orientation=horizontal&q=${requestWord}&page=${page}&per_page=12&key=${keyApi}`,
        );
        handleRequest(request);
        return request;
    } catch (err) {
        throw error;
    }
}

function handleRequest(request) {
    const data = request.data.hits;
    const markup = makeMarkup(data);
    refs.listRef.insertAdjacentHTML('beforeend', markup);
}

async function loadMorePgs() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        hasEventListener = true;
        page += 1;
        makeRequest();
    }
}
