# Astra

A local-first, interactive course from mathematical foundations to modern AI systems. Built with React, TypeScript, Vite, KaTeX, and TensorFlow.js. No API key or application backend is required.

## Run locally

Use Node.js 22.12+ and npm from the repository root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally http://127.0.0.1:5173/.

```sh
npm run build
npm run preview
```

Production output is `app/dist`. Serve it over HTTP; opening its HTML directly with `file://` does not support the application module and service-worker behavior.

## Deploy to GitHub Pages

1. Push this repository to GitHub with a `main` or `master` branch.
2. Open **Settings > Pages > Build and deployment** and choose **GitHub Actions** as the source.
3. Allow GitHub Actions for the repository. The included **Deploy Astra to GitHub Pages** workflow runs on pushes to `main`/`master`, or manually from the Actions tab.
4. Wait for the build and deployment jobs to finish. Open the deployment URL shown in the workflow, normally `https://OWNER.github.io/REPOSITORY/`.

The workflow runs `npm ci`, unit tests, lint, and the production build, then publishes `app/dist`. Relative asset paths and hash routes support repository subpaths without a server rewrite. If you use a different default branch, update the workflow branch list. Repository or organization policies may require approval for the `github-pages` environment.

This guide does not publish the repository or change GitHub settings automatically. GitHub Pages hosts the course; it is not a persistent model-inference backend.

## Course content

- 16 levels and 52 full chapters, ordered so prerequisites come first.
- Approximately 30,000 words of original explanations in 282 teaching sections.
- 119 chapter equations, worked calculations, learning objectives, prerequisite links, checkpoints, and further-reading resources.
- 120 glossary definitions linked to lessons.
- A concept quiz, lesson-specific numerical challenge, and executable JavaScript example for every lesson.
- 15 numerical playground types, including editable neurons, vectors, matrices, optimization, backpropagation, convolution, gated memory, attention, tokenization, diffusion, retrieval, and cache calculations.
- Real TensorFlow.js training on XOR, circles, moons, and spirals.
- A tiny GPT implemented from scalar reverse-mode autodiff through causal multi-head attention, LayerNorm, an MLP, cross entropy, Adam updates, and autoregressive sampling.

Start at Functions and follow the chapter navigation, or use the knowledge map and chapter-aware search. The Mathematics tab collects each chapter's formulas and worked examples. The Code lab runs editable examples in a network-restricted, timed worker and supports downloading them.

## Educational boundaries

The site is a broad, substantial learning course, not an accredited university program or proof of research proficiency. Advanced chapters introduce mechanisms, calculations, trade-offs, and primary reading; they do not replace full graduate texts or practical research experience.

The numerical labs deliberately use small examples. The tokenizer uses a toy vocabulary, retrieval uses lexical vectors rather than pretrained semantic embeddings, the generation distribution is fixed, and the diffusion visualization shows forward corruption rather than a trained image generator. Some chapters reuse a related lab and explain that distinction. The GPT code example is a genuinely trained 728-parameter toy with twelve updates, not a pretrained assistant. Its printed loss is training loss; meaningful quality evaluation requires a separate held-out corpus and a larger training budget.

The original wishlist is broader than this implementation. MNIST training, a 3D loss landscape, arbitrary editable network graphs with every weight exposed, dedicated multi-head visualizations, and fully animated internals for every architecture are not implemented. The lesson code provides numerical implementations for several concepts that do not have a dedicated visual playground. Production cloud deployment examples are instructional; the site never provisions cloud resources or executes external tools.

## Local data and offline use

Progress, bookmarks, and theme are stored in browser localStorage. They are not synced to an account. Export progress before clearing browser storage or switching browsers. Mastery badges record local practice and answers, not independently verified competence.

Production builds register a service worker and precache built assets. Offline use requires a successful initial online visit and service-worker installation; development mode does not install it. The initial download includes the optional training runtime. External further-reading sites still require a network connection. Close older tabs and reload to activate an updated waiting worker; clear this site's storage if a stale deployment persists, after exporting progress.

## Editing content

- `app/src/data/curriculum.ts`: lesson summaries, quizzes, glossary, derived reading times, and learning order.
- `app/src/data/chapters.ts`: foundational chapters and shared chapter types.
- `app/src/data/chapters-architectures.ts`: vision and recurrent networks.
- `app/src/data/chapters-language.ts`: NLP, attention, transformers, and LLMs.
- `app/src/data/chapters-systems.ts`: generative models, retrieval, evaluation, systems, and research.
- `app/src/data/chapter-extensions.ts`: additional derivations and specialized topics.
- `app/src/data/code-examples.ts` and `app/src/examples/tiny-gpt.js`: runnable implementations.
- `app/src/data/exercises.ts`: numerical transfer questions and worked solutions.

Use `String.raw` for LaTeX equations. Keep prerequisite IDs valid, and ensure the `next` links form one complete learning path from `functions` back to it through `research`. Further-reading resources are linked in the chapter reader.

## Checks

```sh
npm test
npm run lint
npm run build
```

The focused content checks render equations, execute examples, check glossary and prerequisite links, and verify chapter and exercise coverage. Browser tests are a separate optional suite (`npm run test:e2e` after building); they are not a substitute for checking instructional accuracy. The build currently reports large-chunk warnings from bundled course content and the lazy-loaded TensorFlow runtime. These are warnings, not deployment failures.