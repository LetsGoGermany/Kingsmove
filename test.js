const array1 = [1,2,3,3,3,4]
const array2 = [0,1,3,3,4]



const numbs = array1.filter(int => {
    const index = array2.indexOf(int)
    if(index < 0) return true
    array2.splice(index,1)
    return false
})

console.log(numbs)