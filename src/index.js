import { fetchImages } from "./js/fetchImages";
import { markup } from "./js/markup";
import Notiflix from "notiflix";
const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
let page = 1;
let query;
loadMoreBtn.classList.add("is-hidden");
searchForm.addEventListener("submit", onSearchForm);
loadMoreBtn.addEventListener("click", onLoadMoreBtn);

async function onSearchForm(evt) {
  evt.preventDefault();
  loadMoreBtn.classList.add("is-hidden");
  gallery.innerHTML = "";
  page = 1;
  query = evt.currentTarget[0].value.trim();
  if (query === "") {
    Notiflix.Notify.failure("Please fill in the search field");
  } else {
    const images = await fetchImages(query, page);

    if (images.totalHits === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    } else {
      gallery.insertAdjacentHTML("beforeend", markup(images.hits));
      loadMoreBtn.classList.remove("is-hidden");
      Notiflix.Notify.success(`We found ${images.totalHits} images.`);
    }
  }
}
async function onLoadMoreBtn() {
  page += 1;
  const images = await fetchImages(query, page);
  if (images.hits.length < 40 && images.hits.length !== 0) {
    loadMoreBtn.classList.add("is-hidden");
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  gallery.insertAdjacentHTML("beforeend", markup(images.hits));
}