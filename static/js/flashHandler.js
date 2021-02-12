const flashHandler = (message, id) =>{
  if(document.getElementById(id) == undefined) {
      let err = 
        `<div id=${id} class="alert alert-danger alert-dismissible fade show" role="alert">
          <span><strong>Invalid Input:</strong> ${message}</span>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>

        </div>`
      document
        .getElementById('flash-container')
        .insertAdjacentHTML('beforeend', err);
    }
    return;

}