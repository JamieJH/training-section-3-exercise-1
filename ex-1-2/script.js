// ---------------------------------------------------------------
// Exercise 1: Remove duplicate from array
const duplicatedItems = [1, 2, 2, 3, 4, 5, 3, 2, 4, 5, 6, 7, 5, 6];

const removeDuplicateFactory = (duplicatedItems, option) => {
    if(!Array.isArray(duplicatedItems)) {
        throw (new Error("Expect an array but received another type."))
    }

    if(duplicatedItems.length === 0) {
        throw (new Error("Expect an array with at least one item but received an empty array."))
    }

    if (!option) {
        throw (new Error('Expect an option as a string of value "set", "map", "indexof-original", or "indexof-final"'))
    }

    switch(option.toLowerCase()) {
        case 'set': {
            return removeDuplicateUsingSet(duplicatedItems);
        }
        case 'map': {
            return removeDuplicateUsingMap(duplicatedItems);
        }
        case 'indexof-original': {
            return removeDuplicateUsingIndexOfOriginalArray(duplicatedItems);
        }
        case 'indexof-final': {
            return removeDuplicateUsingIndexOfFinalArray(duplicatedItems);
        }
        default: {
            throw (new Error('Expect an option as a string of value "set", "map", "indexof-original", or "indexof-final"'))
        }
    }
}

removeDuplicateFactoryConfiguration = (duplicatedItems, option) => {
    if(!Array.isArray(duplicatedItems)) {
        throw (new Error("Expect an array but received another type."));
    }

    if(duplicatedItems.length === 0) {
        throw (new Error("Expect an array with at least one item but received an empty array."))
    }

    if (!option) {
        throw (new Error('Expect an option as a string of value "set", "map", "indexof-original", or "indexof-final"'));
    }

    const configurations = {
        'set': function() {
            return removeDuplicateUsingSet(duplicatedItems);
        },
        'map': function() {
            return removeDuplicateUsingMap(duplicatedItems);
        },
        'indexof-original': function() {
            return removeDuplicateUsingIndexOfOriginalArray(duplicatedItems);
        },
        'indexof-final': function() {
            return removeDuplicateUsingIndexOfFinalArray(duplicatedItems)
        },
        'default': function() {
            throw (new Error('Expect an option as a string of value "set", "map", "indexof-original", or "indexof-final"'));
        }
    }
    return (configurations[option] || configurations['default'])()
}

const removeDuplicateUsingSet = (duplicatedItems) => {
    return Array.from(new Set(duplicatedItems));
}

const removeDuplicateUsingMap = (duplicatedItems) => {
    const visitedItems = {};
    const uniqueItems = [];
    duplicatedItems.forEach(item => {
        if (!visitedItems[item]) {
            uniqueItems.push(item);
            visitedItems[item] = true;
        }
    })
    return uniqueItems;
}

// Time complexity: best case O(nlog(n)) because the indexOf() stops as soon as an element is found
const removeDuplicateUsingIndexOfOriginalArray = (duplicatedItems) => {
    return duplicatedItems.filter((item, index) => {
        return duplicatedItems.indexOf(item) === index
    });
}

// worst case O(n^2) if there's little to no duplicate
const removeDuplicateUsingIndexOfFinalArray = (duplicatedItems) => {
    const uniqueItems = [];
    duplicatedItems.forEach(item => {
        if (uniqueItems.indexOf(item) === -1) {
            uniqueItems.push(item);
        }
    })
    return uniqueItems;
}

console.log("Using Set: ", removeDuplicateFactory(duplicatedItems, "set"));
console.log("Using extra map: ", removeDuplicateFactory(duplicatedItems, "map"));
console.log("Using indexOf on Original array: ", removeDuplicateFactory(duplicatedItems, "indexof-original"));
console.log("Use indexOf on Final Array: ", removeDuplicateFactory(duplicatedItems, "indexof-final"));

console.log("Using Configuration - Set: ", removeDuplicateFactoryConfiguration(duplicatedItems, "set"));
console.log("Using Configuration - Map: ", removeDuplicateFactoryConfiguration(duplicatedItems, "map"));
console.log("Using Configuration - indexOf on Original array: ", removeDuplicateFactoryConfiguration(duplicatedItems, "indexof-original"));
console.log("Using Configuration - indexOf on Final Array: ", removeDuplicateFactoryConfiguration(duplicatedItems, "indexof-final"));
console.log("Using Configuration - other options: ", removeDuplicateFactoryConfiguration(duplicatedItems, "something else"));



