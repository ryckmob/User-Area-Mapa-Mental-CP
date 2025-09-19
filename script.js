async function initMapa() {
    const response = await fetch('estrutura.json');
    const estrutura = await response.json();

    const modal = document.getElementById('articleModal');
    const modalBody = modal.querySelector('.modal-body');
    const closeModalButton = modal.querySelector('.close-button');

    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.querySelector('.modal-content').classList.add('active');
        }, 10);
    }

    function closeModal() {
        modal.querySelector('.modal-content').classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            modalBody.innerHTML = '';
        }, 300);
    }

    closeModalButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    function criarLabel(tipo, textoPersonalizado = null) {
        const span = document.createElement('span');
        span.className = 'label ' + tipo;
        span.textContent = textoPersonalizado || tipo.charAt(0).toUpperCase() + tipo.slice(1);
        return span;
    }

    function processText(text) {
        if (!text) return '';
        // Substitui \r e \n por <br> corretamente
        return text.replace(/\r\n|\r|\n/g, '<br>').trim();
    }

    function findPrincipio(estrutura, artigoNode) {
        function search(nodes) {
            for (const node of nodes) {
                if (node.tipo === 'principio' && node.filhos && node.filhos.length) {
                    if (node.filhos.includes(artigoNode)) return node.nome;
                }
                if (node.filhos) {
                    const found = search(node.filhos);
                    if (found) return found;
                }
            }
            return null;
        }
        return search(estrutura);
    }

    function criarNode(node, parentNode = null) {
        const div = document.createElement('div');
        div.className = 'node';

        if (node.tipo === 'artigo') {
            const artigoDiv = document.createElement('div');
            artigoDiv.className = 'article';
            artigoDiv.appendChild(criarLabel('artigo'));

            const texto = document.createElement('span');
            // Aplica quebras de linha corretas no artigo
            texto.innerHTML = processText(node.nome);
            artigoDiv.appendChild(texto);

            div.appendChild(artigoDiv);

            artigoDiv.addEventListener('click', () => {
                const nomePrincipio = findPrincipio(estrutura, node);
                let conteudoModal = '';

                if (nomePrincipio) {
                    conteudoModal +=
                        '<div class="modal-label-container">' +
                        criarLabel('principio', nomePrincipio).outerHTML +
                        '</div>';
                }

                // Aplica quebras de linha no modal
                conteudoModal += `<p>${processText(node.nome)}</p>`;
                if (node.conteudo) conteudoModal += `<p>${processText(node.conteudo)}</p>`;

                openModal(conteudoModal);
            });
        } else {
            const button = document.createElement('button');
            button.className = 'button';
            const buttonContent = document.createElement('div');
            buttonContent.className = 'button-content';

            const label = criarLabel(node.tipo);
            const texto = document.createElement('span');
            texto.innerHTML = processText(node.nome); // Aplica quebras de linha aqui também

            buttonContent.appendChild(label);
            buttonContent.appendChild(texto);
            button.appendChild(buttonContent);

            if (node.filhos && node.filhos.length) {
                const icon = document.createElement('span');
                icon.className = 'toggle-icon';
                icon.textContent = '+';
                button.appendChild(icon);
            }

            div.appendChild(button);

            if (node.filhos && node.filhos.length) {
                const childrenDiv = document.createElement('div');
                childrenDiv.className = 'children';
                node.filhos.forEach((filho) => {
                    const childNode = criarNode(filho, node);
                    childrenDiv.appendChild(childNode);
                });
                div.appendChild(childrenDiv);

                button.addEventListener('click', () => {
                    const isVisible = childrenDiv.style.display === 'block';
                    childrenDiv.style.display = isVisible ? 'none' : 'block';
                    const icon = button.querySelector('.toggle-icon');
                    if (icon) icon.textContent = isVisible ? '+' : '-';
                });
            }
        }

        return div;
    }

    const mapaContainer = document.getElementById('mapaMental');
    estrutura.forEach((node) => mapaContainer.appendChild(criarNode(node)));
}

initMapa();
