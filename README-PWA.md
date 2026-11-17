# Currículo Studio — atualização PWA para GitHub Pages

Projeto original: **Currículo Studio 2.1**, desenvolvido por **Dev Kayko**.
Esta atualização adiciona manifesto, ícones e Service Worker sem modificar a lógica do gerador de currículos.

## Atenção: dois arquivos originais não foram enviados

O HTML utiliza os arquivos `assets/css/styles.css` e `assets/js/app.js`, que NÃO estavam nos anexos. **Não apague nem substitua esses arquivos no GitHub.** Eles são indispensáveis para a aparência, modelos, prévia, backup e impressão do currículo.

## Publicar

1. No repositório `CVitaeKG`, mantenha todos os arquivos existentes (especialmente `assets/css/styles.css`, `assets/js/app.js` e `assets/favicon.svg`).
2. Envie o conteúdo deste ZIP à raiz do repositório; substitua `index.html` e `manifest.json`, e adicione `service-worker.js`, `assets/js/pwa-register.js` e a pasta `assets/icons/`.
3. Confirme o site: https://kaykodevcontato-afk.github.io/CVitaeKG/
4. Verifique ícones em `https://kaykodevcontato-afk.github.io/CVitaeKG/assets/icons/icon-192.png` e `icon-512.png`.
5. No PWABuilder, execute nova análise. A captura de telas (screenshots) é opcional e deve ser feita com imagens reais do site; não foram incluídas capturas fictícias.

## Recursos PWA

- Manifesto com nome, idioma, categorias, URLs adequadas à subpasta GitHub Pages.
- Ícones PNG 192, 512 e 512 maskable, com identidade aproximada do C da marca original.
- Service Worker online-first com fallback offline para recursos já armazenados em cache.
- Registro do Service Worker independente do JS principal.
- O botão PDF continua usando a impressão nativa do navegador; no Android, a disponibilidade varia.

## Atualizações

O worker usa cache `curriculo-studio-v1`. Ao publicar nova versão dos arquivos estáticos, atualize o sufixo `v1` para `v2` e recarregue o app para renovar o cache. O modo offline precisa ser testado depois de carregar o aplicativo online ao menos uma vez.

## Privacidade

O Service Worker armazena apenas respostas GET de mesma origem dentro da pasta do projeto. Ele não faz upload dos dados digitados pelo cliente. Mantenha o cuidado com dados armazenados localmente em computadores compartilhados.
