<nav class="breadcrumb">
        <a href="#">Spaces</a><span class="sep">/</span>
        <a href="#" class="crumb-space"><span class="proj crumb-proj">M</span> My Team</a><span class="sep">/</span>
        <span ui-dropdown-space><button class="crumb-btn crumb-epic" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs"><use href="#i-edit"/></svg> <span epic-label>Add epic</span></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-epic"><p class="menu-empty">No epic has been created in this space. <a href="#" class="menu-link" onclick="this.up('[popover]').hidePopover()">Create your first epic</a>.</p></div></span><span class="sep">/</span>
        <span ui-copy-space><span ui-dropdown-space><button class="crumb-btn crumb-type" ui-dropdown-trigger title="Task - Change work type" type-set="(o) => { this.one('[type-icon]').setAttribute('href', o.one('use').getAttribute('href')); this.title = o.one('[type-name]').textContent + ' - Change work type' }" onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs"><use href="#i-task" type-icon/></svg></button><div ui-dropdown-menu popover="manual" class="menu menu-start" type-set="(o) => this.all('[type-opt]').each(x => x.attr('aria-checked', x === o))"><div class="menu-head">Change work type</div><button class="menu-item" role="menuitemradio" type-opt aria-checked="true" onclick="this.nall('type-set', this); this.up('[popover]').hidePopover()"><svg class="ic"><use href="#i-task"/></svg> <span type-name>Task</span></button><button class="menu-item" role="menuitemradio" type-opt onclick="this.nall('type-set', this); this.up('[popover]').hidePopover()"><svg class="ic"><use href="#i-prio"/></svg> <span type-name>Bug</span></button><button class="menu-item" role="menuitemradio" type-opt onclick="this.nall('type-set', this); this.up('[popover]').hidePopover()"><svg class="ic"><use href="#i-board"/></svg> <span type-name>Story</span></button></div></span><a href="#" class="crumb-key" ui-copy="https://jira.example.com/browse/SCRUM-1">SCRUM-1</a>
        <button class="icon-btn xs crumb-copy" onclick="App.Ui.Copy.Value(this)" title="Copy link"><svg class="ic"><use href="#i-copy"/></svg></button></span>
      </nav>

      <div class="issue-head">
        <h1 class="issue-title"><span class="edit-view" field-state="" hx-post="fragments/title-edit.html" hx-fill hx-target="this" hx-swap="outerHTML" hx-vals-body="() => ({ value: this.textContent.trim() })" onclick="App.Ui.Hx(this, event)">Login page throws 500 on expired session token</span></h1>
        <div class="row gap issue-actions">
          <div ui-dropdown-space>
            <button class="icon-btn bd" title="Add" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-plus"/></svg></button>
            <div ui-dropdown-menu popover="manual" class="menu menu-start">
              <button class="menu-item"><svg class="ic"><use href="#i-attach"/></svg> Attachment</button>
              <button class="menu-item" onclick="this.up('[popover]').hidePopover(); const s = document.one('[sub-add]'); s.click(); s.scrollIntoView({block: 'center'})"><svg class="ic"><use href="#i-task"/></svg> Subtask</button>
              <button class="menu-item"><svg class="ic"><use href="#i-link"/></svg> Linked work item</button>
              <button class="menu-item"><svg class="ic"><use href="#i-external"/></svg> Web link</button>
            </div>
          </div>
          <div ui-dropdown-space>
            <button class="icon-btn bd" title="More actions" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-dots"/></svg></button>
            <div ui-dropdown-menu popover="manual" class="menu menu-start">
              <button class="menu-item">Move</button>
              <button class="menu-item">Clone</button>
              <button class="menu-item">Archive</button>
              <div class="menu-sep"></div>
              <button class="menu-item danger" onclick="this.up('[popover]').hidePopover(); App.Ui.Modal.Open('delete.html', (r) => r && this.nall('ui-toast', 'Work item deleted'))">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <details class="sec" description-space open>
        <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Description</h2></summary>
        <button class="btn btn-sm sec-action" hx-get="fragments/description-edit.html" hx-target="closest [description-space] [description]" hx-swap="outerHTML" onclick="App.Ui.Hx(this,event)">Edit</button>
        <div class="prose" description>
          <p>When a user's session token expires, the login page returns <code>HTTP 500</code> instead of redirecting to sign-in.</p>
          <p><b>Repro:</b> log in, wait for the token to expire, then submit any action. <b>Expected:</b> redirect to the <code>/login</code> page. <b>Actual:</b> 500 page, stack trace leaks.</p>
        </div>
      </details>

      <details class="sec" subtask-space open>
        <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Subtasks</h2></summary>
        <s-compute run="() => { const rows = this.all('[subtask]'); const done = rows.filter(r => r.one('[subtask-status]').textContent.trim() === 'Done').length; this.one('[subtask-count]').textContent = Math.round(done / rows.length * 100 || 0) + '% Done'; this.one('[subtask-bar]').style.width = (rows.length ? Math.round(done / rows.length * 100) : 0) + '%'; }">
          <div class="sub-progress"><div class="progress"><i subtask-bar style="width:33%"></i></div><span class="counter" subtask-count>33% Done</span></div>
          <div class="subs">
            <div class="subs-head"><span class="subs-h subs-h-work">Work</span><span class="subs-h">Priority</span><span class="subs-h">Assignee</span><span class="subs-h">Status</span><span></span></div>
            <s-sortable class="subs-body" subtask-list handle="[subtask-grip]">
            <div class="sub" subtask><span class="subtask-grip" subtask-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic xs sub-type"><use href="#i-task"/></svg><a class="sub-key" href="#">SCRUM-2</a><span class="sub-title">Reproduce on staging</span><span class="sub-prio"><svg class="ic xs"><use href="#i-prio"/></svg> Medium</span><span class="sub-actions" subtask-actions><span ui-dropdown-space><button type="button" class="sub-assign" subtask-assign ui-dropdown-trigger title="Assignee" onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs"><use href="#i-person"/></svg></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-assign"><div class="menu-head">Assignee</div><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Sam Rivera',initials: 'SR'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">SR</span> Sam Rivera</button><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Alex Kim',initials: 'AK'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">AK</span> Alex Kim</button><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Priya Shah',initials: 'PS'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">PS</span> Priya Shah</button><div class="menu-sep"></div><button type="button" class="menu-item" hx-post="fragments/subtask-unassign.html" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic"><use href="#i-person"/></svg> Unassign</button></div></span></span><span ui-dropdown-space><button type="button" class="sub-status" subtask-state="done" subtask-status ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">Done</button><div ui-dropdown-menu popover="manual" class="menu menu-status"><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'To Do',state: 'todo'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="todo">To Do</span></button><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'In Progress',state: 'progress'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="progress">In Progress</span></button><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'Done',state: 'done'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="done">Done</span></button></div></span><button type="button" class="sub-del" title="Delete subtask" hx-post="fragments/subtask-delete.html" hx-target="closest [subtask]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">&times;</button></div>
            <div class="sub" subtask><span class="subtask-grip" subtask-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic xs sub-type"><use href="#i-task"/></svg><a class="sub-key" href="#">SCRUM-3</a><span class="sub-title">Add regression test</span><span class="sub-prio"><svg class="ic xs"><use href="#i-prio"/></svg> Medium</span><span class="sub-actions" subtask-actions><span ui-dropdown-space><button type="button" class="sub-assign" subtask-assign ui-dropdown-trigger title="Assignee" onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs"><use href="#i-person"/></svg></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-assign"><div class="menu-head">Assignee</div><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Sam Rivera',initials: 'SR'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">SR</span> Sam Rivera</button><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Alex Kim',initials: 'AK'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">AK</span> Alex Kim</button><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Priya Shah',initials: 'PS'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">PS</span> Priya Shah</button><div class="menu-sep"></div><button type="button" class="menu-item" hx-post="fragments/subtask-unassign.html" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic"><use href="#i-person"/></svg> Unassign</button></div></span></span><span ui-dropdown-space><button type="button" class="sub-status" subtask-state="progress" subtask-status ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">In Progress</button><div ui-dropdown-menu popover="manual" class="menu menu-status"><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'To Do',state: 'todo'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="todo">To Do</span></button><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'In Progress',state: 'progress'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="progress">In Progress</span></button><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'Done',state: 'done'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="done">Done</span></button></div></span><button type="button" class="sub-del" title="Delete subtask" hx-post="fragments/subtask-delete.html" hx-target="closest [subtask]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">&times;</button></div>
            <div class="sub" subtask><span class="subtask-grip" subtask-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic xs sub-type"><use href="#i-task"/></svg><a class="sub-key" href="#">SCRUM-7</a><span class="sub-title">Guard /login redirect on 401</span><span class="sub-prio"><svg class="ic xs"><use href="#i-prio"/></svg> Medium</span><span class="sub-actions" subtask-actions><span ui-dropdown-space><button type="button" class="sub-assign" subtask-assign ui-dropdown-trigger title="Assignee" onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic xs"><use href="#i-person"/></svg></button><div ui-dropdown-menu popover="manual" class="menu menu-start menu-assign"><div class="menu-head">Assignee</div><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Sam Rivera',initials: 'SR'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">SR</span> Sam Rivera</button><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Alex Kim',initials: 'AK'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">AK</span> Alex Kim</button><button type="button" class="menu-item" hx-post="fragments/subtask-assignee.html" hx-fill hx-vals-body="() => ({name: 'Priya Shah',initials: 'PS'})" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="avatar xs">PS</span> Priya Shah</button><div class="menu-sep"></div><button type="button" class="menu-item" hx-post="fragments/subtask-unassign.html" hx-target="closest [ui-dropdown-space] [subtask-assign]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><svg class="ic"><use href="#i-person"/></svg> Unassign</button></div></span></span><span ui-dropdown-space><button type="button" class="sub-status" subtask-state="todo" subtask-status ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">To Do</button><div ui-dropdown-menu popover="manual" class="menu menu-status"><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'To Do',state: 'todo'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="todo">To Do</span></button><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'In Progress',state: 'progress'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="progress">In Progress</span></button><button type="button" class="menu-item" hx-post="fragments/subtask-status.html" hx-vals-body="() => ({status: 'Done',state: 'done'})" hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML" onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)"><span class="sub-status" subtask-state="done">Done</span></button></div></span><button type="button" class="sub-del" title="Delete subtask" hx-post="fragments/subtask-delete.html" hx-target="closest [subtask]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">&times;</button></div>
            </s-sortable>
          </div>
          <button type="button" class="sub-add" subtask-add onclick="const f=this.up('[subtask-space]').one('[subtask-form]'); f.hidden=false; this.hidden=true; f.one('input').focus()"><svg class="ic xs"><use href="#i-plus"/></svg> Create subtask</button>
          <form class="row-add" subtask-form hidden hx-post="fragments/subtask-new.html" hx-fill hx-target="[subtask-list]" hx-swap="append" onsubmit="App.Ui.Hx(this, event); this.reset(); this.hidden=true; this.up('[subtask-space]').one('[subtask-add]').hidden=false">
            <input class="input" type="text" name="text" placeholder="What needs to be done?" autocomplete="off">
          </form>
        </s-compute>
      </details>

      <details class="sec" link-space open>
        <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Linked work items</h2></summary>
        <button class="btn btn-sm sec-action" onclick="const f=this.up('[link-space]').one('[link-form]'); f.hidden=false; f.one('input').focus()"><svg class="ic"><use href="#i-plus"/></svg> Add</button>
        <div class="link-list" link-list>
          <div class="linked" linked linked-rel="is-blocked-by"><select class="linked-select" onchange="this.up('[linked]').attr('linked-rel', this.value)"><option value="blocks">blocks</option><option value="is-blocked-by" selected>is blocked by</option><option value="relates-to">relates to</option><option value="duplicates">duplicates</option></select><svg class="ic xs linked-icon"><use href="#i-task"/></svg><a class="linked-key" href="#">SCRUM-4</a><span class="linked-title">Session service returns 500 on token expiry</span><svg class="ic xs linked-pri" style="color:#c9372c"><use href="#i-prio"/></svg><span class="linked-status" linked-state="progress">In Progress</span><span class="linked-actions" linked-actions><button type="button" class="icon-btn xs linked-del" title="Remove link" hx-post="fragments/link-remove.html" hx-target="closest [linked]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">&times;</button></span></div>
        </div>
        <form class="row-add" link-form hidden hx-post="fragments/link-new.html" hx-fill hx-target="[link-list]" hx-swap="append" onsubmit="App.Ui.Hx(this, event)">
          <input class="input" type="text" name="text" placeholder="Search work items to link…" autocomplete="off">
        </form>
      </details>

      <details class="sec" open>
        <summary class="sec-head"><svg class="ic caret"><use href="#i-chevron"/></svg><h2>Activity</h2></summary>
        <div ui-switch-space ui-switch-state="comment" activity-order="old">
          <div class="between activity-bar">
            <div class="segmented">
              <label class="seg"><input type="radio" name="show" onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'comment history worklog')"><span>All</span></label>
              <label class="seg"><input type="radio" name="show" checked onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'comment')"><span>Comments</span></label>
              <label class="seg"><input type="radio" name="show" onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'history')"><span>History</span></label>
              <label class="seg"><input type="radio" name="show" onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'worklog')"><span>Work log</span></label>
            </div>
            <button class="icon-btn bd" title="Oldest first" onclick="const s=this.up('[ui-switch-space]'); s.attrt('activity-order','new','old'); const n=s.attr('activity-order')==='new'; const t=n?'Newest first':'Oldest first'; this.one('[order-label]').textContent=t; this.title=t"><svg class="ic"><use href="#i-sort"/></svg><span order-label>Oldest first</span></button>
          </div>

          <div ui-switch-tag="comment">
            <form class="comment-add" comment-fill="(text) => this.one('[comment-input]').value = text" hx-post="fragments/comment-new.html" hx-target="[comment-list]" hx-swap="append" onsubmit="App.Ui.Hx(this, event)">
              <div class="avatar sm">SR</div>
              <div class="grow comment-box" comment-box>
                <input class="input" name="text" comment-input ui-shortcut-m="() => this.focus()" type="text" placeholder="Add a comment…" autocomplete="off">
                <div class="comment-expand">
                  <div class="row gap quick">
                    <button type="button" class="chip" onclick="this.nup('comment-fill', this.textContent.trim())">Who is working on this…?</button>
                    <button type="button" class="chip" onclick="this.nup('comment-fill', this.textContent.trim())">Status update…</button>
                    <button type="button" class="chip" onclick="this.nup('comment-fill', this.textContent.trim())">Thanks…</button>
                  </div>
                  <div class="comment-foot">
                    <button class="btn btn-primary btn-sm" type="submit">Comment</button>
                    <button class="btn btn-sm" type="button" onclick="this.closest('form').reset(); this.up('[comment-box]').one('[comment-input]').blur()">Cancel</button>
                  </div>
                </div>
              </div>
            </form>
            <s-compute run="() => this.all('[react]').each(r => { const c = r.one('[react-count]'); if (c) c.textContent = Number(r.attr('react-base')) + (r.one('[react-like]').checked ? 1 : 0); })">
              <div comment-list>
                <div class="comment" comment comment>
                  <div class="avatar sm">SR</div>
                  <div class="comment-body">
                    <div class="comment-meta"><b>Sam Rivera</b> <span class="muted">· 2h ago</span></div>
                    <p>Seen it on prod too — the token TTL is 15 min.</p>
                    <div class="comment-actions" comment-actions>
                      <label class="c-act react" react react-base="2" title="React">
                        <input type="checkbox" hidden react-like hx-post="fragments/comment-liked.html" hx-target="this" hx-swap="outerHTML" onchange="App.Ui.Hx(this, event)">
                        <span class="c-emoji">👍</span><span react-count>2</span>
                      </label>
                      <button type="button" class="c-act" hx-get="fragments/comment-reply.html" hx-target="closest [comment]" hx-swap="append" onclick="App.Ui.Hx(this, event)">Reply</button>
                      <button type="button" class="c-act" hx-get="fragments/comment-edit.html" hx-target="closest [comment]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">Edit</button>
                      <button type="button" class="c-act" hx-post="fragments/comment-delete.html" hx-target="closest [comment]" hx-swap="outerHTML" onclick="App.Ui.Hx(this, event)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </s-compute>
          </div>

          <div ui-switch-tag="history" class="feed" style="display:none">
            <div class="feed-item"><div class="avatar sm">SR</div><div><b>Sam Rivera</b> changed the status <b>To Do → In Progress</b> <span class="muted">· 1h ago</span></div></div>
            <div class="feed-item"><div class="avatar sm">PS</div><div><b>Priya Shah</b> set <b>Priority</b> to <b>Medium</b> <span class="muted">· 2h ago</span></div></div>
            <div class="feed-item"><div class="avatar sm">SR</div><div><b>Sam Rivera</b> created the work item <span class="muted">· 3h ago</span></div></div>
          </div>

          <div ui-switch-tag="worklog" class="feed" style="display:none">
            <div class="feed-item"><div class="avatar sm">AK</div><div><b>Alex Kim</b> logged <b>2h</b> — reproduced on staging <span class="muted">· 1h ago</span></div></div>
            <p class="muted small feed-total">Total time logged: 2h</p>
          </div>
        </div>
      </details>
