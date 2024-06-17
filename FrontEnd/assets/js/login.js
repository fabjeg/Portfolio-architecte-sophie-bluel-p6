document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageErreur = document.querySelector(".erreur");

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        window.location.href = "../frontEnd/index.html";
      } else if (response.status === 404) {
        messageErreur.textContent =
          "utilisateur ou mot de passe incorrectes.  ";
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  });
