//Home page 
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalItems = carouselItems.length;
    const itemsPerView = 4; // Number of items visible at a time

    let currentIndex = 0;

    // Function to move the carousel
    function showNextItems() {
        currentIndex = (currentIndex + 1) % totalItems; // Increment the index

        // If we move past the total items, reset to the beginning
        const offset = (100 / itemsPerView) * currentIndex; // Calculate the offset
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    // Set up the interval to move the carousel
    setInterval(showNextItems, 3000); // Slide every 3 seconds
});