const navItems = ["Overview", "Data model", "Insights"];

type SidebarProps = {
  activePage: string;
  onPageChange: (page: string) => void;
};

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">↗</div>
        <div>
          <strong>Signal Room</strong>
          <span>BI portfolio / 01</span>
        </div>
      </div>
      <p className="sidebar-label">Workspace</p>
      <nav>
        {navItems.map((item) => (
          <button
            className={activePage === item ? "nav-item active" : "nav-item"}
            key={item}
            onClick={() => onPageChange(item)}
          >
            <span className="nav-icon">{item === "Overview" ? "◒" : item === "Data model" ? "◇" : "✦"}</span>
            {item}
          </button>
        ))}
      </nav>
      <div className="sidebar-status">
        <p className="sidebar-label">Project status</p>
        <div className="status-box">
          <span className="status-dot" /> <strong>Prototype ready</strong>
          <small>Source data pending<br />Model documented</small>
        </div>
      </div>
    </aside>
  );
}