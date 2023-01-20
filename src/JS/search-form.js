import { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createGallery, clearGallery, getPhotosByAxios } from './library.js';
let galleryData = null;

const form = document.querySelector('.search-form');

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget.elements;

  galleryData = getPhotosByAxios(searchQuery.value.trim())
    .then(resp => {
      console.log(resp);
      console.log(resp.status);
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      if (resp.data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      clearGallery();
      createGallery(resp.data.hits);
      // return resp;
    })
    .catch(err => Notify.failure('' + err));
}
