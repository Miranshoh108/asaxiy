import { useFetch } from "./utils/request.js";
import { laodingFunc } from "./utils/loading.js";
import { addUIData } from "./utils/ui.js";

const carts = document.querySelector(".carts");
const searchInput = document.querySelector("input[type='search']");
const searchButton = document.querySelector(".btn");
let counter = document.querySelector(".counter");
let counter_like = document.querySelector(".counter_like");
const loading = document.querySelector(".loading");

const request = useFetch();
let cart = JSON.parse(localStorage.getItem("carts")) || [];
let like = JSON.parse(localStorage.getItem("like")) || [];

counter.innerHTML = cart.length;
counter_like.innerHTML = like.length;

const getDataFetch = async () => {
  laodingFunc(true, loading);
  let response = await request({ url: "asaxiy" });
  laodingFunc(false, loading);
  return response;
};

function getData(data) {
  carts.innerHTML = "";
  data.forEach((value) => {
    addUIData(value, carts);
  });
  attachEventListeners(data);
}

function searchProducts(data) {
  const query = searchInput.value.toLowerCase();
  const filteredData = data.filter((product) =>
    product.title.toLowerCase().includes(query)
  );
  getData(filteredData);
}

function attachEventListeners(data) {
  document.querySelectorAll(".btn_shop").forEach((btn, idx) => {
    btn.addEventListener("click", () => addToCart(data[idx]));
  });

  document.querySelectorAll(".like").forEach((el) => {
    el.addEventListener("click", () => {
      const item = data.find((d) => d.id === el.id);
      if (item) addToLike(item);
    });
  });
}

function addToCart(data) {
  let existing = cart.find((value) => value.id === data.id);
  if (existing) {
    existing.count++;
    existing.userPrice = existing.count * existing.price;
  } else {
    cart.push({ ...data, count: 1, userPrice: data.price });
  }
  localStorage.setItem("carts", JSON.stringify(cart));
  counter.innerHTML = cart.length;
}

function addToLike(value) {
  if (!like.find((item) => item.id === value.id)) {
    like.push(value);
    localStorage.setItem("like", JSON.stringify(like));
    counter_like.innerHTML = like.length;
    window.location.reload();
  }
}

carts.addEventListener("click", (e) => {
  if (e.target.classList.contains("dislike")) {
    like = like.filter((value) => value.id !== e.target.id);
    localStorage.setItem("like", JSON.stringify(like));
    counter_like.innerHTML = like.length;
    updateLikeIcons();
  }
});

function updateLikeIcons() {
  const likeItems = JSON.parse(localStorage.getItem("like")) || [];
  document.querySelectorAll(".like, .dislike").forEach((icon) => {
    const isLiked = likeItems.some((item) => item.id === icon.id);
    icon.classList.toggle("bxs-heart", isLiked);
    icon.classList.toggle("bx-heart", !isLiked);
    icon.classList.toggle("text-[red]", isLiked);
    icon.classList.toggle("text-white", !isLiked);
    icon.classList.toggle("dislike", isLiked);
  });
}

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let data = await getDataFetch();
  searchProducts(data);
});

searchInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let data = await getDataFetch();
    searchProducts(data);
  }
});

getDataFetch().then((data) => getData(data));
