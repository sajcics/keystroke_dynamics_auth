module.exports = {
  calculateTimings: function(data) {
    let sample = {
      "dd": calculateDD(data),
      "du": calculateDU(data),
      "ud": calculateUD(data),
      "uu": calculateUU(data)
    }
    return sample
  },
  calculateManhattanDistance: function(data, lastKeystrokeSample) {
      let deviation = 30
      let sum = 0
      for(let key in lastKeystrokeSample) {
        sum += Math.abs(parseFloat(data[0][key]) - parseFloat(lastKeystrokeSample[key]))
      }
      if(Math.sqrt(sum) < deviation) return true
      return false
  }
}

function calculateDD(data){
  let sum = 0
  for(let index in data) {
    let nextIndex = index++
    if(nextIndex < data.length -1) {
      sum += Math.abs(parseFloat(data[index].pressed) - parseFloat(data[nextIndex].pressed))
    }
  }
  return sum
}

function calculateUU(data){
  let sum = 0
  for(let index in data) {
    let nextIndex = index++
    if(nextIndex < data.length -1) {
      let razlika = Math.abs(parseFloat(data[index].released) - parseFloat(data[nextIndex].released))
      sum = sum + razlika
    }
  }
  return sum
}

function calculateDU(data){
  let sum = 0
  for(let index in data) {
    sum += Math.abs(parseFloat(data[index].released) - parseFloat(data[index].pressed))
  }
  return sum
}

function calculateUD(data){
  let sum = 0
  for(let index in data) {
    let nextIndex = index++
    if(nextIndex < data.length-1) {
      let razlika =  Math.abs(parseFloat(data[index].released) - parseFloat(data[nextIndex].pressed))
      sum = sum + razlika
    }
  }
  return sum
}