// ---------------------------------------------------------------
// Exercise 2: Find Repetitions
const repeatedItems = [1, 4, 5, 7, 3, 1, 7, 5, 8, 3, 3, 9, 2, 3, 4, 4, 3, 2, 4, 4, 6, 7, 5, 6];

const findMaxRepetitionsFactory = (repeatedItems, option) => {
    if (!Array.isArray(repeatedItems)) {
        throw (new Error('Expect an array but received another type.'));
    }

    if (repeatedItems.length === 0) {
        throw (new Error('Expect an array with at least one item but received an empty array.'));
    }

    if (!option) {
        throw (new Error('Expect an option as a string with value "loops" or "reduce"'));
    }

    switch(option.toLowerCase()) {
        case 'loops': {
            return findMaxRepetitionsWithTwoLoops(repeatedItems);
        }
        case 'reduce': {
            return findMaxRepetitionsWithReduce(repeatedItems);
        }
        default: {
            throw (new Error('Expect an option as a string with value "loops" or "reduce"'));
        }
    }
}

const findMaxRepetitionsFactoryConfiguration = (repeatedItems, option) => {
    if (!Array.isArray(repeatedItems)) {
        throw (new Error('Expect an array but received another type.'));
    }

    if (repeatedItems.length === 0) {
        throw (new Error('Expect an array with at least one item but received an empty array.'));
    }

    if (!option) {
        throw (new Error('Expect an option as a string with value "loops" or "reduce"'));
    }

    const configurations = {
        'loops': function() {
            return findMaxRepetitionsWithTwoLoops(repeatedItems);
        },
        'reduce': function() {
            return findMaxRepetitionsWithReduce(repeatedItems);
        },
        'default': function() {
            throw (new Error('Expect an option as a string with value "loops" or "reduce"'));
        }
    }

    return (configurations[option] || configurations['default'])()
}


const findMaxRepetitionsWithTwoLoops = (repeatedItems) => {
    const itemRepetitionsCounters = {};
    repeatedItems.forEach(item => {
        itemRepetitionsCounters[item] = itemRepetitionsCounters[item] ? itemRepetitionsCounters[item] += 1 : 1;
    })

    let maxRepititions = 0
    const mostRepeatedItems = []

    for (const [currentItem, currentItemRepititions] of Object.entries(itemRepetitionsCounters)) {
        if (currentItemRepititions > maxRepititions) {
            maxRepititions = currentItemRepititions;
            mostRepeatedItems.length = 0;
            mostRepeatedItems.push(parseInt(currentItem));
        }
        else if (currentItemRepititions === maxRepititions) {
            mostRepeatedItems.push(parseInt(currentItem));
        }
    }
    return { 
        mostRepeatedItems: mostRepeatedItems, 
        maxRepititions: maxRepititions 
    };
}

const findMaxRepetitionsWithReduce = (repeatedItems) => {
    const { mostRepeatedItems, itemRepetitionCounters } = repeatedItems.reduce((accumulated, item) => {
        const mostRepeatedItems = accumulated.mostRepeatedItems;
        const itemRepetitionCounters = accumulated.itemRepetitionCounters;

        // count occurences for each item, not immediately update the counters obj as the 
        // count of most repeated values will also be changed, making if condition misbehave
        const currentItemRepetitions = itemRepetitionCounters[item] + 1 || 1;
        const currentMaxRepeatedItems = mostRepeatedItems;

        if (currentMaxRepeatedItems.length === 0 || itemRepetitionCounters[currentMaxRepeatedItems[0]] < currentItemRepetitions) {
            mostRepeatedItems.length = 0;
            mostRepeatedItems.push(item);
        }

        else if (currentMaxRepeatedItems.length && itemRepetitionCounters[currentMaxRepeatedItems[0]] === currentItemRepetitions) {
            mostRepeatedItems.push(item);
        }

        itemRepetitionCounters[item] = currentItemRepetitions;

        return accumulated;
    }, { mostRepeatedItems: [], itemRepetitionCounters: {} });

    return { 
        mostRepeatedItems: mostRepeatedItems, 
        maxRepititions: itemRepetitionCounters[mostRepeatedItems[0]] 
    };
}

console.log(findMaxRepetitionsFactory(repeatedItems, "loops"));
console.log(findMaxRepetitionsFactory(repeatedItems, "reduce"));