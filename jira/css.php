<?php
// The app's stylesheet registry, in load order. One line, one file.
// Dev ($css prints a <link> tag) and build ($css appends to jira.css) both run this.

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
