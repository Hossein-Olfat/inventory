

const title_category=document.querySelector('#input-title-category');
const description_category =document.querySelector('#input-description-category');
const add_category = document.querySelector('.btn-add-category');
const main_box=document.querySelectorAll(".main-box");
const category =document.querySelector(".category");
const cancel_category =document.querySelector('.btn-cancel-category');
const showing_category =document.querySelector('.showing-category');
const title_product =document.querySelector('#input-title-make-product');
const quantity_product = document.querySelector('#input-quantity-make-product');
let category_product =document.querySelector('#input-category-make-product');
let _category_product=Array.from( category_product );
const btnadd_product =document.querySelector('.btn-form-make-product');
const search_list = document.querySelector('#input-search-list-product');
const sort_list =document.querySelector('#input-sort-list-product');
const searchlist_category=document.querySelector("#input-search-list-category");
const list_container =document.querySelector(".lists-container");
console.log(main_box[0]);
// variables
let categorylist=["select category","frontend","backend","IOS","Linox"];
let productlist=[];
let resultsearchbox=[];
let category_search=[];
let search_value="";
let searchcategory_value="select category";
let sort_value="default";
let id=0;



// category
class Category{
    constructor(){
        this.title;
        this.description;
        
        title_category.addEventListener("blur",(event)=>{
            this.title=control_spaces(event);
        });
            
        description_category.addEventListener("blur",(event)=>{
            this.description=control_spaces(event);
        });
        
        add_category.addEventListener("click",(event)=>{
            event.preventDefault();
            this._savecategory(this.title);
            
        });
            
            
            
        cancel_category.addEventListener("click",(event)=>{
            event.preventDefault();
            this._clear_forminput();
            console.log(this.title,this.description);
        });
          
            

            
        
        showing_category.addEventListener("click",function(){
            if(id===0){
                category.style.display="flex";
                
                id++;
            }else{
                category.style.display="none";
                id--;
            }
            Stoarage.save_id_showcategory();
        });
                
        

    }
   
    _savecategory(value){
       
        if((value!=="" && value!==undefined) && (!checkrepeatvalue(categorylist,value,"Category"))){
            
            categorylist.push(value);
            CategoryUi.showCategoryDoM(category_product);
            CategoryUi.showCategoryDoM(searchlist_category);
            
            Stoarage.savecategories_storage();
            
            this._clear_forminput();

            
        }
            
        
        else if( (value!=="" && value!==undefined) && checkrepeatvalue(categorylist,value,"Category") ){
            console.log("a category with this name has already been saved");
        }else if(value==="" || value===undefined){
            console.log("Please complete all the entries in the form");
        }


    }
    _clear_forminput(){
        
        this.title=undefined;
        this.description=undefined;
        title_category.value="";
        description_category.value="";
    }
        
        
}

class CategoryUi{
   static showCategoryDoM(listcontainer){
       const categories =categorylist.map((category)=>{
           const option_category =  document.createElement("option");
           option_category.value=category;
           option_category.textContent=category;
           return option_category;
        });
        console.log(categories);
        
        listcontainer.innerHTML="";

        categories.forEach((category)=>{
            
           return listcontainer.appendChild(category);
        });
        
    }
}

const _category =new Category();


// product
class Product {
    constructor(){
        this.title;
        this.quantity;
        this.category_choose;
        
        title_product.addEventListener("blur",(event)=>{
            if(event.target.value!==""){
                this.title=control_spaces(event);
            }else{
                this.title=undefined;
            }
        });

        quantity_product.addEventListener("blur",(event)=>{
            const floating_point =event.target.value.toString().split("").some(letter=>{return letter==="e" || letter==="E"});
            if(event.target.value>=1 && !floating_point){
                this.quantity=event.target.value;
           
            }else if(event.target.value===""){
                this.quantity=undefined;
            }else{
                this.quantity=undefined;
                console.log("please complete quantity input only with Positive integer values and dont use floating-point number");
            }
        });
                
        category_product.addEventListener('change',(event)=>{
            if(event.target.value!=="select category"){

                console.log(event.target.value);
                this.category_choose=event.target.value;
            }else{
                this.category_choose=undefined;
            }
        });
                
        searchlist_category.addEventListener('change',(event)=>{
            
            category_search=this._search_category(event.target.value,resultsearchbox);
            this._sortproduct(sort_value,category_search);
        });
            
        search_list.addEventListener("input",(event)=>{
            
            this._searchingproduct(control_spaces(event));
            category_search=this._search_category(searchcategory_value,resultsearchbox);
            this._sortproduct(sort_value,category_search);
        });
        
        sort_list.addEventListener('change',(event)=>{

            category_search=this._search_category(searchcategory_value,resultsearchbox);
            this._sortproduct(event.target.value,category_search); 
        });   
        
        btnadd_product.addEventListener("click",(event)=>{
            event.preventDefault();
            this._saveproduct(this);
        });
       
    }

