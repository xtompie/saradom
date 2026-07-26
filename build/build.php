<?php

// The global build owns the output folder: it wipes docs/ once,
// then runs each sub-build. Sub-builds only write, never clean.

$GLOBAL_OUT = dirname(__DIR__) . '/docs';

wipe($GLOBAL_OUT);
@mkdir($GLOBAL_OUT, 0777, true);

require __DIR__ . '/../content/build.php';   // the docs site → docs/*.html
require __DIR__ . '/../jira/build.php';      // the Jira demo → docs/jira/

function wipe(string $p): void
{
    if (!is_dir($p)) { @unlink($p); return; }
    foreach (array_diff(scandir($p), ['.', '..']) as $f) wipe("$p/$f");
    @rmdir($p);
}
