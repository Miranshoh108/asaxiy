function addUIData(value, carts) {
  let card = document.createElement("div");
  const likeItems = JSON.parse(localStorage.getItem("like")) || [];
  const isLiked = likeItems.some((item) => item.id === value.id);
  card.innerHTML = `
       <div class="card w-[300px] h-[450px] ">
        <div class="relative flex justify-start items-start">
              <img
                class="w-full"
                src=${value.img}
                alt=""
              />
             ${`<i id=${value.id} class="bx ${
               isLiked ? "bxs-heart" : "bx-heart"
             } bxslike text-2xl ${
               isLiked ? "text-[red]" : "text-white"
             } absolute top-1 left-4  ${!isLiked ? "like" : "dislike"}"></i>`}
            </div>
            <div class="p-4 ">
              <h2 class="font-bold text-[24px]">${value.title?.slice(0, 60) + "..."}</h2>
              <p><i class="bx bxs-star text-[gold]"></i>${value.rate}</p>
              <h3>${value.month
                ?.toLocaleString("uz-UZ")
                ?.replace(/,/g, " ")} so'm/oyiga</h3>
              <div class="flex items-center justify-between">
                <h2>${value.price
                  ?.toLocaleString("uz-UZ")
                  ?.replace(/,/g, " ")} so'm</h2>
               <button class="btn_shop"><i class="bx bx-shopping-bag text-2xl"></i></button>
              </div>
            </div>
            </div>
        `;
  carts.append(card);
}

export { addUIData };




