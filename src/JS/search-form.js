import { Notify } from 'notiflix';

import {
  loadMoreBtn,
  createGallery,
  clearGallery,
  getPhotosByAxios,
} from './library.js';

export let curPaginationPage = 1;
export let curSearchString = '';

let firstSearch = true;

const form = document.querySelector('.search-form');

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

const guard = document.querySelector('.js-guard');

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};

export let observer = new IntersectionObserver(onScroll, options);

function onScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore('');
    }
  });
}

function onSubmit(evt) {
  evt.preventDefault();
  curPaginationPage = 1;
  const { searchQuery } = evt.currentTarget.elements;
  curSearchString = searchQuery.value.trim();
  getPhotosByAxios(curSearchString, curPaginationPage)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      clearGallery();
      if (resp.data.hits.length === 0) {
        loadMoreBtn.hidden = true;
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        observer.unobserve(guard);
      } else {
        if (firstSearch !== true) {
          Notify.success(`"Hooray! We found ${resp.data.totalHits} images."`);
        }
        // console.log(curPaginationPage);
        createGallery(resp.data, curPaginationPage);
        curPaginationPage += 1;
        observer.observe(guard);
      }
      firstSearch = false;
    })
    .catch(err => Notify.failure('' + err));
}

function onLoadMore(evt) {
  loadMoreBtn.hidden = true;

  getPhotosByAxios(curSearchString, curPaginationPage)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      if (resp.data.hits.length === 0) {
        loadMoreBtn.hidden = true;
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        // console.log(curPaginationPage);
        createGallery(resp.data, curPaginationPage);
        curPaginationPage += 1;

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    })
    .catch(err => Notify.failure('' + err));
}

loadMoreBtn.hidden = true;
