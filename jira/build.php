<?php

// The Jira demo builds itself from its registries: css.php and js.php list
// every source in load order. Here $css/$js append each file (local path or
// URL) into one bundle and print the single <link>/<script> tag in place of
// the registry — the page renders itself, nothing is parsed or patched.
// Fragments and the modal pages are copied as-is; the modal pages keep
// loading their own two small files.

$JIRA = __DIR__;
$JOUT = dirname(__DIR__) . '/docs/jira';
@mkdir($JOUT, 0777, true);

$resolve = fn(string $src) => preg_match('#^https?://#', $src) ? $src
    : (str_starts_with($src, '/') ? dirname(__DIR__) . $src : "$JIRA/$src");

$cssOut = '';
$jsOut  = '';
$css = function (string $src) use (&$cssOut, $resolve) {
    if ($cssOut === '') echo "<link rel=\"stylesheet\" href=\"jira.css\">\n";
    $cssOut .= file_get_contents($resolve($src)) . "\n";
};
$js = function (string $src) use (&$jsOut, $resolve) {
    if ($jsOut === '') echo "<script src=\"jira.js\"></script>\n";
    $jsOut .= file_get_contents($resolve($src)) . "\n;\n";
};

ob_start();
include "$JIRA/index.php";
file_put_contents("$JOUT/index.html", ob_get_clean());
file_put_contents("$JOUT/jira.css", $cssOut);
file_put_contents("$JOUT/jira.js", $jsOut);

@mkdir("$JOUT/fragments", 0777, true);
foreach (glob("$JIRA/fragments/*") as $f) copy($f, "$JOUT/fragments/" . basename($f));

@mkdir("$JOUT/js/Ui", 0777, true);
copy("$JIRA/create.html", "$JOUT/create.html");
copy("$JIRA/delete.html", "$JOUT/delete.html");
copy("$JIRA/js/App.js", "$JOUT/js/App.js");
copy("$JIRA/js/Ui/Modal.js", "$JOUT/js/Ui/Modal.js");

echo "built → docs/jira/ (jira.css " . round(strlen($cssOut) / 1024) . " KB, jira.js " . round(strlen($jsOut) / 1024) . " KB)\n";
