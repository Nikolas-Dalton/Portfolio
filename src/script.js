let darkmode = localStorage.getItem("darkmode");
const themeSwitchBtn = document.getElementById("theme-switch");

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
  themeSwitchBtn.textContent = "Light Mode";
};

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", "inactive");
  themeSwitchBtn.textContent = "Dark Mode";
};

if (darkmode === "active") {
  enableDarkMode();
} else {
  disableDarkMode();
}

themeSwitchBtn.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");

  if (darkmode !== "active") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

(function () {
  const typeSpeed = 50;

  function typeTextInto(targetNode, text, i, cb) {
    if (i <= text.length - 1) {
      if (targetNode.nodeType === Node.TEXT_NODE) {
        targetNode.data += text.charAt(i);
      } else {
        targetNode.textContent += text.charAt(i);
      }
      setTimeout(() => typeTextInto(targetNode, text, i + 1, cb), typeSpeed);
    } else {
      cb && cb();
    }
  }

  function typeChildNodes(srcNodes, targetParent, index, done) {
    if (index >= srcNodes.length) {
      done && done();
      return;
    }

    const srcNode = srcNodes[index];

    if (srcNode.nodeType === Node.TEXT_NODE) {
      const textNode = document.createTextNode("");
      targetParent.appendChild(textNode);
      typeTextInto(textNode, srcNode.data, 0, () => {
        typeChildNodes(srcNodes, targetParent, index + 1, done);
      });
    } else if (srcNode.nodeType === Node.ELEMENT_NODE) {
      const clone = srcNode.cloneNode(false);
      clone.innerHTML = "";
      targetParent.appendChild(clone);

      typeChildNodes(srcNode.childNodes, clone, 0, () => {
        typeChildNodes(srcNodes, targetParent, index + 1, done);
      });
    } else {
      typeChildNodes(srcNodes, targetParent, index + 1, done);
    }
  }

  function startTyping(source, target, callback) {
    target.innerHTML = "";
    typeChildNodes(source.childNodes, target, 0, () => {
      target.classList.add("no-cursor");
      callback && callback();
    });
  }

  // Seleciona TODOS os pares de animação
  const groups = document.querySelectorAll(".typed-source");

  groups.forEach((source) => {
    const target = source.parentElement.querySelector(".typed-target");
    if (target) {
      startTyping(source, target);
    }
  });
})();
