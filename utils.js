// Inserindo elementos via javascript sem alterar o HTML e CSS diretamente

// criar checkbox para salvar a chave API
// const saveKeyCheckbox

function createToggleButton(){
	if (!apiKeyInput) return;
	if (document.getElementById("toggleApiKey")) return; // Evita duplicação

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

function addNewStyle(){
	const style = document.createElement('style');
	style.textContent = `
	.api-key-container {
		position: relative;
		display: flex;
		align-items: center;
	}
	
	.api-key-container input {
		width: 100%;
		padding-right: 45px; /* Espaço para o botão */
	}
	
	.toggle-btn {
		position: absolute;
		right: 5px;
		width: 35px;
		height: 30px;
		border: none;
		background: transparent;
		cursor: pointer;
		color: #666;
	}
	
	.toggle-btn:hover {
		background-color: #fff;
		color: #333;
	}
		.api-key-container input[type="text"] {
			width: 100%;
			padding: 10px;
			border: 1px solid #ddd;
			border-radius: 4px;
			box-sizing: border-box;
		}
	`;

	document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
	addNewStyle();
	createToggleButton();
});
