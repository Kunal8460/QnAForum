// hamburger
function hamRespose() {
    let hamburger = document.querySelector('.hamburger');
    let menu = document.querySelector('.nav-menu');
    let navbar = document.querySelector('.navbar');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        navbar.classList.toggle('light-up');
    });
    document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        navbar.classList.toggle('light-up');
    }));
}
function leftNavActive() {
    let ln = document.querySelectorAll('.ln');
    Array.from(ln).forEach(element => {
        element.addEventListener('click', () => {
            Array.from(ln).forEach(e=>e.classList.remove('active-ln'));
            element.classList.add('active-ln');
        })
    })
}
export default hamRespose;
export { leftNavActive };


