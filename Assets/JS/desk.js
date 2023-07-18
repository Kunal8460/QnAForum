import requireFieldValidator from './validation.js';
import { leftNavActive } from "./utility.js";

leftNavActive();
let loader = document.querySelector('.loader-bg');
function loadComplete() {
    loader.style.display = 'none';
}
setTimeout(loadComplete, 2000);
// DOM elements 
let questionTitle = document.querySelector('#ques');
let questionBody = document.querySelector('#ques-body');
let postVisiblity = document.querySelector('#post-visiblity');
let postQuestionButton = document.querySelector('#post-question');
// let postSearchBtn = document.querySelectorAll('.searchButton');
let postSearchInput = document.querySelectorAll('.search-field');
let deleteBtn;
let postAnswerText;
let postAnswerBtn;
let checkAnony;

//! --- Utitlity function for dropdown and left navigation bar ---//
function utilWork() {
    let search = document.querySelector('.collapse-search');
    let content = document.querySelector('.collapse-content');
    search.onclick = () => {
        content.classList.toggle('hidden');
        content.classList.toggle('flex');
    }
    let commentBox = document.querySelectorAll('.comment-box');
    let commentCollapse = document.querySelectorAll('.collapse-comment');
    commentCollapse.forEach(comCol => {
        comCol.addEventListener('click', () => {
            let content = comCol.parentElement.parentElement.nextElementSibling.firstElementChild;
            comCol.classList.toggle('rotate-180');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        })
    })
}
//! --- Utiltity function for posting answer --- //
function postAnswerUtil() {
    postAnswerBtn = document.querySelectorAll('.comment-ans-btn');
    postAnswerBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.parentElement.previousElementSibling.value.trim()) {
                const description = btn.parentElement.previousElementSibling.value;
                const anonymous = btn.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.firstElementChild.checked;
                const quesID = btn.parentElement.previousElementSibling.id;
                postAnswer(description, anonymous, quesID);
            }
        })
    })


}
function deleteAnswerUtil() {
    deleteBtn = document.querySelectorAll('.delete-ans-btn');
    deleteBtn.forEach(elem => {

        elem.addEventListener('click', async (e) => {
            e.preventDefault();
            let ansId = elem.parentElement.parentElement.nextElementSibling.children[0].innerText;
            const response = await fetch(`/api/v1/answers/${ansId}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                },
            });
            await runRefresher();
        })

    });
}


//! --- Clearing session on user logout ---//
let logoutRef = document.querySelector('#logout');
let nameLabel = document.querySelector('#UserBadge');
nameLabel.textContent = sessionStorage.getItem('name');
logoutRef.addEventListener('click', () => {
    sessionStorage.clear();
})

//! --- Getting user information ---//
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
async function getSpecificUser(id) {
    try {
        const response = await fetch(`/api/v1/users/${id}`);
        const { singleUserById } = await response.json();
        return singleUserById;
    }
    catch (error) {
        alert('Internal server error');
        return;
    }
}


//! --- GET request for fetching all questions and dom population --- //
let feedExist = document.querySelector('.feed-exist');
let postContainer = document.querySelector('.post-content');
async function getQuestions(callback, callback2, callback3) {
    try {
        const uniId = sessionStorage.getItem('university');
        // console.log(uniId);

        const response = await fetch(`/api/v1/questions/byUni/${uniId}`);
        const { quesByUni } = await response.json();
        if (quesByUni.length < 1) {
            feedExist.textContent = `No feed found! :(`;
            return;
        }
        postContainer.innerHTML = `<div class="feed-exist mx-4 text-slate-400 text-center text-xl"></div>`;
        quesByUni.forEach(async (ques, index) => {
            const u = await getSpecificUser(ques.userID);
            let ans = await getAnsByQid(ques._id);
            let emptyAns = "", f = 0;
            let givenAns;
            if (ans.length == 0) {
                f = 1;
                emptyAns += `<div class="py-4">
                <div class="posted-Comment">
                    <div class="main p-0 pt-2 lg:px-4 lg:pt-1 lg:pb-4">
                        <div class="text-content">Not answered yet</div>
                    </div>
                </div>
            </div>`
            }
            else {
                givenAns = await Promise.all(ans.map(async (answer) => {
                    let uAnswer = await getSpecificUser(answer.userID);
                    let curUser = await getCurrentUser();
                    return `<div class="py-4">
                        <div class="posted-Comment">
                            <div class="header px-2">
                                <div class="dp flex gap-1">
                                    <img src="../images/user.jpg" alt="" class="mt-2 h-[40px] w-[40px] rounded-full">
                                    <div class="name-panel flex flex-col justify-center">
                                        <div class="username mx-3 ${(answer.anonymous == true) ? 'block' : 'hidden'}">Anonymous</div>
                                        <div class="username mx-3 ${(answer.anonymous == false) ? 'block' : 'hidden'}">${uAnswer.name}</div>
                                    </div>
                                    <button type="submit" class="delete-ans-btn ml-auto ${(curUser._id == answer.userID) ? 'block' : 'hidden'}"><i class="my-4 fa-solid fa-trash-can"></i></button>
                                </div>
                            </div>
                            <div class="main p-0 pt-2 lg:px-4 lg:pt-1 lg:pb-4">
                                <div class="hidden">${answer._id}</div>
                                <div class="text-content">${answer.description}</div>
                            </div>
                        </div>
                    </div>`
                }));
                givenAns = givenAns.join(" ");
            }
            postContainer.innerHTML += `<div class="postWrapper md:mx-4 mt-1 mb-2 border-[1px] rounded-lg px-4 py-2 shadow-md bg-slate-200">
            <div class="header px-2">
                <div class="dp flex gap-1 items-center">
                    <img src="../images/user.jpg" alt="" draggable="false" class="mt-2 h-[40px] w-[40px] rounded-full">
                    <div class="name-panel flex flex-col justify-center">
                        <div class="username mx-3 ${(ques.anonymous == true) ? 'block' : 'hidden'}">Anonymous</div>
                        <div class="username mx-3 ${(ques.anonymous == false) ? 'block' : 'hidden'}">${u.name}</div>
                    </div>
                    <div class="checkWrapper ml-auto select-none">
                    <input type="checkbox" id="ckbox-${index + 1}" class="peer opacity-0 z-0">
                    <label for="ckbox-${index + 1}" class="check-box pl-2">Answer as 'Anonymous'</label>
                </div>
                </div>
            </div>
            <div class="main p-2 pt-2 lg:p-4">
                <div class="text-content">
                    <div class="q-title font-semibold text-lg pb-3">${ques.title}</div>
                    <div class="q-desc">${ques.description}</div>
                </div>
            </div>
            <div class="comment-tool flex justify-center items-center gap-4 mx-auto my-1">
                <textarea name="commentarea" id="${ques._id}" class="comment-body form-inputBox resize-none transition-all duration-300 focus:h-[200px] my-0 h-[40px]"
                    placeholder="Write your thoughts..."></textarea>
                <div class="w-fit ml-auto"><button class="comment-ans-btn btn h-[35px]">Answer</button></div>
            </div>
            <div class="w-fit mx-auto">
                <button class="collapse-comment px-7 transition-all duration-200 "><i
                        class="fa fa-angle-down text-[28px] text-[#0c4363] hover:text-[#1b8c94]"></i></button>
            </div>
        </div>
        <div class="comment-box relative bottom-3">
            <div class="comment-wrapper md:mx-4 border-[1px] px-7 rounded-b-lg shadow-md bg-slate-200 max-h-0 overflow-auto transition-all duration-200">
                ${(f == 0 ? givenAns : emptyAns)}
            </div>
        </div>`;
            callback();
            callback2();
            callback3();
        })

    }
    catch (error) {
        feedExist.textContent = `Oops! Something went wrong :(`;
    }
}

//! Refresher for refreshing feed on home page
const runRefresher = async () => {
    await getQuestions(utilWork, postAnswerUtil, deleteAnswerUtil);
}
await runRefresher();


//! --- posting questions --- //
async function postQuestion() {
    try {
        const uniId = sessionStorage.getItem('university');

        const fieldEmpty = requireFieldValidator(questionTitle);
        if (fieldEmpty == 0) {
            const user = await getCurrentUser();
            const data = {
                title: questionTitle.value,
                description: questionBody.value,
                userID: user._id,
                anonymous: postVisiblity.value,
                universityID: uniId
            }
            const response = await fetch('/api/v1/questions', {
                method: 'POST',
                headers: { 'content-type': 'application/json;charset=utf-8' },
                body: JSON.stringify(data)
            });
            console.log(data);
            // location.reload();
            history.go(-1);
            questionTitle.value = "";
            questionBody.value = "";
            postVisiblity.value = "false";

            await runRefresher();
        }
    }
    catch (error) {
        alert('Unable to post question. Something went wrong!');
    }

}
postQuestionButton.addEventListener('click', (e) => {
    e.preventDefault();
    postQuestion();
});


//! ---GET request for answers - fetching answers by user id using GET request --- // 
async function getAnsByQid(id) {
    try {
        const response = await fetch(`/api/v1/answers/${id}`);
        const { ans } = await response.json();
        return ans;
    }
    catch {
        alert('Internal server error');
        return;
    }
}


//!--- POST call for posting answers ---//
async function postAnswer(description, anony, quesID) {
    try {
        const curUser = await getCurrentUser();
        const AnswerData = {
            description: description,
            questionID: quesID,
            userID: curUser._id,
            anonymous: anony
        }
        const response = await fetch(`/api/v1/answers`, {
            method: 'POST',
            headers: { 'content-type': 'application/json;charset=utf-8' },
            body: JSON.stringify(AnswerData)
        })
        await runRefresher();

    }
    catch (error) {
        alert('Unable to post the answer. Something went wrong!');
    }
}


//! --- Search functionality ---//
function searchPosts() {
    postSearchInput.forEach(inpText => {
        let flag = 0, elem;
        inpText.addEventListener('input', () => {
            let count = 0, countAlter = 0;
            let postWrappers = document.querySelectorAll('.postWrapper');
            let stext = inpText.value.toLowerCase();
            postWrappers.forEach(post => {
                let postTitle = post.querySelector('.q-title').textContent.toLowerCase();
                let postDesc = post.querySelector('.q-desc').textContent.toLowerCase();
                post.classList.remove('block');
                post.nextElementSibling.classList.remove('block');
                post.classList.remove('hidden');
                post.nextElementSibling.classList.remove('hidden');
                if (postTitle.includes(stext)) {
                    post.classList.add('block');
                    post.nextElementSibling.classList.add('block');
                }
                else {
                    post.classList.add('hidden');
                    post.nextElementSibling.classList.add('hidden');
                }
                count++;
            })
            postWrappers.forEach(post => {
                if (post.classList.contains('hidden')) {
                    countAlter++;
                }
                if (countAlter == count && flag == 0) {
                    flag = 1;
                    elem = document.createElement('div');
                    elem.classList.add('resultError');
                    elem.style.fontSize = '20px';
                    elem.style.color = 'grey';
                    elem.style.textAlign = 'center';
                    elem.textContent = 'No result found!';
                    postContainer.appendChild(elem);
                }
                else {
                    flag = 0;
                }
                if (postContainer.lastElementChild.classList.contains('resultError') && flag == 0) {
                    postContainer.removeChild(postContainer.lastChild);
                }
            })
        })
    })
}
searchPosts();