    _saveproduct(value){
      

      if(value.title!==undefined && value.quantity!==undefined && value.category_choose!==undefined && !checkrepeatvalue(productlist,value,"Product")){
         
            const new_product={_name:this.title,_quantity:this.quantity,_category:this.category_choose,date:new Date(),id:productlist.length};
            productlist=[...productlist,new_product];
            productlist=productlist.sort((a,b)=>{return b.date-a.date});
            console.log(productlist);
            resultsearchbox=productlist;
            
            this._searchingproduct(search_value);
            category_search=this._search_category(searchcategory_value,resultsearchbox);
            this._sortproduct(sort_value,category_search);
             
            Stoarage.saveproduct_storage(productlist);
            this._clear_forminput(3);
            
        }else if(value.title!==undefined && value.quantity!==undefined && value.category_choose!==undefined && checkrepeatvalue(productlist,value,"Product")){
            console.log("a product with this name has already been saved");
        }else if(value.title===undefined || value.quantity===undefined || value.category_choose===undefined){
            console.log("Please complete all the entries in the form");
      }

    }


    _searchingproduct(value){
        search_value=value;

        let productsearchbox=productlist;
        for(let i=0;i<value.length;i++){
            productsearchbox =productsearchbox.filter((product)=>{return product._name.toLowerCase()[i]===value.toLowerCase()[i]}).length>=1 ? productsearchbox.filter((product)=>{return product._name.toLowerCase()[i]===value.toLowerCase()[i]}) : productsearchbox=[];
        }
        resultsearchbox=productsearchbox;
    }
   
    _sortproduct(value,_productlist_){
       
        sort_value=value;
       
        let _sort=[..._productlist_];
       
        if(sort_value==="newest" || sort_value==="default"){
            _productlist_=_productlist_.sort((a,b)=>{return new Date(b.date) - new Date(a.date)});
            _productlist_=ProductUi.showProductDoM(_productlist_);
            return _productlist_;

        }else if(sort_value==="oldest"){
            
            // _sort=_sort.reverse();
            // _sort=ProductUi.showProductDoM(_sort);
            // return _sort;
            //console.log(_productlist_[0].date);
            _sort=_sort.sort((a,b)=>{return new Date(a.date) - new Date(b.date)});
            _sort=ProductUi.showProductDoM(_sort);
            return _sort;


        }else if(sort_value==="most"){
            
            _sort=_sort.sort((a,b)=>{return b._quantity - a._quantity});
            _sort=ProductUi.showProductDoM(_sort);
            return _sort;

        }else if(sort_value==="least"){

            _sort=_sort.sort((a,b)=>{return a._quantity - b._quantity});
            _sort=ProductUi.showProductDoM(_sort);
            return _sort;
        }
            
    }

        
    _search_category(value,_list_){

        searchcategory_value=value;
         
        category_search =_list_.filter((category)=>{
            const result_search = searchcategory_value==="select category" ? category : (category._category===searchcategory_value);
            return result_search;
        });
        return category_search;
    }
 

_clear_forminput(){
        this.title=undefined;
        this.quantity=undefined;
        this.category_choose=undefined;
        title_product.value="";
        quantity_product.value="";
        category_product.value="select category";
}
       
}

class ProductUi{
    static showProductDoM(_productlist){

        
        list_container.innerHTML="";
        _productlist.forEach((product)=>{
           const eachproduct = document.createElement("li");
           eachproduct.classList.add("list");
           const showtime_dom =_date( new Date(product.date) );
          
           
           eachproduct.innerHTML=`<span class="list-name">${product._name}</span>
            <div class="list-info">
               <time class="time-list-info">${showtime_dom}</time>
               <div class="category-list-info">${product._category}</div>
               <div class="numberbox-list-info">${product._quantity}</div>
               <button type="submit" class="delete-list-info"data-id="${product.id}">delete</button>
           </div>`;
            list_container.appendChild(eachproduct);
        });
        
        const delete_list =document.querySelectorAll('.delete-list-info');
        
        delete_list.forEach((Eachdelete)=>{
            Eachdelete.addEventListener("click",(event)=>{
                _productlist=this._removeproduct(event,_productlist);
                return _productlist;
            });

        });

        return _productlist;
        
    }
        
