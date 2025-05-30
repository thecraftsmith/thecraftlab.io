# thecraftlab.io

A minimalist dracula-themed personal site built with React and Vite.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Install Tailwind CSS, PostCSS, Autoprefixer and the Typography plugin:

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
```

## Production

Build the site for production:

```bash
npm run build
```
Serve the built `dist/` directory (e.g. for local testing or platforms expecting a `start` command):

```bash
npm run start
```

### Deploying on Render.com

To have Render.com automatically build and publish your site from the `dist/` folder, commit a `render.yaml` at the root of your repo:

```yaml
services:
  - type: static
    name: thecraftlab-io
    staticPublishPath: dist
    buildCommand: npm install && npm run build
```
## Content Management

Place markdown files in `src/content/<section>/`. The following sections are supported:

- `whoami`: personal bio files
- `courses`: course descriptions
- `articles`: blog posts

New markdown files in these folders will automatically load in the site once added.
