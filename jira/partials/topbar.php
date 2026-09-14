<header class="topbar">
  <div class="topbar-group">
    <button class="icon-btn" title="Collapse sidebar [" onclick="this.nall('sidebar-toggle')"><svg class="ic"><use href="#i-panel"/></svg></button>
    <div ui-dropdown-space ui-dropdown-onopen="() => App.Ui.Hx(this.one('[ui-dropdown-menu]'))">
      <button class="icon-btn" title="Switch apps" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-grid"/></svg></button>
      <div ui-dropdown-menu popover="manual" class="menu menu-start menu-apps" hx-get="fragments/app-switcher.html" hx-target="this" hx-swap="innerHTML"><p class="menu-empty">Loading…</p></div>
    </div>
    <a class="brand" href="#"><span class="brand-mark">J</span> Jira</a>
  </div>
  <div class="topbar-center">
    <div class="search-wrap" search-space ui-dropdown-space search-mode="recent" ui-dropdown-onopen="() => { if(!this.one('input').value){ this.attr('search-mode','recent'); App.Ui.Hx(this.one('[search-recent-trigger]')); } }">
      <label class="search" ui-dropdown-trigger>
        <svg class="ic"><use href="#i-search"/></svg>
        <input type="search" placeholder="Search" autocomplete="off"
          ui-shortcut-slash="() => this.focus()" ui-shortcut-cc-k="() => this.focus()"
          hx-post="fragments/search-results.html" hx-fill hx-target="closest [search-space] [search-results]" hx-swap="innerHTML"
          hx-vals-body="() => ({ filter: this.up('[search-space]').one('[search-reload]').attr('search-active') || 'Recently viewed' })"
          oninput="var w=this.up('[ui-dropdown-space]'); w.attr('search-mode', this.value ? 'query' : 'recent'); if(this.value){ App.Ui.Hx(this,event); } else { w.one('[search-results]').replaceChildren(); }"
          onfocus="App.Ui.Dropdown.Open(this); this.placeholder='Search Jira'"
          onblur="this.placeholder='Search'">
      </label>
      <a hidden search-recent-trigger hx-get="fragments/search-recent.html" hx-target="closest [search-space] [search-recent]" hx-swap="innerHTML"></a>
      <div class="search-panel" ui-dropdown-menu popover="manual" ui-switch-space ui-switch-state="jira">
        <div class="sp-tabs">
          <label class="sp-tab"><input type="radio" name="sp-tab" checked onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'jira')"><span>Jira</span></label>
          <label class="sp-tab"><input type="radio" name="sp-tab" onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'home')"><span>Home</span></label>
        </div>
        <div ui-switch-tag="jira">
          <div class="sp-cols">
            <div class="sp-main">
              <div class="sp-recent" search-recent></div>
              <div class="sp-results" search-results></div>
              <div class="sp-goto"><span class="sp-goto-label">Go to all:</span><a href="#">Boards</a><a href="#">Projects</a><a href="#">Filters</a><a href="#">Plans</a><a href="#">People</a></div>
            </div>
            <div class="sp-side" search-filters>
              <a hidden search-reload search-active="" hx-post="fragments/search-results.html" hx-fill hx-target="closest [search-space] [search-results]" hx-swap="innerHTML" hx-vals-body="() => { const f = this.up('[search-filters]').all('[search-label]').filter(c => c.tagName === 'SELECT' ? c.value : c.checked).map(c => c.tagName === 'SELECT' ? c.value : c.attr('search-label')).join(', '); this.attr('search-active', f); return { filter: f || 'Recently viewed' } }"></a>
              <div class="sp-fhead">Last updated</div>
              <div class="sp-pills">
                <label class="sp-pill"><input type="radio" name="sp-updated" checked onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span>Any time</span></label>
                <label class="sp-pill"><input type="radio" name="sp-updated" search-label="Today" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span>Today</span></label>
                <label class="sp-pill"><input type="radio" name="sp-updated" search-label="Yesterday" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span>Yesterday</span></label>
                <label class="sp-pill"><input type="radio" name="sp-updated" search-label="Past 7 days" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span>Past 7 days</span></label>
                <label class="sp-pill"><input type="radio" name="sp-updated" search-label="Past 30 days" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span>Past 30 days</span></label>
                <label class="sp-pill"><input type="radio" name="sp-updated" search-label="Past year" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span>Past year</span></label>
              </div>
              <div class="sp-fhead">Filter by project</div>
              <label class="sp-check"><input type="checkbox" search-label="My Team" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span class="proj sp-proj">M</span><span class="sp-check-label">My Team</span></label>
              <button type="button" class="sp-more">Show more</button>
              <div class="sp-fhead">Filter by assignee</div>
              <label class="sp-check"><input type="checkbox" search-label="Thomas Anderson" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span class="avatar xs">TA</span><span class="sp-check-label">Thomas Anderson</span></label>
              <button type="button" class="sp-more">Show more</button>
              <div class="sp-fhead">Filter by reporter</div>
              <label class="sp-check"><input type="checkbox" search-label="Reported by me" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span class="sp-check-label">Reported by me</span></label>
              <div class="sp-fhead">Filter by status</div>
              <label class="sp-check"><input type="checkbox" search-label="Open" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span class="sp-check-label">Open</span></label>
              <label class="sp-check"><input type="checkbox" search-label="Done" onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))"><span class="sp-check-label">Done</span></label>
              <div class="sp-fhead">Filter by label</div>
              <select class="sp-select" search-label onchange="App.Ui.Hx(this.up('[search-filters]').one('[search-reload]'))">
                <option value="">Select label</option>
                <option value="backend">backend</option>
                <option value="security">security</option>
                <option value="regression">regression</option>
              </select>
              <button type="button" class="sp-feedback">Give feedback</button>
            </div>
          </div>
          <a class="sp-foot" href="#"><svg class="ic"><use href="#i-search"/></svg><span class="sp-title">View all work items</span><kbd class="sp-kbd">&crarr;</kbd></a>
        </div>
        <div ui-switch-tag="home" class="sp-empty" style="display:none">
          <svg class="ic sp-empty-ic"><use href="#i-search"/></svg>
          <p class="sp-empty-t">We couldn't find anything matching your search.</p>
          <p class="sp-empty-s">Try again with a different term.</p>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" onclick="App.Ui.Modal.Open('create.html', (r) => r && this.nall('ui-toast', r.key + ' created'))" ui-shortcut-c="() => this.click()"><svg class="ic"><use href="#i-plus"/></svg> Create</button>
  </div>
  <div class="topbar-group">
    <button class="btn btn-sm see-plans">See plans</button>
    <div ui-dropdown-space ui-dropdown-onopen="() => { const m = this.one('[ui-dropdown-menu]'); m.attr('hx-get', Number(this.one('[notif-total]').attr('notif-total')) ? 'fragments/notifications-unread.html' : 'fragments/notifications-read.html'); App.Ui.Hx(m); }">
      <button class="icon-btn" title="Notifications" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-bell"/></svg><span class="badge" notif-total="3" notif-count="(n) => { const c = Number(n); this.textContent = c; this.attr('notif-total', c); this.hide(!c); }">3</span></button>
      <div ui-dropdown-menu popover="manual" class="menu menu-end" hx-get="fragments/notifications-unread.html" hx-target="this" hx-swap="innerHTML"><p class="menu-empty">Loading…</p></div>
    </div>
    <div ui-dropdown-space>
      <button class="icon-btn" title="Help" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-help"/></svg></button>
      <div ui-dropdown-menu popover="manual" class="menu menu-end">
        <button class="menu-item">Help center</button>
        <button class="menu-item">Keyboard shortcuts</button>
        <button class="menu-item">What's new</button>
        <div class="menu-sep"></div>
        <button class="menu-item">Contact support</button>
      </div>
    </div>
    <div ui-dropdown-space>
      <button class="icon-btn" title="Settings" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><svg class="ic"><use href="#i-gear"/></svg></button>
      <div ui-dropdown-menu popover="manual" class="menu menu-end menu-settings">
        <button class="menu-item"><svg class="ic"><use href="#i-person"/></svg> Personal settings</button>
        <div class="menu-sep"></div>
        <div class="menu-head">Jira Settings</div>
        <button class="menu-item"><svg class="ic"><use href="#i-gear"/></svg> System</button>
        <button class="menu-item"><svg class="ic"><use href="#i-grid"/></svg> Products</button>
        <button class="menu-item"><svg class="ic"><use href="#i-board"/></svg> Projects</button>
        <button class="menu-item"><svg class="ic"><use href="#i-task"/></svg> Issues</button>
        <button class="menu-item"><svg class="ic"><use href="#i-zap"/></svg> Apps</button>
        <div class="menu-sep"></div>
        <div class="menu-head">Administration</div>
        <button class="menu-item"><svg class="ic"><use href="#i-users"/></svg> User management</button>
        <button class="menu-item"><svg class="ic"><use href="#i-briefcase"/></svg> Billing</button>
      </div>
    </div>
    <div ui-dropdown-space>
      <button class="avatar" title="Account" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">SR</button>
      <div ui-dropdown-menu popover="manual" class="menu menu-end" theme-toggle="() => { const h = document.documentElement; h.flag('theme-dark', !h.flag('theme-dark')); }">
        <div class="menu-profile"><div class="avatar sm">SR</div><div><b>Sam Rivera</b><div class="muted small">sam@example.com</div></div></div>
        <div class="menu-sep"></div>
        <button class="menu-item">Profile</button>
        <button class="menu-item">Account settings</button>
        <button class="menu-item" onclick="this.nall('theme-toggle')"><svg class="ic"><use href="#i-star"/></svg> Theme</button>
        <div class="menu-sep"></div>
        <button class="menu-item">Log out</button>
      </div>
    </div>
  </div>
</header>
