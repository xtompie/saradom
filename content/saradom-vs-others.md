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

The same need, handled two ways. Each section shows what a framework brings to it, and what plain HTML and JavaScript do.

## htmx

Saradom is compatible with [htmx](https://htmx.org/), except for one thing: event binding. htmx does not use native HTML event attributes. It processes `hx-*` attributes itself, on its own pass over the page.

Hx implements htmx in the Saradom pattern.

## Distant update

An action in one widget needs to update a different widget somewhere else on the page.

React answers this with a state-management layer: Context, a Provider at the root, `useContext`, a selector, Redux, Zustand, actions, reducers, `React.memo`.

In Saradom, the widget that changed sends one signal up to a shared ancestor, which passes it down to whatever listens. Two attributes and a call.

## Live data

Data arriving from outside the app, over a WebSocket or a server-sent event, needs to update the screen.

React has its own mechanism for this: `useSyncExternalStore`, `subscribe`, `getSnapshot`, `getServerSnapshot`, stable references, manual teardown, reconnect logic, a rendering bug named tearing.

In Saradom, a plain listener reads each message. It has its own reconnect logic. The update is whatever the message needs: append or replace a node. The message can carry an HTML fragment written straight into the page, or JSON written onto the elements.

## Forms

A form needs to send its data to the server. Errors need to show next to the right field.

React uses separate libraries for this: Zod, Yup, Formik, React Hook Form, `register`, `Controller`, field arrays, `value`, `onChange`, refs.

In Saradom, the form submits and the server sends back HTML with the errors in place. For checks that should show before the request, one function validates the fields in the browser.

## SEO

A search engine needs to read real content in the page, not an empty shell that JavaScript fills in later.

Every framework does this with a second server that runs JavaScript, next to whatever the backend already is. Even a Java or PHP backend needs this new stack, on its own, just for this: server-side rendering, static site generation, `getServerSideProps`, `getStaticProps`, Next.js, Nuxt, SvelteKit, `react-helmet`, `next/head`, sitemap.xml, robots.txt, prerendering services.

In Saradom, the page is already real HTML. It is the same page for a browser and for a crawler. The state is text and attributes in the markup, so there is nothing to render first.

## Onboarding

A new developer joins the project and needs to read the code and start making changes.

Picking up a React, Vue, or Angular codebase means learning its rendering model, its hooks or reactivity rules, its state-management library, its routing library, its build tooling, before any of it touches business logic. None of it transfers to the next project, or even to this one two major versions later. The app itself carries extra complexity on top: solving problems the framework introduces, and following its particular style for solving them. That design is specific to whoever built it, and the framework does not teach it.

In Saradom, the code is plain HTML and plain JavaScript. State is visible directly in the browser's Elements panel, not inside a framework's internal store. The mechanisms are generic and reused everywhere: understanding one mechanism once already covers tabs, accordions, and dropdowns. There is no separate architecture to reverse-engineer on top.

## Time to interactive

How fast the page responds depends on how much JavaScript has to download, parse, and run before anything works.

React's runtime adds its own weight before any business logic runs: itself and ReactDOM as a baseline, a router, a state library, a UI kit, icons, easily past 500KB before the app does anything. On top of that: code-splitting with `React.lazy`, tree-shaking that quietly fails on non-ESM packages, hydration adding its own gap between the page looking ready and the page actually responding to a click.

In Saradom, there is no runtime to download, parse, or hydrate. The HTML the browser already parsed is the interactive page.

## Third-party libraries

Dropping in an existing library, a jQuery plugin, a D3 chart, a map widget, means letting it touch the same DOM nodes the framework manages.

React's own docs warn about this directly: if the same DOM nodes are manipulated by another library, React gets confused and has no way to recover. Safe integration means treating the widget as a black box the framework is not allowed to touch: an empty div behind a ref, `shouldComponentUpdate` or `React.memo` forced to skip re-renders on that spot, manual teardown in a cleanup function.

In Saradom, there is no virtual DOM to confuse. The plugin and the Saradom code write to the same real nodes. Wiring one in is just calling it.

## Model duplication

A domain model lives once, on the backend: its fields, its statuses, its rules.

A framework front carries two kinds of state. One is a copy of that model, kept in step by hand: TypeScript interfaces over the DTOs, a validation schema over the rules, a status like active or inactive checked again in a client conditional. The other is view state the backend never had: which row is selected, which panel is expanded, which item is highlighted. So the backend holds one model, and the front holds a copy of it plus a layer of its own. A new field or a new status means touching more than one place. OpenAPI codegen, GraphQL codegen, and tRPC exist just to keep the model copy from drifting.

In Saradom, the model stays once, on the backend. The front receives HTML that updates the DOM. View state lives in the DOM too, as attributes on the elements, not as a second model in JavaScript. The backend keeps the model. The page keeps the view state. Neither is copied into a third place to sync.

## The build pipeline

Before a framework app runs, a toolchain has to build it. That toolchain is its own thing to install, configure, and keep working.

A React app needs Node.js and npm, a bundler and its config, a transpiler for JSX and TypeScript, and often a native module that compiles C++ on install. A build that works on one machine can fail on the next. When `node-sass` stopped working on Apple Silicon, teams had to swap it for `dart-sass` and change their dependencies to match. The pipeline runs again on every deploy, in CI, where "works on my machine" is not enough.

In Saradom, there is no build. The HTML, JavaScript, and CSS that a developer writes are the files the browser runs. Nothing has to be compiled or bundled on the way to production.

## Accidental complexity

There are two kinds of complexity: essential and accidental. Essential complexity is what must be done. It cannot be avoided, and without it nothing works. Accidental complexity is the chosen way of doing it: which framework, and everything that comes with it.

A click that reveals a hidden tab is essential complexity. Something has to happen: the tab shows.

In Saradom, an attribute marks the tab, a small function shows it, and `onclick` connects the two. Nothing else is needed.

In React, the same click needs Node.js, npm, React and its build tooling installed, JSX as a syntax of its own to learn, a dev server running just to see the result, a root div for React to mount into, a component, knowledge of React itself and its rule that the DOM is never touched directly, a `useState` flag for whether the tab is open, and often a `useEffect` or a `useMemo` to keep the rest of the component from re-rendering more than it should. All of that is accidental complexity.

## Constant change

A framework project does not stand still. What was the right way last year is legacy this year. Moving with the change costs a rewrite. Staying put means running on a version that no longer gets fixes.

- Three module systems: CommonJS, then AMD, then native `import`/`export`. Packages still ship all three.
- 2016: Angular 2 replaces AngularJS. No upgrade path. Every AngularJS app has to be rewritten.
- 2019: React drops class components for hooks.
- 2020: Vue 3 changes the API.
- 2020: Moment.js, the most used date library, declares itself legacy.
- 2021: AngularJS reaches end of life. No more security patches.
- 2022: Protractor, a test tool, is deprecated. Every test has to move.
- 2023: Angular and Svelte move to signals.
- 2025: Create React App is deprecated.
- Angular ships a new major every six months, each supported for about eighteen months.

In Saradom, a handler written today would have worked almost thirty years ago: an attribute, a function, a DOM write. There is no major version to migrate to.

## Migration

Contexte, a French SaaS, had a React front end that took two years to build. In 2022 they [rebuilt it](https://www.youtube.com/watch?v=3GObi93tjZI) with server-rendered HTML and htmx (Saradom does the same, through Hx), in about two months, with no loss in the experience.

The code base dropped by 67%, from 21,500 lines to 7,200. JavaScript dependencies dropped by 96%, from 255 to 9. The build went from 40 seconds to 5. First load went from 2 to 6 seconds down to 1 to 2, and the app could finally handle data sets that React had choked on.

The team changed too. Under React it was split: two back-end developers, one front-end, and one full-stack. After the switch the whole team was full-stack, each able to own a feature end to end.

The team's own caveat is worth keeping: Contexte is a content-heavy app, well suited to this style, and not every app will see numbers this large. It was an htmx port, and htmx is the same server-HTML model Saradom builds on. The approach holds up on a real product, at real scale.
