(function () {
  const script = document.currentScript;
  const repo = script.getAttribute("data-repo");

  if (!repo) {
    console.error("Contri.buzz: No repository specified");
    return;
  }

  const container = document.createElement("div");
  container.style.fontFamily = "Arial, sans-serif";
  container.style.maxWidth = "800px";
  container.style.margin = "0 auto";
  container.style.padding = "20px";
  container.style.backgroundColor = "#f8f9fa";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "20px";

  const title = document.createElement("h2");
  title.textContent = "Contributors";
  title.style.margin = "0";
  title.style.fontSize = "24px";
  title.style.color = "#333";

  const link = document.createElement("a");
  link.href = "https://contri.buzz";
  link.textContent = "Powered by Contri.buzz";
  link.style.color = "#3A86FF";
  link.style.textDecoration = "none";
  link.style.fontSize = "14px";

  header.appendChild(title);
  header.appendChild(link);

  const wall = document.createElement("div");
  wall.style.display = "grid";
  wall.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))";
  wall.style.gap = "20px";

  container.appendChild(header);
  container.appendChild(wall);

  script.parentNode.insertBefore(container, script);

  fetch(`https://api.github.com/repos/${repo}/contributors`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((contributor) => {
        const card = document.createElement("div");
        card.style.textAlign = "center";

        const avatar = document.createElement("img");
        avatar.src = contributor.avatar_url;
        avatar.alt = contributor.login;
        avatar.style.width = "80px";
        avatar.style.height = "80px";
        avatar.style.borderRadius = "50%";
        avatar.style.marginBottom = "8px";

        const name = document.createElement("p");
        name.textContent = contributor.login;
        name.style.margin = "0";
        name.style.fontSize = "14px";
        name.style.color = "#333";

        const contributions = document.createElement("p");
        contributions.textContent = `${contributor.contributions} contributions`;
        contributions.style.margin = "0";
        contributions.style.fontSize = "12px";
        contributions.style.color = "#666";

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(contributions);

        wall.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching contributors:", error);
      wall.textContent = "Failed to load contributors. Please try again later.";
    });

  const footer = document.createElement("div");
  footer.style.textAlign = "center";
  footer.style.marginTop = "20px";
  footer.style.fontSize = "14px";
  footer.style.color = "#666";
  footer.innerHTML =
    'Made with ❤️ by <a href="https://contri.buzz" style="color: #3A86FF; text-decoration: none;">Contri.buzz</a>';

  container.appendChild(footer);
})();
