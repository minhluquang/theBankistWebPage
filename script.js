'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Scrolling Button
btnScrollTo.addEventListener('click', function (e) {
  // Toạ độ y từ trên mép web xuống,
  // toạ độ x từ trên mép bên trái qua của section1
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // Toạ độ y từ trên mép web xuống,
  // toạ độ x từ trên mép bên trái qua của btnScrollTo
  console.log(e.target.getBoundingClientRect());

  // Toạ độ x, y khi scroll góc trái bên trên là toạ độ (0,0)
  console.log('Current scroll (X/Y): ', window.pageXOffset, window.pageYOffset);

  // Chiều dài và chiều rộng của web
  console.log(
    'Height/width viewport: ',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation
/*
//  NOTE:  Không dùng cái này vì chạy không nhanh 
// (nếu có 10.000 phần tử thì phải chạy 10.000 lần)

document.querySelectorAll('.nav__link').forEach((el, index) => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    // Way 1
    // document.querySelector(`#section--${index + 1}`).scrollIntoView({ behavior: 'smooth' });
    
    // Way 2
    // const id = this.getAttribute('href');
    // document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    
    // Way 3
    const id = this.getAttribute('href');
    const idCoords = document.querySelector(id).getBoundingClientRect();
    window.scrollTo({
      left: idCoords.left + window.pageXOffset,
      top: idCoords.top + window.pageYOffset,
      behavior: 'smooth'
    })
  })
})
*/

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tab operations
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
tabContainer.addEventListener('click', function (e) {
  // Remove active tab
  // [...tabContainer.children].forEach(tab => tab.classList.remove('operations__tab--active'));
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Add active classes
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Nav hover
const handleHover = function (e) {
  const link = e.target;
  const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');
  if (link.classList.contains('nav__link')) {
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation
/*
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function() {
  if (window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
})
*/

///////////////////////////////////////
// Sticky navigation: Intersection Observer API
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry)
//   });
// };

// const obsOption = {
//   root: null,
//   threshold: 1.0,
// };

// const observer = new IntersectionObserver(obsCallBack);
// observer.observe(section1)

const header = document.querySelector('.header');
const navHeight = document.querySelector('.nav').getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSelections = document.querySelectorAll('.section');

const revealSection = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSelections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///////////////////////////////////////
// Clear lazy img
const imgTargets = document.querySelectorAll('img[data-src]');

const imgLoad = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  imgObserver.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgLoad, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

const maxSlide = slides.length;
let curSlide = 0;

// Show many slide
// const slider = document.querySelector('.slider');
// slider.style.overflow = 'visible';
// slider.style.transform = 'scale(0.3) translateX(-1200px)';

// slides.forEach(
//   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
// );

// Create some dots
const createDots = function () {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
    <button class="dots__dot" data-slide="${index}"></button>
  `
    );
  });
};

// Active dots
const activeDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// Slide want to go
const slideToGo = function (numSlide) {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - numSlide)}%)`)
  );
};

// Init slide when current slide = 0
const initSlide = function () {
  slideToGo(0);
  // 0%, 100%, 200%, 300%
  createDots();
  activeDot(0);
};

initSlide();

//Next slide
const nextSlide = function () {
  curSlide++;
  if (curSlide === maxSlide) {
    curSlide = 0;
  }
  slideToGo(curSlide);
  activeDot(curSlide);
};

//Prev slide
const prevSlide = function () {
  curSlide--;
  if (curSlide < 0) {
    curSlide = maxSlide - 1;
  }
  slideToGo(curSlide);
  activeDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Listen event when use keyboard
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

// Dots
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    slideToGo(slide);
    activeDot(slide);
  }
});

/*
// Selecting
const header = document.querySelector('.header');
console.log(header);

// NOTE: Not change if delete : querySelectorAll
const allSelections = document.querySelectorAll('section');
console.log(allSelections);

// NOTE: Change if delete : getElement
const allBtns = document.getElementsByTagName('button');
console.log(allBtns);

// Creating element
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We are cookied for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';

// Add the top layout of section and header div
// header.prepend(message);

// Add the bottom layout of section and header div
header.append(message);

// Clone node(true) (like copy)
// header.append(message.cloneNode(true))

// Add message to HTML but not in header div
// header.before(message);
// header.after(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });
*/

/*
// Style
console.log(' === Style ===');
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 28 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');
*/

/*
// Attribute
console.log(' === Attribute ===');
const logo = document.querySelector('.nav__logo');

console.log(logo.src);
console.log(logo.getAttribute('src'));

console.log(logo.alt);
console.log(logo.className);

console.log(logo.designer);
console.log(logo.getAttribute('designer'));

logo.setAttribute('owner', 'Jonas')

// Data attribute
console.log(logo.dataset.versionNumber);
*/

/*
// Class
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');
*/

/*
// Events
const h1 = document.querySelector('h1');

const alertH1 = function () {
  alert('Lắng nghe sự kiện: Cảm ơn bạn đã đọc!');

  // h1.removeEventListener('mouseenter', alertH1);
};

// Hover in JS (addEventListener)
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 2000);
// (other way)
// h1.onmouseenter = alertH1;
*/

/*
// Hiệu ứng nổi bọt
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// Phần tử con của nav
document.querySelector('.nav__link').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();

  //Stop propagation
  // e.stopPropagation();

  console.log('LINK', e.target);
});

// Phần tử cha chứa nó
document.querySelector('.nav__links ').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();

  console.log('LINKS', e.target);
});

// Phần tử cha tổng thể
document.querySelector('.nav').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();

  console.log('NAV', e.target);

  // e.stopPropagation();
})
*/

/*
const h1 = document.querySelector('h1');
console.log(h1);

// Going downwards: Child
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstElementChild);
console.log(h1.lastElementChild);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: Parent
console.log(h1.parentNode);
console.log(h1.parentElement);
// h1.parentElement.style.backgroundColor = 'Yellow'
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going slides: Siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.nextSibling);
console.log(h1.previousSibling);
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
})
*/

/*
document.addEventListener('DOMContentLoaded', function(e) {
  console.log(e);
})

window.addEventListener('load', function(e) {
  console.log(e);
})

document.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = 'message';
})
*/