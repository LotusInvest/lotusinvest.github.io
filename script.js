function createCircles() {
    const numCircles = 80; // Adjust the number of circles as needed

    for (let i = 0; i < numCircles; i++) {
        const circle = document.createElement("div");
        circle.classList.add("circle");

        const randomX = Math.floor(Math.random() * window.innerWidth);
        const randomY = Math.floor(Math.random() * window.innerHeight);
        const randomVelocityX = (Math.random() * 2 - 1) * 0.5; // Adjust the multiplier to control the speed
        const randomVelocityY = (Math.random() * 2 - 1) * 0.5; // Adjust the multiplier to control the speed

        circle.style.left = `${randomX}px`;
        circle.style.top = `${randomY}px`;
        circle.style.animation = `moveCircle ${Math.random() * 10 + 5}s linear infinite`; // Random duration between 5 and 15 seconds
        circle.style.animationDelay = `${Math.random() * 5}s`; // Random delay between 0 and 5 seconds
        circle.style.setProperty("--velocityX", randomVelocityX);
        circle.style.setProperty("--velocityY", randomVelocityY);

        document.body.appendChild(circle);
    }
}



createCircles();



/* Typing Effect */
// Wait for 3 seconds before starting the typing effect
// Wait for 2 seconds before adding the fadeInUp animation class
setTimeout(function () {
    const subtitle = document.querySelector('.subtitle');
    subtitle.classList.add('animate__animated');
    subtitle.classList.remove('d-none');
}, 700);
setTimeout(function () {
    const subtitle = document.querySelector('.title');
    subtitle.classList.add('animate__animated');
    subtitle.classList.remove('d-none');
}, 700);
setTimeout(function () {
    const subtitle = document.querySelector('.main-area');
    subtitle.classList.add('animate__animated');
    subtitle.classList.remove('d-none');
}, 1400);
setTimeout(function () {
    const subtitle = document.querySelector('.slidediv');
    subtitle.classList.remove('d-none');
}, 100);





function nextPage () {
    // body
    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', function methodName () {
        // body
        setTimeout(function () {
            const subtitle = document.querySelector('.test');
             subtitle.classList.add('animate__animated');
            subtitle.classList.remove('d-none');
        }, 1000);

    })
        

}  

nextPage();








setTimeout(function () {
    typeWriterEffect();
}, 2000);


setTimeout(function () {
    const subtitle = document.querySelector('.main-area');
    subtitle.classList.add('animate__animated');
    subtitle.classList.remove('d-none');
}, 2500);








function typeWriterEffect() {
    const textElement = document.querySelector('.info');
    const text = 'Experimental location of Sultonbek Khamidov';
    let index = 0;

    function type() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150);
        }
    }

    type();
}
