// ---------------------------------------------------------------
// Exercise 1: Remove duplicate from array
const arr = [1, 2, 2, 3, 4, 5, 3, 2, 4, 5, 6, 7, 5, 6]

// 1. Using Set
const removeDupOne = (arr) => {
    return Array.from(new Set(arr))
}


// 2. An extra map to store visited element
const removeDupTwo = (arr) => {
    const visited = {}
    const unique = []
    arr.forEach(item => {
        if (!visited[item]) {
            unique.push(item)
            visited[item] = true
        }
    })
    return unique
}


// 3. Use indexOf() to return the first index that has the value
// Time complexity: best case O(nlog(n)) because the indexOf() stops as soon as an element is found
const removeDupThree = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index)
}


// 4. Use indexOf on final array
// worst case O(n^2) if there's little to no duplicate
const removeDupFour = (arr) => {
    const unique = []
    arr.forEach(item => {
        if (unique.indexOf(item) === -1) {
            unique.push(item)
        }
    })
    return unique
}

// console.log("Using Set: ", removeDupOne(arr));
// console.log("Using extra map: ", removeDupTwo(arr));
// console.log("Using indexOf on Original array: ", removeDupThree(arr));
// console.log("Use indexOf on Final Array: ", removeDupFour(arr));


// ---------------------------------------------------------------
// Exercise 2: Find Repetitions
const arr_2 = [1, 4, 5, 7, 3, 1, 7, 5, 8, 3, 3, 9, 2, 3, 4, 4, 3, 2, 4, 4, 6, 7, 5, 6]

// Using 2 loops and extra variables
const findMaxRepetitionsOne = (arr) => {
    if (arr.length === 0) {
        return null
    }

    const counters = {}
    arr.forEach(item => {
        // add 1 if item already in counters obj, else set it to 1
        counters[item] = counters[item] ? counters[item] += 1 : 1
    })

    let maxRepititions = 0                         // current max repititions
    const mostRepeated = []                // array contains items with max repetitions

    for (const [key, value] of Object.entries(counters)) {
        // if value is higher than current max
        if (value > maxRepititions) {
            maxRepititions = value
            mostRepeated.length = 0        // clear original array
            mostRepeated.push(key)         // add the key to the array
        }
        else if (value === maxRepititions) {       // multiple key with max repetitions
            mostRepeated.push(key)
        }
    }
    return { mostRepeated: mostRepeated, repetitions: maxRepititions }
}

console.log(findMaxRepetitionsOne(arr_2));


// Using only one loop: array.reduce()
const findMaxRepetitionsTwo = (arr) => {
    if (arr.length === 0) {
        return null
    }
    const result = arr.reduce((accum, item) => {
        // count occurences for each item
        accum.counters[item] = accum.counters[item] + 1 || 1

        // current most repeated items
        const maxVals = Object.keys(accum.mostRepeated)

        // if NO most repeated item exist (first loop) or their repetitions < those of newly counted item
        // => there's a new most repeated item, clear the current maxItems
        if (maxVals.length === 0 || accum.counters[maxVals[0]] < accum.counters[item]) {
            accum.mostRepeated = {}             // clear obj
            accum.mostRepeated[item] = true     // add the new max item to obj
        }

        // if some most repeated item exist and their repetitions === those of newly counted item,
        // => add that item to maxItems obj
        else if (maxVals.length && accum.counters[maxVals[0]] === accum.counters[item]) {
            accum.mostRepeated[item] = true
        }

        return { ...accum }
    }, { mostRepeated: {}, counters: {} })

    const mostRepeatedItems = Object.keys(result.mostRepeated)
    return { mostRepeated: mostRepeatedItems, repititions: result.counters[mostRepeatedItems[0]] }
}

console.log(findMaxRepetitionsTwo(arr_2));