// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
let heart = document.getElementsByClassName('fa-heart')
var trash = document.getElementsByClassName("fa-trash-o");

let btn = document.querySelector('.btn')
btn.addEventListener('click', function(){
  console.log()
})

Array.from(heart).forEach(function(element) {
      element.addEventListener('click', function(){
        const id = this.parentNode.parentNode.getAttribute('data-objectId')
        
        const heartIc = this.dataset.heart === "true"
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            "id": id,
        "heart": heartIc
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     fetch('messages', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbUp':thumbUp -2
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const sWord = this.parentNode.parentNode.children[1].innerText
        const cWord = this.parentNode.parentNode.children[3].innerText
        const iWord = this.parentNode.parentNode.children[5].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'scrambledWord': sWord,
            'correctWord': cWord,
            'userInput': iWord
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
