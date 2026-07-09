---
slug: saradom-vs-others
title: "Saradom vs Others"
type: topic
tags: [comparison]
track: topics
order: 30
status: draft
---

# Saradom vs Others

## htmx

Saradom is compatible with htmx, except for one thing: event binding. htmx does not use native HTML event attributes. It processes `hx-*` attributes itself, on its own pass over the page.

htmx in Saradom implementation: [hx](hx.html).

## Distant update

An action in one widget needs to update a different widget somewhere else on the page.

React answers this with a whole state-management layer, not a quick fix for one feature: Context, a Provider at the root, `useContext`, a selector, Redux, Zustand, actions, reducers, `React.memo`.

In Saradom, this is solved with [change reaction](the-simple-way.html#change-reaction).

## Live data

Data arriving from outside the app, over a WebSocket or a server-sent event, needs to update the screen.

React has its own mechanism for this, not a plain event listener: `useSyncExternalStore`, `subscribe`, `getSnapshot`, `getServerSnapshot`, stable references, manual teardown, reconnect logic, a rendering bug named tearing.

In Saradom, a plain listener reads each message. It has its own reconnect logic. The update is whatever the message needs: append or replace a node. The message itself can carry an HTML fragment written straight into the page, or JSON written through [Val](val.html).

## Forms

A form needs to send its data to the server. Errors need to show next to the right field.

React needs separate libraries with their own APIs for this, not just wired-up inputs: Zod, Yup, Formik, React Hook Form, `register`, `Controller`, field arrays, `value`, `onChange`, refs.

In Saradom, this is solved with [forms](the-simple-way.html#forms).

## SEO

A search engine needs to read real content in the page, not an empty shell that JavaScript fills in later.

Every framework pays for this the same way, with a second server that runs JavaScript, next to whatever the backend already is. Even a Java or PHP backend needs this new stack, on its own, just for this: server-side rendering, static site generation, `getServerSideProps`, `getStaticProps`, Next.js, Nuxt, SvelteKit, `react-helmet`, `next/head`, sitemap.xml, robots.txt, prerendering services.

In Saradom, the page is already real HTML. It is the same page for a browser and for a crawler: [DOM State](dom-state.html#why).

## Onboarding

A new developer joins the project and needs to read the code and start making changes.

Picking up a React, Vue, or Angular codebase means learning its rendering model, its hooks or reactivity rules, its state-management library, its routing library, its build tooling, before any of it touches business logic. None of it transfers to the next project, or even to this one two major versions later. The app itself carries extra complexity on top: solving problems the framework introduces, and following its particular style for solving them. That design is specific to whoever built it, and the framework does not teach it.

In Saradom, the code is plain HTML and plain JavaScript. State is visible directly in the browser's Elements panel, not inside a framework's internal store. The mechanisms are generic and reused everywhere: understanding [Visible](visible.html) once already covers tabs, accordions, dropdowns. There is no separate architecture to reverse-engineer on top.

## Time to interactive

How fast the page responds depends on how much JavaScript has to download, parse, and run before anything works.

React's runtime adds its own weight before any business logic runs at all: itself and ReactDOM as a baseline, a router, a state library, a UI kit, icons, easily past 500KB before the app does anything. On top of that: code-splitting with `React.lazy`, tree-shaking that quietly fails on non-ESM packages, hydration adding its own gap between the page looking ready and the page actually responding to a click.

In Saradom, there is no runtime to download, parse, or hydrate. The HTML the browser already parsed is the interactive page.

## Third-party libraries

Dropping in an existing library, a jQuery plugin, a D3 chart, a map widget, means letting it touch the same DOM nodes the framework manages.

React's own docs warn about this directly: if the same DOM nodes are manipulated by another library, React gets confused and has no way to recover. Safe integration means treating the widget as a black box the framework is not allowed to touch: an empty div behind a ref, `shouldComponentUpdate` or `React.memo` forced to skip re-renders on that spot, manual teardown in a cleanup function.

In Saradom, there is no virtual DOM to confuse. The plugin and the Saradom code write to the same real nodes. Wiring one in is just calling it.

## Model duplication

A domain model and its rules exist once, on the backend. The front end needs a second copy of it, to render and to validate.

Any typed front end pays for this twice, kept in step by hand: TypeScript interfaces mirroring backend DTOs, a validation schema mirroring backend rules, a status check like active or inactive repeated in a client conditional. A new rule, a new status, or a new field means changing both copies, often across two teams, released in the right order so neither side breaks. OpenAPI codegen, GraphQL codegen, and tRPC exist just to stop the two copies from drifting apart.

In Saradom, like in htmx, the model and its logic live once, on the backend. The front only receives HTML, a string that updates the DOM. The backend decides the if, at render time. The front only builds the mechanism around it. There is no second model to keep in step, only what changes on the page.

## Accidental complexity

There are two kinds of complexity: essential and accidental. Essential complexity is what must be done. It cannot be avoided, and without it nothing works. Accidental complexity is the chosen way of doing it: which framework, and everything that comes with it.

A click that reveals a hidden tab is essential complexity. Something has to happen: the tab shows.

In Saradom, an attribute marks the tab, a small function shows it, and `onclick` connects the two. Nothing else is needed.

In React, the same click needs Node.js, npm, React and its build tooling installed, JSX as a syntax of its own to learn, a dev server running just to see the result, a root div for React to mount into, a component, knowledge of React itself and its rule that the DOM is never touched directly, a `useState` flag for whether the tab is open, and often a `useEffect` or a `useMemo` to keep the rest of the component from re-rendering more than it should. All of that is accidental complexity.

## Constant change

- Three module systems: CommonJS, then AMD, then native `import`/`export`. Packages still ship both.
- 2014 — new Angular, no migration path from the old version.
- 2019 — React: class components out, hooks in.
- 2020 — Vue 3 adds Composition API next to Options API. Community split.
- 2022 — AngularJS support ends, eight years after its replacement.
- 2023 — Vue 2 end of life. Teams pay for extended support.
- 2023 — Angular and Svelte move to signals: "we've come to the realisation that Knockout was right all along... Svelte 5's reactivity is powered by signals, which are essentially what Knockout was doing in 2010."
- SolidStart: years in beta, APIs changing the whole time.
- 2025 — Create React App deprecated by React's own team: "we're deprecating Create React App for new apps, and encouraging existing apps to migrate to a framework."
- Angular: new major every six months, ~18 months support.

This is a fragment. Today's "right way" is just a stage. Every item on this list was once a stage too.

A handler written in Saradom today would have worked almost thirty years ago: an attribute, a function, a DOM write.
