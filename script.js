fetch("data/blocks.json")
  .then(res => res.json())
  .then(blocks => {
    const grid = document.getElementById("blocks-grid");

    blocks.forEach(block => {
      const card = document.createElement("div");

      card.className = "block-card";

      card.innerHTML = `
        <img src="${block.preview}" alt="${block.title}">
        <h3>${block.title}</h3>
        <p>${block.category}</p>

        <button data-id="${block.id}">
          Open
        </button>
      `;

      grid.appendChild(card);
    });
  });
