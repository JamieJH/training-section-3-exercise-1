class Decision {
    // question, prevDecision, answers
    constructor(id, question, prevDecision, [...answers]) {
        this._id = id
        this._question = question
        this._prevDecision = prevDecision
        this._answers = answers
    }

    get id() {
        return this._id
    }

    set id(id) {
        this._id = id
    }

    get question() {
        return this._question
    }

    set question(question) {
        this._question = question
    }

    get prevDecision() {
        return this._prevDecision
    }

    get answers() {
        return this._answers
    }

    set answers([...answers]) {
        this._answers = answers
    }

}

// all operations on a decision is made through the tree, not through the decision object itself
class DecisionTree {
    constructor(topDecision) {
        this._choices = {}
        this._topDecision = topDecision
        this._choices[topDecision.id] = topDecision
    }

    get choices() {
        return this._choices
    }

    get initialDecision() {
        return this._topDecision
    }

    addDecisionText(id, question, parent, answers) {
        const parentDecision = this.getDecision(parent)
        this.addDecisionObj(new Decision(id, question, parentDecision, answers))
    }

    getPrevDecision(input) {
        // if input is a string (id) and not a Decision obj
        if (!(input instanceof Decision)) {
            input = this.getDecision(input)
        }

        if (input) {
            return input.prevDecision
        }
    }


    addDecisionObj(decision) {
        if (!decision.prevDecision) {
            console.log(`ERROR: Previous Decision was not specified`);
            return
        }

        if (decision.prevDecision.answers.indexOf(decision.id) === -1) {
            // if the id does not exist, add it to the parent answers first 
            this.addDecisionAnswers(decision.prevDecision.id, [decision.id])
        }

        this._choices[decision.id] = decision

    }


    addMultipleDecisions(decisions) {
        for (const decision of Object.values(decisions)) {
            this.addDecisionObj(decision)
        }
    }


    getDecision(id) {
        return this._choices[id]
    }


