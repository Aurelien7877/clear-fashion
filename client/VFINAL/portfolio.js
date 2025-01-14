// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
// cd C:\Users\aurel\OneDrive - De Vinci\ONE DRIVE PC\A4 S8\WebApp\clear-fashion
//git add -A && git commit -m "Todo9"
//git push origin master

// DISCLAIMER : SUr tout mes tests, j'ai déja "excédé" le nombre  de "connexion" (warning par MongoDB) à mon cluster
// Donc il est possible de faire crash avec trop de requetes
// 
// API : https://server-psi-murex.vercel.app/products/search?limit=${size}&brandName=${brand}&price=${price}
//
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
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



const setCurrentProducts = ({result}) => {
  currentProducts = result;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

//J'ai du tout retravailler et adpater a mon api
const fetchProducts = async (size = 12, brand = null, price) => {
  let api;
  try {
    if (brand==null ||brand ==undefined ||brand =="") {
      api = `https://server-psi-murex.vercel.app/products/search?limit=${size}&price=${price}`;
    }
    if(price == undefined){
      api = `https://server-psi-murex.vercel.app/products/search?limit=${size}&brandName=${brand}`;
    }
    if((brand == undefined || brand == null ||brand =="")&& price==undefined){
      api = `https://server-psi-murex.vercel.app/products/search?limit=${size}`;
    }
    if((brand!== undefined && brand !== null ||brand !=="") && price!==undefined) {
      api = `https://server-psi-murex.vercel.app/products/search?limit=${size}&brandName=${brand}&price=${price}`;
    }
    const response = await fetch(api);
    const body = await response.json();
    console.log(body.result)

    return body;
    
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


//
// ------ Liste des fonctions de tri et filtres
//

//Fonction pour méta donnée
function productToMeta(min, max, input){
  const {result} = input;
  const output = result.slice(min,max);
  const products = { result: output};
  return products;
}

function LowPriceFunc(input) {
  const { result } = input; 
  const lowOutput = result.filter(item => {return item.price < 50;});
  const finalOutput = { result: lowOutput};
  return finalOutput;
}

//Comme j'ai tout rescrapé, tous les articles sont présents car ils ont la même date mais la fonction marche 
//idem pour Sort avec 
function getRecent(input) {
  const {result} = input; 
  const timelaps = Date.now() - (14 * 24 * 60 * 60 * 1000);
  const prodrecent = result.filter(item => {
    const time = Date.parse(item.date); 
    return time >= timelaps;
  });
  const finalOutput = { result: prodrecent}; //sortie en meta donnée
  return finalOutput;
}

function priceAscending(input) {
  const {result} = input; 
  const resTemp = result.slice().sort((a, b) => a.price - b.price); 
  const finalOutput = { result: resTemp}; 
  return finalOutput;
}

function priceDescending(input) {
  const { result} = input; 
  const resTemp = result.slice().sort((a, b) => b.price - a.price); 
  const finalOutput = { result: resTemp}; 
  return finalOutput;
}

function dateAscending(input) {
  const { result} = input; 
  const resTemp = result.slice().sort((a, b) => {
    const dateOne = new Date(a.date);
    const dateTwo = new Date(b.date);
    return dateOne - dateTwo;
  }); 
  const finalOutput = { result: resTemp}; 
  return finalOutput;
}

function dateDescending(input) {
  const { result} = input; 
  const resTemp = result.slice().sort((a, b) => {
    const dateOne = new Date(a.date);
    const dateTwo = new Date(b.date);
    return dateTwo - dateOne;
  }); 
  const finalOutput = { result: resTemp}; 
  return finalOutput;
}

//Fonction de ma première étape :retrouver tout les produits en fonction des filtres

const AllProd = async(page,size,brand,recent,price,filters) => {
	let products = [];
	if (price == true){products = await fetchProducts(3000,brand,50);} //3000 pour tout avoir '2033'
  else{products = await fetchProducts(3000,brand);}

	if(recent == true){
			products = await fetchProducts(3000);
			products =  getRecent(products)
	}
	
	if(price == true){products = LowPriceFunc(products);}

	if (filters == "price-desc"){products = priceDescending(products);}

  if (filters == "price-asc"){products = priceAscending(products);}

	if (filters == "date-desc"){products = dateDescending(products);}

	if (filters == "date-asc"){products = dateAscending(products);}

  products = productToMeta(page*size - size,page*size,products)
  return products;

	};

//Etape 2 : On filtre les resultats	
const filterProd = async(brand, recent, price,filters) => {
	let products = [];
	if (price == true){products = await fetchProducts(3000,brand,50); }
  else{products = await fetchProducts(3000,brand);}

	if(recent == true){products =  getRecent(products)	}

  if (filters == "price-desc"){products = priceDescending(products);}

	if (filters == "price-asc"){products = priceAscending(products);}

	if (filters == "date-desc"){products = dateDescending(products);}

	if (filters == "date-asc"){products = dateAscending(products);}

  return products;
	};


  let favoriteItems = [];
  const temp = JSON.parse(localStorage.getItem("favoriteItems"));
  if (temp !=null) {favoriteItems = temp}


  const getFavorite = async(favoriteItems) =>{
    let products = [];
    try {
    for (let i = 0; i < favoriteItems.length; i++) {
     const response = await fetch(`https://server-psi-murex.vercel.app/products/${favoriteItems[i]}`);
     const body = await response.json(); 
       products.push(body.result);	 
    }
      return products;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

const renderProducts = products => {
  if (!products || products.length === 0) {
    console.error("No products to render");
    sectionProducts.innerHTML = "Nothing with the filters applied";    
    return;
  }
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const template = products
      .map(product => {

        let checkbox = "";
        if(favoriteItems.includes(product._id)){
          checkbox = "checked";
        }

        return `
        <div class="product" id="${product._id}">
          <span class="heartclass">💛</span>
          <input class="checkboxclass" type="checkbox" id="${product._id}" ${checkbox}>
          <span class ="BrandName">${product.brandName}</span>
          <a href="${product.link}" target="_blank">${product.name}</a>
          <span class = "Price">${product.price} €</span>
          <a><img class="product-image" src="${product.img}"></a>
        </div>
      `;
      })
      .join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);


};


let pagecurrent = 1;
/**
 * Render page selector
 * @param  {Object} pagination
 */
 
const renderPagination = datafiltered => {
  const dimePage = Math.ceil(datafiltered.result.length/selectShow.value);
  const options = Array.from(
    {'length': dimePage},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  selectPage.innerHTML = options;
  selectPage.selectedIndex = pagecurrent - 1;
};

const renderIndicators = products  => {
  const count = products.result.length;
  spanNbProducts.innerHTML = count;
};






const render = (products, datafiltered,brands) => {
  renderProducts(products);
  renderPagination(datafiltered);
  renderIndicators(datafiltered);
  renderBrandsNB();
  renderRecentProducts(datafiltered);
  renderP50P90P95(datafiltered);
  renderLastReleasedDate(datafiltered);

  const checkboxes = document.querySelectorAll('.checkboxclass');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', event => {
      const idCHECKED = event.target.id;
      if (event.currentTarget.checked) {favoriteItems.push(idCHECKED);}
      else{
        let i = 0;
        while (i < favoriteItems.length) {
          if (favoriteItems[i] === idCHECKED) {favoriteItems.splice(i, 1);} 
          else {++i;}
        }
      }
      localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
      console.log("fav :",favoriteItems);
    });
  });

};


async function fetchBrands() {
  try {
    const response = await fetch(
      'https://server-psi-murex.vercel.app/brands'
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error)
    return [];
  }
}

//-------------- Les indicateurs -----------

const renderBrands = brands => {
  const brandNames = Object.values(brands)[0];
  const options = brandNames
    .map(name => `<option value="${name}">${name}</option>`)
    .join('');
    brandSelect.innerHTML = `<option value="">All or Get Fav</option>` + options;
};

async function renderBrandsNB(){
  if(brandSelect.value == ""){
    const brand = await fetchBrands();
    showNbBrands.innerHTML = brand.result.length;
    }
    else {
      showNbBrands.innerHTML = 1;
    }
};

async function renderRecentProducts(products){
  let prod = getRecent(products);
  const nbRecentProducts = prod.result.length
  showNbRecent.innerHTML = nbRecentProducts;
};

async function renderP50P90P95(products){
  const prices = products.result.map((product) => product.price); // extract prices from result array
  let sortPrice =  prices.slice().sort((a, b) => a - b)
  p50 = sortPrice[Math.floor(sortPrice.length * 0.5)];
  p90 = sortPrice[Math.floor(sortPrice.length * 0.9)];
  p95 = sortPrice[Math.floor(sortPrice.length * 0.95)];

  showP50.innerHTML = p50;
  showP90.innerHTML = p90;
  showP95.innerHTML = p95;
};

async function renderLastReleasedDate(products){
  if (products.result.length !== 0){
    const sortedProducts = products.result.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastDateReleased = sortedProducts[0];
    showLastReleasedDate.innerHTML = lastDateReleased.date
    }
  else {
  lastDateReleased = "Null"
  showLastReleasedDate.innerHTML = lastDateReleased;
  }
};


//-------------- Les event Listeners -----------
///
function dislpayCharging (){
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = `
  <div class="loading">
  <div></div>
  <div></div>
  <div></div>
</div>`;

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '';
  sectionProducts.appendChild(fragment);
};


document.addEventListener('DOMContentLoaded', async () => {
  dislpayCharging ()
  let products = await fetchProducts();
  let brands = await fetchBrands();

  setCurrentProducts(products);
  renderBrands(brands);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  
  render(products.result, filteredproduct);

});



//let favorite = false;
//let price = false;

selectShow.addEventListener('change', async (event) => {
  dislpayCharging ()
  let products = await AllProd(pagecurrent,parseInt(event.target.value),brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  
  setCurrentProducts(products);
  render(currentProducts, filteredproduct, brandSelect.value);
});

selectPage.addEventListener('change', async (event) => {
  dislpayCharging ()
  let page = parseInt(event.target.value);
  pagecurrent = page

  let products = await AllProd(page,selectShow.value,brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  setCurrentProducts(products);
  render(currentProducts, filteredproduct, brandSelect.value);

});

brandSelect.addEventListener('change', async (event) => {
  dislpayCharging ()
  let products = await AllProd(pagecurrent,selectShow.value,event.target.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  setCurrentProducts(products);
  render(currentProducts, filteredproduct, event.target.value);
});

filterSelectNew.addEventListener("click", async (event) => {
  dislpayCharging ()
  let products = await AllProd(pagecurrent,selectShow.value,brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  setCurrentProducts(products);
  render(currentProducts, filteredproduct, brandSelect.value);
});

filterSelectPrice.addEventListener("click", async (event) => {
  dislpayCharging ()
  let products = await AllProd(pagecurrent,selectShow.value,brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  setCurrentProducts(products);
  render(currentProducts, filteredproduct, brandSelect.value);
  
});

sortSelect.addEventListener('change', async (event) => {
  dislpayCharging ()
  let products = await AllProd(pagecurrent,selectShow.value,brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,event.target.value);

  const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
  setCurrentProducts(products);
  render(currentProducts, filteredproduct, brandSelect.value);
});



showFav.addEventListener('change', async(event) => {
  dislpayCharging ()
  if (event.currentTarget.checked) {
    //favorite = true;
    let products = await getFavorite(favoriteItems);

    const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
    setCurrentProducts(products);
    render(products, filteredproduct,brandSelect.value);
  }
  else{
    //favorite = false;
    let products = await AllProd(pagecurrent,selectShow.value,brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);

    const filteredproduct = await filterProd(brandSelect.value,filterSelectNew.checked,filterSelectPrice.checked,sortSelect.value);
    setCurrentProducts(products);
    render(currentProducts, filteredproduct, brandSelect.value);
  }
});
