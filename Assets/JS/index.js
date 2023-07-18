import requireFieldValidator from './validation.js'
import {
  expressionValidator,
  userSwill,
  enrollUser,
  verifyUniversity,
  loginEmail,
  loginPass,
  firstName,
  lastName,
  regEmail,
  regPass,
  dateOfBirth,
  sem,
  gradYear,
  forgetEmail,
  forgetPass,
  reForgetPass,
  login,
  signUp,
  changePass,
} from './validation.js'
import hamResponse from './utility.js'
hamResponse()
let currentOtp

//! --- DOM element for forgot password
const getOtpButton = document.querySelector('.get-otp-btn')
const verifyButton = document.querySelector('.verify-otp')

const otpLabel = document.querySelector('.enter-otp-lbl')
const otpInput = document.querySelector('.OTP')
const verifyOtp = document.querySelector('.verify-otp')
const getOtpLoading = document.querySelector('.get-otp-loading')
const mainPasswordForm = document.querySelector('.main-pass-form')

//! --- DOM element for registartion verification
const regDataVeriBtn = document.querySelector('#veri-reg-data')
const regOtpLabel = document.querySelector('.reg-otp-lbl')
const regOtpInput = document.querySelector('#otp-reg')
const sendingRegOtp = document.querySelector('#sending-reg-otp')
async function isUserExist(email) {
  try {
    const response = await fetch(`/api/v1/users/user/${email.value}`)
    if (response.status == 200) {
      return true
    } else {
      return false
    }
  } catch {
    return false
  }
}
//!--- Reseting state after updation of password
function resetState() {
  forgetEmail.value = ''
  forgetPass.value = ''
  reForgetPass.value = ''
  otpInput.value = ''
  mainPasswordForm.classList.add('hidden')
  getOtpLoading.classList.add('hidden')
  otpLabel.classList.add('hidden')
  otpInput.classList.add('hidden')
  verifyOtp.classList.add('hidden')
}

//!--- Login functionality
login.addEventListener('click', async (e) => {
  e.preventDefault()
  const isEmptyLogin = requireFieldValidator(loginEmail, loginPass)
  const logE = expressionValidator(loginEmail, 'email')
  const logP = expressionValidator(loginPass, 'password')
  const loginStatus = await userSwill(loginEmail, loginPass)
  if (
    isEmptyLogin == 0 &&
    logE == true &&
    logP == true &&
    loginStatus == true
  ) {
    if (loginEmail.value == 'admin@cube.com' && loginPass.value == 'admin123') {
      location.replace('../Pages/admin.html')
    } else {
      location.replace('../Pages/Desk.html')
    }
  }
})

// !--- Signup Button
signUp.addEventListener('click', async (e) => {
  e.preventDefault()
  const isEmptyReg = requireFieldValidator(
    firstName,
    lastName,
    regEmail,
    regPass,
    dateOfBirth,
    sem,
    gradYear
  )
  const regE = expressionValidator(regEmail, 'email')
  const regP = expressionValidator(regPass, 'password')
  const fn = expressionValidator(firstName, 'name')
  const ln = expressionValidator(lastName, 'name')
  const verUni = await verifyUniversity(regEmail)
  if (
    isEmptyReg == 0 &&
    regE == true &&
    regP == true &&
    fn == true &&
    ln == true &&
    verUni != null
  ) {
    const otpReq = requireFieldValidator(regOtpInput)
    if (Number(regOtpInput.value.trim()) === currentOtp && otpReq == 0) {
      const enrollStatus = await enrollUser()
      if (enrollStatus == true) {
        alert('You are successfully registered')
        location.replace('/')
        regOtpInput.value = ''
        regOtpInput.parentElement.previousElementSibling.removeChild(span)
      }
    } else {
      const mailInfo = document.querySelector('#emailRegInformation')
      if (mailInfo) {
        regOtpInput.removeChild(mailInfo)
      }
      let span = document.createElement('span')
      span.textContent = `OTP didn't match`
      span.style.color = 'red'
      span.style.margin = '0px 6px'
      span.style.fontSize = '16px'
      regOtpInput.style.borderColor = 'red'
      regOtpInput.classList.add('focus:ring-red-500')
      if (
        regOtpInput.parentElement.previousElementSibling.childElementCount == 0
      ) {
        regOtpInput.parentElement.previousElementSibling.appendChild(span)
      }
    }
  }
})

regDataVeriBtn.addEventListener('click', async (e) => {
  e.preventDefault()
  const isEmptyReg = requireFieldValidator(
    firstName,
    lastName,
    regEmail,
    regPass,
    dateOfBirth,
    sem,
    gradYear
  )
  const regE = expressionValidator(regEmail, 'email')
  const regP = expressionValidator(regPass, 'password')
  const fn = expressionValidator(firstName, 'name')
  const ln = expressionValidator(lastName, 'name')
  const verUni = await verifyUniversity(regEmail)
  if (
    isEmptyReg == 0 &&
    regE == true &&
    regP == true &&
    fn == true &&
    ln == true &&
    verUni != null
  ) {
    try {
      regOtpInput.classList.add('hidden')
      regOtpLabel.classList.add('hidden')
      signUp.classList.add('hidden')
      sendingRegOtp.classList.remove('hidden')
      regDataVeriBtn.classList.add('hidden')
      const response = await fetch(`/api/v1/otp/${regEmail.value}`)
      const { otp } = await response.json()
      sendingRegOtp.classList.add('hidden')
      regDataVeriBtn.classList.remove('hidden')
      currentOtp = otp
      regOtpInput.classList.remove('hidden')
      regOtpLabel.classList.remove('hidden')
      signUp.classList.remove('hidden')
      let elem = document.createElement('span')
      elem.id = 'emailRegInformation'
      elem.style.color = 'white'
      elem.style.marginLeft = '6px'
      elem.style.padding = '2px 8px 2px 8px'
      elem.style.backgroundColor = '#0e4667'
      elem.style.borderRadius = '12px'
      elem.style.fontSize = '14px'
      elem.textContent = 'Check your email or spam section of the email'
      regOtpLabel.appendChild(elem)
      setTimeout(() => {
        regOtpLabel.removeChild(elem)
      }, 5000)
    } catch (error) {
      alert('Unable to verify data. Try again!')
      console.log(error)
    }
  }
})

