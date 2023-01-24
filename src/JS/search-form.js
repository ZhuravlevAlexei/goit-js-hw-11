import { Notify } from 'notiflix';

import {
  loadMoreBtn,
  createGallery,
  clearGallery,
  getPhotosByAxios,
} from './library.js';

let curPaginationPage = 1;
let curSearchString = '';

const form = document.querySelector('.search-form');

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget.elements;
  curSearchString = searchQuery.value.trim();
  getPhotosByAxios(curSearchString, curPaginationPage)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      if (resp.data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      clearGallery();
      createGallery(resp.data, curPaginationPage);
    })
    .catch(err => Notify.failure('' + err));
}

function onLoadMore(evt) {
  loadMoreBtn.hidden = true;
  curPaginationPage += 1;

  getPhotosByAxios(curSearchString, curPaginationPage)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      if (resp.data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`"Hooray! We found ${resp.data.totalHits} images."`);
      createGallery(resp.data, curPaginationPage);
    })
    .catch(err => Notify.failure('' + err));
}

loadMoreBtn.hidden = true;
