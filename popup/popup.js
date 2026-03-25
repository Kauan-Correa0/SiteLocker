const form = document.querySelector('form');
const input = document.querySelector('.input');
const select = document.querySelector('#time');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valor = Number(input.value);
    const unidade = select.value;

    function converterParaSegundos(valor, unidade) {
        if (unidade === 'segundos') return valor;
        if (unidade === 'minutos') return valor * 60;
        if (unidade === 'horas') return valor * 3600;
    }

    const tempoFinal = converterParaSegundos(valor, unidade);
    const dataFinal = new Date(Date.now() + tempoFinal * 1000);

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const url = new URL(tab.url);

    await chrome.storage.local.set({ [url.hostname]: dataFinal.getTime() });
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['components/block.js']
    });
});