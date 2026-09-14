<?php
// The app's JavaScript registry, in load order. One line, one file.
// Dev ($js prints a <script> tag) and build ($js appends to jira.js) both run this.

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
$js('js/Ui/Shortcut.js');
$js('vendor/Sortable.min.js');
$js('js/Ui/Sortable.js');
$js('js/SSortable.js');
$js('/Compute/SCompute.js');
$js('/Init/SInit.js');
$js('/Resizer/SResizer.js');
