const takeFetch = document.getElementById('tbody');
const filter = document.querySelector("#filter-task");
const create = document.querySelector("#create");
const submitBtn = document.querySelector('#submit');
const loading = document.querySelector("#loadingOverlay")

let items = [];



  async function apiData (){
    const loading = document.querySelector("#loading");
    loading.innerText = "Loading.......";
    loading.style.display = "block";
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      items = await response.json();
      loading.style.display = "none";
      fetchData(items)
    } catch (error) { 
      displayErrorAlert(error.message)
  }
  
  }


  function displayErrorAlert(message) {
    const alertHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;

    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = alertHTML;
}

function fetchData(param) {
    const el = param.map((item, index) => {
     return `
      <tr>
      <td>${item.userId}</td>
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.body}</td>
      <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editTable(${index})">Edit</button></td>
      <td><button class="btn btn-danger" onclick="deleteData(${item.id})">Delete</button></td>
      </tr>
     `;
    }).join("");

    takeFetch.innerHTML = el;
}

filter.addEventListener("keyup", function(x){
  let text = x.target.value.toLowerCase();
  console.log(text)
  document.querySelector('#tbody').querySelectorAll("tr").forEach(task => {
    let item = task.querySelectorAll('td')[2].textContent;
    console.log(item)

    console.log(item)
    if(item.toLowerCase().indexOf(text)!= -1){
      task.style.display = "block";
    }else{
      task.style.display = "none";
    }
    
  })
});



function editTable(param){
  submitBtn.innerText = 'Update'
  const index = parseInt(param);
  console.log(index)
  const formField = document.querySelector('#form-add');
  // console.log(formField)
  const userIdInput = document.querySelector('#userId');
  const idInput = document.getElementById('id');

  const titleInput = document.getElementById('title');
  const bodyInput = document.getElementById('body');

  const {title, body, id, userId} = items[index]; 

  userIdInput.value = userId;
  idInput.value = id;
  titleInput.value = title;
  bodyInput.value = body;
};

document.addEventListener('DOMContentLoaded', ()=> {

  apiData();
})







create.addEventListener("click", ()=> {
  submitBtn.innerText = 'Create';
  const formField = document.querySelector('#form-add');
  console.log(formField)
  const userIdInput = document.querySelector('#userId');
  const idInput = document.getElementById('id');
  
  const titleInput = document.getElementById('title');
  const bodyInput = document.getElementById('body');
  
  userIdInput.value = "";
  idInput.value = "";
  titleInput.value = "";
  bodyInput.value = "";
  
  
})


function showAlert(errorMsg){
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.textContent = errorMsg;
  alertContainer.appendChild(alert);
}





async function addData(){
  submitBtn.disabled = true;
  submitBtn.classList.add("loading"); // Change the button text to indicate loading
  
  const userIdInput = document.querySelector('#userId');
  const idInput = document.getElementById('id');
  const titleInput = document.getElementById('title');
  const bodyInput = document.getElementById('body');
  
  let payload = {
    id: idInput.value,
    userId: userIdInput.value,
    title: titleInput.value,
    body: bodyInput.value
  }
  
  try {
    const res = await fetch("https://jsnplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(payload)
    })
    
    const data = await res.json();
    console.log(data)
    

    
    if (res.ok) {
      items.push(payload);
      const modal = document.querySelector('.modal');
      // modal.classList.remove('show'); 
      modal.style.display = 'none';
      const backdrop = document.querySelector('.modal-backdrop');
      backdrop.style.display = 'none'
      console.log(modal)// Remove 'show' class to hide the modal
    }
    
    fetchData(items);
  } catch (error) {
    // Handle errors here
    showAlert(error.message);
    setTimeout(() => {
      submitBtn.innerText = "Create"
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }, 1000);
  }
}




async function editData (){
  const userIdInput = document.querySelector('#userId');
  const idInput = document.getElementById('id');

  const titleInput = document.getElementById('title');
  const bodyInput = document.getElementById('body');

  submitBtn.disabled = true;
  submitBtn.classList.add("loading") 

    let payload= {
    id: parseInt(idInput.value),
    userId: parseInt(userIdInput.value),
    title: titleInput.value,
    body: bodyInput.value
  }
  


  try {
    const rsData = await fetch(`https://jsonplaceholder.typicode.com/posts/${payload.id}`,{
      method: "PATCH",
      body: JSON.stringify(payload)
    })

    submitBtn.innerText = "Update"
    submitBtn.disabled = false;
    submitBtn.classList.remove()

    console.log(rsData)
    
    const putData = await rsData.json();
    // console.log(putData)

    if(rsData.ok){
      const editedItems = items.map((tasks => {

        if(tasks.id === payload.id){
          return {...tasks, userId: payload.userId, title: payload.title, body: payload.body};
        }
          else{
          return tasks;
        }
      }));
      // console.log(editedItems)
      items = editedItems;
      fetchData(editedItems);


      const modal = document.getElementById('staticBackdrop');
      const backdrop = document.querySelector(".modal-backdrop")
      modal.style.display = 'none';
      backdrop.style.display = "none"

      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading")
      }, 1000);

    }

    // console.log("put",putData)
  } catch (error) {
    
  }

  // alert("Network connection is online!");


}




async function deleteData(id){
  try {
    const des = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`,{
      method: "DELETE",
      // body: JSON.stringify(id)

    })
    
    // const deletePush = await des.json();

    if(des.ok){
      const deleteFilter = items.filter((filt) => filt.id !== id);
      items = deleteFilter;
      updateUI();
      // console.log("Item delte succssfuly")

    }

  } catch (error) {
    console.log("Error while deleting items", error)
  }

  
  
}

// document.addEventListener("DOMContentLoaded", function() {
//   const alertContainer = document.getElementById("alertContainer");
//   const form = document.getElementById("form-add");
//   const submitBtn = document.getElementById("submit");

//   submitBtn.addEventListener("click", function() {
//     if (!navigator.onLine) {
//       const alert = document.createElement("div");
//       alert.classList.add("alert", "alert-danger");
//       alert.textContent = "No network connection. Please check your network.";
//       alertContainer.appendChild(alert);
//     } else {

//     }
//   });
    
// });




function updateUI(){
  const el = items.map((item, index) => {
    return `
    <tr>
    <td>${item.userId}</td>
    <td>${item.id}</td>
    <td>${item.title}</td>
    <td>${item.body}</td>
    <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editTable(${index})">Edit</button></td>
    <td><button class="btn btn-danger" onclick="deleteData(${item.id})">Delete</button></td>
    </tr>
   `;
  }).join("");

  takeFetch.innerHTML = el;

}



  // items = editedItems;
  
  // // Now 'items' array has the edited tasks
  
  // return items;
  
  
  
  
  
  submitBtn.addEventListener('click', (e)=>{
    const btnTxt = e.target.innerText;
    
    if(btnTxt === 'Create'){
      addData();
    }else{
      editData();
    }
  })
  
  
