const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code.toLowerCase() === "space") {
    setRandomColors();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;
  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickboard(event.target.textContent);
  }
});

function generateRandomeColor() {
  //#FF0000 - red
  //#00FF00 - green
  //#0000FF - blue
  const hexCodes = "0123456789ABCDEF";
  let colors = "";
  for (let i = 0; i < 6; i++) {
    colors += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }

  return "#" + colors;
}

function copyToClickboard(text) {
  //   alert("Text already copied");
  return navigator.clipboard.writeText(text); //return promis
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];
  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const text = col.querySelector("h2");
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });
  updateColorsHash(colors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance(); //0-1
  //якщо luminace 0-0,5 - білий колір
  text.style.color = luminance > 0.5 ? "black" : "white";
}

//збережемо кольори в url - document.location.hash
function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }

  return [];
}

setRandomColors(true);