   static _removeproduct(event,_productlist){

        const id_delete =event.target.dataset.id;

        productlist=productlist.filter((product)=>{return product.id.toString()!==id_delete});
        
        resultsearchbox=resultsearchbox.filter((product)=>{return product.id.toString()!==id_delete});
        
        _productlist=_productlist.filter((product)=>{return product.id.toString()!==id_delete});
        
        this.showProductDoM(_productlist);
        
        Stoarage.saveproduct_storage(productlist);
           
        return _productlist;
    }

    
}

const our_product =new Product();


// storage
class Stoarage{
    static savecategories_storage(){

       localStorage.setItem("categories",JSON.stringify(categorylist));
    }
      
    static getcategories_storage(container){
       const categoriesall =JSON.parse( localStorage.getItem("categories") );
       categorylist=[...categoriesall];
       container.forEach((each_container)=>{
           CategoryUi.showCategoryDoM(each_container);
        });
        
    }

    static save_id_showcategory(){

        localStorage.setItem("id_showcategory",JSON.stringify(id));
    }

    static get_id_showcategory(){

        const id_showcategory = JSON.parse( localStorage.getItem("id_showcategory") );
        if(id_showcategory===1){category.style.display="flex"};
        return id_showcategory;
    }

    static saveproduct_storage(_productlist){

        localStorage.setItem("Productlist",JSON.stringify(_productlist));
    }

    static getproduct_storage(){

        const productall=JSON.parse(localStorage.getItem("Productlist"));
        productlist=[...productall];
        resultsearchbox=[...productall];
        ProductUi.showProductDoM(productlist);
    }
}
    
id=Number(Stoarage.get_id_showcategory());


// document 
document.addEventListener("DOMContentLoaded",()=>{

    Stoarage.getcategories_storage([category_product,searchlist_category]);
    Stoarage.getproduct_storage();
    
});
    

// helper functions    
function control_spaces(event){

    const _event=event.target.value.trim();
    const text=_event.split("").filter((value,index)=>{return value!==" " || _event[index+1]!==" "}).join("");
    return text;
}
function checkrepeatvalue(list,value,formbox){
    if(formbox==="Category"){

        const ourlist = list.map((product)=>{return product.toLowerCase()});
        const checkrepeat = ourlist.includes(value.toLowerCase());
        return checkrepeat;

    }else if(formbox==="Product"){

        const ourlist = list.map((product)=>{return product._name.toLowerCase()});
        const checkrepeat = ourlist.includes(value.title.toLowerCase());
        return checkrepeat;
    }
}
function _date(_time){

   
    const year_date=_time.getFullYear();
    //console.log(year_date);
    const month_date =_time.getMonth() + 1;
    const day_date=_time.getDate();

    return`${year_date.toString()}/${month_date.toString().length===2 ? month_date:month_date.toString().padStart(2,"0")}/${day_date.toString().length===2 ? day_date:day_date.toString().padStart(2,"0")}`;
}



let x =[0,0,5];
function clock(){
    
    x[2]--;    
    for(let i=x.length;i>0;i--){
        if(x[0]===0 && x[1]===0 && x[2]===-1){
            
            x[0]=0;
            x[1]=0;
            x[2]=0;
            console.log("ended time");
            
        }else if(x[i]===-1){
            
            x[i]=59;
            x[i-1]-=1;
        }
    }
    
    console.log(x[0] +" : "+x[1]+" : "+x[2]);
    
}

// let abcd=["name : Hossein","age : 19","country : IRAN","job : developer"];
// let i =1000;
// abcd.forEach((item)=>{
//     setTimeout(()=>{
//         console.log(item);
//     },i);
//     i=i+1000;
// });


// let array=["a","b","c","b","B"];
// let container=[];
// array=array.map((item)=>{return item.toString().toLocaleLowerCase()});

// for (let i = 0; i < array.length; i++) {
    
//     const filtered = array.filter((item)=>{return item===array[i]});
//     container.push(filtered);
//     array=array.filter((item)=>{return !filtered.includes(item)});
    
//     i--;
// }
// let result=container.map((item)=>{return [item[0],item.length]});
// console.log(result);
// console.log(container);


// let v=["a","b","c","d","e","f","g","h"];
// let t=[[],[]];
// for (let i = 0; i < v.length; i++) {
    
//     const _filtered = v.filter((item)=>{return item%2===0});
//     t.push(_filtered);
//     v=v.filter((item)=>{return !_filtered.includes(item)});
    
//     i--;
// }


// const m =[1,2,3,4,5];

let names = ["Ray", "Robert", "Marie", "Frank", "Deborah"];
let count = 0;

function cycleArray() {
    if(names[count]){

        let name = names[count];
        console.log(name);
        
        count++;
        
    }
        

  if (count === names.length) {
    
    count = 0;
}

}

//setInterval(cycleArray,1000);


