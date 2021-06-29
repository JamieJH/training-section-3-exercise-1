import decisionTree from './tree.js'

(function () {
    /* Making decisions */
    const chosen = document.getElementById("chosen")
    const answers = document.getElementById("answers")
    const note = document.getElementById("note")
    const final = document.getElementById("final")
    const btnBack = document.querySelector(".btn__back")
    const btnTop = document.querySelector(".btn__top")

    setupChoices(decisionTree.initialDecision)

    // display a decision question and its answers for user to choose from
    function setupChoices(decision) {
        chosen.innerText = "There's no decision!"
        let innerLis = ""

        if (decision.question) {
            chosen.innerText = decision.question
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

    const allDecisions = form.querySelector("#all-decisions")
    const allDecisionsLabel = form.querySelector("#all-decisions-label")

    const addDecisionBox = form.querySelector(".form-add-decision")
    const addDecisionQuestion = addDecisionBox.querySelector("#add-decision-question")
    const addDecisionAnswers = addDecisionBox.querySelector("#add-decision-answers")

    const addAnswersBox = form.querySelector(".form-add-answers")
    const addAnswersAnswers = addAnswersBox.querySelector("#add-answers-answers")

    const editQuestionBox = form.querySelector(".form-edit-question")

    const editAnswersBox = form.querySelector(".form-edit-answers")
    const editAnswersSelect = editAnswersBox.querySelector("#edit-answers-select")
    const editAnswersText = editAnswersBox.querySelector("#edit-answers-text-new")

    const removeDecisionBox = form.querySelector(".form-remove-decision")
    const removeDecisionAns = removeDecisionBox.querySelector("#remove-decision-ans")

    const removeAnswersBox = form.querySelector(".form-remove-answers")
    const removeAnswersSelect = removeAnswersBox.querySelector("#remove-answers-select")

    const containers = [addDecisionBox, addAnswersBox, editQuestionBox,
        editAnswersBox, removeDecisionBox, removeAnswersBox]


    populateDecisions()


    function toggleActive(activeElement) {
        containers.forEach(element => element.classList.remove("active"))
        activeElement.classList.add("active")
    }


    // populate all available decision
    function populateDecisions() {
        allDecisions.innerHTML = `<option value="">--seclect a decision question--</option>`
        Object.keys(decisionTree.choices).forEach(dec => {
            allDecisions.innerHTML += `<option value="${dec}">${dec}</option>`
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
        return textElem.value.toLowerCase().split("\n");
    }

    // on selecting an action option, display appropriate input fields
    actionsSelect.addEventListener("change", () => {
        currentAction = actionsSelect.value;
        allDecisionsLabel.innerText = "Decision"
        allDecisions.value = ""         // set default option

        switch (currentAction) {
            case "add-decision":
                toggleActive(addDecisionBox)
                allDecisionsLabel.innerText = "Parent Decision"
                break
            case "add-answers":
                toggleActive(addAnswersBox)
                break
            case "edit-question":
                toggleActive(editQuestionBox)
                break
            case "edit-answers":
                toggleActive(editAnswersBox)
                break
            case "remove-decision":
                toggleActive(removeDecisionBox)
                break
            default:
                toggleActive(removeAnswersBox)
        }
    })


    // on selecting an available decision, display its answers
    allDecisions.addEventListener("change", () => {
        const question = allDecisions.value

        if (question !== "") {
            if (currentAction === "remove-decision") {
                removeDecisionAns.value = decisionTree.choices[question].answers.join("\n")
            }
            else if (currentAction === "remove-answers") {
                removeAnswersSelect.innerHTML = ""
                decisionTree.choices[question].answers.forEach(ans => {
                    removeAnswersSelect.innerHTML += `<option value="${ans}">${ans}</option>`
                })
            }
            else if (currentAction === "edit-answers") {
                editAnswersSelect.innerHTML = ""
                decisionTree.choices[question].answers.forEach(ans => {
                    editAnswersSelect.innerHTML += `<option value="${ans}">${ans}</option>`
                })
            }
        }
    })


    // Edit form 
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const decision = allDecisions.value
        if (!decision) {
            errorAlert("Decision not selected")
            return
        }

        let question, answers
        switch (currentAction) {
            case "add-decision":
                question = addDecisionQuestion.value.toLowerCase()
                answers = getEnteredAnswers(addDecisionAnswers);
                (question && answers) ? decisionTree.addDecisionText(decision, question, answers) : errorAlert("Add new Decision")
                break
            case "add-answers":
                answers = getEnteredAnswers(addAnswersAnswers);
                console.log(answers);
                answers ? decisionTree.addDecisionAnswers(decision, answers) : errorAlert("Add answers")
                break
            case "edit-question":
                const newQuestion = editQuestionBox.querySelector("#edit-question-new").value.trim().toLowerCase();
                newQuestion ? decisionTree.editDecisionQuestion(decision, newQuestion) : errorAlert("Edit Decision question")
                break
            case "edit-answers":
                const toBeEditAns = getMultipleSelected(editAnswersSelect)
                const newAnswers = getEnteredAnswers(editAnswersText)
                    (toBeEditAns.length !== 0 && newAnswers) ?
                    decisionTree.editDecisionAnswers(decision, toBeEditAns, newAnswers) :
                    errorAlert("Edit Decision Answers")
                break
            case "remove-decision":
                decisionTree.removeDecision(decision)
                break
            case "remove-answers":
                answers = getMultipleSelected(removeAnswersSelect)
                answers ? decisionTree.removeSomeDecisionAnswers(decision, answers) : errorAlert("Remove Decision Answer(s)")
                break
        }
        setupChoices(decisionTree.initialDecision)
        populateDecisions()
    })

})()
