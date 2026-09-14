<aside class="panel">
      <button class="panel-toggle" panel-toggle title="Toggle details panel" onclick="const m = this.up('[resizer-space]'); m.flag('panel-off', !m.flag('panel-off'))"><svg class="ic xs"><use href="#i-chevron"/></svg></button>
      <s-resizer store="issue-panel" var="--panel-w" min="280" max="560"></s-resizer>
      <div class="row gap actions">
        <div ui-dropdown-space>
          <button class="icon-btn bd" title="No restrictions" ui-dropdown-trigger restrict-set="(v) => { const m = {none:['No restrictions','#i-lock',false],edit:['Editing restricted','#i-lock',true],full:['Viewing &amp; editing restricted','#i-lock',true]}[v]; this.attr('title', m[0]); this.one('use').setAttribute('href', m[1]); this.flag('restrict-on', m[2]); }" onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-lock"/></svg></button>
          <div ui-dropdown-menu popover="manual" class="menu menu-end" restrict-set="(v) => this.all('[restrict-opt]').each(o => o.attr('aria-checked', o.attr('restrict-opt') === v))">
            <div class="menu-head">Restrict access</div>
            <button class="menu-item" role="menuitemradio" restrict-opt="none" aria-checked="true" onclick="this.nall('restrict-set', 'none')"><svg class="ic"><use href="#i-users"/></svg> No restrictions</button>
            <button class="menu-item" role="menuitemradio" restrict-opt="edit" onclick="this.nall('restrict-set', 'edit')"><svg class="ic"><use href="#i-lock"/></svg> Editing restricted</button>
            <button class="menu-item" role="menuitemradio" restrict-opt="full" onclick="this.nall('restrict-set', 'full')"><svg class="ic"><use href="#i-lock"/></svg> Viewing &amp; editing restricted</button>
          </div>
        </div>
        <div ui-dropdown-space ui-dropdown-onopen="() => App.Ui.Hx(this.one('[ui-dropdown-menu]'))">
          <button class="icon-btn bd" watch-on watch-total="2" watch-count="(n) => { const c = Number(n); this.one('[watch-badge]').textContent = c; this.attr('watch-total', c); }" watch-watching="(on) => this.flag('watch-on', on)" title="Watch options" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-eye"/></svg> <span class="count" watch-badge>2</span></button>
          <div ui-dropdown-menu popover="manual" class="menu menu-end" hx-get="fragments/watchers.html" hx-target="this" hx-swap="innerHTML"><p class="menu-empty">Loading…</p></div>
        </div>
        <div ui-dropdown-space ui-dropdown-onopen="() => this.one('[ui-dropdown-menu]').flag('shared', false)">
          <button class="icon-btn bd" title="Share" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-share"/></svg></button>
          <div ui-dropdown-menu popover="manual" class="menu menu-end">
            <div class="menu-head">Share this work item</div>
            <label class="menu-field">To<input class="input" type="text" placeholder="Names, teams or emails"></label>
            <label class="menu-field">Note<textarea class="input" rows="2" placeholder="Optional message"></textarea></label>
            <div class="menu-foot"><span class="share-done">Shared &#10003;</span><button class="btn btn-primary btn-sm" onclick="const m = this.up('[popover]'); m.flag('shared', true); m._t = setTimeout(() => m.hidePopover(), 900)">Share</button></div>
          </div>
        </div>
        <div ui-dropdown-space>
          <button class="icon-btn bd" title="Actions" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-dots"/></svg></button>
          <div ui-dropdown-menu popover="manual" class="menu menu-end">
            <button class="menu-item">Move</button>
            <button class="menu-item">Clone</button>
            <button class="menu-item" onclick="this.nall('flag-toggle'); this.up('[popover]').hidePopover()">Add flag</button>
            <button class="menu-item">Print</button>
            <div class="menu-sep"></div>
            <button class="menu-item danger" onclick="this.up('[popover]').hidePopover(); App.Ui.Modal.Open('delete.html', (r) => r && this.nall('ui-toast', 'Work item deleted'))">Delete</button>
          </div>
        </div>
      </div>
      <div class="flag-chip" flag-toggle="() => this.flag('hidden', !this.flag('hidden'))" hidden>⚑ Flagged</div>

      <div class="row gap status-row">
        <div ui-dropdown-space><button type="button" class="status" field-status field-state="in-progress" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">In Progress <svg class="ic"><use href="#i-chevron"/></svg></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-status"><button type="button" class="menu-item" hx-post="fragments/field-status.html" hx-fill hx-vals-body="() => ({ value: 'To Do', state: 'to-do' })" hx-target="closest [ui-dropdown-space] [field-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="status" field-state="to-do">To Do</span></button><button type="button" class="menu-item" hx-post="fragments/field-status.html" hx-fill hx-vals-body="() => ({ value: 'In Progress', state: 'in-progress' })" hx-target="closest [ui-dropdown-space] [field-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="status" field-state="in-progress">In Progress</span></button><button type="button" class="menu-item" hx-post="fragments/field-status.html" hx-fill hx-vals-body="() => ({ value: 'Done', state: 'done' })" hx-target="closest [ui-dropdown-space] [field-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="status" field-state="done">Done</span></button></div></div>
        <div ui-dropdown-space>
          <button class="icon-btn bd" title="Automation" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-zap"/></svg></button>
          <div ui-dropdown-menu popover="manual" class="menu menu-end">
            <div class="menu-head">Automation rules</div>
            <button class="menu-item"><svg class="ic"><use href="#i-zap"/></svg> Move to In Progress on branch</button>
            <button class="menu-item"><svg class="ic"><use href="#i-zap"/></svg> Assign to me on transition</button>
            <button class="menu-item"><svg class="ic"><use href="#i-zap"/></svg> Notify watchers when Done</button>
            <div class="menu-sep"></div>
            <button class="menu-item"><svg class="ic"><use href="#i-plus"/></svg> Create rule</button>
          </div>
        </div>
        <div ui-dropdown-space>
          <button class="btn" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic fill"><use href="#i-sparkle"/></svg> Improve</button>
          <div ui-dropdown-menu popover="manual" class="menu menu-end">
            <div class="menu-head">AI suggestions</div>
            <button class="menu-item"><svg class="ic fill"><use href="#i-sparkle"/></svg> Summarise this issue</button>
            <button class="menu-item"><svg class="ic fill"><use href="#i-sparkle"/></svg> Suggest a fix</button>
            <button class="menu-item"><svg class="ic fill"><use href="#i-sparkle"/></svg> Draft a reply</button>
            <button class="menu-item"><svg class="ic fill"><use href="#i-sparkle"/></svg> Break into subtasks</button>
          </div>
        </div>
      </div>

      <div ui-pin-space ui-pin-store="detail-properties">
      <s-sortable class="pinned" ui-pin-target store="detail-properties" handle="[field-grip]"></s-sortable>

      <details class="pdetails" open>
      <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Details</h2></summary>
      <div ui-dropdown-space>
      <button class="icon-btn xs sec-action" title="Configure fields" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-gear"/></svg></button>
      <div ui-dropdown-menu popover="manual" class="menu menu-end">
        <div class="menu-head">Show fields</div>
        <label class="menu-item"><input type="checkbox" value="assignee" checked onchange="this.nall('fields-toggle', this)"> Assignee</label>
        <label class="menu-item"><input type="checkbox" value="priority" checked onchange="this.nall('fields-toggle', this)"> Priority</label>
        <label class="menu-item"><input type="checkbox" value="parent" checked onchange="this.nall('fields-toggle', this)"> Parent</label>
        <label class="menu-item"><input type="checkbox" value="due" checked onchange="this.nall('fields-toggle', this)"> Due date</label>
        <label class="menu-item"><input type="checkbox" value="labels" checked onchange="this.nall('fields-toggle', this)"> Labels</label>
        <label class="menu-item"><input type="checkbox" value="team" checked onchange="this.nall('fields-toggle', this)"> Team</label>
        <label class="menu-item"><input type="checkbox" value="start" checked onchange="this.nall('fields-toggle', this)"> Start date</label>
        <label class="menu-item"><input type="checkbox" value="sprint" checked onchange="this.nall('fields-toggle', this)"> Sprint</label>
        <label class="menu-item"><input type="checkbox" value="points" checked onchange="this.nall('fields-toggle', this)"> Story points</label>
        <label class="menu-item"><input type="checkbox" value="reporter" checked onchange="this.nall('fields-toggle', this)"> Reporter</label>
      </div>
      </div>
      <div class="fields" fields-toggle="(cb) => { const f = this.one('[field-name=' + cb.value + ']'); if (f) f.hidden = !cb.checked; }">
        <div ui-pin-slot="assignee"><div class="field" field-name="assignee" ui-pin-name="assignee" sort-item="assignee"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Assignee</span><span class="field-body" field-body><span ui-dropdown-space><button type="button" class="field-pick" field-assignee ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs favi"><use href="#i-person"/></svg><span class="field-val">Unassigned</span></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-assign"><div class="menu-head">Assignee</div><button type="button" class="menu-item" hx-post="fragments/field-assignee.html" hx-fill hx-vals-body="() => ({ value: 'Sam Rivera', initials: 'SR' })" hx-target="closest [ui-dropdown-space] [field-assignee]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">SR</span> Sam Rivera</button><button type="button" class="menu-item" hx-post="fragments/field-assignee.html" hx-fill hx-vals-body="() => ({ value: 'Alex Kim', initials: 'AK' })" hx-target="closest [ui-dropdown-space] [field-assignee]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">AK</span> Alex Kim</button><button type="button" class="menu-item" hx-post="fragments/field-assignee.html" hx-fill hx-vals-body="() => ({ value: 'Priya Shah', initials: 'PS' })" hx-target="closest [ui-dropdown-space] [field-assignee]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">PS</span> Priya Shah</button><div class="menu-sep"></div><button type="button" class="menu-item" hx-post="fragments/field-unassign.html" hx-target="closest [ui-dropdown-space] [field-assignee]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic"><use href="#i-person"/></svg> Unassign</button></div></span> <button class="linkish sm" hx-post="fragments/field-assignee.html" hx-fill hx-vals-body="() => ({ value: 'Sam Rivera', initials: 'SR' })" hx-target="closest [field-body] [field-assignee]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">Assign to me</button></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="priority"><div class="field" field-name="priority" ui-pin-name="priority" sort-item="priority"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Priority</span><span class="field-body" field-body><span ui-dropdown-space><button type="button" class="field-pick" field-priority field-state="medium" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs prio"><use href="#i-prio"/></svg><span class="field-val" field-set="set">Medium</span></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-prio"><button type="button" class="menu-item" hx-post="fragments/field-priority.html" hx-fill hx-vals-body="() => ({ value: 'Highest', state: 'highest' })" hx-target="closest [ui-dropdown-space] [field-priority]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic xs prio" field-state="highest"><use href="#i-prio"/></svg> Highest</button><button type="button" class="menu-item" hx-post="fragments/field-priority.html" hx-fill hx-vals-body="() => ({ value: 'High', state: 'high' })" hx-target="closest [ui-dropdown-space] [field-priority]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic xs prio" field-state="high"><use href="#i-prio"/></svg> High</button><button type="button" class="menu-item" hx-post="fragments/field-priority.html" hx-fill hx-vals-body="() => ({ value: 'Medium', state: 'medium' })" hx-target="closest [ui-dropdown-space] [field-priority]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic xs prio" field-state="medium"><use href="#i-prio"/></svg> Medium</button><button type="button" class="menu-item" hx-post="fragments/field-priority.html" hx-fill hx-vals-body="() => ({ value: 'Low', state: 'low' })" hx-target="closest [ui-dropdown-space] [field-priority]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic xs prio" field-state="low"><use href="#i-prio"/></svg> Low</button><button type="button" class="menu-item" hx-post="fragments/field-priority.html" hx-fill hx-vals-body="() => ({ value: 'Lowest', state: 'lowest' })" hx-target="closest [ui-dropdown-space] [field-priority]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic xs prio" field-state="lowest"><use href="#i-prio"/></svg> Lowest</button></div></span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="parent"><div class="field" field-name="parent" ui-pin-name="parent" sort-item="parent"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Parent</span><span class="field-body" field-body><span class="edit-view field-val" field-state="" hx-post="fragments/field-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim(), type: 'text', set: '', state: '' })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="due"><div class="field" field-name="due" ui-pin-name="due" sort-item="due"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Due date</span><span class="field-body" field-body><span class="edit-view field-val" field-state="" hx-post="fragments/field-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim(), type: 'date', set: '', state: '' })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="labels"><div class="field" field-name="labels" ui-pin-name="labels" sort-item="labels"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Labels</span><span class="field-body" field-body><span class="edit-view field-val" field-labels="None" hx-post="fragments/field-labels-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.attr('field-labels') })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="team"><div class="field" field-name="team" ui-pin-name="team" sort-item="team"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Team</span><span class="field-body" field-body><span class="edit-view field-val" field-state="" hx-post="fragments/field-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim(), type: 'text', set: '', state: '' })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="start"><div class="field" field-name="start" ui-pin-name="start" sort-item="start"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Start date</span><span class="field-body" field-body><span class="edit-view field-val" field-state="" hx-post="fragments/field-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim(), type: 'date', set: '', state: '' })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="sprint"><div class="field" field-name="sprint" ui-pin-name="sprint" sort-item="sprint"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Sprint</span><span class="field-body" field-body><span class="edit-view field-val" field-state="" hx-post="fragments/field-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim(), type: 'text', set: '', state: '' })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="points"><div class="field" field-name="points" ui-pin-name="points" sort-item="points"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Story points</span><span class="field-body" field-body><span class="edit-view field-val" field-state="" hx-post="fragments/field-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim(), type: 'number', set: '', state: '' })" onclick="App.Ui.Hx(this, event)">None</span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
        <div ui-pin-slot="reporter"><div class="field" field-name="reporter" ui-pin-name="reporter" sort-item="reporter"><span class="field-grip" field-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><span class="field-key">Reporter</span><span class="field-body" field-body><span ui-dropdown-space><button type="button" class="field-pick" field-reporter ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><span class="avatar xs">SR</span><span class="field-val" field-set="set">Sam Rivera</span></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-assign"><div class="menu-head">Reporter</div><button type="button" class="menu-item" hx-post="fragments/field-reporter.html" hx-fill hx-vals-body="() => ({ value: 'Sam Rivera', initials: 'SR' })" hx-target="closest [ui-dropdown-space] [field-reporter]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">SR</span> Sam Rivera</button><button type="button" class="menu-item" hx-post="fragments/field-reporter.html" hx-fill hx-vals-body="() => ({ value: 'Alex Kim', initials: 'AK' })" hx-target="closest [ui-dropdown-space] [field-reporter]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">AK</span> Alex Kim</button><button type="button" class="menu-item" hx-post="fragments/field-reporter.html" hx-fill hx-vals-body="() => ({ value: 'Priya Shah', initials: 'PS' })" hx-target="closest [ui-dropdown-space] [field-reporter]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">PS</span> Priya Shah</button></div></span></span><button class="pin" title="Pin to top" onclick="App.Ui.Pin.Toggle(this)"><svg class="ic xs"><use href="#i-pin"/></svg></button></div></div>
      </div>
      </details>
      <script>App.Ui.Pin.Init(document.currentScript)</script>
      </div>

      <details class="pdetails pd-bd" hx-get="fragments/development.html" hx-target="find .pcard-body" hx-swap="innerHTML" ontoggle="this.open && App.Ui.Hx(this)">
        <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Development</h2></summary>
        <div class="pcard-body"><p class="muted small">Loading…</p></div>
      </details>
      <details class="pdetails pd-bd" hx-get="fragments/automation.html" hx-target="find .pcard-body" hx-swap="innerHTML" ontoggle="this.open && App.Ui.Hx(this)">
        <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Automation</h2></summary>
        <div class="pcard-body"><p class="muted small">Loading…</p></div>
      </details>

      <div class="meta">
        <div>Created <button class="linkish">3 hours ago</button></div>
        <div>Updated <button class="linkish">1 hour ago</button></div>
        <a href="#">Configure</a>
      </div>
    </aside>