    // editing a decision question, also edit its parent answer of that question
    editDecisionQuestion(id, newQuestion) {
        const decision = this.getDecision(id)
        // if there exist the question
        if (decision) {
            decision.question = newQuestion     // update the decision new question
        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }

    editDecisionId(id, newId) {
        const decision = this.getDecision(id)
        const isAvailable = this.getDecision(newId) == null
        // if there exist the question
        if (decision && isAvailable) {
            delete this._choices[id]            // delete the old 
            decision.id = newId                 // update the decision new question
            this._choices[newId] = decision        // assign the decision to the new question key

            // update previous decision answers
            if (decision !== this.topDecision) {         // if it's topDecision, there's no previous
                const prevDecAnswers = decision.prevDecision.answers
                const index = prevDecAnswers.indexOf(id)
                prevDecAnswers[index] = newId
            }
        }
        // else {
        //     console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        // }
    }


    // add one or more answers (array) into an existing decision 
    addDecisionAnswers(id, answers) {
        const decision = this.getDecision(id)

        if (decision && answers && answers.length !== 0) {
            decision.answers = Array.from(new Set([...decision.answers, ...answers]))   // remove duplicate
        }
        else {
            console.log(`ERROR: Decision not found or new answers are not provided correctly in array format.`);
        }
    }

    // remove some answers specified from a decision
    // takes in a id or a decision if the object is known
    removeSomeDecisionAnswers(input, answers) {
        // if input is not a Decision, then it's an id
        if (!(input instanceof Decision)) {
            input = this.getDecision(input)
        }

        answers.forEach(ans => {
            // remove the Decision and its subsequences
            this.removeDecision(ans)

            // remove this ans from current decision
            const index = input.answers.indexOf(ans)
            if (index !== -1) {
                input.answers.splice(index, 1)
            }
        })

        // if all answers was removed, remove that decision obj from the tree
        if (input.answers.length === 0) {
            delete this._choices[input.id]
        }

    }


    // removing an answer will also remove its branches (if applicable)
    // this method is recursive
    removeAllDecisionAnswers(id) {
        const decision = this.getDecision(id)

        if (decision) {
            decision.answers.forEach(ans => {
                this.removeAllDecisionAnswers(ans)     // recursion
                delete this._choices[ans]
            })

            decision.answers.length = 0                 // remove the anwers from decision
            delete this._choices[decision.id]     // remove decision obj from the tree

        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }

    // remove a decision using question
    removeDecision(id) {
        const decision = this.getDecision(id)
        if (decision) {
            // remove subsequent decisions
            this.removeAllDecisionAnswers(id)

            // remove this decision key-value
            delete this._choices[id]

            // remove the decision from previous Decision answers
            if (decision.prevDecision) {
                const index = decision.prevDecision.answers.indexOf(id)
                decision.prevDecision.answers.splice(index, 1)
            }

            // if the decision is the top one
            if (decision === this._topDecision) {
                this._topDecision = {}
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
    editDecisionAnswers(id, oldAns, newAns) {
        if (!(newAns && oldAns) ||
            (newAns.length + oldAns.length === 0)) {
            console.log("return");
            return
        }

        const decision = this.getDecision(id)

        // if the decision exists
        if (decision) {
            // if oldAns is provided
            if (oldAns && oldAns.length !== 0) {
                // if newAns is not provided => remove all old answers and their subsequences
                if (!newAns || newAns.length === 0) {
                    this.removeSomeDecisionAnswers(decision, oldAns)
                }

                // if newAns is provided
                else if (newAns.length) {
                    let i = 0

                    while (i < newAns.length && i < oldAns.length) {
                        const indexOld = decision.answers.indexOf(oldAns[i])
                        const indexNew = decision.answers.indexOf(newAns[i])
                        // if old answer exist
                        if (indexOld !== -1 && indexNew === -1) {
                            // update the subsequent decisions
                            this.editDecisionId(oldAns[i], newAns[i])

                            // update current decision answer 
                            decision.answers.splice(indexOld, 1)
                            decision.answers.push(newAns[i])
                        }
                        i++
                    }

                    // this loop runs if newAns > oldAns 
                    while (i < newAns.length) {
                        const indexNew = decision.answers.indexOf(newAns[i])
                        if (indexNew === -1) {
                            decision.answers.push(newAns[i])
                        }
                        i++
                    }
                }
            }
            // if oldAns is not provided, remove original answers (and its subsequent) and replace with newAnswer
            else {
                console.log("no old answers");
                this.removeAllDecisionAnswers(id)
                decision.answers = [...newAns]

            }
        }
        else {
            console.log(`ERROR: Cannot find a Decision with question "${id}" in the tree.`);
        }
    }

}


// Initiate decisions using json file
let tree

const getDecisionTree = fetch("http://localhost:5501/ex-3/decisions.json")  // the port is defined in .vscode/settings.json
    .then(res => {
        if (res.status === 200 || res.ok) {
            return res.json()
        }
    })
    .then(results => {
        const topDecision = results.topDecision
        const decisions = results.decisions

        // define the top decision of the tree, then initialise the tree
        const treeTop = new Decision(topDecision.id, topDecision.question, null, topDecision.answers)
        tree = new DecisionTree(treeTop)

        decisions.forEach(item => {
            const prevDecision = tree.getDecision(item.previousId)
            const decision = new Decision(item.id, item.question, prevDecision, item.answers)
            tree.addDecisionObj(decision)
        })

        return tree
    })


export default getDecisionTree






// top decision - level 1
// const topDecision = new Decision('friday night', null, ['stay in', 'go out'])

// // top decision answers - level 2
// const stayIn = new Decision("stay in", topDecision, ['watch movie', 'gaming', 'early night'])
// const goOut = new Decision("go out", topDecision, ['carnival', 'karaoke'])

// // level 3
// const watchMovie = new Decision("watch movie", stayIn, ['horror', 'action', 'romance'])
// const gaming = new Decision("gaming", stayIn, ['the witcher', 'rdr2', 'dragon age'])
// const carnival = new Decision("carnival", goOut, ["mirror house", "carousel"])

// // level 4
// const horror = new Decision("horror", watchMovie, ["conjuring", "anabelle"])
// const action = new Decision("action", watchMovie, ["black widow", "justice league - snyder cut", "john wick"])
// const romance = new Decision("romance", watchMovie, ["i care a lot", "love, simon", "the danish girl"])



// const tree = new DecisionTree(topDecision)
// tree.addMultipleDecisions({ stayIn, watchMovie, gaming, goOut })
// tree.addDecisionObj(carnival)
// tree.addDecisionObj(horror)
// tree.addMultipleDecisions({action, romance})


// // console.log(tree.choices);
// // tree.editDecisionQuestion("stay in", "stay home")
// // console.log(tree);

// // // tree.editDecisionAnswers("stay home", [], ['watch shows', "call mom", "invite friends"])
// // tree.editDecisionAnswers("stay home", ['gaming', 'watch movie'], [])
// // console.log(tree);

// // const empty = new Decision("clubbing", null, ["cocktail", "soda", "beer"])


// // editDecisionAnswers tests
// function editDecisionAnswersTests() {
//     tree.editDecisionAnswers("stay in", [], [])                    // empty arrs =>  do nothing
//     tree.editDecisionAnswers("stay in", ["not an answer"], null)   // old ans not exist => do nothing
//     console.log("---------------------------");
//     // only old answers provided => remove them
//     tree.editDecisionAnswers("stay in", ["watch movie", "gaming"], [])
//     console.log("---------------------------");

//     // only new answers privided => remove all old answers and replace them with new one
//     tree.editDecisionAnswers("stay in", [], ["cook dinner", "order in"])
//     console.log("---------------------------");

//     const cookDinner = new Decision("cook feast", stayIn, ["lasagna", "mac 'n cheese"])
//     tree.addDecisionObj(cookDinner)     // error "cook feast" is not one of stayIn answers
//     console.log("---------------------------");

//     // old answer does not exist => skip that old-new answer pair
//     tree.editDecisionAnswers("stay in", ["cook feast", "order in"], ["starve", "take out"])
//     console.log("---------------------------");

//     // old answers < new answers, extra new answer already in the current asnwers => skip it
//     tree.editDecisionAnswers("go out", ["carnival", "karaoke"], ["bar", "concert", "concert"])
//     const bar = new Decision("bar", goOut, ["beer", "cocktail", "soda"])
//     tree.addDecisionObj(bar)
//     console.log("---------------------------");

//     // old answers < new answers, perfect scenario
//     tree.editDecisionAnswers("go out", ["bar", "concert"], ["club", "coachella"])
// }

// editDecisionAnswersTests()

// export default tree