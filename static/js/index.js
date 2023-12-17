'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header')
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')
const imgTargets = document.querySelectorAll("img[data-src]")
const slides = document.querySelectorAll('.slide')
const sliderBtnLeft = document.querySelector('.slider__btn--left')
const sliderBtnRight = document.querySelector('.slider__btn--right')
const sliderDotContainer = document.querySelector('.dots')


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth'})
})

document.querySelector('.nav__links').addEventListener('click', function(e) {
  if(e.target.classList.contains('nav__link')){
    e.preventDefault()

    const id = e.target.getAttribute('href')

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    })
  }
})

tabsContainer.addEventListener('click', function(e){
  const clickedTab = e.target.closest('.operations__tab');

  if(!clickedTab) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content => content.classList.remove('operations__content--active'))

  clickedTab.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clickedTab.dataset.tab}`).classList.add('operations__content--active')
})


const handleNavHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblingLinks = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblingLinks.forEach(element => {
      if(element !== link) element.style.opacity = this;
    })

    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleNavHover.bind(0.5));
nav.addEventListener('mouseout', handleNavHover.bind(1));

const navHeight = nav.getBoundingClientRect().height

const stickyNav = function (entries) {
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin:`-${navHeight}px`,
});

headerObserver.observe(header)

const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, observer) {
  const [entry] = entries

  if(!entry.isIntersecting) return

  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

const loadImg = function(entries, observer){
  const [entry] = entries

  if(!entry.isIntersecting) return

  entry.target.src = entry.target.dataset.src

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img))

const slider = function(){

  let currentSlide = 0
  const lastSlide = slides.length - 1

  const goToSlide = function(currentSlide) {
    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
    )
  }

  const nextSlide = function(){
    if(currentSlide === lastSlide){
      currentSlide = 0;
    } else {
      currentSlide++
    }

    goToSlide(currentSlide)
    activateSliderDot(currentSlide)
  }

  const prevSlide = function(){
    if(currentSlide === 0){
      currentSlide = lastSlide;
    } else {
      currentSlide--
    }

    goToSlide(currentSlide)
    activateSliderDot(currentSlide)
  }

  sliderBtnRight.addEventListener('click', nextSlide)
  sliderBtnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function(e){
    e.key === "ArrowLeft" && prevSlide
    e.key === "ArrowRight" && nextSlide
  })

  const createSliderDots = function(){
    slides.forEach((_, i)=> {
      sliderDotContainer.insertAdjacentHTML(
        'beforeend', 
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateSliderDot = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  }

  sliderDotContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('dots__dot')){
      const { slide } = e.target.dataset
      goToSlide(slide)
      activateSliderDot(slide)
    }
  })

  const init = function(){
    goToSlide(0)
    createSliderDots()
    activateSliderDot(0)
  }

  init()
}

slider()
