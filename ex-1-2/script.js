// ---------------------------------------------------------------
// Exercise 1: Remove duplicate from array
const arr = [1,2,2,3,4,5,3,2,4,5,6,7,5,6] 

// 1. Using Set
const unique_1 = Array.from(new Set(arr))
console.log("Using Set: ", unique_1);

// 2. An extra map to store visited element
const visited = {}
const unique_2 = []
arr.forEach(item => {
    if (!visited[item]) {
        unique_2.push(item)
        visited[item] = true
    }
})
console.log("Using extra map: ", unique_2);
// console.log("Visited: ", visited);


// 3. Use indexOf() to return the first index that has the value
// Time complexity: best case O(nlog(n)) because the indexOf() stops as soon as an element is found
const unique_3 = arr.filter((item, index) => arr.indexOf(item) === index)
console.log("Using indexOf on Original array: ", unique_3);


// 4. Use indexOf on final array
// worst case O(n^2) if there's little to no duplicate
const unique_4 = []
arr.forEach(item => {
    if (unique_4.indexOf(item) === -1) {
        unique_4.push(item)
    }
})
console.log("Use indexOf on Final Array: ", unique_4);


// ---------------------------------------------------------------
// Exercise 2: Find Repetitions
const arr_2 = [1,4,5,7,3,1,7,5,8,3,3,9,2,3,4,4,3,2,4,4,6,7,5,6] 

const counters = {}
arr_2.forEach(item => {
    // add 1 if item already in counters obj, else set it to 1
    counters[item] = counters[item] ? counters[item] += 1 : 1
})

let max = 0                         // current max repititions
const maxValues = []                // array contains items with max repetitions

for (const [key, value] of Object.entries(counters)) {
    // if value is higher than current max
    if (value > max) {
        max = value        
        maxValues.length = 0        // clear original array
        maxValues.push(key)         // add the key to the array
    }
    else if (value === max) {       // multiple key with max repetitions
        maxValues.push(key)
    }
}
console.log("Counter: ", counters);
console.log("Value(s) with most repetitions: ", maxValues, ", repeated ", max, " time(s)");