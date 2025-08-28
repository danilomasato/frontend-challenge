import React, { useEffect, useRef  } from 'react';
import "./ThumbSlider.css";
// import ThumbSlider from "./ThumbSlider.js";

const baseURL = process.env.REACT_APP_URL;

let slideIndex = 1;
// showSlides(slideIndex);

// Next/previous controls
function plusSlides(props) {
    showSlides(slideIndex += props);
}

// Thumbnail image controls
function currentSlide(props) {
    showSlides(slideIndex = props);
}

function showSlides(props, mySlides) {
    let i;
    let slides = mySlides || document.getElementsByClassName("mySlides");
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

const ThumbSLider = (props) => {
		 
	const mySlides = useRef(null);
	const handleClick = (n, mySlides) => {
	console.log('handleClick============>', n, mySlides.querySelectorAll('.mySlides.fade'))

    showSlides(n, mySlides.querySelectorAll('.mySlides.fade'))
  };

 //first load
  useEffect(() => {
    showSlides(slideIndex);

  	console.log('mySlides============>',  mySlides.current)

  }, [handleClick, mySlides]);
  
  return (
    <>
        <div className="slideshow-container" ref={mySlides} style={{ width: "100%", height: "140px" }}>
            {props.image.map(
                (image, index) =>
                <div className="mySlides fade" >
                    {/* <div className="numbertext">1 / 3</div> */}
                    
                    <img src={`${baseURL}${image.url}`}  style={{ width: "100%", height: "140px" }} />
                    {/* <div className="text">Caption Text</div> */}
                </div>
            )}

            <a className="prev" onClick={(e) => {handleClick(-1, mySlides.current) }}>&#10094;</a>
            <a className="next" onClick={(e) => {handleClick(1, mySlides.current) }}>&#10095;</a>
        </div>

        <div style={{ textAlign: "center", display: "none" }}>
            <span className="dot" onClick={(e) => {handleClick(1) }}></span>
            <span className="dot" onClick={(e) => {handleClick(2) }}></span>
            <span className="dot" onclick=" (3)"></span>
        </div>
    </>
  );
}

export default ThumbSLider;