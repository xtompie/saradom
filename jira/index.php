<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>[SCRUM-1] Login page throws 500 on expired session token</title>
<link rel="icon" href="data:,">
<?php include __DIR__ . '/css.php'; ?>
<?php include __DIR__ . '/js.php'; ?>
</head>
<body onkeydown="App.Ui.Shortcut.Route(this, event); App.Ui.Dropdown.Esc(event)" onpointerdown="App.Ui.Dropdown.Down(event)" onfocusout="App.Ui.Dropdown.Out(event)">

<?php include __DIR__ . '/partials/sprite.php'; ?>
<?php include __DIR__ . '/partials/topbar.php'; ?>

<div sidebar-toggle="() => this.flag('sidebar-off', !this.flag('sidebar-off'))">
  <?php include __DIR__ . '/partials/sidebar.php'; ?>

  <main class="main" resizer-space>
    <div class="content">
      <?php include __DIR__ . '/partials/content.php'; ?>
    </div>
    <?php include __DIR__ . '/partials/panel.php'; ?>
  </main>
</div>

<?php include __DIR__ . '/partials/modal.php'; ?>
<output class="toast" ui-toast></output>

</body>
</html>
