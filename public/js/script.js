//Home page 
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalItems = carouselItems.length;
    const itemsPerView = 4; 

    let currentIndex = 0;

    // Function to move the carousel
    function showNextItems() {
        currentIndex = (currentIndex + 1) % totalItems; 

        
        const offset = (100 / itemsPerView) * currentIndex; 
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    
    setInterval(showNextItems, 3000); // Slide every 3 seconds
});


