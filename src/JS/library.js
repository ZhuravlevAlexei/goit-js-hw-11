import axios from 'axios';

const galleryDiv = document.querySelector('.gallery');

export function getPhotos(searchString) {
  //https://pixabay.com/
  //user: u_nxmifzq7cj; key: 32936589-73134fb91afb2b55fe07bd374
  const URL_KEY = 'https://pixabay.com/api/';
  const myPIXABAY_KEY = '32936589-73134fb91afb2b55fe07bd374';
  const FILTER_PARAMETERS = `?key=${myPIXABAY_KEY}&q=${searchString}&image_type=photo&orientation=horizontal&safesearch=true`;
  const resp = fetch(URL_KEY + FILTER_PARAMETERS)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      return resp.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      console.log(data);
    })
    .catch(err => console.log(err));
}

export async function getPhotosByAxios(searchString) {
  const URL_KEY = 'https://pixabay.com/api/';
  const myPIXABAY_KEY = '32936589-73134fb91afb2b55fe07bd374';
  const FILTER_PARAMETERS = `?key=${myPIXABAY_KEY}&q=${searchString}&image_type=photo&orientation=horizontal&safesearch=true`;
  const resp = await axios.get(URL_KEY + FILTER_PARAMETERS);

  return resp;
}

export function createGallery(data) {
  console.log('start', data);
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
        `<div class="photo-card">
        <img src=${webformatURL} data-source=${largeImageURL} alt=${tags} loading="lazy" />
        <div class="info">
        <p class="info-item">Likes ${likes}</p>
        <p class="info-item">Views  ${views}</p>
        <p class="info-item">Comments ${comments}</p>
        <p class="info-item">Downloads ${downloads}</p>
        </div>
    </div>`
    )
    .join('');

  galleryDiv.insertAdjacentHTML('beforeend', galleryMarkup);
}

export function clearGallery() {
  galleryDiv.innerHTML = '';
}
