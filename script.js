document.addEventListener("DOMContentLoaded", () => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const abertura = $("#abertura");
    const entrarBtn = $("#entrarBtn");
    const musica = $("#musica");
    const controleMusica = $("#controleMusica");
    const modoNoite = $("#modoNoite");
    const botaoAmor = $("#botaoAmor");
    const mensagemAmor = $("#mensagemAmor");
    const progresso = $("#progressoPagina");
    const reiniciar = $("#reiniciar");

    // Estrelas decorativas
    const estrelas = $("#stars");
    for (let i = 0; i < 75; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.opacity = `${0.15 + Math.random() * 0.5}`;
        estrelas.appendChild(star);
    }

    // Entrada + música
    entrarBtn.addEventListener("click", async () => {
        abertura.classList.add("sumir");
        setTimeout(() => abertura.style.display = "none", 1000);

        try {
            musica.volume = 0.42;
            await musica.play();
            atualizarBotaoMusica(true);
        } catch {
            controleMusica.classList.add("visivel");
            controleMusica.textContent = "▶";
        }

        criarCoracoes(window.innerWidth / 2, window.innerHeight / 2, 16);
    });

    function atualizarBotaoMusica(tocando) {
        controleMusica.classList.add("visivel");
        controleMusica.classList.toggle("playing", tocando);
        controleMusica.textContent = tocando ? "♫" : "▶";
    }

    controleMusica.addEventListener("click", async () => {
        if (musica.paused) {
            try { await musica.play(); atualizarBotaoMusica(true); }
            catch { atualizarBotaoMusica(false); }
        } else {
            musica.pause();
            atualizarBotaoMusica(false);
        }
    });

    // Modo claro/escuro
    modoNoite.addEventListener("click", () => {
        document.body.classList.toggle("luz");
        modoNoite.textContent = document.body.classList.contains("luz") ? "☀" : "☾";
    });

    // Animações ao rolar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visivel");
        });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(el => observer.observe(el));

    // Barra de progresso
    function atualizarProgresso() {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        progresso.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
    }
    window.addEventListener("scroll", atualizarProgresso, { passive:true });
    atualizarProgresso();

    // Contador desde a data original do projeto.
    // Se quiser alterar a data, troque apenas esta linha.
    const inicio = new Date("2025-08-25T00:00:00");

    function atualizarContador() {
        let diferenca = Math.max(0, Date.now() - inicio.getTime());
        const segundosTotais = Math.floor(diferenca / 1000);
        const minutosTotais = Math.floor(segundosTotais / 60);
        const horasTotais = Math.floor(minutosTotais / 60);

        $("#dias").textContent = Math.floor(horasTotais / 24);
        $("#horas").textContent = String(horasTotais % 24).padStart(2, "0");
        $("#minutos").textContent = String(minutosTotais % 60).padStart(2, "0");
        $("#segundos").textContent = String(segundosTotais % 60).padStart(2, "0");
    }
    atualizarContador();
    setInterval(atualizarContador, 1000);

    // Mensagem final + corações
    botaoAmor.addEventListener("click", (event) => {
        mensagemAmor.classList.toggle("mostrar");
        const rect = event.currentTarget.getBoundingClientRect();
        criarCoracoes(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
        botaoAmor.querySelector("span").textContent = mensagemAmor.classList.contains("mostrar") ? "♡" : "♥";
    });

    function criarCoracoes(x, y, quantidade = 20) {
        for (let i = 0; i < quantidade; i++) {
            const coracao = document.createElement("span");
            coracao.className = "coracao-explosao";
            coracao.textContent = Math.random() > .35 ? "♥" : "♡";
            coracao.style.left = `${x}px`;
            coracao.style.top = `${y}px`;
            coracao.style.setProperty("--x", `${Math.random() * 420 - 210}px`);
            coracao.style.setProperty("--y", `${Math.random() * 420 - 210}px`);
            coracao.style.fontSize = `${14 + Math.random() * 18}px`;
            document.body.appendChild(coracao);
            setTimeout(() => coracao.remove(), 1500);
        }
    }

    // Corações ao clicar na página
    document.addEventListener("click", (event) => {
        if (event.target.closest("button, a")) return;
        if (Math.random() > .7) criarCoracoes(event.clientX, event.clientY, 5);
    });

    // Voltar ao começo
    reiniciar.addEventListener("click", () => {
        window.scrollTo({ top:0, behavior:"smooth" });
        setTimeout(() => {
            abertura.style.display = "grid";
            requestAnimationFrame(() => abertura.classList.remove("sumir"));
        }, 450);
    });

    // Atalho de teclado: M = música
    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "m") controleMusica.click();
    });
});
