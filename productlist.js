const kategori = new URLSearchParams(window.location.search).get("fsik");

console.log("det virker");
const container = document.querySelector(".main");
let allData = [];

function getData() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  let endpoint = "https://kea-alt-del.dk/t7/api/products?limit=30";
  if (category) {
    endpoint += `&category=${encodeURIComponent(category)}`;
  }
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      allData = data;
      showProducts(allData);
    });
}

function filter(e) {
  const valgt = e.target.textContent;
  if (valgt === "All") {
    showProducts(allData);
  } else {
    const udsnit = allData.filter((element) => element.gender === valgt);
    showProducts(udsnit);
  }
}

document
  .querySelectorAll(".filter-buttons button")
  .forEach((knap) => knap.addEventListener("click", filter));

document
  .querySelectorAll("#sorter button")
  .forEach((knap) => knap.addEventListener("click", sorter));

function sorter(e) {
  let udsnit = [...allData];
  if (e.target.dataset.price) {
    const dir = e.target.dataset.price;
    if (dir == "up") {
      udsnit.sort((a, b) => a.price - b.price);
    } else {
      udsnit.sort((a, b) => b.price - a.price);
    }
  } else {
    const dir = e.target.dataset.text;
    if (dir == "az") {
      udsnit.sort((a, b) =>
        a.productdisplayname.localeCompare(b.productdisplayname, "da"),
      );
    } else {
      udsnit.sort((a, b) =>
        b.productdisplayname.localeCompare(a.productdisplayname, "da"),
      );
    }
  }
  showProducts(udsnit);
}

function showProducts(json) {
  let markup = "";
  json.forEach((element) => {
    const productLink = `product.html?id=${element.id}`;
    const soldOutClass = element.soldout ? " soldOut" : "";
    const discountPercent = element.discount
      ? Math.round((element.discount / element.price) * 100)
      : 0;
    markup += `
      <article class="product_info${soldOutClass}">
        <a href="${productLink}" title="See details for ${element.productdisplayname}">
          <img src="https://kea-alt-del.dk/t7/images/webp/1000/${element.id}.webp" alt="${element.productdisplayname}" />
          <h3 class="product_name">${element.productdisplayname || "No name"}</h3>
          <div class="product_brand">${element.articletype || ""} | ${element.brandname || ""}</div>
          <div class="product_price">
            <span class="old_price">DKK ${element.price},-</span><br />
            <span class="new_price">${element.discount ? `Now DKK ${element.price - element.discount},-` : ""}</span>
            ${element.discount ? `<span class="discount_badge">-${discountPercent}%</span>` : ""}
          </div>
          ${element.soldout ? `<div class="sold_out">Sold Out</div>` : ""}
        </a>
      </article>
    `;
  });
  container.innerHTML = markup;
}

getData();
