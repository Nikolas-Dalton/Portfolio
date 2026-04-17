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

const telInput = document.getElementById('telefone');


// Impede apagar o prefixo '+55 '
telInput.addEventListener('input', (e) => {
  let value = e.target.value;

  // Remove tudo que não é número
  value = value.replace(/\D/g, "");

  // Garante que sempre comece com 55
  if (!value.startsWith("55")) {
    value = "55" + value.replace(/^5*/, "");
  }

  // Aplica a formatação visual: +55 (XX) XXXXX-XXXX
  let formatted = "+" + value.slice(0, 2); // +55
  if (value.length > 2) {
    formatted += " (" + value.slice(2, 4);
  }
  if (value.length > 4) {
    formatted += ") " + value.slice(4, 9);
  }
  if (value.length > 9) {
    formatted += "-" + value.slice(9, 13);
  }

  // Impede apagar o prefixo
  if (!formatted.startsWith("+55")) {
    formatted = "+55 ";
  }
  if (formatted.length < 5) {
    formatted = "+55 ";
  }

  e.target.value = formatted;
  // Mantém o cursor sempre após o prefixo
  if (e.target.selectionStart < 4) {
    e.target.setSelectionRange(formatted.length, formatted.length);
  }
});

telInput.addEventListener('focus', (e) => {
  if (e.target.value === "" || !e.target.value.startsWith("+55")) {
    e.target.value = "+55 ";
  }
  // Mantém o cursor após o prefixo
  setTimeout(() => {
    if (e.target.selectionStart < 4) {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }
  }, 0);
});


// ============================================
// ENVIO DO FORMULÁRIO DE CONTATO
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  // Adiciona atributos name nos inputs dinamicamente (caso não estejam no HTML)
  const inputs = contactForm.querySelectorAll('input');
  const textarea = contactForm.querySelector('textarea');
  
  if (inputs[0]) inputs[0].name = 'firstName';
  if (inputs[1]) inputs[1].name = 'lastName';
  if (inputs[2]) inputs[2].name = 'email';
  if (inputs[3]) inputs[3].name = 'phone';
  if (textarea) textarea.name = 'message';

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Coleta os dados pelos nomes (mais seguro que por índice)
    const formData = {
      firstName: contactForm.querySelector('[name="firstName"]')?.value.trim() || '',
      lastName: contactForm.querySelector('[name="lastName"]')?.value.trim() || '',
      email: contactForm.querySelector('[name="email"]')?.value.trim() || '',
      phone: contactForm.querySelector('[name="phone"]')?.value.trim() || '',
      message: contactForm.querySelector('[name="message"]')?.value.trim() || ''
    };

    // Validação
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      showAlert('Por favor, preencha nome, e-mail e mensagem.', 'error');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    // Estado de loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch('http://localhost:3001/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showAlert('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        contactForm.reset();
        // Reseta a máscara do telefone
        const phoneInput = contactForm.querySelector('[name="phone"]');
        if (phoneInput) phoneInput.value = '+55 ';
      } else {
        throw new Error(data.error || 'Erro ao enviar');
      }
    } catch (err) {
      console.error('Erro no envio:', err);
      showAlert('❌ Erro ao conectar com o servidor. Tente novamente mais tarde.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // Função para mostrar mensagens bonitinhas (sem alert nativo)
  function showAlert(message, type) {
    // Remove mensagem anterior se existir
    const oldMsg = document.getElementById('form-feedback');
    if (oldMsg) oldMsg.remove();
    
    // Cria elemento de feedback
    const feedback = document.createElement('p');
    feedback.id = 'form-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      margin-top: 12px;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      text-align: center;
      background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
      color: ${type === 'success' ? '#155724' : '#721c24'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
      transition: opacity 0.3s ease;
    `;
    
    contactForm.appendChild(feedback);
    
    // Remove após 5 segundos
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 300);
    }, 5000);
  }
}

// ===== SIDEBAR MENU =====
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  menuToggle.classList.add('active');
  document.body.classList.add('sidebar-open');
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  menuToggle.classList.remove('active');
  document.body.classList.remove('sidebar-open');
}

// Abrir ao clicar no hambúrguer
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

// Fechar ao clicar no X
if (sidebarClose) {
  sidebarClose.addEventListener('click', closeSidebar);
}

// Fechar ao clicar no overlay
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Fechar ao clicar em um link
document.querySelectorAll('.sidebar-nav a').forEach(link => {
  link.addEventListener('click', () => {
    closeSidebar();
    
    // Atualiza classe active
    document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Fechar com tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    closeSidebar();
  }
});