import requireFieldValidator, { expressionValidator } from "./validation.js";

const uniName = document.querySelector('#uniName');
const uniPostfix = document.querySelector('#uniPostfix');
const addUni = document.querySelector('.add-uni');
console.log(addUni)
const uniContainer = document.querySelector('.uni-container');
const alertMsg = document.querySelector('.alertMsg');

//!--- Getting all universities
async function getUniversities() {
    try {
        const response = await fetch('/api/v1/universities/');
        const { universities } = await response.json();
        if (universities.length < 1) {
            uniContainer.innerHTML = '<div class="empty-list text-center text-xl">No universities are registered</div>';
            return
        }
        const allUni = universities.map(uni => {
            const { emailPostfix, name } = uni;
            return `<div class="uniWrapper mx-1 md:mx-4 mt-1 mb-3 border-[1px] rounded-lg px-2 py-2 shadow-md bg-slate-200 ${(name === 'ADMIN')?'hidden':'block'}">
            <div class="uniBox px-3 py-2">
                <div class="dp flex gap-1 items-center">
                    <i class="fa fa-graduation-cap text-[20px] text-[#0c4363] hover:text-[#1b8c94] pt-1"></i>
                    <div class="name-panel flex flex-col justify-center">
                        <div class="username mx-3">${name}</div>
                    </div>
                    <div class="main-post-fix ml-auto lg:mr-6">Postfix: <span class="bg-slate-600 py-1 px-3 text-white rounded-md">${emailPostfix}</span></div>
                </div>
            </div>
        </div>`
        }).join(' '); 
        uniContainer.innerHTML = allUni;
    }
    catch (error) {
        uniContainer.innerHTML = '<div class="empty-list text-center text-xl">Unable to fetch universities. Try again...!</div>';
    }
}
getUniversities();

//!--- Posting university
async function postUniversity(){
    const data = {
        name: uniName.value.trim(),
        emailPostfix: uniPostfix.value.trim()
    }
    try{
        await fetch(`/api/v1/universities/`,{
            method: 'POST',
            headers: {'content-type':'application/json;charset=utf-8'},
            body: JSON.stringify(data)
        });
        await getUniversities();
    }
    catch(err){
        alertMsg.innerHTML = '<div class="empty-list text-center text-xl">Unable to post university. Try again...!</div>';
    }
}

addUni.addEventListener('click',async (e)=>{
    e.preventDefault();
    const reqF = requireFieldValidator(uniName, uniPostfix);
    const nmValid = expressionValidator(uniName, "name");
    const pfValid = expressionValidator(uniPostfix,"emailPostfix");
    if(reqF == 0 && pfValid == true){
        await postUniversity();
        alert('University Added Succesfully');
        history.go(-1);
        uniName.value = "";
        uniPostfix.value = "";
    }
})
