const wrapper1 = document.querySelector(".recent-wrap1");
const carousel1 = document.querySelector(".recent1");
const firstCardWidth1 = carousel1.querySelector(".slide1").offsetWidth;
const arrowBtns1 = document.querySelectorAll(".recent-wrap1 i");
const carouselChildrens1 = [...carousel1.children];

let cardPerView1 = Math.round(carousel1.offsetWidth / firstCardWidth);
carouselChildrens1.slice(-cardPerView).reverse().forEach(card => {
    carousel1.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildrens1.slice(0, cardPerView).forEach(card => {
    carousel1.insertAdjacentHTML("beforeend", card.outerHTML);
});

carousel1.classList.add("no-transition");
carousel1.scrollLeft = carousel.offsetWidth;
carousel1.classList.remove("no-transition");
// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns1.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel1.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel1.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel1.scrollLeft;
}