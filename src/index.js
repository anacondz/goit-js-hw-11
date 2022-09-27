import './scss/main.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiPix from './apipix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryG: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

let isShown = 0;

const GalleryEl = new ApiPix();
refs.searchForm.addEventListener('submit', subForm);
refs.moreBtn.addEventListener('click', fLoad);

async function subForm(e) {
  e.preventDefault();

  if (e.currentTarget.elements.searchQuery.value === '') {
    return (innerHTML = '');
  }

  GalleryEl.query = e.target.elements.searchQuery.value.trim();
  isShown = 0;
  refs.galleryG.innerHTML = '';
  GalleryEl.resetPage();
  fetchGallery();
}

function fLoad() {
  GalleryEl.incrementPage();
  fetchGallery();
}

async function fetchGallery() {
  refs.moreBtn.classList.add('is-hidden');

  const response = await GalleryEl.fetchGallery();
  const { hits, total } = response;

  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  renderGallery(hits);

  isShown += hits.length;

  if (isShown < total) {
    refs.moreBtn.classList.remove('is-hidden');
  }
  if (isShown >= total) {
    Notiflix.Notify.info(
      'We re sorry, but you have reached the end of search results.'
    );
  }
}

function renderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <a class="card" href="${largeImageURL}">
                <div class="card__container">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="card__info">
                        <p class="card__info-item">
                            <b>Likes</b>
                             <span class="card__item-count">${likes}</span>
                        </p>
                        <p class="card__info-item">
                            <b>Views</b>
                             <span class="card__item-count">${views}</span>
                        </p>
                        <p class="card__info-item">
                            <b>Comments</b>
                             <span class="card__item-count">${comments}</span>
                        </p>
                        <p class="card__info-item">
                            <b>Downloads</b>
                             <span class="card__item-count">${downloads}</span>
                        </p>
                    </div>
                </div>
            </a>`;
      }
    )
    .join('');

  refs.galleryG.insertAdjacentHTML('beforeend', markup);
  const simpleLightbox = new SimpleLightbox('.gallery a');
}