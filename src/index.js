let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  document.querySelector(".add-toy-form").addEventListener("submit", handleSubmit);
});

function addToyToCard(toyObj) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyObj),
  })
    .then((resp) => resp.json())
    .then(data => console.log(data))
};

function handleSubmit(e){
  e.preventDefault();
  let toyObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  renderOneToy(toyObj);
  addToyToCard(toyObj);
}

function renderOneToy(toy) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img class="toy-avatar" src="${toy.image}">
    <p>${toy.likes} Likes</p>
    <div class="like-btn" id="${toy.id}">
      <button>Like ❤️</button>
    </div>
  `;

  const likeBtns = card.querySelectorAll(".like-btn");
  likeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      toy.likes++;
      card.querySelector('p').textContent = `${toy.likes} Likes`;
      updateToy(toy);
    });
  });

  document.querySelector('#toy-collection').appendChild(card);
};

function updateToy(toyObj) {
  fetch(`http://localhost:3000/toys/${toyObj.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": toyObj.likes
    })
  })  
  .then(resp => resp.json())
  .then(toy => {
    document.querySelector('p').textContent = `${toy.likes} Likes`;
  });
};


function getToys() {
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(data => data.forEach(toy => renderOneToy(toy)))
};

function initialize(){
  getToys();
}
initialize();