//! --- Get Otp Functionality for forgot password
getOtpButton.addEventListener('click', async (e) => {
  e.preventDefault()
  const isEmptyFop = requireFieldValidator(forgetEmail)
  const fm = expressionValidator(forgetEmail, 'email')
  const verUni = await verifyUniversity(forgetEmail)
  const userStatus = await isUserExist(forgetEmail)
  if (isEmptyFop == 0 && fm == true && verUni != null) {
    if (userStatus == true) {
      getOtpButton.disabled = true
      mainPasswordForm.classList.add('hidden')
      getOtpButton.classList.add('hidden')
      getOtpLoading.classList.remove('hidden')
      otpLabel.classList.add('hidden')
      otpInput.classList.add('hidden')
      verifyOtp.classList.add('hidden')
      try {
        const response = await fetch(`/api/v1/otp/${forgetEmail.value}`)
        const { otp } = await response.json()
        getOtpButton.disabled = false
        currentOtp = otp
        otpLabel.classList.remove('hidden')
        otpInput.classList.remove('hidden')
        verifyOtp.classList.remove('hidden')
        getOtpButton.classList.remove('hidden')
        getOtpLoading.classList.add('hidden')
        let elem = document.createElement('span')
        elem.id = 'emailInformation'
        elem.style.color = 'white'
        elem.style.marginLeft = '6px'
        elem.style.padding = '2px 8px 2px 8px'
        elem.style.backgroundColor = '#0e4667'
        elem.style.borderRadius = '12px'
        elem.style.fontSize = '14px'
        elem.textContent = 'Check your email or spam section of the email'
        otpLabel.appendChild(elem)
        setTimeout(() => {
          otpLabel.removeChild(elem)
        }, 4000)
      } catch (error) {
        console.log(error)
      }
    } else {
      alert(
        'Your email is unregistered to our forum. Kindly create your forum account.'
      )
    }
  }
})

//! Verification of Otp for forgot password
verifyButton.addEventListener('click', async (e) => {
  e.preventDefault()
  const ofi = requireFieldValidator(otpInput)
  if (currentOtp === Number(otpInput.value.trim()) && ofi == 0) {
    mainPasswordForm.classList.remove('hidden')
    changePass.addEventListener('click', async (e) => {
      e.preventDefault()
      const isEmptyReg = requireFieldValidator(
        forgetEmail,
        forgetPass,
        reForgetPass
      )
      const fm = expressionValidator(forgetEmail, 'email')
      const fp = expressionValidator(forgetPass, 'password')
      const refp = expressionValidator(reForgetPass, 'password')
      if (isEmptyReg == 0 && fm == true && fp == true && refp == true) {
        if (forgetPass.value === reForgetPass.value) {
          try {
            const user = await fetch(`/api/v1/users/user/${forgetEmail.value}`)
            const { singleUser } = await user.json()
            const data = {
              password: forgetPass.value,
            }
            const response = await fetch(`/api/v1/users/${singleUser._id}`, {
              method: 'PATCH',
              headers: { 'content-type': 'application/json;charset=utf-8' },
              body: JSON.stringify(data),
            })
            alert('Password updated succesfully')
            resetState()
            location.reload()
            history.go(-1)

            console.log('sucess')
          } catch (err) {
            console.log(err)
          }
        } else {
          let span = document.createElement('span')
          span.textContent = `Passowrd should match`
          span.style.color = 'red'
          span.style.margin = '0px 6px'
          span.style.fontSize = '16px'
          reForgetPass.style.borderColor = 'red'
          reForgetPass.classList.add('focus:ring-red-500')
          if (
            reForgetPass.parentElement.previousElementSibling
              .childElementCount == 0
          ) {
            reForgetPass.parentElement.previousElementSibling.appendChild(span)
          }
        }
      }
    })
  } else {
    const mailInfo = document.querySelector('#emailInformation')
    if (mailInfo) {
      otpLabel.removeChild(mailInfo)
    }
    let span = document.createElement('span')
    span.textContent = `OTP didn't match`
    span.style.color = 'red'
    span.style.margin = '0px 6px'
    span.style.fontSize = '16px'
    otpInput.style.borderColor = 'red'
    otpInput.classList.add('focus:ring-red-500')
    if (otpInput.parentElement.previousElementSibling.childElementCount == 0) {
      otpInput.parentElement.previousElementSibling.appendChild(span)
    }
  }
})
