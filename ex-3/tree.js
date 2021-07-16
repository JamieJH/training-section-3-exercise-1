class Decision {
    constructor(id, question, previousDecision, [...answers]) {
        this._id = id;
        this._question = question;
        this._previousDecision = previousDecision;
        this._answers = answers;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get question() {
        return this._question;
    }

    set question(question) {
        this._question = question;
    }

    get previousDecision() {
        return this._previousDecision;
    }

    get answers() {
        return this._answers;
    }

    set answers([...answers]) {
        this._answers = answers;
    }

}

// all operations on a decision is made through the tree, not through the decision object itself
class DecisionTree {
    constructor(topDecision) {
        this._choices = {};
        this._topDecision = topDecision;
        this._choices[topDecision.id] = topDecision;
    }

    get choices() {
        return this._choices;
    }

    get initialDecision() {
        return this._topDecision;
    }

    addDecisionFromText(id, question, parentId, answers) {
        const parentDecision = this.getDecisionById(parentId);
        this.addDecisionObj(new Decision(id, question, parentDecision, answers));
    }

    getPreviousDecision(input) {
        // if input is a string (id) and not a Decision obj
        if (!(input instanceof Decision)) {
            input = this.getDecisionById(input);
        }

        if (input) {
            return input.previousDecision;
        }
    }


    addDecisionObj(decision) {
        if (!decision.previousDecision) {
            throw (new Error("Previous Decision was not specified"));
        }

        if (decision.previousDecision.answers.indexOf(decision.id) === -1) {
            this.addAnswersToDecision(decision.previousDecision.id, [decision.id]);
        }

        this._choices[decision.id] = decision;
    }


    addMultipleDecisions(decisions) {
        for (const decision of Object.values(decisions)) {
            this.addDecisionObj(decision);
        }
    }


    getDecisionById(id) {
        return this._choices[id]
    }


    editDecisionQuestion(id, newQuestion) {
        const decision = this.getDecisionById(id)
        if (decision) {
            decision.question = newQuestion
        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }

    editDecisionId(id, newId) {
        const decision = this.getDecisionById(id)
        const isAvailable = this.getDecisionById(newId) == null
        if (decision && isAvailable) {
            delete this._choices[id];
            decision.id = newId;
            this._choices[newId] = decision;

            // update previous decision answers
            if (decision !== this.topDecision) {         // if it's topDecision, there's no previous
                const previousDecisionAnswers = decision.previousDecision.answers;
                const index = previousDecisionAnswers.indexOf(id);
                previousDecisionAnswers[index] = newId;
            }
        }
    }


    addAnswersToDecision(id, answers) {
        const decision = this.getDecisionById(id);

        if (decision && answers && answers.length !== 0) {
            decision.answers = Array.from(new Set([...decision.answers, ...answers]));
        }
        else {
            console.log(`ERROR: Decision not found or new answers are not provided correctly in array format.`);
        }
    }

    // takes in a id or a decision if the object is known
    removeMultipleAnswersFromDecision(decisionIdOrObj, answers) {
        if (!(decisionIdOrObj instanceof Decision)) {
            decisionIdOrObj = this.getDecisionById(decisionIdOrObj);
        }

        answers.forEach(ans => {
            this.removeDecisionAndChildren(ans);

            const index = decisionIdOrObj.answers.indexOf(ans);
            if (index !== -1) {
                decisionIdOrObj.answers.splice(index, 1);
            }
        })

        // if all answers was removed, remove that decision obj from the tree
        if (decisionIdOrObj.answers.length === 0) {
            delete this._choices[decisionIdOrObj.id];
        }

    }


    // removing an answer will also remove its branches (if applicable)
    // this method is recursive
    removeAllAnswersFromDecision(id) {
        const decision = this.getDecisionById(id);

        if (decision) {
            decision.answers.forEach(ans => {
                this.removeAllAnswersFromDecision(ans);
                delete this._choices[ans];
            })

            decision.answers.length = 0;
            delete this._choices[decision.id];

        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }

    removeDecisionAndChildren(id) {
        const decision = this.getDecisionById(id);
        if (decision) {
            this.removeAllAnswersFromDecision(id);
            delete this._choices[id];

            // remove the decision from previous Decision answers
            if (decision.previousDecision) {
                const index = decision.previousDecision.answers.indexOf(id);
                decision.previousDecision.answers.splice(index, 1);
            }

            if (decision === this._topDecision) {
                this._topDecision = {};
            }
        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }



    /* 
    - the order of oldAnswers and newAnswers must the the same
    - if oldAnswers is not provided, current answers and their subsequent will be deleted and 
    replaced with newAnswers
    - if oldAnswers is provided, based on their indices, newAnswers will replace those in oldAnwers
    - if newAnswers.length > oldAnswers.length, the excess will be added to the answers
    - if newAnswers.length < oldAnswers.length, remove oldAnswers excesses 
    - if oldAnswers is specified, but newAnswers are not => remove all old answers and their subsequences
    */
    editDecisionAnswers(id, oldAnswers, newAnswers) {
        if (!(newAnswers && oldAnswers) || (newAnswers.length + oldAnswers.length === 0)) {
            return;
        }

        const decision = this.getDecisionById(id);

        if (decision) {
            if (oldAnswers && oldAnswers.length !== 0) {
                // if newAns is not provided => remove all old answers and their subsequences
                if (!newAnswers || newAnswers.length === 0) {
                    this.removeMultipleAnswersFromDecision(decision, oldAnswers);
                }

                else if (newAnswers.length) {
                    let i = 0;

                    while (i < newAnswers.length && i < oldAnswers.length) {
                        const oldAnswerIndex = decision.answers.indexOf(oldAnswers[i]);
                        const newAnswerIndex = decision.answers.indexOf(newAnswers[i]);
                        if (oldAnswerIndex !== -1 && newAnswerIndex === -1) {
                            // update the subsequent decisions
                            this.editDecisionId(oldAnswers[i], newAnswers[i]);

                            decision.answers.splice(oldAnswerIndex, 1)
                            decision.answers.push(newAnswers[i])
                        }
                        i++
                    }

                    // this loop runs if newAnswers is longer than oldAnswers
                    while (i < newAnswers.length) {
                        const newAnswerIndex = decision.answers.indexOf(newAnswers[i])
                        if (newAnswerIndex === -1) {
                            decision.answers.push(newAnswers[i])
                        }
                        i++
                    }
                }
            }
            else {
                this.removeAllAnswersFromDecision(id);
                decision.answers = [...newAnswers];
            }
        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }

}


// Initiate decisions using json file
let tree;

const getDecisionTree = fetch("http://localhost:5501/ex-3/decisions.json")  // the port is defined in .vscode/settings.json
    .then(res => {
        if (res.status === 200 || res.ok) {
            return res.json();
        }
    })
    .then(results => {
        const topDecision = results.topDecision;
        const decisions = results.decisions;

        const treeTop = new Decision(topDecision.id, topDecision.question, null, topDecision.answers);
        tree = new DecisionTree(treeTop);

        decisions.forEach(item => {
            const previousDecision = tree.getDecisionById(item.previousId)
            const decision = new Decision(item.id, item.question, previousDecision, item.answers)
            tree.addDecisionObj(decision)
        })

        return tree
    })


export default getDecisionTree
