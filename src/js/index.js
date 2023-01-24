import Notiflix from "notiflix"
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";

import { getImages } from "./fetchImages";
import { refs } from "./refs";

//LightBox
const lightbox = new SimpleLightbox(".gallery a", {
  // showCounter: false,
}); 

refs.form.addEventListener('submit',formSubmitHandler)
refs.loadMore.addEventListener('click',loadMoreClickHandler)

let page = 1
refs.loadMore.classList.add('is-hidden')
// refs.loadMore.setAttribute('hidden', true) ❌

function loadMoreClickHandler(){
  page+=1
  refs.loadMore.textContent = 'Loading...'

  const userRequest = refs.input.value.trim()

  getImages(userRequest,page)
  .then(data => {
    const imgArr = data.hits
    refs.loadMore.textContent = 'Load more'

    renderMarkup(imgArr)
    smoothScroll()
    endOfImages(imgArr)
    lightbox.refresh()

  })
}
function formSubmitHandler(event){
 event.preventDefault()
 refs.gallery.innerHTML = ''
 refs.loadMore.classList.add('is-hidden')
//  refs.loadMore.setAttribute('hidden', true)❌
 page = 1

 const userRequest = refs.input.value.trim()
 if(userRequest === ''){
  Notiflix.Notify.failure("Please fill in the search field")
return
 }
 refs.button.textContent = 'Loading...'

 getImages(userRequest,page)
    .then(data => {
   refs.button.textContent = '🔍'
   const imagesAmount = data.totalHits 
   const imgArr = data.hits

   if(imgArr.length === 0){
    // refs.loadMore.setAttribute('hidden', true)
   refs.loadMore.classList.add('is-hidden')

   Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
return
  }
renderMarkup(imgArr)
noticeImagesAmount(imagesAmount)
endOfImages(imgArr)
lightbox.refresh()

 })
 .catch(error => console.log(error.message))

}
function renderMarkup(array){
  array.map(({largeImageURL,webformatURL,tags,likes,views,comments,downloads}) => {
    createMarkup(largeImageURL,webformatURL,tags,likes,views,comments,downloads)
 })
}
function createMarkup(largeImageURL,webformatURL,tags,likes,views,comments,downloads){
    const markup =  ` <div class="photo-card">
   <a href = "${largeImageURL}" class = "photo-link"> <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>

    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
 </div>`
    refs.gallery.insertAdjacentHTML('beforeend',markup)  
}
function endOfImages(array){
    if(array.length < 40 && array.length !== 0){
        // refs.loadMore.setAttribute('hidden', true)
        refs.loadMore.classList.add('is-hidden')
        Notiflix.Notify.info("You've reached the end of search results");
    }  
}
function noticeImagesAmount(amount){
    Notiflix.Notify.success(`Hooray! We found ${amount} images.`);
}
function smoothScroll (){
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
})

// getBoundingClientRect() повертає об’єкт( у нашому випадку першого елемента), який є найменшим прямокутником, який містить весь елемент, включаючи його відступи та ширину рамки
// Властивості height/width ,які повертає метод, включають paddingі border-width, а не лише ширину/висоту вмісту, тобто border-box -- дорівнювати ширині/висоті(бо вже входить падінг та бордер ), АЛЕ якщо content-box -- width/height+padding+border
// та бере висоту у першого елемента(вузла)

//Потім на window scrollBy() прокручує вгору сторінку на height*2, з smooth поведінкою
// behavior
// Визначає, чи має прокручування анімуватися плавно ( smooth), відбуватися миттєво за один стрибок ( instant) чи дозволяти браузеру вибирати ( auto, за замовчуванням).
}

