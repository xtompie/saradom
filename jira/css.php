<?php
// The app's stylesheet registry, in load order. One line, one file.
// Run straight from the sources it prints a <link> per file. The build sets
// $css first, so there it appends each file into one jira.css instead.

$css ??= fn($src) => printf('<link rel="stylesheet" href="%s">' . "\n", $src);

$css('css/ui-dropdown.css');
$css('blueprint.css');
$css('css/sidebar.css');
$css('css/watchers.css');
$css('css/activity.css');
$css('css/search.css');
$css('css/subtasks.css');
$css('css/restrict.css');
$css('css/breadcrumb.css');
$css('css/notif.css');
$css('css/linked.css');
$css('css/actions-extra.css');
$css('css/details.css');
