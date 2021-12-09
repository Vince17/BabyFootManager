
(function connect(){
  let socket = io.connect('http://localhost:3000')

  document.getElementByClass('modificationParty').addEventListener('click', function(event) {
    socket.send('changes');
  });
  
  //checkbox = document.getElementById('checkbox')
  //checkbox.addEventListener('change', (event) => {
  //  if (event.currentTarget.checked) {
  //    console.log('checked')
  //    //update sql
  //    socket.send('changes');
  //  } else {
  //    console.log('unchecked')
  //    //updqte sql
  //    socket.send('changes'); 
  //  }
  //})
})
