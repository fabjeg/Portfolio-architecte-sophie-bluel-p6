async function getworks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
getworks();
//parcour le tableau
async function displayimages() {
  const pictures = await getworks();
  pictures.forEach((pictures) => {
    imgWorks(pictures);
  });
}
displayimages();
//affichage
function imgWorks(pictures) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = pictures.imageUrl;
  figcaption.textContent = pictures.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  document.querySelector("div.gallery").appendChild(figure);
}

async function arrayCategorys() {
  const filter = await fetch("http://localhost:5678/api/categories");
  return await filter.json();
}
arrayCategorys();
//ajoute les btn
async function displayCategorysBtn() {
  const category = await arrayCategorys();
  console.log(category);
  category.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    document.querySelector(".filters").appendChild(btn);
  });
}
displayCategorysBtn();
//try les images
async function filterCategory() {
  const picturesArray = await getworks();
  console.log(picturesArray);
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      document.querySelector(".gallery").innerHTML = "";
      btnId = e.target.id;
      if (btnId !== "0") {
        const picturesTry = picturesArray.filter((pictures) => {
          return pictures.categoryId == btnId;
        });
        picturesTry.forEach((pictures) => {
          imgWorks(pictures);
        });
      } else {
        displayimages();
      }
    });
  });
}
filterCategory();
