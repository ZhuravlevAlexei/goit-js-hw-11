const form = document.querySelector('.search-form');

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  console.log(evt);
}
