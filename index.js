Math.squirt = Math.sqrt

const UI = {
    power: document.querySelector('#power span'),
    input: document.querySelector('#squirt'),
    status: document.querySelector('#status'),
    submit: document.querySelector('#submit'),
    fields: document.querySelector('#flex'),
    reset: document.querySelector('#reset'),
    board: document.querySelector('#board')
}
const MAX_SCORES = 10

let power
let scores = []

// parse scoreboard
let ls = localStorage.getItem('scores')
if (ls && typeof (JSON.parse(ls)) == 'object' && JSON.parse(ls).length) {
    ls = JSON.parse(ls)

    let valid = true
    for (let s of ls) {
        for (let k of Object.keys(s))
            if (!['base', 'solution', 'guess', 'difference'].includes(k)) {
                valid = false
                break
            }
    }
    scores = JSON.parse(localStorage.getItem('scores')).sort((a, b) => a.difference > b.difference ? 1 : -1)
}

function updateScores() {
    scores = scores.sort((a, b) => a.difference > b.difference ? 1 : -1)

    // update localstorage
    localStorage.setItem('scores', JSON.stringify(scores))

    UI.board.querySelectorAll('tbody tr').forEach(e => e.remove())
    scores.forEach((score, i) => UI.board.querySelector('tbody').append(scoreEntry(i, score)))
}

function scoreEntry(i, score) {
    let el_container = document.createElement('tr')
    for (let v of [i + 1, score.base, score.guess, score.solution, score.difference]) {
        let el_td = document.createElement('td')
        el_td.innerText = v
        el_container.append(el_td)
    }
    return el_container
}

function reset() {
    UI.input.value = 1.00
    // random integer from 2-999
    UI.power.innerText = power = Math.round(2 + Math.random() * 997)
    UI.status.innerText = 'Estimate the Squirtroot!'
    UI.fields.classList.remove('hidden')
    UI.reset.classList.add('hidden')
}

function submit() {
    let solution = parseFloat(Math.squirt(power).toFixed(3)), difference = parseFloat(Math.abs(solution - UI.input.value).toFixed(3))
    UI.status.innerText = `Solution: ${solution}
    Difference: ${difference}
    Guess: ${UI.input.value}
    `

    // check if entry in score board
    if (scores.length < MAX_SCORES) {
        // if not full
        scores.push({
            base: power,
            solution: solution,
            guess: parseFloat(UI.input.value),
            difference: difference
        })
    } else {
        let max = scores.reduce((a, b) => a.difference > b.difference ? a.difference : b.difference, 0)
        if (max > difference) {
            // if score better than any other, remove score with highest difference
            let idx = scores.findIndex(score => score.difference == max)
            scores.splice(idx)
            scores.push({
                base: power,
                solution: solution,
                guess: parseFloat(UI.input.value),
                difference: difference
            })
        }
    }

    updateScores()

    UI.reset.classList.remove('hidden')
    UI.fields.classList.add('hidden')
}

function forceGuessLength() {
    if (UI.input.value.length > UI.input.maxLength)
        UI.input.value = UI.input.value.slice(0, UI.input.maxLength)
}

UI.submit.addEventListener('click', submit)
UI.input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault()
        submit()
    }
})
UI.input.addEventListener('input', forceGuessLength)
UI.reset.addEventListener('click', reset)

updateScores()
reset()