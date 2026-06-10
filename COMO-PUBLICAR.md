# Como publicar o portfólio no GitHub (passo a passo)

Conta: **github.com/GuiSouzals** · Você **não precisa de token** — o Git abre o navegador para login.

## 1. Crie o repositório do site

1. Logado no GitHub, acesse https://github.com/new
2. Nome do repositório: `portfolio`
3. Deixe como **Public** e clique em **Create repository**

## 2. Envie os arquivos

O repositório git local já está pronto (já fiz o `git init` e o commit).
Abra o PowerShell e rode:

```powershell
cd "C:\Users\guilherme.souza\Desktop\Portifólio"
git push -u origin main
```

> No primeiro `git push`, abre uma janela do navegador pedindo login no GitHub.
> Faça o login e pronto — **sem token, sem senha no terminal**.
> (Se a janela não abrir por causa do antivírus, me avise que te passo o caminho com token.)

## 3. Ative o GitHub Pages (o site no ar, de graça)

1. No repositório, vá em **Settings → Pages**
2. Em **Source**, escolha **Deploy from a branch**
3. Branch: `main` / pasta: `/ (root)` → **Save**
4. Em 1–2 minutos seu site estará em:
   **`https://guisouzals.github.io/portfolio/`**

Esse é o link que você compartilha com clientes. 🎉

## 4. (Recomendado) README de perfil — a "capa" do seu GitHub

1. Crie outro repositório público chamado exatamente **`GuiSouzals`** (mesmo nome do usuário)
2. Marque a opção **"Add a README file"** ao criar
3. Substitua o conteúdo dele pelo arquivo que deixei pronto em
   [`perfil-github/README.md`](perfil-github/README.md) — pode copiar e colar pelo próprio site do GitHub
   (botão de lápis ✏️ no README do repositório)

Pronto: quem visitar github.com/GuiSouzals verá sua apresentação profissional.
