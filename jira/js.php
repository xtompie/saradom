<?php
// The app's JavaScript registry, in load order. One line, one file.
// Run straight from the sources it prints a <script> per file. The build sets
// $js first, so there it appends each file into one jira.js instead.

$js ??= fn($src) => printf('<script src="%s"></script>' . "\n", $src);

$js('js/App.js');
$js('/Util/Util.js');
$js('/Notify/Notify.js');
$js('js/Ui/Hx.js');
$js('hx-fill.js');
$js('js/Ui/Switch.js');
$js('js/Ui/Filter.js');
$js('js/Ui/Dropdown.js');
$js('js/Ui/Modal.js');
$js('js/Ui/Pin.js');
$js('js/Ui/Copy.js');
$js('js/Ui/Toast.js');
$js('js/Ui/Shortcut.js');
$js('vendor/Sortable.min.js');
$js('js/Ui/Sortable.js');
$js('js/SSortable.js');
$js('/Compute/SCompute.js');
$js('/Init/SInit.js');
$js('/Resizer/SResizer.js');
