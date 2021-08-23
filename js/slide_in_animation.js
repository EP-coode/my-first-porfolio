const containers = document.querySelectorAll('.scrol-in')


function isInView(el, pxOffset = 200) {
    const { top } = el.getBoundingClientRect()
    return top <= (window.innerHeight - pxOffset)
}


function handleScrolAnimations() {
    containers.forEach(el => {
        console.log(el.innerHeight);
        if (isInView(el, el.getBoundingClientRect().height/3))
            el.classList.add('scrooled-in')
    })
}

window.addEventListener('scroll', handleScrolAnimations)
