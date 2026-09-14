<style>
body[ui-modal-open]{overflow:hidden;}
dialog[ui-modal-state]{padding:0;border:none;width:100vw;height:100vh;max-width:100vw;max-height:100vh;background:rgba(0,0,0,.6);}
dialog[ui-modal-state]::backdrop{background:transparent;}
dialog[ui-modal-state] [ui-modal-frame],
dialog[ui-modal-state] [ui-modal-loading]{width:100%;height:100%;}
dialog[ui-modal-state] iframe{width:100%;height:100%;border:0;background:transparent;}
[ui-modal-loading]{display:flex;align-items:center;justify-content:center;color:#fff;gap:1rem;}
[ui-modal-state="loading"] [ui-modal-frame]{display:none;}
[ui-modal-state="iframe"] [ui-modal-loading]{display:none;}
</style>

<template ui-modal-tpl>
  <dialog ui-modal-state="loading">
    <div ui-modal-loading>
      <span>Loading…</span>
      <button onclick="App.Ui.App.Ui.Modal.Cancel()">Cancel</button>
    </div>
    <div ui-modal-frame>
      <iframe ui-modal-iframe></iframe>
    </div>
  </dialog>
</template>


