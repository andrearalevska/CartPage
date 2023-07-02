
//Components

let postContainer = document.getElementById("postContainer");
let numberOfItems = document.getElementById("numberOfItems");
let subtotalPrice = document.getElementById("subtotalPrice");
let totalPrice = document.getElementById("totalPrice");
let standardBtn = document.getElementById("customCheck1");
let premiumBtn = document.getElementById("customCheck2");
let discountCode = document.getElementById("discountCode");
let submitCode = document.getElementById("submitCode");

//Functions

async function getContent(url){

    let fetchedData = await fetch(url).then(result => result.json()).then(data => data);
    localStorage.setItem("products", JSON.stringify(fetchedData));
    let localStorageData = JSON.parse(localStorage.getItem("products")) || {};
    let productsWithQuantities= localStorageData.map(product => ({...product, quantity :1})); 
    localStorage.setItem("products", JSON.stringify(productsWithQuantities));

    let products = productsWithQuantities.map(product => new Product(product.id, product.title, product.price, product.image, product.quantity));

    return products;
}

function printContent(){

    postContainer.innerHTML = ""; 
    let productsArray = JSON.parse(localStorage.getItem("products")) || {};

    let productCounter = 0;
    for(let i =0 ; i < productsArray.length ; i++){
        productCounter += productsArray[i].quantity;
    }
    numberOfItems.innerText = productCounter;
    
    for (let i=0; i<productsArray.length; i++){
        let cartProduct = productsArray[i];
        postContainer.innerHTML += 
            `<div class="d-flex flex-row bd-highlight mb-3 justify-content-around align-items-center w-100">
            <div class="mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
                <div class="col-md-4">
                <img src=${cartProduct.image} class="card-img" alt="...">
                </div>
                <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title text-secondary">${cartProduct.title}</h5>
                    <p class="card-text">Moodle (Brand of the product)</p>
                    <p class="card-text"><small class="text-muted">Size: M (Size of the product)</small></p>
                </div>
                </div>
            </div>
            </div>
            <ul class="pagination">
                <li class="page-item"><a class="page-link text-dark font-weight-bold decreaseQuantity" href="#" id="${cartProduct.id}">-</a></li>
                <li class="page-item"><a class="card p-2 text-dark font-weight-bold" id="quantity${i}">${cartProduct.quantity}</a></li>
                <li class="page-item"><a class="page-link text-dark font-weight-bold increaseQuantity" href="#" id="${cartProduct.id}">+</a></li>
            </ul>
            <div>
            <div class="col" id="singlePrice${i}">€ ${cartProduct.price * cartProduct.quantity}</div>
            </div>
            <div class="close" id="${cartProduct.id}"  type="button">&#10005;</div>
        </div>
        <hr/>`  
    }
    
    increaseQuantity();
    decreaseQuantity();
    subtotalPriceCount();
    deleteProduct();  
    updateTotalPrice();  
}

function updateQuantity(product, quantity, productsArray){
    productsArray.find(p => p.id === product.id).quantity = quantity;
    localStorage.setItem("products", JSON.stringify(productsArray));
}

function increaseQuantity(){

    let increaseQuantityButtons= document.querySelectorAll(".increaseQuantity");
    
    increaseQuantityButtons.forEach(button => {
        button.addEventListener("click",e => {
            let productsArray = JSON.parse(localStorage.getItem("products")) || {};
            let product = productsArray.find(p => p.id === parseInt(e.target.id));
            updateQuantity(product, product.quantity + 1, productsArray);
            printContent();
       }) 
    });
}

function decreaseQuantity(){
    let decreaseQuantityButtons= document.querySelectorAll(".decreaseQuantity");

    decreaseQuantityButtons.forEach(button => {
        button.addEventListener("click",e => {
            let productsArray = JSON.parse(localStorage.getItem("products")) || {};
            let product = productsArray.find(p => p.id === parseInt(e.target.id));               
            updateQuantity(product, product.quantity - 1, productsArray);
            productsArray = JSON.parse(localStorage.getItem("products")) || {};
            product = productsArray.find(p => p.id === parseInt(e.target.id))
            if(product.quantity === 0){
                return deleteFromLocalSt(e.target.id);
            }
            printContent();
       }) 
    });
}

function subtotalPriceCount(){
    let productsArray = JSON.parse(localStorage.getItem("products")) || {};
    let sum = 0;
    
    for(i=0; i<= productsArray.length - 1; i++){
        sum += productsArray[i].quantity * productsArray[i].price;
    }
    if(sum !== subtotalPrice.value){
        standardBtn.checked = true;
        premiumBtn.checked = false;
    }
    subtotalPrice.innerText = sum.toFixed(2);
    return sum;
}

function deleteProduct(){
    let closeButtons = document.querySelectorAll(".close");
    
    closeButtons.forEach(button => {
        button.addEventListener("click", e =>{
            let clicked = e.target;
            deleteFromLocalSt(clicked.id);
            printContent();
        })
    })

}

function deleteFromLocalSt(id){
    let productsArray = JSON.parse(localStorage.getItem("products")) || {};
    let removed_list = productsArray.filter(p => p.id != id);
    
    localStorage.setItem("products", JSON.stringify(removed_list));
    
    printContent();
}

function checkIf(stdBtnValue , prmBtnValue){
    if(stdBtnValue === true){
        premiumBtn.checked = false;
    }
    else if(prmBtnValue === true){
        standardBtn.checked = false;
    }
}

function updateTotalPrice(){
    let price = subtotalPriceCount();
    totalPrice.innerText = price.toFixed(2);
    discountUpdate(price);
    
    standardBtn.addEventListener("click", () => {
        
        checkIf(true, false);
        
        totalPrice.innerText = price.toFixed(2);
        
        discountUpdate(price);
    })

    premiumBtn.addEventListener("click", () => {
        checkIf(false, true);
        
        totalPrice.innerText = (price + 10).toFixed(2);
        
        discountUpdate(price + 10);
    })

}

function discountUpdate(price){
    discountCode.value = "";

    submitCode.addEventListener("click", () => {
        
        if(discountCode.value === "DISCOUNT30"){
            let newPrice = (price - (price*30/100)).toFixed(2);
            totalPrice.innerHTML = `<del>${price.toFixed(2)}</del> ${newPrice}`;
        }
        else{
            totalPrice.innerText = price.toFixed(2);
        }
    })
}

//Models

function Product (id, name, price, image , quantity){
    this.id = id,
    this.name = name,
    // this.brand = brand,
    // this.size = size,
    this.price = price,
    this.image = image,
    this.quantity = quantity
}

getContent("https://fakestoreapi.com/products");
printContent();
