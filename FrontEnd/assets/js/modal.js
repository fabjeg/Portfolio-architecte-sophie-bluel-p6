let modal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};
//ferme le modal
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

//affiche les images dans le modale
const addPictures = document.querySelector(".add-pictures");

async function pictureModal() {
  addPictures.innerHTML = "";
  const modalPictures = await getworks();
  console.log(modalPictures);
  modalPictures.forEach((picture) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = picture.id;
    img.src = picture.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    addPictures.appendChild(figure);
  });
  deletePictures();
}
pictureModal();

// supprime les images
function deletePictures() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("token non trouvé, impossible de continuer. ");
    return;
  }
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const id = trash.id;
      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`http://localhost:5678/api/works/ ${id}`, init)
        .then((response) => {
          if (!response.ok) {
            console.log("le delete n'a pas marché !");
          }
          return response.json();
        })
        .then((data) => {
          console.log("le delete à fonctioné :", data);
          getworks();
          pictureModal();
        });
    });
  });
}

//modale ajout photo
const btnAjoutPhoto = document.querySelector(".input-modal input");
const modaladdpictures = document.querySelector(".modal-addpictures");
const modalImg = document.querySelector(".modal-wrapper");
const arrowReturn = document.querySelector(".fa-arrow-left");
const deleteMark = document.querySelector(".modal-addpictures .fa-xmark");

function displayAddModall() {
  btnAjoutPhoto.addEventListener("click", () => {
    modaladdpictures.style.display = "flex";
    modalImg.style.display = "none";
  });
  arrowReturn.addEventListener("click", () => {
    modaladdpictures.style.display = "none";
    modalImg.style.display = "";
  });
  deleteMark.addEventListener("click", (e) => {
    modal.style.display = "none";
  });
  const modalstop = document.querySelector(".js-modal-stop-2");
  modalstop.addEventListener("click", stopPropagation);
}
displayAddModall();

//insérer les images

const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconeFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconeFile.style.display = "none";
      pFile.style.display = "none";
    };

    reader.readAsDataURL(file);
  }
});

// affichages des catégories
async function displayCategoryModal() {
  const select = document.querySelector("select");
  const categories = await arrayCategorys();
  categories.forEach((categorie) => {
    const option = document.createElement("option");
    if (option === false) {
      option.textContent = "";
    } else {
      option.value = categorie.id;
      option.textContent = categorie.name;
      select.appendChild(option);
    }
  });
}
displayCategoryModal();

//ajouter une photo (ne fonctionne pas !!!!!)
const form = document.querySelector(".modal-addpictures form");
const title = document.querySelector(".modal-addpictures #title");
const category = document.querySelector(".modal-addpictures #category");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé, impossible de continuer.");
    return;
  }
  const formData = new FormData();
  formData.append("id", 0);
  formData.append("title", "string");
  formData.append("imageUrl", "String");
  formData.append("categoryId", "string");
  formData.append("userId", 0);

  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    console.log("Voici l'image ajoutée", data);
    getworks();
    displayimages();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image:", error);
  }
});

// change le btn en vert quand le formulaire est remplit ( ne fonctionne pas !!)
function verifFormCompleted() {
  const btnValider = document.querySelector(".container-button button");
  const labelFileAjt = document.querySelector(".fa-image");
  form.addEventListener("input", () => {
    if (
      !labelFileAjt.value == "" &&
      !title.value === "" &&
      !category.value == ""
    ) {
      btnValider.classList.remove("valide");
    } else {
      btnValider.classList.add("valide");
    }
  });
}
verifFormCompleted();
// cacher éléments

const affichage = document.querySelector("#affichage");
const login = document.querySelector(".login");

function affichageCo() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé, impossible de continuer.");
    return;
  }
  if (token) {
    login.innerHTML = "logout";
    affichage.style.display = "block";
    console.log("Ça fonctionne", token);
  } else {
    affichage.style.display = "none";
  }
}
affichageCo();
