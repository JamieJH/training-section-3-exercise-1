import getDecisionTree from './tree.js';

(async function () {
    let decisionTree
    await getDecisionTree.then(res => { decisionTree = res });
    /* Making decisions */
    const chosenQuestion = document.getElementById("chosen");
    let chosenDecisionId;
    const answersList = document.getElementById("answers");
    const decideStatus = document.getElementById("note");
    const finalChoice = document.getElementById("final");
    const buttonBack = document.querySelector(".btn__back");
    const buttonToTop = document.querySelector(".btn__top");

    setupChoices(decisionTree.initialDecision)
    function setupChoices(decision) {
        chosenQuestion.innerText = "There's no decision!";
        chosenDecisionId = decision.id;
        let answers = "";

        if (decision.question) {
            chosenQuestion.innerText = decision.question[0].toUpperCase() + decision.question.substr(1);
            decision.answers.forEach(ans => {
                answers += `<li>${ans}</li>`;
            })
        }
        answersList.innerHTML = answers;
        clearNotes()
    }

    function displayAnswersOnDecide(chosenAnswer) {
        const decision = decisionTree.getDecisionById(chosenAnswer.toLowerCase());
        if (decision) {
            setupChoices(decision);
        }
        else {
            decideStatus.innerText = "You have reached the end!";
            finalChoice.innerHTML = `Final choice: <span>${chosenAnswer}<span>`;
        }
    }

    function goBackToPreviousDecision() {
        const previousDecision = decisionTree.getPreviousDecision(chosenDecisionId);
        if (previousDecision) {
            setupChoices(previousDecision);
        }
        else {
            decideStatus.innerText = "You have reached the top!";
        }
    }

    function goToTopDecision() {
        setupChoices(decisionTree.initialDecision);
    }

    function clearNotes() {
        decideStatus.innerText = "";
        finalChoice.innerText = "";
    }

    answersList.addEventListener("click", (e) => {
        if (e.target.nodeName === "LI") {
            displayAnswersOnDecide(e.target.innerText);
        }
    })

    buttonBack.addEventListener("click", goBackToPreviousDecision);
    buttonToTop.addEventListener("click", goToTopDecision);

    // ************************************************************************
    // edit decision tree

    const form = document.getElementById("edit-form");
    const actionsSelect = form.querySelector(".form-input.selection select");
    let currentAction = "add-decision";

    const allDecisionsContainer = form.querySelector(".form-all-decisions-choose");
    const allDecisionsDecision = allDecisionsContainer.querySelector("#all-decisions-decision");
    const allDecisionsQuestion = allDecisionsContainer.querySelector("#all-decisions-question");
    const allDecisionsAnswers = allDecisionsContainer.querySelector("#all-decisions-answers")

    const addDecisionContainer = form.querySelector(".form-add-decision");
    const addDecisionId = addDecisionContainer.querySelector("#add-decision-id");
    const addDecisionQuestion = addDecisionContainer.querySelector("#add-decision-question");
    const addDecisionAnswers = addDecisionContainer.querySelector("#add-decision-answers");

    const addAnswersContainer = form.querySelector(".form-add-answers");
    const addAnswersAnswers = addAnswersContainer.querySelector("#add-answers-answers");

    const editQuestionContainer = form.querySelector(".form-edit-question");
    const editQuestionNew = editQuestionContainer.querySelector("#edit-question-new");

    const editAnswersContainer = form.querySelector(".form-edit-answers");
    const editAnswersText = editAnswersContainer.querySelector("#edit-answers-text-new");

    const containers = [addDecisionContainer, addAnswersContainer, editQuestionContainer, editAnswersContainer]

    populateAllDecisionOptions()

    function toggleActive(activeElement = null) {
        containers.forEach(element => element.classList.remove("active"));
        if (activeElement !== null) {
            activeElement.classList.add("active");
        }
    }


    function populateAllDecisionOptions() {
        allDecisionsDecision.innerHTML = `<option value="">--seclect a decision question--</option>`;
        allDecisionsQuestion.value = "";
        allDecisionsAnswers.innerHTML = "";

        Object.keys(decisionTree.choices).forEach(dec => {
            allDecisionsDecision.innerHTML += `<option value="${dec}">${dec}</option>`;
        })
    }

    function errorEmptyInputAlert(action) {
        alert(action + ": All fields must be filled.")
    }

    function getSelectedOptionsAsArray(selectedOptions) {
        const optionsAsArray = [];
        Array.from(selectedOptions.options).filter(option => {
            if (option.selected) {
                optionsAsArray.push(option.value.toLowerCase());
            }
        })
        return optionsAsArray;
    }

    // function to return an array of entered answers separated by new lines  
    function getEnteredAnswersAsArray(textInput) {
        const answers = [];
        textInput.value.toLowerCase().split("\n").forEach(answer => {
            if (answer.trim() !== "") {
                answers.push(answer.trim());
            }
        });
        return answers;
    }

    // on selecting an action option, display appropriate input fields
    actionsSelect.addEventListener("change", () => {
        currentAction = actionsSelect.value;
        allDecisionsContainer.classList.remove("add-decision");
        allDecisionsContainer.classList.remove("enabled");

        allDecisionsDecision.value = "";
        allDecisionsQuestion.value = "";
        allDecisionsAnswers.innerHTML = "";
        allDecisionsAnswers.disabled = true;

        switch (currentAction) {
            case "add-decision":
                toggleActive(addDecisionContainer);
                allDecisionsContainer.classList.add("add-decision");
                break
            case "add-answers":
                toggleActive(addAnswersContainer);
                break
            case "edit-question":
                toggleActive(editQuestionContainer);
                break
            case "edit-answers":
                allDecisionsAnswers.disabled = false;
                allDecisionsContainer.classList.add("enabled");
                toggleActive(editAnswersContainer)
                break
            case "remove-answers":
                allDecisionsAnswers.disabled = false;
                allDecisionsContainer.classList.add("enabled");
                toggleActive();
                break
            default:
                toggleActive();
        }
    })


    // on selecting an available decision, display its answers
    allDecisionsDecision.addEventListener("change", () => {
        const decisionId = allDecisionsDecision.value;

        if (decisionId !== "") {
            const decision = decisionTree.getDecisionById(decisionId);
            allDecisionsQuestion.value = decision.question;
            allDecisionsAnswers.innerHTML = "";

            decision.answers.forEach(ans => {
                allDecisionsAnswers.innerHTML += `<option value="${ans}">${ans}</option>`;
            })
        }
    })


    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const chosenDecisionId = allDecisionsDecision.value;
        if (!chosenDecisionId) {
            errorEmptyInputAlert("Decision not selected");
            return
        }

        let question, answers;
        switch (currentAction) {
            case "add-decision":
                const newDecisionId = addDecisionId.value.trim().toLowerCase();
                question = addDecisionQuestion.value.trim().toLowerCase();
                answers = getEnteredAnswersAsArray(addDecisionAnswers);
                (newDecisionId && question && answers) ? decisionTree.addDecisionFromText(newDecisionId, question, chosenDecisionId, answers) : errorEmptyInputAlert("Add new Decision")
                addDecisionQuestion.value = "";
                addDecisionAnswers.value = "";
                addDecisionId.value = "";
                break
            case "add-answers":
                answers = getEnteredAnswersAsArray(addAnswersAnswers);
                answers ? decisionTree.addAnswersToDecision(chosenDecisionId, answers) : errorEmptyInputAlert("Add answers");
                addAnswersAnswers.value = "";
                break
            case "edit-question":
                const newQuestion = editQuestionContainer.querySelector("#edit-question-new").value.trim().toLowerCase();
                newQuestion ? decisionTree.editDecisionQuestion(chosenDecisionId, newQuestion) : errorEmptyInputAlert("Edit Decision question");
                editQuestionNew.value = "";
                break
            case "edit-answers":
                const toBeEditedAnswers = getSelectedOptionsAsArray(allDecisionsAnswers);
                const newAnswers = getEnteredAnswersAsArray(editAnswersText);
                (toBeEditedAnswers.length !== 0 && newAnswers) ?
                    decisionTree.editDecisionAnswers(chosenDecisionId, toBeEditedAnswers, newAnswers) :
                    errorEmptyInputAlert("Edit Decision Answers");
                editAnswersText.value = "";
                break
            case "remove-decision":
                decisionTree.removeDecisionAndChildren(chosenDecisionId);
                break
            case "remove-answers":
                answers = getSelectedOptionsAsArray(allDecisionsAnswers);
                answers ? decisionTree.removeMultipleAnswersFromDecision(chosenDecisionId, answers) : errorEmptyInputAlert("Remove Decision Answer(s)");
                allDecisionsAnswers.innerHTML = "";
                break
        }
        console.log(decisionTree);
        setupChoices(decisionTree.initialDecision);
        populateAllDecisionOptions();
    })

})()
