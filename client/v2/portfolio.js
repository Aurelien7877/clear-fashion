// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
GET https://clear-fashion-api.vercel.app/
GET https://clear-fashion-api.vercel.app/brands
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const brandSelect = document.querySelector('#brand-select');


const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};


const fetchProducts = async (page = 1, size = 12, brand =null) => {
  try {
    let url = `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`;
    if (brand) {
      url += `&brand=${brand}`;
    }

    const response = await fetch(url);
    const body = await response.json();


    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};





const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};


const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};


const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};



selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});




document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();
  setCurrentProducts(products);
  renderBrands(brands);
  render(currentProducts, currentPagination);
});

/* FEATURE 1 */
//To load the page
const loadPage = async (page) => {
  const products = await fetchProducts(page, parseInt(selectShow.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
};

//When a page is selected, call 'loadpage'
selectPage.addEventListener('change', (event) => {
  loadPage(parseInt(event.target.value));
});

//Feature 2
//First, we need to fetch the list of available brands
async function fetchBrands() {
  try {
    const response = await fetch(
      'https://clear-fashion-api.vercel.app/brands'
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(error);
      //return [];
    }

    else {
      return body.data.result;
    }
  } catch (error) {
    console.error(error);
  }
}
//Next, we need to render the brands in the select element for brands.
const renderBrands = brands => {
  const options = brands
    .map(brand => `<option value="${brand}">${brand}</option>`)
    .join('');

  brandSelect.innerHTML = options;
};

//add an event listener to the select element for brands to filter the products based on the selected brand.
brandSelect.addEventListener('change', async (event) => {
  const brand = event.target.value;
  let products;

  if (brand) {
    products = currentProducts.filter(product => product.brand === brand);
  } else {
    products = await fetchProducts(currentPagination.currentPage, parseInt(selectShow.value));
    setCurrentProducts(products);
  }

  render(products, currentPagination);
});