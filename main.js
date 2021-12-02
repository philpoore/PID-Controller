

const canvas_el = document.getElementById('canvas')
const ctx = canvas_el.getContext('2d')

const margin = 50
const stepX = 5
const stepY = 350
const canvasWidth = canvas_el.clientWidth
const canvasHeight = canvas_el.clientHeight
const startX = margin
const startY = canvasHeight - margin

const endX = canvasWidth - margin
const endY = margin

let results = []

const kp_el = document.getElementById('kp_input')
const ki_el = document.getElementById('ki_input')
const kd_el = document.getElementById('kd_input')
const kp_value_el = document.getElementById('kp_value')
const ki_value_el = document.getElementById('ki_value')
const kd_value_el = document.getElementById('kd_value')


const clearCanvas = () => {
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}

const toScreen = (px, py) => {
    const x = startX + (px * stepX)
    const y = startY - (py * stepY)
    return [x, y]
}

const drawPoint = (x, y, color = '#000') => {
    console.log('draw point', x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(Math.floor(x), Math.floor(y), 2, 0, 2 * Math.PI)
    ctx.fill()
}

const drawLine = (x1, y1, x2, y2, color = '#000') => {
    console.log('draw line', x1, y1, x2, y2)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}


const renderAxis = () => {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, endY)

    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, startY)
    ctx.stroke()
}



const renderResults = () => {
    results.forEach(([i, sp, pv, u]) => {
        drawPoint(...toScreen(i, pv))
        drawPoint(...toScreen(i, sp), '#00f')
    })

    for (let j = 1; j < results.length; j += 1) {
        const [i_prev, _1, pv_prev] = results[j - 1]
        const [i, _2, pv] = results[j]
        drawLine(...toScreen(i_prev, pv_prev), ...toScreen(i, pv), '#00f')
    }
}

// Render the state of simluation and results onto the canvas
const render = () => {
    clearCanvas()
    renderAxis()
    renderResults()
}

// Run the pid simulation
const runSimulation = () => {
    results = []
    let pv = 0.0
    let sp = 0.0
    const kp = parseInt(kp_el.value) / 1000
    const ki = parseInt(ki_el.value) / 1000
    const kd = parseInt(kd_el.value) / 1000
    kp_value_el.innerHTML = kp
    ki_value_el.innerHTML = ki
    kd_value_el.innerHTML = kd

    for (let i = 0; i < 200; i += 1) {
        if (i % 50 === 0) sp = sp ? 0.0 : 1.0
        const u = pid(sp, pv, kp, ki, kd)
        pv += u

        console.log(i, sp, pv, u)
        results.push([i, sp, pv, u])
    }
}

const run = () => {
    runSimulation()
    render()
}

kp_el.addEventListener('mousemove', run)
ki_el.addEventListener('mousemove', run)
kd_el.addEventListener('mousemove', run)


run()