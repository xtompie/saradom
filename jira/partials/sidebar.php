<nav sidebar-nav sidebar-customise="() => { const on = !this.flag('sidebar-editing'); this.flag('sidebar-editing', on); this.one('[customise-label]').textContent = on ? 'Done' : 'Customise sidebar'; }">
    <s-sortable class="nav-list" handle="[nav-grip]" store="sidebar-nav">
      <a class="nav-item" href="#"><svg class="ic"><use href="#i-home"/></svg> For you</a>
      <span sort-item="recent" ui-dropdown-space ui-dropdown-onopen="() => App.Ui.Hx(this.one('[ui-dropdown-menu]'))">
        <button class="nav-item as-btn" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-clock"/></svg> Recent<span nav-chev><svg class="ic xs"><use href="#i-chevron"/></svg></span></button>
        <div ui-dropdown-menu popover="manual" class="menu menu-recent" hx-get="fragments/recent.html" hx-target="this" hx-swap="innerHTML"><p class="menu-empty">Loading…</p></div>
      </span>
      <span sort-item="starred" ui-dropdown-space ui-dropdown-onopen="() => App.Ui.Hx(this.one('[ui-dropdown-menu]'))">
        <button class="nav-item as-btn" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-star"/></svg> Starred<span nav-chev><svg class="ic xs"><use href="#i-chevron"/></svg></span></button>
        <div ui-dropdown-menu popover="manual" class="menu menu-flyout" hx-get="fragments/starred.html" hx-target="this" hx-swap="innerHTML"><p class="menu-empty">Loading…</p></div>
      </span>
      <button class="nav-item as-btn" sort-item="apps"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-grid"/></svg> Apps</button>
      <button class="nav-item as-btn" sort-item="plans"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-plans"/></svg> Plans</button>
      <button class="nav-item as-btn" sort-item="filters"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-filter"/></svg> Filters</button>
      <button class="nav-item as-btn" sort-item="dashboards"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-dashboard"/></svg> Dashboards</button>
      <span sort-item="spaces" ui-dropdown-space ui-dropdown-onopen="() => App.Ui.Hx(this.one('[ui-dropdown-menu]'))">
        <button class="nav-item as-btn" ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)"><span nav-grip><svg class="ic xs"><use href="#i-grip"/></svg></span><svg class="ic"><use href="#i-briefcase"/></svg> Spaces<span nav-chev><svg class="ic xs"><use href="#i-chevron"/></svg></span></button>
        <div ui-dropdown-menu popover="manual" class="menu menu-flyout" hx-get="fragments/spaces.html" hx-target="this" hx-swap="innerHTML"><p class="menu-empty">Loading…</p></div>
      </span>
      <s-init run="(el) => el.restore()"></s-init>
    </s-sortable>

    <div class="nav-foot">
      <a class="nav-item" href="#" target="_blank"><svg class="ic"><use href="#i-users"/></svg> Teams <svg class="ic xs ext"><use href="#i-external"/></svg></a>
      <a class="nav-item" href="#" target="_blank"><svg class="ic"><use href="#i-target"/></svg> Goals <svg class="ic xs ext"><use href="#i-external"/></svg></a>
      <a class="nav-item" href="#" target="_blank"><svg class="ic"><use href="#i-briefcase"/></svg> Projects <svg class="ic xs ext"><use href="#i-external"/></svg></a>
      <button class="nav-item as-btn" onclick="this.nall('sidebar-customise')"><svg class="ic"><use href="#i-gear"/></svg> <span customise-label>Customise sidebar</span></button>
    </div>
  </nav>
