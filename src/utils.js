/*
 * Inserindo elementos via javascript sem alterar o HTML e CSS diretamente
 */

/**
 * Inicializa as funcionalidades:
 * * exibição da chave API;
 * * salvamento da chave API;
		- automaticamente em sessionStorage
		- e opcionalmente em localStorage decidido pelo usuário
 * * limpeza da chave API do localStorage;
 * * monitoramento da entrada de nova chave API.
 */

document.addEventListener("DOMContentLoaded", () => {
	createToggleButton();
	createSaveKeyButton();
	createClearKeyButton();
	monitorApiKeyInput();
	const savedApiKey = localStorage.getItem('savedApiKey');
	const apiKeyInput = document.getElementById("api-key");
	const saveKeyButton = document.getElementById("save-api-key");
	if (savedApiKey && apiKeyInput) {
		apiKeyInput.value = savedApiKey;
		saveKeyButton.style.backgroundColor = '#28a745';
		saveKeyButton.innerHTML = '<i class="fas fa-check"></i> Chave salva!';
	}
});

function monitorApiKeyInput() {
	const apiKeyInput = document.getElementById("api-key");

	if (apiKeyInput) {
		apiKeyInput.addEventListener('input', () => {
			sessionStorage.setItem('sessionApiKey', apiKeyInput.value);
		});
		const sessionApiKey = sessionStorage.getItem('sessionApiKey');
		if (sessionApiKey && !localStorage.getItem('savedApiKey')) {
			apiKeyInput.value = sessionApiKey;
		}
	}

	const saveKeyButton = document.getElementById("save-api-key");
	if (!apiKeyInput || !saveKeyButton) return;

	apiKeyInput.addEventListener('input', () => {
		const savedApiKey = localStorage.getItem('savedApiKey') || '';
		const currentValue = apiKeyInput.value;
		if (savedApiKey && currentValue && currentValue !== savedApiKey) {
			saveKeyButton.style.backgroundColor = '#ffc107';
			saveKeyButton.innerHTML = '<i class="fas fa-save"></i> Salvar nova chave';
		} else if (currentValue === savedApiKey && savedApiKey) {
			saveKeyButton.style.backgroundColor = '#28a745';
			saveKeyButton.innerHTML = '<i class="fas fa-check"></i> Chave salva!';
		} else {
			saveKeyButton.style.backgroundColor = '';
			saveKeyButton.innerHTML = '<i class="fas fa-save"></i> Salvar chave da API';
		}
	});
}

function createToggleButton() {
	const apiKeyInput = document.getElementById("api-key");
	if (!apiKeyInput) return;
	if (document.getElementById("toggleApiKey")) return;

	const container = document.createElement('div');
	container.className = 'api-key-container';

	const toggleKeyButton = document.createElement('button');
	toggleKeyButton.title = 'Mostrar/Esconder Chave da API';
	toggleKeyButton.type = 'button';
	toggleKeyButton.className = 'toggle-btn';
	toggleKeyButton.id = "toggleApiKey";
	toggleKeyButton.innerHTML = '<i class="fas fa-eye"></i>';

	apiKeyInput.parentNode.insertBefore(container, apiKeyInput);
	container.appendChild(apiKeyInput);
	container.appendChild(toggleKeyButton);

	toggleKeyButton.addEventListener('click', () => {
		const isPassword = apiKeyInput.type === 'password';
		apiKeyInput.type = isPassword ? 'text' : 'password';
		toggleKeyButton.classList.toggle('active', !isPassword);
		toggleKeyButton.innerHTML = isPassword
			? '<i class="fas fa-eye-slash"></i>'
			: '<i class="fas fa-eye"></i>';
	});

}

function createSaveKeyButton() {
	const apiKeyInput = document.getElementById("api-key");
	if (!apiKeyInput) return;
	if (document.getElementById("save-api-key")) return;

	const saveKeyContainer = document.createElement('div');
	saveKeyContainer.className = 'save-api-key-container';

	const saveKeyButton = document.createElement('button');
	saveKeyButton.type = 'button';
	saveKeyButton.id = 'save-api-key';
	saveKeyButton.innerHTML = '<i class="fas fa-save "></i> Salvar chave da API';

	const feedback = document.createElement('span');
	feedback.style.marginLeft = '8px';
	feedback.style.color = '#28a745';
	feedback.style.fontSize = '0.95em';
	feedback.style.display = 'none';

	saveKeyButton.addEventListener('click', () => {
		const apiKey = apiKeyInput.value;
		if (apiKey) {
			localStorage.setItem('savedApiKey', apiKey);
			feedback.textContent = 'Chave salva!';
			feedback.style.display = 'block';
			saveKeyButton.style.backgroundColor = '#28a745';
			saveKeyButton.innerHTML = '<i class="fas fa-check"></i> Chave salva!';
			setTimeout(() => {
				feedback.style.display = 'none';
			}, 2000);
		} else {
			feedback.textContent = 'Digite uma chave API.';
			feedback.style.color = '#dc3545';
			feedback.style.display = 'block';
			saveKeyButton.style.backgroundColor = '#dc3545';
			setTimeout(() => {
				feedback.style.display = 'none';
				feedback.style.color = '#28a745';
				saveKeyButton.style.backgroundColor = '';
			}, 2000);
		}
	});

	const label = document.createElement('label');
	label.htmlFor = 'save-api-key';
	label.appendChild(document.createTextNode('Salvar chave da API'));

	saveKeyContainer.appendChild(saveKeyButton);
	saveKeyContainer.appendChild(feedback);

	const apiKeyContainer = apiKeyInput.closest('.api-key-container');
	if (apiKeyContainer && apiKeyContainer.parentNode) {
		apiKeyContainer.parentNode.insertBefore(saveKeyContainer, apiKeyContainer.nextSibling);
	}
}


function createClearKeyButton() {
	const apiKeyInput = document.getElementById("api-key");
	if (!apiKeyInput) return;
	if (document.getElementById("clear-api-key")) return;

	const clearKeyButton = document.createElement('button');
	clearKeyButton.type = 'button';
	clearKeyButton.id = 'clear-api-key';
	clearKeyButton.innerHTML = '<i class="fas fa-eraser"></i> Limpar chave';

	clearKeyButton.addEventListener('click', () => {
		apiKeyInput.value = '';
		localStorage.removeItem('savedApiKey');
		const saveKeyButton = document.getElementById('save-api-key');
		if (saveKeyButton) {
			saveKeyButton.style.backgroundColor = '';
			saveKeyButton.innerHTML = '<i class="fas fa-save"></i> Salvar chave da API';
		}
	});

	const saveKeyContainer = document.querySelector('.save-api-key-container');
	if (saveKeyContainer) {
		saveKeyContainer.appendChild(clearKeyButton);
	}
}

