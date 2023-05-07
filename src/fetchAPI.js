import axios from 'axios';

const API_KEY = '36143815-ea740a42d540c7990675da33a';
const BASE_URL = 'https://pixabay.com/api/';
const imageType = 'photo';
const orientationType = 'horizontal';
const safesearch = 'true';
const countImage = '40';

async function fetchImages(query, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=${imageType}&orientation=${orientationType}&safesearch=${safesearch}&page=${page}&per_page=${countImage}`
  );
  return response.data;
}

export { fetchImages };