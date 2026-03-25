async function createOverlay() {

    document.body.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    document.body.addEventListener("keydown", (e) => {
        e.preventDefault();
    });

    if (!document.querySelector('#overlay-style')) {
        const link = document.createElement('link');
        link.id = 'overlay-style';
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('components/overlay/overlay.css');
        document.head.appendChild(link);
    }

    const html = await fetch(
        chrome.runtime.getURL('components/overlay/overlay.html')
    ).then(res => res.text());

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    const siteAtual = window.location.hostname;
    const dados = await chrome.storage.local.get(siteAtual);

    const dataSalva = dados[siteAtual];
    if (!dataSalva) return;

    const dataBloqueio = new Date(dataSalva);

    const mensagem = wrapper.querySelector('.mensagem');
    mensagem.textContent = "Este site está bloqueado por até: "+ dataBloqueio.toLocaleString('pt-BR');
    
    const contador = wrapper.querySelector('.contador');
    const interval = setInterval(() => {
        let tempo_restante = Math.floor((dataBloqueio.getTime() - Date.now()) / 1000);

        if (tempo_restante <= 0) {
            contador.textContent = "Liberado!!!";
            btn.disabled = false;
            clearInterval(interval);
            return;
        }

        const horas = Math.floor(tempo_restante / 3600);
        const minutos = Math.floor((tempo_restante % 3600) / 60);
        const segundos = tempo_restante % 60;

        let texto = "";

        if (horas > 0) {
            texto += horas + (horas === 1 ? " hora, " : " horas, ");
        }

        if (minutos > 0) {
            texto += minutos + (minutos === 1 ? " minuto e" : " minutos e ");
        }

        if (segundos > 0 || texto === "") {
            texto += segundos + (segundos === 1 ? " segundo" : " segundos");
        }

        contador.textContent = texto;
    }, 1000);

    document.body.appendChild(wrapper);
    const btn = wrapper.querySelector('.close-btn');
    btn.onclick = () => {
        wrapper.remove();
    };
}

createOverlay();
