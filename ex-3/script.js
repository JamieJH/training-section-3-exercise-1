import decisionTree from './tree.js'

(function () {
    const chosen = document.getElementById("chosen")
    const answers = document.getElementById("answers")
    const note = document.getElementById("note")
    const final = document.getElementById("final")
    const btnBack = document.querySelector(".btn__back")
    const btnTop = document.querySelector(".btn__top")

    setupChoices(decisionTree.initialDecision)


    function setupChoices(decision) {
        let innerLis = ""

        chosen.innerText = decision.question
        decision.answers.forEach(ans => {
            innerLis += `<li>${ans}</li>`
        })

        answers.innerHTML = innerLis
    }

    function choose(choice) {
        const decision = decisionTree.getDecision(choice)
        if (decision) {
            setupChoices(decision)
            reset()
        }
        // if the choice is the last one
        else {
            note.innerText = "You have reached the end!"
            final.innerHTML = `Final choice: <span>${choice}<span>`
        }
    }

    function goBack() {
        const currentChosen = chosen.innerText.toLowerCase()
        const prevDecision = decisionTree.getPrevDecision(currentChosen)
        if (prevDecision) {
            setupChoices(prevDecision)
            reset()
        }
        else {
            note.innerText = "You have reached the top!"
        }
    }

    function goTop() {
        setupChoices(decisionTree.initialDecision)
        reset()
    }

    function reset() {
        note.innerText = ""
        final.innerText = ""
    }

    answers.addEventListener("click", (e) => {
        if (e.target.nodeName === "LI") {
            choose(e.target.innerText)
        }
    })

    btnBack.addEventListener("click", goBack)
    btnTop.addEventListener("click", goTop)



})()