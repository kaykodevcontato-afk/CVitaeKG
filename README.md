# Currículo Studio 2.0 — Dev Kayko

Gerador de currículos profissionais para clientes, desenvolvido em **HTML + CSS + JavaScript puros**, sem frameworks, sem servidor, sem banco de dados e compatível com **GitHub Pages**.

## Principais recursos

- Formulário completo com dados pessoais, objetivo profissional, experiências, formação, cursos, competências, idiomas, projetos e informações adicionais.
- Atualização da prévia em tempo real no **papel A4**.
- **12 modelos:** Moderno, Clássico, Executivo, Criativo, Minimalista, Duas colunas, Elegante, Tecnologia, Linha do tempo, Compacto, Editorial e Acadêmico.
- **20 cores predefinidas + qualquer cor personalizada (seletor HEX)** e ajuste de fonte (90% a 110%).
- Foto opcional, reduzida automaticamente no dispositivo (sem upload externo).
- **Imprimir** e **Salvar em PDF** usando a impressão nativa do navegador.
- **Backup** e **Importar** em JSON para voltar a editar o currículo.
- Rascunho salvo automaticamente no navegador (`localStorage`).
- Botão **Novo cliente** para limpar dados antes de um novo atendimento.
- Layout responsivo, sem dependências externas, sem cookies de rastreamento.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub. Exemplo: `curriculo-studio`.
2. Envie o arquivo `index.html`, esta documentação e **toda a pasta `assets/`** para a raiz do repositório. Mantenha exatamente as pastas e os nomes.
3. Vá a **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**. Selecione `main` e `/ (root)` e clique em **Save**.
5. Seu endereço será semelhante a: `https://SEU-USUARIO.github.io/curriculo-studio/`.

Você também pode abrir `index.html` diretamente no computador para trabalhar sem internet.

## Como usar para atendimento ao cliente

1. Clique em **Novo cliente** (se existir um rascunho de outra pessoa).
2. Digite os dados. Use **Ver exemplo** se quiser testar os modelos com informações fictícias.
3. Acesse **Visual** e escolha o modelo, cor, tamanho do texto e foto (opcional).
4. Clique em **Imprimir** para mandar para a impressora.
5. Clique em **Salvar em PDF**, escolha no diálogo do navegador o destino **Salvar como PDF / Microsoft Print to PDF**, tamanho **A4**, e salve o documento. **A exportação não é um download direto**: ela utiliza o recurso de PDF do sistema/navegador.
6. Se precisar continuar outro dia, clique em **Backup** e guarde o arquivo `.json`. Use **Importar** para restaurá-lo.
7. Após entregar, **Novo cliente** apaga o rascunho local do atendimento anterior.

### Configuração recomendada para o PDF

- **Papel:** A4.
- **Escala:** padrão / 100%.
- **Margens:** nenhuma / padrão do site.
- **Cabeçalhos e rodapés do navegador:** desativados.
- **Gráficos de segundo plano:** ativados, especialmente para os modelos Executivo e Criativo.
- Currículos longos podem ocupar duas ou mais páginas. O site tenta evitar dividir uma experiência entre páginas; recomenda-se textos concisos.

## Onde editar cada parte

```text
curriculo-studio-dev-kayko/
├── index.html               # Estrutura, campos e botões
├── README.md                # Documentação
└── assets/
    ├── favicon.svg          # Ícone da aba
    ├── css/
    │   └── styles.css       # Visual do site, modelos de currículo, impressão e celular
    └── js/
        └── app.js           # Formulário, modelos, prévia, PDF, backup e armazenamento
```

Para mudar o título, texto ou o nome do desenvolvedor, edite o `index.html`. Para mudar as cores, edite `:root` no início do CSS. Para mudar os campos ou o conteúdo do currículo, veja `FIELDS`, `COLLECTIONS`, `renderResume()` e `DEMO` no começo de `app.js`.

## Privacidade, segurança e limitações

- **Os dados não são enviados para o GitHub ou para qualquer servidor**, porque o aplicativo não tem backend. O GitHub hospeda apenas os arquivos públicos do código.
- O rascunho fica salvo no **navegador e dispositivo em uso**. Ele não sincroniza automaticamente entre computadores e pode desaparecer se os dados do site forem apagados ou se a navegação privada for encerrada.
- Quem utilizar o mesmo perfil do navegador neste computador poderá ver o rascunho existente. Em balcões, sempre use **Novo cliente** após o atendimento.
- O backup JSON e o PDF contêm dados pessoais. Trate esses arquivos com cuidado.
- Não há login, contas de usuários, cobrança ou salvamento em nuvem. Essas funções exigem serviços adicionais e medidas de segurança próprias.
- A foto é opcional; para muitas vagas, recomenda-se não adicionar foto nem dados pessoais desnecessários.
- O recurso de PDF requer navegador/sistema com opção de impressão para PDF. Em celulares, o caminho varia conforme o navegador.

**Desenvolvimento:** Dev Kayko  
**Versão:** 2.1

## Novidades da versão 2.0

- Agora há 12 estilos realmente diferentes; os modelos **Duas colunas** e **Tecnologia** organizam seções principais e complementares em colunas no próprio HTML, inclusive ao imprimir.
- O seletor **Cor personalizada** permite usar qualquer cor hexadecimal. Em cores claras, a interface ajusta automaticamente os tons usados em textos, garantindo legibilidade melhor.
- Backups JSON da versão 1.0 continuam funcionando e rascunhos locais existentes são preservados (mesma chave de armazenamento).
- Mude paletas em `COLORS` e modelos em `TEMPLATES` no `assets/js/app.js`; edite estilos `.template-*` no `assets/css/styles.css` e os cartões do painel Visual em `index.html`.
- Para cores preencherem cabeçalhos ao exportar PDF, marque **Gráficos de segundo plano** na tela de impressão. Documentos extensos podem passar de uma página.


## Novidades da versão 2.1 — endereços, telefones e CNH

- **Telefone principal:** selecione se é WhatsApp, celular ou telefone fixo. Backups antigos continuam com o número principal e sem rótulo obrigatório.
- **Outros números de contato:** adicione e remova quantos forem necessários, com tipo separado para cada número (WhatsApp, celular, fixo).
- **Endereço completo (opcional):** rua/avenida, número, bairro, CEP e complemento, além de cidade e UF. **O endereço completo só aparece no currículo se marcar “Exibir endereço completo no currículo”**, para proteger a privacidade dos candidatos.
- **CNH (opcional):** marque se possui, informe a categoria e, se necessário, EAR. Se não marcar, nada sobre habilitação aparece no currículo.
- Tudo funciona nos 12 modelos, na prévia, no PDF pela impressão e no backup JSON. Dados da versão 1.0 e 2.0 continuam aceitos. Para editar, procure em `index.html` por "Endereço completo", "Outros números" ou "Carteira Nacional"; no JavaScript, por `FIELDS`, `COLLECTIONS` e `renderResume()`.
