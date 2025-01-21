if (!localStorage.getItem("user")) {
  window.location.href = "../src/login.html";
}

import { useFetch } from "./utils/request.js";
import { addUIData } from "./utils/ui.js";

const post_product = document.getElementById("post_product");
const getId = document.getElementById("getId");
const getIdEdit = document.getElementById("getIdEdit");
const post_product_edit = document.getElementById("post_product_edit");

const btns = document.querySelectorAll(".btn");
const addForm = document.querySelector(".add");
const deleteForm = document.querySelector(".delete");
const editForm = document.querySelector(".edit");

const carts = document.querySelector(".carts");
const carts2 = document.querySelector(".carts2");

const deleteBtn = document.querySelector(".delete-btn");
const signOut = document.querySelector(".sign-out");
const name = document.querySelector(".name");

let users = JSON.parse(localStorage.getItem("user"));
const request = useFetch();

name.innerHTML = users.username;
signOut.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../src/index.html";
});

// Formalarni boshida yashirish
addForm.style.display = "none";
deleteForm.style.display = "none";
editForm.style.display = "none";

// Tugmalarni bosganda tegishli bo‘limni ochish
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let id = e.target.id;
    localStorage.setItem("id", id);
    showSection(id);
  });
});

function showSection(id) {
  addForm.style.display = id === "add" ? "block" : "none";
  deleteForm.style.display = id === "delete" ? "block" : "none";
  editForm.style.display = id === "edit" ? "block" : "none";
}

// Mahsulot qo‘shish
post_product.addEventListener("submit", (e) => {
  e.preventDefault();
  let file = post_product.img_file.files[0];

  if (file.type !== "image/png" && file.type !== "image/webp") {
    return alert("Iltimos faqat PNG yoki WEBP rasm yuklang");
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    let newData = {
      img: event.target.result,
      title: post_product.title.value,
      price: +post_product.price.value,
      month: +post_product.month.value,
      rate: +post_product.rate.value,
    };
    postData(newData);
  };
  reader.readAsDataURL(file);
});

function postData(data) {
  request({ url: "asaxiy", method: "POST", data }).then(() => {
    alert("Mahsulot qo'shildi!");
    post_product.reset();
  });
}

// Mahsulot o‘chirish
deleteBtn.style.display = "none";
getId.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = getId.id.value;
  getOneProduct(id);
});

function getOneProduct(id) {
  request({ url: `asaxiy/${id}` }).then((data) => {
    deleteBtn.style.display = "block";
    addUIData(data, carts);
    deleteBtn.onclick = () => deleteProduct(data.id);
  });
}

function deleteProduct(id) {
  if (confirm("O‘chirishni tasdiqlaysizmi?")) {
    request({ url: `asaxiy/${id}`, method: "DELETE" }).then(() => {
      alert("Mahsulot o‘chirildi!");
      carts.innerHTML = "";
      deleteBtn.style.display = "none";
    });
  }
}

// Mahsulotni o‘zgartirish
getIdEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = getIdEdit.id.value;
  getOneProductForEdit(id);
});

function getOneProductForEdit(id) {
  request({ url: `asaxiy/${id}` }).then((data) => {
    addUIData(data, carts2);
    post_product_edit.style.display = "block";
    editProductForm(data);
  });
}

function editProductForm(data) {
  post_product_edit.title_edit.value = data.title;
  post_product_edit.price_edit.value = data.price;
  post_product_edit.month_edit.value = data.month;
  post_product_edit.rate_edit.value = data.rate;

  post_product_edit.addEventListener("submit", (e) => {
    e.preventDefault();
    let file = post_product_edit.img_file_edit.files[0];

    if (file && file.type !== "image/png" && file.type !== "image/webp") {
      return alert("Iltimos faqat PNG yoki WEBP rasm yuklang");
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      let updatedData = {
        img: event.target.result || data.img,
        title: post_product_edit.title_edit.value,
        price: +post_product_edit.price_edit.value,
        month: +post_product_edit.month_edit.value,
        rate: +post_product_edit.rate_edit.value,
      };
      updateProduct(data.id, updatedData);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      updateProduct(data.id, {
        img: data.img,
        title: post_product_edit.title_edit.value,
        price: +post_product_edit.price_edit.value,
        month: +post_product_edit.month_edit.value,
        rate: +post_product_edit.rate_edit.value,
      });
    }
  });
}

function updateProduct(id, newData) {
  request({ url: `asaxiy/${id}`, method: "PUT", data: newData }).then(() => {
    alert("Mahsulot o‘zgartirildi!");
    carts2.innerHTML = "";
    post_product_edit.style.display = "none";
  });
}

// Boshlang‘ich sahifani yangilash
showSection(localStorage.getItem("id") || "add");
