// sec-1 main-swiper

var sec1mainswiper = new Swiper(".sec-1-main-swiper", {
  loop: true,
  effect: "fade",

  pagination: {
    el: ".main-pagination",
    type: "fraction",
    clickable: true,
  },

  navigation: {
    nextEl: ".main-next",
    prevEl: ".main-prev",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// sec-1 sub-swiper

var sec1subswiper = new Swiper(".sec-1-sub-swiper", {
  loop: true,
  effect: "fade",

  fadeEffect: {
    crossFade: true,
  },
  pagination: {
    el: ".sub-pagination",
    type: "fraction",
    clickable: true,
  },

  navigation: {
    nextEl: ".sub-next",
    prevEl: ".sub-prev",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// sec-2 left-swiper

var sec2leftswiper = new Swiper(".sec-2-left-swiper", {
  loop: true,
  effect: "fade",

  pagination: {
    el: ".sec-2-left-pagination",
    type: "fraction",
    clickable: true,
  },

  navigation: {
    nextEl: ".sec-2-left-next",
    prevEl: ".sec-2-left-prev",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// sec-2 cen-tab-box, sec-3 cen-tab-box

$(document).ready(function () {
  $(function () {
    $(".sec-2-grid .tab-head > li").click(function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  });
  $(function () {
    $(".sec-3-grid .tab-head > li > a").click(function (event) {
      event.preventDefault();
      $(this).parent().addClass("active").siblings().removeClass("active");
    });
  });
});

// sec-2 right-swiper

var sec2rightswiper = new Swiper(".sec-2-right-swiper", {
  loop: true,
  effect: "fade",

  pagination: {
    el: ".sec-2-right-pagination",
    type: "fraction",
    clickable: true,
  },

  navigation: {
    nextEl: ".sec-2-right-next",
    prevEl: ".sec-2-right-prev",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// sec-3 left-swiper

var sec3leftswiper = new Swiper(".sec-3-left-swiper", {
  loop: true,
  effect: "fade",

  pagination: {
    el: ".sec-3-left-pagination",
    type: "fraction",
    clickable: true,
  },

  navigation: {
    nextEl: ".sec-3-left-next",
    prevEl: ".sec-3-left-prev",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// sec-5 con-swiper

var sec5swiper = new Swiper(".sec-5-swiper", {
  loop: true,
  slidesPerView: 5,
  spaceBetween: 20,

  navigation: {
    nextEl: ".sec-5-next",
    prevEl: ".sec-5-prev",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// footer_wrap

$(".footer-top .site-list > li > a").click(function (e) {
  e.preventDefault();

  $(".site-depth").not($(this).next()).slideUp();

  $(".footer-top .site-list > li").not($(this).parent()).removeClass("active");

  $(this).next().slideToggle();

  $(this).parent().toggleClass("active");
});

// left-popup
$(".left-popup .close-btn").click(function(){
  $(".left-popup").addClass("active");
});
// right-popup
$(".right-popup .close-btn").click(function(){
  $(".right-popup").addClass("active");
});
