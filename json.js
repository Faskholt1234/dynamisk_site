const endpoint = "https://kea-alt-del.dk/t7/api/categories";

const container = document.querySelector("#linkcontainer");

function getData() {
  fetch(endpoint)
    .then((res) => res.json())
    .then(showData);
}

function showData(data) {
  container.innerHTML = "";
  data.forEach((category) => {
    container.innerHTML += `<a href="productlist.html?category=${encodeURIComponent(category.category)}">${category.category}</a>`;
  });
}

getData();
