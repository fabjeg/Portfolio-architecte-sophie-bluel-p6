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
        const token = data.token;
        localStorage.setItem("token", token);
        window.location.href = "index.html";
      } else if (response.status === 404 || response.status === 401) {
        email.textContent = "utilisateur ou mot de passe incorrect.  ";
        password.textContent = "utilisateur ou mot de passe incorrect.  ";
        messageErreur.textContent = "utilisateur ou mot de passe incorrect.  ";
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  });
