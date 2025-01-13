# Vitepress project

Vitepress is a static site generator powered by Vite. It is designed to be simple and lightweight, with a Vue-powered theme system and Markdown-based content.

```bash
npm init vitepress
```
## Start the development server

```bash
npm run dev:docs
```

## Use github pages

```bash
npm install -D gh-pages
```

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "deploy": "vitepress build docs && gh-pages -d docs/.vitepress/dist"
  }
}
```

Then run:

```bash
npm run deploy
```


