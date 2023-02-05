import axios from 'axios';
import { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox;

const galleryDiv = document.querySelector('.gallery');
export const loadMoreBtn = document.querySelector('.load-more');

const paginationPerPage = 40;

export async function getPhotosByAxios(searchString, page = 1) {
  const URL_KEY = 'https://pixabay.com/api/';
  const myPIXABAY_KEY = '32936589-73134fb91afb2b55fe07bd374';
  const FILTER_PARAMETERS = `?key=${myPIXABAY_KEY}&q=${searchString}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${paginationPerPage}`;
  const resp = await axios.get(URL_KEY + FILTER_PARAMETERS);

  return resp;
}

export function createGallery(respData, curPagPage) {
  const data = respData.hits;
  const pagesQty = Math.ceil(respData.totalHits / paginationPerPage);

  const galleryMarkup = data
    .map(
      (
        {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        },
        idx
      ) =>
        `<a class="photo-wrap" href=${largeImageURL}>
        <div class="photo-card">
        <img class="photo-card-img" width=320 height=240 src=${webformatURL} alt=${tags} loading="lazy" />
        <div class="info">
            <p class="info-item">Likes<span class="info-data">${likes.toLocaleString(
              'uk'
            )}</span></p>
            <p class="info-item">Views<span class="info-data">${views.toLocaleString(
              'uk'
            )}</span></p>
            <p class="info-item">Comments<span class="info-data">${comments.toLocaleString(
              'uk'
            )}</span></p>
            <p class="info-item">Downloads<span class="info-data">${downloads.toLocaleString(
              'uk'
            )}</span></p>
        </div>
    </div>
    </a>`
    )
    .join('');
  galleryDiv.insertAdjacentHTML('beforeend', galleryMarkup);
  lightbox.refresh();
  if (curPagPage < pagesQty) {
    loadMoreBtn.hidden = false;
  } else {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

export function clearGallery() {
  galleryDiv.innerHTML = '';
}

lightbox = new SimpleLightbox('.gallery a', {
  // captionDelay: 250,
});
