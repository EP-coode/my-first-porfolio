// buttons
const btn_logo = document.querySelector('#logo-btn')
const btn_about_me = document.querySelector('#about-me-btn')
const btn_my_projects = document.querySelector('#my-projects-btn')
const btn_contact = document.querySelector('#contact-btn')
const btn_download_cv = document.querySelector('#download-btn')

// div containers
const banner = document.querySelector('.banner')
const about_me = document.querySelector('#about-me')
const my_projects = document.querySelector('#my-projects')
const contact = document.querySelector('#contact')

// actions
btn_logo.addEventListener('click', e => {
    banner.scrollIntoView({
        behavior: 'smooth'
    })
})

btn_about_me.addEventListener('click', e=>{
    about_me.scrollIntoView({
        behavior: 'smooth'
    })
})

btn_my_projects.addEventListener('click', e => {
    my_projects.scrollIntoView({
        behavior: 'smooth'
    })
})

btn_contact.addEventListener('click', e => {
    contact.scrollIntoView({
        behavior: 'smooth'
    })
})

btn_download_cv.addEventListener('click', ()=>{
    alert('No cv to download yet')
})