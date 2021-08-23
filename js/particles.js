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

// to make canvas always fit div/banner
new ResizeObserver(() => fitToContainer(canvas)).observe(banner)

// ======================== particles ========================

const PARTICLE_MAX_SIZE = 15
const STARVE_RATE = 0.2
const MOUSE_FORCE_FACTOR = -0.005
const INITIAL_SPEED_FACTOR = 0.2
const PARTICLES_AMMOUT = 100
// forve of enviroment applied to evry particle
const ENV_FORCE = Object.freeze({x: 0, y: 0.0005})

// colors
const HUE_START = 160
const HUE_END = 200
const HUE_STEP = 1

const particles = []

let deltaTime = 0
let lastFrameTime = new Date().getTime()

// mouse position relative to canvas
const mouse = {
    x: null,
    y: null,
    dx: null,
    dy: null
}
let hue = 0


// determins how many deggres is betwen start and end on hue circel
const hue_path = HUE_END > HUE_START ? HUE_END - HUE_START : 360 - HUE_START + HUE_END
function nextColor() {
    hue = ((hue + HUE_STEP) % hue_path + HUE_START) % 360
}

// inneficient
window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect()

    mouse.dx = Math.abs(mouse.x - e.x)
    mouse.dy = Math.abs(mouse.y - e.y)
    mouse.x = Math.max(e.x - rect.left, 0)
    mouse.y = Math.max(e.y - rect.top, 0)
})

class Particle {
    constructor(color = '#FF2233') {
        this.position = { x: 0, y: 0 }
        this.speed = { x: 0, y: 0 }
        this.force = { x: ENV_FORCE.x, y: ENV_FORCE.y }
        this.starve_rate = STARVE_RATE
        this.size = 0
        this.color = color
    }

    // respawns particle at certain position
    respawn(x, y) {
        this.position = { x, y }
        this.color = `hsla(${hue},100%,50%,0.5)`
        nextColor()
        this.speed.x = INITIAL_SPEED_FACTOR * (Math.random() * 2 - 1)
        this.speed.y = INITIAL_SPEED_FACTOR * (Math.random() * 2 - 1)
        this.size = PARTICLE_MAX_SIZE * Math.random()
    }

    // determins if this particle is visable in canvas
    isVisable() {
        const { x, y } = this.position
        return this.size > 0 &&
            canvas.width > x &&
            canvas.height > y &&
            x > 0 &&
            y > 0
    }

    update(deltaTime) {
        const { x, y } = this.position

        const r_sqr = Math.pow(mouse.x - x, 2) + Math.pow(mouse.y - y, 2)
        this.force.x = (MOUSE_FORCE_FACTOR * (x - mouse.x) / Math.max(r_sqr, 10)) + ENV_FORCE.x
        this.force.y = (MOUSE_FORCE_FACTOR * (y - mouse.y) / Math.max(r_sqr, 10)) + ENV_FORCE.y

        this.speed.x += this.force.x * deltaTime
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

function initialize()
{
    for (let i = 0; i < PARTICLES_AMMOUT; i++) {
        const particle = new Particle(`hsla(${hue},100%,50%,0.5)`)
        nextColor()
        particles.push(particle)
    }
}

function isMouseInCanvas(){
    return mouse.x < canvas.width && mouse.x > 0 &&
            mouse.y < canvas.height && mouse.y > 0
}


function animate() {
    deltaTime = new Date().getTime() - lastFrameTime
    lastFrameTime = new Date().getTime()

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => p.update(deltaTime))

    const _isMouseinCanvas = isMouseInCanvas()

    particles.forEach(p => {
        if (!p.isVisable() && _isMouseinCanvas) 
            p.respawn(mouse.x + Math.random() - 0.5, mouse.y + Math.random() - 0.5)
    })

    particles.forEach(p => p.draw())

    requestAnimationFrame(animate)
}

initialize()
animate()

