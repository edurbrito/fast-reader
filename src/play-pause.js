/* eslint-disable no-undef */
/** @module play-pause */

var text
var index
var rate

/**
 * Receives a Message from the Worker
 * @event message
 */
self.addEventListener('message', function (e) {
  var init = false
  if (text === undefined) { init = true }

  text = e.data.text
  index = e.data.index
  rate = e.data.rate
  if (init) { updateWord() }
})

var data = {}

/**
 * Sends the updated data to the Worker
 * @fires message
 */
function updateWord () {
  var currRate = rate

  if (index === text.length) {
    postMessage(data)
    return
  }

  var word = text[index]

  if (index > 0) { data.before_word = text[index - 1] } else { data.before_word = '' }

  data.word = word

  if (index < text.length - 1) { data.after_word = text[index + 1] } else { data.after_word = '' }

  var incrment = 1

  // if (word != undefined && (word.length <= 3 || word.length >= 6 || word[word.length - 1] == '.')) {
  //     incrment += 1.2;
  //     if (word.length >= 10)
  //         incrment += 1;
  // }

  currRate = rate * incrment

  index++
  data.index = index

  postMessage(data)
  if (index < text.length) {
    setTimeout(function () {
      updateWord()
    }, currRate)
  }
}
