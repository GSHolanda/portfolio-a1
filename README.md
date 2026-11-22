# Portfólio · Gabriel Silva Holanda

Site pessoal de portfólio feito para o **Projeto Final A1** (Prof. Eliel Cruz). Apresenta quem sou, o que faço e seis projetos, com o problema, a minha contribuição e o resultado de cada um.

Site estático em **HTML5, CSS3 e JavaScript puro**, sem frameworks, sem backend e sem etapa de compilação.

**Endereço:** https://gsholanda.github.io/portfolio-a1/

## Estrutura

```
portfolio-a1/
├── index.html          conteúdo da página
├── css/styles.css      estilos (mobile first)
├── js/main.js          menu móvel, filtros de projetos e realce da navegação
├── imagens/            favicon, imagem de compartilhamento e capturas dos projetos
└── README.md
```

Páginas HTML adicionais, se surgirem, ficam em `paginas/`.

## Abrir localmente

Dê dois cliques em `index.html`. Todos os caminhos são relativos, então o site abre direto do computador. As fontes vêm do Google Fonts; sem internet, o navegador usa fontes do sistema.

Se preferir um servidor local:

```
python -m http.server 8000
```

Depois abra http://localhost:8000.

## Publicar no GitHub Pages

1. Crie um repositório **público** chamado `portfolio-a1` na conta `GSHolanda`.
2. Envie os arquivos desta pasta para a branch `main` (com `index.html` na raiz):
   ```
   git init
   git add .
   git commit -m "Portfólio do Projeto Final A1"
   git branch -M main
   git remote add origin https://github.com/GSHolanda/portfolio-a1.git
   git push -u origin main
   ```
3. No repositório, abra **Settings → Pages → Deploy from a branch → main → /(root)** e clique em **Save**.
4. Em um ou dois minutos o site fica no ar em https://gsholanda.github.io/portfolio-a1/.

## Requisitos do professor

| Requisito | Onde está |
|---|---|
| Site portfólio sobre mim e o que faço | `index.html`: Início, Sobre, Projetos, Formação e Contato |
| Hospedado no GitHub Pages | Passo a passo acima; caminhos relativos |
| HTML, CSS e JavaScript | `index.html`, `css/styles.css`, `js/main.js` |
| Design responsivo (mobile) | `css/styles.css`: uma coluna no celular, pontos de quebra em 768 e 1024 px |
| Pastas separadas | `imagens/`, `css/`, `js/` e o HTML na raiz |
