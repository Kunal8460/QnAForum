
let loginEmail = document.getElementById('logemail');
let loginPass = document.getElementById('logpass');
let firstName = document.getElementById('fname');
let lastName = document.getElementById('lname');
let regEmail = document.getElementById('regemail');
let regPass = document.getElementById('regpass');
let dateOfBirth = document.getElementById('dob');
let gradYear = document.getElementById('gradYear');
let sem = document.getElementById('semester');
let forgetEmail = document.getElementById('fpemail');
let forgetPass = document.getElementById('fppass');
let reForgetPass = document.getElementById('refppass');
let login = document.getElementById('login');
let signUp = document.getElementById('signup');
let changePass = document.getElementById('changePass');

function generalizedRegex(elem, regEx, msg) {

    if (!regEx.test(elem.value.trim())) {
        let span = document.createElement('span');
        span.textContent = `${msg}`;
        span.style.color = 'red';
        span.style.margin = '0px 6px';
        span.style.fontSize = '16px';
        elem.style.borderColor = 'red';
        elem.classList.add('focus:ring-red-500');
        if (elem.parentElement.previousElementSibling.childElementCount == 0) {
            elem.parentElement.previousElementSibling.appendChild(span);
            return false;
        }
    }
    else {
        if (!elem.parentElement.previousElementSibling.childElementCount == 0) {
            elem.parentElement.previousElementSibling.removeChild(elem.parentElement.previousElementSibling.childNodes[1]);
        }
        elem.style.borderColor = 'rgb(148,163,184)';
        elem.classList.remove('focus:ring-red-500');
        return true;
    }
}
/*
requireFieldValidator(elements,message) - follows the follwoing design structure
<elem>Label for input element<elem>
<elem><input type='' class=''></elem>

first class name should contain proper context field name
*/
function expressionValidator(elem, fieldType) {
    let regEx;
    switch (fieldType) {
        case "name":
            regEx = /^([a-zA-Z]+){3,}$/g;
            return generalizedRegex(elem, regEx, 'Invalid name');

        case "password":
            regEx = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
            return generalizedRegex(elem, regEx, 'Password should contain digits, characters and length >= 6');

        case "email":
            regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return generalizedRegex(elem, regEx, 'Invalid email');
        case "emailPostfix":
            regEx = /[a-z]{2,3}\.(?=\w)[a-z]{2,3}\.?[a-z]?/;
            return generalizedRegex(elem, regEx, 'Invalid postfix structure');
        default:
            return `Invalid fieldType ${fieldType}`
    }
}
function requireFieldValidator(...args) {
    let ee = 0;
    args.forEach(element => {
        if (!element.value.trim() || (element.selectedIndex == 0)) {
            let elem = document.createElement('span');
            elem.style.color = 'red';
            elem.style.margin = '0px 6px';
            elem.style.fontSize = '16px';
            element.style.borderColor = 'red';
            element.classList.add('focus:ring-red-500');
            if (args[args.length - 1] == false) {
                elem.textContent = `This field is required`;
            }
            else {
                elem.textContent = `${element.classList[0]} is required`;
            }
            if (element.parentElement.previousElementSibling.childElementCount == 0) {
                element.parentElement.previousElementSibling.appendChild(elem);
            }
        }
        else {
            if (!element.parentElement.previousElementSibling.childElementCount == 0) {
                element.parentElement.previousElementSibling.removeChild(element.parentElement.previousElementSibling.childNodes[1]);
            }
            element.style.borderColor = 'rgb(148,163,184)';
            element.classList.remove('focus:ring-red-500');
        }
    });
    args.forEach(element => {
        if (!element.parentElement.previousElementSibling.childElementCount == 0) {
            ee++;
        }
    });
    return ee;
}


async function userSwill(elem, passelem) {
    try {
        const response = await fetch(`/api/v1/users/user/${elem.value}`);
        if (response.status == 200) {
            const { singleUser } = await response.json();
            // console.log(singleUser);
            if (singleUser.password != passelem.value) {
                let span = document.createElement('span');
                span.textContent = `Password doesn't match`;
                span.style.color = 'red';
                span.style.margin = '0px 6px';
                span.style.fontSize = '16px';
                passelem.style.borderColor = 'red';
                passelem.classList.add('focus:ring-red-500');
                if (passelem.parentElement.previousElementSibling.childElementCount == 0) {
                    passelem.parentElement.previousElementSibling.appendChild(span);
                }
                return false;
            }
            const uni = await verifyUniversity(elem);
            sessionStorage.setItem('university',uni._id);
            sessionStorage.setItem('email', singleUser.email);
            sessionStorage.setItem('name', singleUser.name);
            return true;
        }
        else {
            let span = document.createElement('span');
            span.textContent = `Unregistered Email`;
            span.style.color = 'red';
            span.style.margin = '0px 6px';
            span.style.fontSize = '16px';
            elem.style.borderColor = 'red';
            elem.classList.add('focus:ring-red-500');
            if (elem.parentElement.previousElementSibling.childElementCount == 0) {
                elem.parentElement.previousElementSibling.appendChild(span);
            }
            return false;
        }
    }
    catch (error) {
        return false;
    }
}


function calcAge(dateOfBirth) {
    let curYear = new Date().getFullYear();
    let birthYear = new Date(dateOfBirth.value).getFullYear();
    return curYear - birthYear;
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
async function enrollUser() {
    try {
        const uni = await verifyUniversity(regEmail);
        const userExist = await fetch(`/api/v1/users/user/${regEmail.value}`);
        if(userExist.status == 200){
            alert('User is already enrolled!!!');    
            return false;
        }
        if (uni != null) {
            const age = calcAge(dateOfBirth);
            const data = {
                name: firstName.value.trim() + " " + lastName.value.trim(),
                email: regEmail.value.trim(),
                password: regPass.value,
                universityID: uni._id,
                age: age,
                semester: sem.value,
                graduationYear: gradYear.value
            }
            const response = await fetch(`/api/v1/users/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            }

            );
            if (response.status == 201) {
                return true;
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (error) {
        alert('Internal server error!');
        return false;
    }
}
export default requireFieldValidator;
export {
    expressionValidator,
    userSwill,
    enrollUser,
    verifyUniversity,
    firstName,
    lastName,
    regEmail,
    regPass,
    loginEmail,
    loginPass,
    dateOfBirth,
    sem,
    gradYear,
    forgetEmail,
    forgetPass,
    reForgetPass,
    login,
    signUp,
    changePass
};
//*module.exports = requireFieldValidator;