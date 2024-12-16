/*@Authour Joshua Boyne - Student Number: 23343338
*/

//Home page 
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const totalItems = carouselItems.length;
    const itemsPerView = 4; //shows 4 items in the carousel each time

    let currentIndex = 0;

    //function to show the items in the carousel
    function showNextItems() {
        currentIndex = (currentIndex + 1) % totalItems; 

        
        const offset = (100 / itemsPerView) * currentIndex; 
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    
    setInterval(showNextItems, 3000); //shows next item every 3 seconds
});


