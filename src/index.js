
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './fetchAPI';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  observer: document.querySelector('.js-observer'),
  body: document.querySelector('body'),
  input: document.querySelector('.searcher'),
};
let page = 1;
let total ;
let observer;
let isEnd;
let query;
let imgId;
let lastObserver;



function buildMarkup(obj) {
  let markup = obj
    .map(img => {
      imgId += 1;
      console.log('imgId:', imgId);
      return `
      <div class="portfolio-item">
          <div class="portfolio-item-wrap">
          <a href="${img.largeImageURL}">
            <img src=${img.webformatURL} alt=${img.tags}>
            <div class="portfolio-item-inner">
              <ul class="portfolio-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ec4757"
                    class="bi bi-chat-square-heart-fill" viewBox="0 0 16 16">
                    <path
                      d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm6 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
                  </svg><b style="font-size: 16px;">${img.likes}</b></li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                    class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path
                      d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg><b style="font-size: 16px;">${img.views}</b></li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#0d6efd"
                    class="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                    <path
                      d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
                  </svg><b style="font-size: 16px;">${img.comments}</b></li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#198754"
                    class="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                    <path
                      d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                  </svg><b style="font-size: 16px;">${img.downloads}</b></li>
              </ul>
            </div>
            </a>
          </div>
        </div>`;
    })
    .join('');
  if (imgId >= total) {
    isEnd = true;
    markup += `<div class="js-last-observer"></div>`;
    return markup;
  }
  markup += `<div class="js-observer"></div>`;
  return markup;
}
function addMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  if (imgId >= total) {
    createLastObserver();
  }
  window.scrollBy({
    top: refs.input.firstElementChild.getBoundingClientRect().height,
    behavior: 'smooth',
  });
  lightbox.refresh();
}
function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.remove();
      page += 1;
      fetchImages(query, page)
        .then(data => {
          addMarkup(buildMarkup(data.hits));
          observer.observe(document.querySelector('.js-observer'));
        })
        .catch(err => console.log(err));
    }
  });
}
function onSubmit(evt) {
  page = 1;
  imgId = 0;
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  query = evt.currentTarget[0].value;
  createObserver();
  if (query.trim() !== '') {
    fetchImages(query, page)
      .then(data => {
        if (data.totalHits === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        total = data.totalHits;
        addMarkup(buildMarkup(data.hits));
        observer.observe(document.querySelector('.js-observer'));
        Notiflix.Notify.success(`✅ Hooray! We found ${data.totalHits} images.`);
      })
      .catch(err => console.log(err));
  }
}


function createObserver() {
  const options = {
    root: null,
    rootMargin: '400px',
    trashhold: 0,
  };
  observer = new IntersectionObserver(onLoad, options);
}
function createLastObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    trashhold: 0,
  };
  lastObserver = new IntersectionObserver(() => {
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results.'
    );
  }, options);
  lastObserver.observe(document.querySelector('.js-last-observer'));
}



refs.form.addEventListener('submit', onSubmit);



const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
lightbox.on('show.simplelightbox', e => e.preventDefault());
lightbox.on('error.simplelightbox', e => console.log(e));