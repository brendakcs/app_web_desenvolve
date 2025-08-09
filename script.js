// 1. Seleção de Elementos do DOM
const apiKeyInput = document.getElementById("api-key");
const modeloSelect = document.getElementById("modelSelect");
const perguntaTextarea = document.getElementById("userInput");
const perguntarButton = document.getElementById("askButton");
const limparButton = document.getElementById("clearBtn");
const copiarButton = document.getElementById("copyBtn");
const respostaWrapper = document.getElementById("responseSection");
const textoResposta = document.getElementById("responseText");
const perguntaEco = document.getElementById("questionEcho");
const statusElement = document.getElementById("status");
const charCountElement = document.getElementById("charCount");

// Acrescentar o checkbox e o toggle key depois - obs Lembrar de colocar no HTML tbm
const saveKeyCheckbox = null;  // Para salvar a chave api no navegador - 'local storage'
const toggleKeyButton = null; // Para mostrar ou ocultar a chave API

// 2. Constantes
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

// 3. Utilitários
function setStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
}

function clearStatus() {
  statusElement.textContent = "";
  statusElement.className = "status";
}

// 4. Comunicação com API
async function enviarPerguntaParaIA(pergunta, modelo, apiKey) {
  try {
    perguntarButton.disabled = true;
    limparButton.disabled = true;
    copiarButton.disabled = true;
    perguntaTextarea.readOnly = true;
    setStatus("Carregando...");
    respostaWrapper.hidden = false;
    textoResposta.textContent = "";
    perguntaEco.textContent = `Você perguntou: ${pergunta}`;

    const response = await fetch(`${GEMINI_API_BASE_URL}${modelo}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: pergunta }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Erro desconhecido da API");
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    setStatus("");
    return aiResponse;

  } catch (error) {
    console.error("Erro:", error);
    setStatus(`Erro: ${error.message}`, "error");
    return "Não foi possível obter uma resposta. Verifique a API Key e tente novamente.";
  } finally {
    perguntarButton.disabled = false;
    limparButton.disabled = false;
    copiarButton.disabled = false;
    perguntaTextarea.readOnly = false;
  }
}

// 5. Manipulação da UI
async function handlePerguntar(event) {
  event.preventDefault();
  const pergunta = perguntaTextarea.value.trim();
  const modelo = modeloSelect.value;
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    setStatus("Por favor, insira sua API Key.", "error");
    apiKeyInput.focus();
    return;
  }

  if (!pergunta) {
    setStatus("Por favor, digite sua pergunta.", "error");
    perguntaTextarea.focus();
    return;
  }

  clearStatus();
  const resposta = await enviarPerguntaParaIA(pergunta, modelo, apiKey);
  textoResposta.textContent = resposta;
}

function handleLimpar() {
  perguntaTextarea.value = "";
  textoResposta.textContent = "Clique em Perguntar para ver a resposta.";
  perguntaEco.textContent = "";
  respostaWrapper.hidden = true;
  clearStatus();
  updateCharCount();
}

function handleCopiar() {
  navigator.clipboard.writeText(textoResposta.textContent)
    .then(() => setStatus("Resposta copiada para a área de transferência!", "success"))
    .catch(err => setStatus("Erro ao copiar: " + err, "error"));
}

function updateCharCount() {
  const count = perguntaTextarea.value.length;
  charCountElement.textContent = `${count} caracteres`;
}

// 6. Eventos
perguntarButton.addEventListener("click", handlePerguntar);
limparButton.addEventListener("click", handleLimpar);
copiarButton.addEventListener("click", handleCopiar);
perguntaTextarea.addEventListener("input", updateCharCount);
perguntaTextarea.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    handlePerguntar(event);
  }
});

// 7. Inicialização
function init() {
  updateCharCount();
  handleLimpar(); // Reset UI ao carregar
}

init();
