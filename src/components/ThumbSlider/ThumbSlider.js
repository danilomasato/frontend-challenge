const ThumbSlider = (props) => {
        console.log("slide===============>", props)

	let slideIndex = 1;
	showSlides(slideIndex);

	// Next/previous controls
	function plusSlides(props) {
	showSlides(slideIndex += props);
	}

	// Thumbnail image controls
	function currentSlide(props) {
	    showSlides(slideIndex = props);
	}

	function showSlides(props) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        if (props > slides.length) {slideIndex = 1}
        if (props < 1) {slideIndex = slides.length}

        for (i = 0; i < slides.length; i++) {
            
            slides[i].style.display = "none";
	    }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
	}
};

export default ThumbSlider;
