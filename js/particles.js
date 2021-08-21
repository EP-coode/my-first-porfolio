// ======================== setup ===============================

const banner = document.querySelector('.banner')
const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#banner_canvas'))
const ctx = canvas.getContext('2d')

function fitToContainer(canvas) {
    // Make it visually fill the positioned parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// from chrome 64
new ResizeObserver(() => fitToContainer(canvas)).observe(banner)

// ======================== particles ========================

// globals
const particles = []
let deltaTime = 0
let lastFrameTime = new Date().getTime()
const mouse = {
    x: null,
    y: null,
    dx: null,
    dy: null
}
let hue = (Math.random() * 255) % 30 + 160

function nextColor() {
    hue = (hue + 1) % 30 + 160
}

window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect()

    mouse.dx = Math.abs(mouse.x - e.x)
    mouse.dy = Math.abs(mouse.y - e.y)
    mouse.x = Math.max(e.x - rect.left, 0)
    mouse.y = Math.max(e.y - rect.top, 0)
})

class Particle {
    constructor(color = '#FF2233') {
        this.position = { x: 10, y: 10 }
        this.speed = { x: 0, y: 0 }
        this.force = { x: 0, y: 0 }
        this.starve_rate = 0.2
        this.size = 15
        this.color = color
    }

    respawn(x, y) {
        this.position = { x, y }
        this.speed.x = 0.1 * (Math.random() * 2 - 1) * 2
        this.speed.y = 0.1 * (Math.random() * 2 - 1) * 2
        this.size = 15 * Math.random()
    }

    isVisable() {
        const { x, y } = this.position
        const rect = canvas.getBoundingClientRect()
        return this.size > 0 &&
            canvas.width > Math.max(x - rect.left, 0) &&
            canvas.height > Math.max(y - rect.top, 0) &&
            x > 0 &&
            y > 0
    }

    update(deltaTime) {
        const { x, y } = this.position
        // temporaty sollution
        const r_sqr = Math.pow(mouse.x - x, 2) + Math.pow(mouse.y - y, 2)
        const forceFactor = 0.01
        this.force.x = forceFactor * (x - mouse.x) / Math.max(r_sqr, 10)
        this.force.y = forceFactor * (y - mouse.y) / Math.max(r_sqr, 10)

        this.speed.x += Math.min(this.force.x * deltaTime,)
        this.speed.y += this.force.y * deltaTime
        this.position.x += this.speed.x * deltaTime
        this.position.y += this.speed.y * deltaTime


        if (this.size > this.starve_rate)
            this.size -= this.starve_rate
        else
            this.size = 0

    }

    draw() {
        const { x, y } = this.position
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(x, y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }
}

const rect = canvas.getBoundingClientRect()
for (let i = 0; i < 50; i++) {
    const particle = new Particle(`hsla(${hue},100%,50%,0.5)`)
    nextColor()
    particles.push(particle)
    particle.respawn(Math.random() * rect.width, Math.random() * rect.height)
}


function animate() {
    deltaTime = new Date().getTime() - lastFrameTime
    lastFrameTime = new Date().getTime()

    // if (blur < 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // else {
    //     ctx.fillStyle = `rgba(0,0,0,${1 - blur})`
    //     ctx.fillRect(0, 0, canvas.width, canvas.height)
    // }

    particles.forEach(p => p.update(deltaTime))

    particles.forEach(p => {
        if (!p.isVisable()) {
            p.respawn(mouse.x + Math.random() - 0.5, mouse.y + Math.random() - 0.5)
            //p.respawn(mouse.x,mouse.y)
        }
    })

    particles.forEach(p => p.draw())

    requestAnimationFrame(animate)
}

animate()

