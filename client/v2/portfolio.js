// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
// cd C:\Users\aurel\OneDrive - De Vinci\ONE DRIVE PC\A4 S8\WebApp\clear-fashion
//git add -A && git commit -m "Todo9"
//git push origin master

// current products on the page
let currentProducts = [];
let currentPagination = {};
let nbBrands =0;
let nbRecentProducts = 0;
let p50 = 0;
let p90 = 0;
let p95 = 0;
let lastDateReleased = NaN;


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const brandSelect = document.querySelector('#brand-select');
const sortSelect = document.querySelector('#sort-select');
const filterSelectNew = document.querySelector('#select-New');
const filterSelectPrice = document.querySelector('#select-Price');
const showNbBrands = document.querySelector('#nbBrands');
const showNbRecent = document.querySelector('#nbRecent');
const showP50 = document.querySelector('#p50');
const showP90 = document.querySelector('#p90');
const showP95 = document.querySelector('#p95');
const showLastReleasedDate = document.querySelector("#lastReleasedDate");
const showFav = document.querySelector("#select-Fav");



const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};


const fetchProducts = async (page = 1, size = 12, brand = null, sort = null,recent =false,price = false,favorite=false) => {
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
    else if (price==true) {
      result = result.filter(product => product.price < 50);
    }
    else if (favorite==true) {
      result = result.filter(function(prod){
        return favoriteItems.includes(prod.uuid);
      });
      if (result.length==0){return false;}
    }
    //Sort
    switch (sort) {
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'date-asc':
        result = result.sort((a, b) => new Date(b.released) - new Date(a.released));
        break;
      case 'date-desc':
        result = result.sort((a, b) => new Date(a.released) - new Date(b.released));
        break;
    }

    //indicators (expect brands in fetchbrand)
    nbRecentProducts = result.filter(product => (new Date() - new Date(product.released)) / (1000 * 60 * 60 * 24) < 14).length;

    //Corrige le crash de rendu vide (car si on appuie sur recenlty 0 produits)
    if (result.length>0) {
      let sortPrice = [...result].sort((a, b) => a.price - b.price)
      p50 = sortPrice[Math.floor(result.length * 0.5)].price;
      p90 = sortPrice[Math.floor(result.length * 0.9)].price;
      p95 = sortPrice[Math.floor(result.length * 0.95)].price;

      const DateReleased = [...result].sort((a, b) => new Date(b.released) - new Date(a.released));
      lastDateReleased = DateReleased[0].released;
    }
    else { p50=0;p90=0;p95=0;}


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

        let checkbox = "";
        if(favoriteItems.includes(product.uuid)){
          checkbox = "checked";
        }

        return `
        <div class="product" id=${product.uuid}>
        <span class="heartclass">💛</span><input class="heartclass" type="checkbox" id="${product.uuid}" ${checkbox}>
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


let favoriteItems = [];
try{
  favoriteItems = JSON.parse(localStorage.getItem("favList"));
}
catch(error){favoriteItems = []}



const render = (products, pagination,brands) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrandsNB(brands);
  renderRecentProducts();
  renderP50P90P95();
  renderLastReleasedDate();

  const checkboxes = document.querySelectorAll('.heartclass');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', event => {
      const checkboxId = event.target.id;
      if (event.currentTarget.checked) {favoriteItems.push(checkboxId);}
      else{
        let i = 0;
        while (i < favoriteItems.length) {
          if (favoriteItems[i] === checkboxId) {
            favoriteItems.splice(i, 1);
          } 
          else {++i;}
        }
      }
      localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    });
  });

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
      nbBrands = brands.length;
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

const renderBrandsNB = brands => {;
  showNbBrands.innerHTML = nbBrands;
};

const renderRecentProducts = () => {
  showNbRecent.innerHTML = nbRecentProducts;
};

const renderP50P90P95 = () => {
  showP50.innerHTML = p50;
  showP90.innerHTML = p90;
  showP95.innerHTML = p95;
};

const renderLastReleasedDate = () => {
  showLastReleasedDate.innerHTML = lastDateReleased;
};

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();

  setCurrentProducts(products);
  renderBrands(brands);
  render(currentProducts, currentPagination);
});



let favorite = false;
let brand = "coteleparis";
let PageShow =12;
let Sort = "price-asc";

selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), brand, Sort,filterSelectNew.value,filterSelectPrice.values, favorite);
  PageShow = parseInt(event.target.value);
  if (products == false){
    sectionProducts.innerHTML = "Nothing with the filters applied";
    renderPagination(currentPagination);
    renderIndicators(currentPagination);
  }
  else {

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize, brand, Sort,filterSelectNew.value,filterSelectPrice.values,favorite);
  if (products == false){
    sectionProducts.innerHTML = "Nothing with the filters applied";
    renderPagination(currentPagination);
    renderIndicators(currentPagination);
  }
  else {

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }

});

brandSelect.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, event.target.value, Sort,filterSelectNew.value,filterSelectPrice.values,favorite);
  brand = event.target.value;

  if (products == false){
    sectionProducts.innerHTML = "Nothing with the filters applied";
    renderPagination(currentPagination);
    renderIndicators(currentPagination);
  }
  else {
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

filterSelectNew.addEventListener("click", async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, brand, Sort, true,filterSelectPrice.values,favorite);
  if (products == false){
    sectionProducts.innerHTML = "Nothing with the filters applied";
    renderPagination(currentPagination);
    renderIndicators(currentPagination);
  }
  else {

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});

filterSelectPrice.addEventListener("click", async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, brand, Sort, filterSelectNew.value, true,favorite);

  if (products == false){
    sectionProducts.innerHTML = "Nothing with the filters applied";
    renderPagination(currentPagination);
    renderIndicators(currentPagination);
  }
  else {

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
  
});

sortSelect.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, brand, event.target.value,filterSelectNew.value,filterSelectPrice.values,favorite);
  Sort = event.target.value;
  if (products == false){
    sectionProducts.innerHTML = "Nothing with the filters applied";
    renderPagination(currentPagination);
    renderIndicators(currentPagination);
  }
  else {

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
});



showFav.addEventListener('change', async(event) => {
  if (event.currentTarget.checked) {
    favorite = true;
    const products = await fetchProducts(1, currentPagination.pageSize, brand, Sort, filterSelectNew.value,filterSelectPrice.values,favorite);
    if (products == false){
      sectionProducts.innerHTML = "Nothing Here";
      renderPagination(currentPagination);
      renderIndicators(currentPagination);
    }
    else{
      setCurrentProducts(products);
      render(currentProducts, currentPagination, brand);
    }
  }
  else{
    favorite = false;
    const products = await fetchProducts(1, PageShow, brand,Sort, filterSelectNew.value,filterSelectPrice.values,favorite);
    setCurrentProducts(products);
    render(currentProducts, currentPagination,brand);
  }
});
