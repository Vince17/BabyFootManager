(function connect(){
  let socket = io.connect('http://localhost:3000')

  let username = document.querySelector('#username')
  let usernameBtn = document.querySelector('#usernameBtn')
  let curUsername = document.querySelector('#usernameShow')

  let message = document.querySelector('#message')
  let messageBtn = document.querySelector('#send-message')
  let messageList = document.querySelector('#message-list')
  
  //username
  usernameBtn.addEventListener('click', e => {
      console.log(username.value)
      socket.emit('change_username', {username: username.value})
      curUsername.setAttribute('title', username.value)
      username.setAttribute('value', username.value)
  })

  //message
  if(message !== null){
    messageBtn.addEventListener('click', e => {
      console.log(message.value)
      socket.emit('new_message', {message: message.value})
      message.value = ''
    })
  }

  //message view
  socket.on('receive_message', data => {
    console.log(data)
    let listItem = document.createElement('li')
    listItem.textContent = data.username + ': ' + data.message
    listItem.classList.add('list-group-item')
    messageList.appendChild(listItem)
  })

  //typing
  let info = document.querySelector('.info')
  message.addEventListener('keypress', e => {
    socket.emit('typing')
  })
  socket.on('typing', data => {
    info.textContent = data.username + " est en train d'écrire"
    setTimeout(() => {info.textContent=''}, 5000)
  })

})()