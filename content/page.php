<?php
// Page layout. In scope from page(): $title, $desc, $body, $landing, $current, $nav, $css.
// One template, one if: landing has no sidebar, every other page does.
$icon  = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23f0883e'/><text x='16' y='22' font-family='ui-monospace,monospace' font-size='17' font-weight='700' fill='%23140c04' text-anchor='middle'>S</text></svg>";
$ogImg = BASE_URL . 'og.png';
?><!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preload" href="fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<title><?= htmlspecialchars($title) ?> · <?= SITE ?></title>
<meta name="description" content="<?= htmlspecialchars($desc) ?>">
<meta property="og:title" content="<?= htmlspecialchars($title) ?>">
<meta property="og:description" content="<?= htmlspecialchars($desc) ?>">
<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= SITE ?>">
<meta property="og:url" content="<?= BASE_URL ?>">
<meta property="og:image" content="<?= $ogImg ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="<?= $ogImg ?>">
<link rel="icon" href="<?= $icon ?>">
<link rel="stylesheet" href="style.css">
<?php foreach ($css as $href): ?><link rel="stylesheet" href="<?= htmlspecialchars($href) ?>">
<?php endforeach ?></head>
<?php if ($landing): ?>
<body class="landing"><main class="content"><?= $body ?></main></body>
<?php else: ?>
<body>
<header class="nav-bar"><a class="brand" href="index.html"><span class="mark"><?= SITE ?></span></a><button type="button" class="nav-toggle" onclick="Nav.Toggle(this)" aria-label="Menu" aria-expanded="false"><span class="nav-burger"></span></button></header>
<div class="nav-scrim" onclick="Nav.Close(this)"></div>
<aside class="nav"><a class="brand" href="index.html"><span class="mark"><?= SITE ?></span></a><?= nav_html($nav, $current) ?><div class="nav-foot"><a href="https://github.com/xtompie/saradom" target="_blank" rel="noopener">GitHub</a></div></aside>
<main class="content"><?= $body ?><?php if ($next): ?>
<p class="doc-next"><a href="<?= htmlspecialchars($next['href']) ?>">Next: <?= htmlspecialchars($next['title']) ?> →</a></p>
<?php endif; ?></main>
<script>
// Mobile nav drawer — built the Saradom way: state in the DOM (body[nav-open]),
// event in an HTML attribute, action in context (this), module as an IIFE.
const Nav = (() => {
  const Toggle = (ctx) => ctx.setAttribute('aria-expanded', document.body.toggleAttribute('nav-open'));
  const Close  = () => { document.body.removeAttribute('nav-open'); document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false'); };
  return { Toggle, Close };
})();
</script>
</body>
<?php endif; ?>
</html>
