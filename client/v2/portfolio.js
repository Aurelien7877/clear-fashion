// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
// cd C:\Users\aurel\OneDrive - De Vinci\ONE DRIVE PC\A4 S8\WebApp\clear-fashion
//git add -A && git commit -m "Todo9"
//git push origin master

// current products on the page
let currentProducts = [];
let currentPagination = {};


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const brandSelect = document.querySelector('#brand-select');
const sortSelect = document.querySelector('#sort-select');
const filterSelectNew = document.querySelector('#select-New');
const filterSelectPrice = document.querySelector('#select-Price');


const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};


const fetchProducts = async (page = 1, size = 12, brand = null, sort = null,recent =false,price = false) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?size=999` + (brand !== null ? `&brand=${brand}` : "")
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    //Obligé d'ajouter les meta data avec le body.result
    var result = body.data.result;
    var meta = {
      currentPage: page,
      pageCount: Math.ceil(result.length / size),
      pageSize: size,
      count: result.length
    };


    //fonctions intermédiaires
    //Filter
    if (recent ==true) {
      result = result.filter(product => (new Date() - new Date(product.released)) / (1000 * 60 * 60 * 24) < 14);
    }
    if (price==true) {
      result = result.filter(product => product.price < 50);
    }
    //Sort
    switch (sort) {
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(b.released) - new Date(a.released));
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(a.released) - new Date(b.released));
        break;
    }



    //Permet de limiter le résultat car sinon tout les resultats sont affichés
    result = result.slice((page - 1) * size, page * size);
    return {result,meta};
    
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
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price} </span>
      </span></div>
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

async function fetchBrands() {
  try {
    const response = await fetch(
      'https://clear-fashion-api.vercel.app/brands'
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(error);
    }
    else {
      var brands = body.data.result;
      return brands;
    }
  } catch (error) {
    console.error(error);
  }
}

const renderBrands = brands => {
  const options = brands
    .map(brand => `<option value="${brand}">${brand}</option>`)
    .join('');

  brandSelect.innerHTML = options;
};


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();

  setCurrentProducts(products);
  renderBrands(brands);
  render(currentProducts, currentPagination);
});


selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(1, parseInt(event.target.value), brandSelect.value, sortSelect.value,filterSelectNew.value,filterSelectPrice.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize, brandSelect.value, sortSelect.value,filterSelectNew.value,filterSelectPrice.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

brandSelect.addEventListener('change', async (event) => {
  const products = await fetchProducts(1, currentPagination.pageSize, event.target.value, sortSelect.value,filterSelectNew.value,filterSelectPrice.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

filterSelectNew.addEventListener("click", async (event) => {
  const products = await fetchProducts(1, currentPagination.pageSize, brandSelect.value, sortSelect.value, true,filterSelectPrice.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

filterSelectPrice.addEventListener("click", async (event) => {
  const products = await fetchProducts(1, currentPagination.pageSize, brandSelect.value, sortSelect.value, filterSelectNew.value, true);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

sortSelect.addEventListener('change', async (event) => {
  const products = await fetchProducts(1, currentPagination.pageSize, brandSelect.value, event.target.value,filterSelectNew.value,filterSelectPrice.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});