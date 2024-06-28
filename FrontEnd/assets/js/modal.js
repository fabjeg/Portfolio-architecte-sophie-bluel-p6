let modal = null;

const token = localStorage.getItem("token");
const isAdmin = token?.length > 0 ? true : false;
const affichage = document.querySelector("#affichage");
const affichage1 = document.querySelector("#affichage1");
const login = document.querySelector(".login");

//ajouter une photo (ne fonctionne pas !!!!!)
const form = document.querySelector(".modal-addpictures form");
const title = document.querySelector(".modal-addpictures #title");
const category = document.querySelector(".modal-addpictures #category");

//affiche les images dans le modale
const addPictures = document.querySelector(".add-pictures");

//modale ajout photo
const btnAjoutPhoto = document.querySelector(".input-modal input");
const modaladdpictures = document.querySelector(".modal-addpictures");
const modalImg = document.querySelector(".modal-wrapper");
const arrowReturn = document.querySelector(".fa-arrow-left");
const deleteMark = document.querySelector(".modal-addpictures .fa-xmark");
const btnValider = document.querySelector(".button-valider");
console.log(btnValider);

//insérer les images

const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconeFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");
//déconnexion
const headers = document.querySelector("header");
const filter = document.querySelector(".filters");
const btn_Filter = document.querySelector(".filters button");

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

async function pictureModal() {
  addPictures.innerHTML = "";
  const modalPictures = await getworks();
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

// supprime les images
function deletePictures() {
  if (!isAdmin) {
    console.error("token non trouvé, impossible de continuer. ");
    return;
  }
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      const id = trash.id;
      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${id}`,
          init
        );
        if (response.ok) {
          getworks();
          pictureModal();
        }
      } catch (error) {
        console.log("image delete error", error);
      }
    });
  });
}

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
async function displayCategoryModal() {
  const select = document.querySelector("select");
  let categoriesPopulated = false;
  select.innerHTML = "";
  select.addEventListener("click", async () => {
    if (!categoriesPopulated) {
      const categories = await arrayCategorys();
      categories.forEach((categorie) => {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.textContent = categorie.name;
        select.appendChild(option);
      });
      categoriesPopulated = true;
    }
  });
}
// ajout des images
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!token) {
    console.error("Token non trouvé, impossible de continuer.");
    return;
  }

  const formData = new FormData(e.target);

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
    console.log("Voici l'image ajoutée", data);
    console.log("i'm ok", data.ok);
    if (data) {
      console.log("i'm ok inside", data.k);

      location.reload();
      getworks();
      displayimages();
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image:", error);
  }
});

// change le btn en vert quand le formulaire est remplit ( ne fonctionne pas !!)
function verifFormCompleted() {
  const btnValider = document.querySelector(".button-valider");
  const myPicture = document.getElementById("myPicture");

  form.addEventListener("input", () => {
    console.log(myPicture.src);
    const myFormIsValid =
      myPicture.src.data !==
        "file:///C:/Users/Jego/openclassroom/Portfolio-architecte-sophie-bluel/frontEnd/index.html" &&
      title.value !== "" &&
      category.value !== "";

    console.log("myPicture.src ===>", myPicture.src);
    console.log("title.value ===>", title.value);
    console.log("category.value ===>", category.value);

    if (myFormIsValid) {
      btnValider.classList.add("valide");
    } else {
      btnValider.classList.remove("valide");
    }
  });
}

function affichageCo() {
  if (isAdmin) {
    login.innerHTML = "logout";
    affichage.style.display = "block";
    affichage1.style.display = "flex";
    filter.classList.remove("filters");
    filter.removeChild(btn_Filter);
    console.log("Ça fonctionne", token);
  } else {
    console.error("Token non trouvé, impossible de continuer.");
    affichage.style.display = "none";
    affichage1.style.display = "none";
    headers.style.margin = "40px 0px 50px";
    return;
  }
}

function deleteTokenFromLocalStorage() {
  if (login) {
    login.addEventListener("click", () => {
      login.innerHTML = "login";
      localStorage.removeItem("token");
      window.location.assign = "../FrontEnd/index.html";
    });
  } else {
    console.error("L'élément avec l'ID 'login' n'a pas été trouvé.");
  }
}

// Appelez la fonction pour attacher l'écouteur d'événement
deleteTokenFromLocalStorage();

// Utilisation

displayAddModall();
pictureModal();
displayCategoryModal();
verifFormCompleted();
// cacher éléments
affichageCo();
