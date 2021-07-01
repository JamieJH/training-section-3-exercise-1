import getDecisionTree from './tree.js'

(async function () {
    let decisionTree
    await getDecisionTree.then(res => { decisionTree = res })
    /* Making decisions */
    const chosenQuestion = document.getElementById("chosen")
    let chosenId
    const answers = document.getElementById("answers")
    const note = document.getElementById("note")
    const final = document.getElementById("final")
    const btnBack = document.querySelector(".btn__back")
    const btnTop = document.querySelector(".btn__top")

    setupChoices(decisionTree.initialDecision)
    // display a decision question and its answers for user to choose from
    function setupChoices(decision) {
        chosenQuestion.innerText = "There's no decision!"
        chosenId = decision.id
        let innerLis = ""

        if (decision.question) {
            chosenQuestion.innerText = decision.question[0].toUpperCase() + decision.question.substr(1)
            decision.answers.forEach(ans => {
                innerLis += `<li>${ans}</li>`
            })
        }
        answers.innerHTML = innerLis
    }

    // when user choose an answer, find the decision correspond to that answer and show it
    function choose(choice) {
        const decision = decisionTree.getDecision(choice.toLowerCase())
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

    // when user press the "Go back" button, go back to the immediate previous decision
    function goBack() {
        const prevDecision = decisionTree.getPrevDecision(chosenId)
        if (prevDecision) {
            setupChoices(prevDecision)
            reset()
        }
        else {
            note.innerText = "You have reached the top!"
        }
    }

    // when user click "Back to Top" button, go back to the very first decision 
    function goTop() {
        setupChoices(decisionTree.initialDecision)
        reset()
    }

    // clear notes
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

    // ************************************************************************
    // edit decision tree

    const form = document.getElementById("edit-form")
    const actionsSelect = form.querySelector(".form-input.selection select")
    let currentAction = "add-decision"

    const allDecisionsBox = form.querySelector(".form-all-decisions-choose")
    const allDecisionsDec = allDecisionsBox.querySelector("#all-decisions-decision")
    const allDecisionsQuestion = allDecisionsBox.querySelector("#all-decisions-question")
    const allDecisionsAnswers = allDecisionsBox.querySelector("#all-decisions-answers")

    const addDecisionBox = form.querySelector(".form-add-decision")
    const addDecisionId = addDecisionBox.querySelector("#add-decision-id")
    const addDecisionQuestion = addDecisionBox.querySelector("#add-decision-question")
    const addDecisionAnswers = addDecisionBox.querySelector("#add-decision-answers")

    const addAnswersBox = form.querySelector(".form-add-answers")
    const addAnswersAnswers = addAnswersBox.querySelector("#add-answers-answers")

    const editQuestionBox = form.querySelector(".form-edit-question")
    const editQuestion = editQuestionBox.querySelector("#edit-question-new")

    const editAnswersBox = form.querySelector(".form-edit-answers")
    const editAnswersSelect = editAnswersBox.querySelector("#edit-answers-select")
    const editAnswersText = editAnswersBox.querySelector("#edit-answers-text-new")

    const containers = [addDecisionBox, addAnswersBox, editQuestionBox, editAnswersBox]

    populateDecisions()

    function toggleActive(activeElement = null) {
        containers.forEach(element => element.classList.remove("active"))
        if (activeElement !== null) {
            activeElement.classList.add("active")
        }
    }


    // populate all available decision
    function populateDecisions() {
        allDecisionsDec.innerHTML = `<option value="">--seclect a decision question--</option>`
        allDecisionsQuestion.value = ""
        allDecisionsAnswers.innerHTML = ""

        Object.keys(decisionTree.choices).forEach(dec => {
            allDecisionsDec.innerHTML += `<option value="${dec}">${dec}</option>`
        })
    }

    // alert error if form is submitted without sufficient data
    function errorAlert(action) {
        alert(action + ": All fields must be filled.")
    }

    // function to return an array of selected answers using <select> multiple
    function getMultipleSelected(selectElem) {
        const values = []
        Array.from(selectElem.options).filter(op => {
            if (op.selected) {
                values.push(op.value.toLowerCase())
            }
        })
        return values
    }

    // function to return an array of entered answers separated by new lines  
    function getEnteredAnswers(textElem) {
        return textElem.value.toLowerCase().split("\n").filter(answer => answer.trim() !== "");
    }

    // on selecting an action option, display appropriate input fields
    actionsSelect.addEventListener("change", () => {
        currentAction = actionsSelect.value;
        allDecisionsBox.classList.remove("add-decision")
        allDecisionsBox.classList.remove("enabled")

        allDecisionsDec.value = ""         // set default option
        allDecisionsAnswers.innerHTML = ""
        allDecisionsQuestion.value = ""
        allDecisionsAnswers.disabled = true

        switch (currentAction) {
            case "add-decision":
                toggleActive(addDecisionBox)
                allDecisionsBox.classList.add("add-decision")
                break
            case "add-answers":
                toggleActive(addAnswersBox)
                break
            case "edit-question":
                toggleActive(editQuestionBox)
                break
            case "edit-answers":
                allDecisionsAnswers.disabled = false
                allDecisionsBox.classList.add("enabled")
                toggleActive(editAnswersBox)
                break
            case "remove-answers":
                allDecisionsAnswers.disabled = false
                allDecisionsBox.classList.add("enabled")
                toggleActive()
                break
            default:
                toggleActive()
        }
    })


    // on selecting an available decision, display its answers
    allDecisionsDec.addEventListener("change", () => {
        const id = allDecisionsDec.value

        if (id !== "") {
            const decision = decisionTree.getDecision(id)
            allDecisionsQuestion.value = decision.question
            allDecisionsAnswers.innerHTML = ""

            decision.answers.forEach(ans => {
                allDecisionsAnswers.innerHTML += `<option value="${ans}">${ans}</option>`
            })
        }
    })


    // Edit form 
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const decision = allDecisionsDec.value
        if (!decision) {
            errorAlert("Decision not selected")
            return
        }

        let question, answers, id
        switch (currentAction) {
            case "add-decision":
                id = addDecisionId.value.trim().toLowerCase();
                question = addDecisionQuestion.value.trim().toLowerCase();
                answers = getEnteredAnswers(addDecisionAnswers);
                (id && question && answers) ? decisionTree.addDecisionText(id, question, decision, answers) : errorAlert("Add new Decision")
                addDecisionQuestion.value = "";      // clear input
                addDecisionAnswers.value = "";
                addDecisionId.value = "";
                break
            case "add-answers":
                answers = getEnteredAnswers(addAnswersAnswers);
                answers ? decisionTree.addDecisionAnswers(decision, answers) : errorAlert("Add answers")
                addAnswersAnswers.value = ""
                break
            case "edit-question":
                const newQuestion = editQuestionBox.querySelector("#edit-question-new").value.trim().toLowerCase();
                newQuestion ? decisionTree.editDecisionQuestion(decision, newQuestion) : errorAlert("Edit Decision question")
                editQuestion.value = ""
                break
            case "edit-answers":
                const toBeEditAns = getMultipleSelected(editAnswersSelect);
                const newAnswers = getEnteredAnswers(editAnswersText);
                (toBeEditAns.length !== 0 && newAnswers) ?
                    decisionTree.editDecisionAnswers(decision, toBeEditAns, newAnswers) :
                    errorAlert("Edit Decision Answers");

                editAnswersSelect.innerHTML = "";
                editAnswersText.value = "";
                break
            case "remove-decision":
                decisionTree.removeDecision(decision)
                break
            case "remove-answers":
                answers = getMultipleSelected(allDecisionsAnswers)
                answers ? decisionTree.removeSomeDecisionAnswers(decision, answers) : errorAlert("Remove Decision Answer(s)")
                allDecisionsAnswers.innerHTML = ""
                break
        }
        console.log(decisionTree);
        setupChoices(decisionTree.initialDecision)
        populateDecisions()
    })

})()
