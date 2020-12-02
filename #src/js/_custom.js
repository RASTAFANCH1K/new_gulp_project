$(function() {
  msnry();
});

var mySwiper = new Swiper('.swiper-container', {
  direction: 'horizontal',
  loop: true,

  speed: 900,
  spaceBetween: 200,
  autoplay: {
    delay: 5000,
  },

  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
})

function msnry() {
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });
}