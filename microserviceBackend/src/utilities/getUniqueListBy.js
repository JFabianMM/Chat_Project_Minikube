const getUniqueListBy= function(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

module.exports = getUniqueListBy; 