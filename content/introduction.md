---
slug: introduction
title: "Introduction"
type: page
track: foundations
order: 0
status: draft
---

# Introduction

## Definition

Saradom is an architecture pattern. It is not a framework and not a library. It is plain HTML and JavaScript. There is nothing to learn beyond HTML and JavaScript.

Saradom does not say how to build, bundle, or deploy the code that reaches the page.

## Idea

The idea is that today's frontends are over-engineered. Saradom's rules do not create the problems that later need a framework or a build system. The extra complexity is gone. What is left is what the interface does.

## Advantages

- No build step. The HTML, JavaScript, and CSS ship as they are.
- No toolchain to keep working. No `npm install`, no native modules, no bundler config that breaks on a new machine or OS.
- The same on every machine. No install step means no version drift and no "works on my machine".
- No dependencies to keep up to date. Extending the app later needs no framework upgrade. The HTML and JavaScript it uses do not get deprecated.
- No `node_modules`. No dependency vulnerabilities to patch, and no supply-chain risk.
- Only HTML and JavaScript. There is no JSX, no directives, and no template language to learn.
- No framework runtime to download. The page is interactive as soon as it loads.
- Works on slow devices and networks. There is no runtime overhead to carry.
- One source of truth on the client. The state is in the DOM, not in a separate store that can drift from the screen.
- Real, crawlable HTML. Search engines read the page directly.
- Built on semantic HTML, which works with screen readers, with no extra ARIA layer to add.
- Drops into any backend, like PHP, Rails, or a plain HTML page.
- Third-party libraries drop in, writing to the same DOM.
- Adopt it one widget at a time. It coexists with whatever is already on the page.
- The pattern holds as the app grows.

## Structure

First the foundations. These are the rules the rest is based on. Then the toolkits, plain JavaScript for common problems. Then complete examples to read and run. Then some topics.
