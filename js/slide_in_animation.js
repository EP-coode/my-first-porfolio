const containers = document.querySelectorAll('.scrol-in')


function isInView(el, pxOffset = 200) {
    const { top } = el.getBoundingClientRect()
    return top <= (window.innerHeight - pxOffset)
}


function handleScrolAnimations() {
    containers.forEach(el => {
        const offset = Math.min(el.getBoundingClientRect().height / 3, 200);

        if (isInView(el, offset))
            el.classList.add('scrooled-in')
    })
}

window.addEventListener('scroll', handleScrolAnimations)
window.addEventListener('load', handleScrolAnimations)
