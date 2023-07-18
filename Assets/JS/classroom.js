import requireFieldValidator from './validation.js';
import { leftNavActive } from "./utility.js";
leftNavActive();

let logoutRef = document.querySelector('#logout');
let nameLabel = document.querySelector('#UserBadge');
nameLabel.textContent = sessionStorage.getItem('name');
logoutRef.addEventListener('click', () => {
    sessionStorage.clear();
})

let createClassBtn = document.querySelector('#create-class');
let joinClassBtn = document.querySelector('#join-class');
let classCodeBox = document.querySelector('#classCodeBox');
let createClasstxt = document.querySelector('#createClasstxt');
let classroomList = document.querySelector('.class-list');
let myClassBtn = document.querySelector('#my-class');
let classDetails = document.querySelector('.class-details');

createClassBtn.addEventListener('click', () => {

    const code = Math.floor(100000 + Math.random() * 900000);
    if (classCodeBox.className.includes('hidden') && classDetails.className.includes('hidden')) {
        classCodeBox.classList.remove('hidden');
        classDetails.classList.remove('hidden');
        createClassroom(code);
        classCodeBox.innerText = "Copy your class code: " + code;
        createClassBtn.disabled = true;
    } else {
        classDetails.classList.add('hidden');
        classCodeBox.classList.add('hidden');
    }

})
joinClassBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (joinClasstxt.className.includes('hidden')) {
        joinClasstxt.classList.remove('hidden');
    } else {
        joinClasstxt.classList.add('hidden');

    }

})
myClassBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (classroomList.className.includes('hidden')) {
        classroomList.classList.remove('hidden');
    } else {
        classroomList.classList.add('hidden');

    }
})

async function getCurrentUser() {
    try {
        const curUserEmail = sessionStorage.getItem('email');
        const response = await fetch(`/api/v1/users/user/${curUserEmail}`);
        const { singleUser } = await response.json();
        delete singleUser.password;
        return singleUser;
    }
    catch (error) {
        alert(`Internal error ocuured`);
    }
}
async function verifyUniversity(email) {
    let emailFrag = email.split('@');
    console.log(emailFrag);
    let emailPostfix = emailFrag[1];
    try {
        const response = await fetch(`/api/v1/universities/${emailPostfix}`);
        if (response.status == 200) {
            const { uni } = await response.json();
            return uni;
        }
        else {
            let span = document.createElement('span');
            span.textContent = `Unregistered University`;
            span.style.color = 'red';
            span.style.margin = '0px 6px';
            span.style.fontSize = '16px';
            emailField.style.borderColor = 'red';
            emailField.classList.add('focus:ring-red-500');
            if (emailField.parentElement.previousElementSibling.childElementCount == 0) {
                emailField.parentElement.previousElementSibling.appendChild(span);
            }
            return null;
        }
    }
    catch (error) {
        return null;
    }

}
async function createClassroom(classCode) {

    let user = await getCurrentUser();
    let university = await verifyUniversity(user.email);

}