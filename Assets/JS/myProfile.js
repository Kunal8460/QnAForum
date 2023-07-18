import requireFieldValidator from './validation.js';
import { leftNavActive } from "./utility.js";
import { expressionValidator } from './validation.js';

const firstName = document.querySelector('#fname');
const lastName = document.querySelector('#lname');
const profEmail = document.querySelector('#profEmail');
const gradYear = document.querySelector('#gradYear');
const sem = document.querySelector('#semester');
const currPass = document.querySelector('#currPass');
const newPass = document.querySelector('#newPass');

leftNavActive();
loadData();
let logoutRef = document.querySelector('#logout');
let nameLabel = document.querySelector('#UserBadge');
let updateBtn = document.querySelector('#updateProfile');

nameLabel.textContent = sessionStorage.getItem('name');
logoutRef.addEventListener('click', () => {
    sessionStorage.clear();
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
async function loadData() {

    let userData = await getCurrentUser();
    let name = userData.name;
    name = name.split(' ');
    let fname = name[0];
    let lname = name[1];
    firstName.value = fname;
    lastName.value = lname;
    profEmail.value = userData.email;
    gradYear.value = userData.graduationYear;
    sem.value = userData.semester;
}
async function verifyUniversity(emailField) {
    let emailFrag = emailField.value.split('@');
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
updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const isEmptyReg = requireFieldValidator(firstName, lastName, profEmail, sem, gradYear);
        const regE = expressionValidator(profEmail, "email");
        const fn = expressionValidator(firstName, "name");
        const ln = expressionValidator(lastName, "name");
        const verifyUni = await verifyUniversity(profEmail);
        console.log(verifyUni);
        // const isEmptyPass = requireFieldValidator(currPass, newPass);

        let newpassword = "";
        let updateData;
        if (currPass.value.trim() && newPass.value.trim()) {
            newpassword = newPass.value;
            updateData = {
                name: firstName.value.trim() + " " + lastName.value.trim(),
                email: profEmail.value.trim(),
                password: newpassword,
                semester: sem.value,
                graduationYear: gradYear.value
            }
        } else {
            updateData = {
                name: firstName.value.trim() + " " + lastName.value.trim(),
                email: profEmail.value.trim(),
                // password: newpassword,
                semester: sem.value,
                graduationYear: gradYear.value
            }
        }
        if (isEmptyReg == 0 && regE == true && fn == true && ln == true && verifyUni != null) {

            let user = await getCurrentUser();
            let user_id = user._id;

            let response = await fetch(`/api/v1/users/${user_id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(updateData)
                });
            if (response.status == 200) {
                location.reload();
                sessionStorage.setItem('name', firstName.value.trim() + " " + lastName.value.trim())
                sessionStorage.setItem('email', profEmail.value);
                // const uni = verifyUniversity(profEmail);
                sessionStorage.setItem('university', verifyUni._id);
                alert('Profile updated successfully');
            }
        }

    } catch (error) {
        console.log(error);
    }
})
