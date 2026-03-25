(async () => {
    const siteAtual = window.location.hostname;
    let dataAgora = new Date(Date.now());
    const dados = await chrome.storage.local.get(null);
    const dataSalva = dados[siteAtual];

    if (!dataSalva) return;

    const dataBloqueio = new Date(dataSalva);

    if (isNaN(dataBloqueio.getTime())) {
        console.error("Data inválida para:", siteAtual);
        return;
    }

    if (dataAgora.getTime() <= dataBloqueio.getTime()) {
        chrome.runtime.sendMessage({
            action: "bloquear",
            site: siteAtual
        });
    } else {
        chrome.storage.local.remove(siteAtual);
    }
})();