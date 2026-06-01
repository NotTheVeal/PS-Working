import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  Breadcrumb,
  Button,
  Input,
  StatusBadge,
  Pagination,
  FilterShell,
  FilterChip,
} from "@partssource/react-kit";
import styles from "./MyDashboard.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrderStatus = "Ordered" | "Backordered";

interface PartsEvent {
  id: string;
  facility: string;
  wo: string;
  ref: string;
  po: string;
  qty: number;
  price: string;
  status: OrderStatus;
  orderNum: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const MOCK_PARTS_EVENTS: PartsEvent[] = [
  { id: "1", facility: "Chatham Memorial", wo: "CW 34343", ref: "8888808", po: "009", qty: 788, price: "$222.42", status: "Ordered", orderNum: "769799" },
  { id: "2", facility: "Chatham Memorial", wo: "WW342342", ref: "4343434", po: "008", qty: 777, price: "$600.35", status: "Ordered", orderNum: "665677" },
  { id: "3", facility: "Chatham Memorial", wo: "343E", ref: "4444534", po: "889", qty: 657, price: "$365.00", status: "Ordered", orderNum: "234433" },
  { id: "4", facility: "Chatham Memorial", wo: "-", ref: "6699322", po: "009877", qty: 788, price: "$400.00", status: "Ordered", orderNum: "234454" },
  { id: "5", facility: "Chatham Memorial", wo: "343243", ref: "3423423", po: "009", qty: 657, price: "$1,300.00", status: "Backordered", orderNum: "333533" },
  { id: "6", facility: "Chatham Memorial", wo: "-", ref: "9932922", po: "009877", qty: 788, price: "$800.00", status: "Ordered", orderNum: "009877" },
  { id: "7", facility: "Chatham Memorial", wo: "99899", ref: "666343", po: "008", qty: 777, price: "$550.25", status: "Ordered", orderNum: "677800" },
];

const LEFT_NAV_ITEMS = [
  { id: "dashboard", label: "My Dashboard", href: "/dashboard" },
  { id: "orders", label: "Orders", href: "/orders" },
  { id: "parts-events", label: "Parts Events", href: "/parts-events" },
  { id: "analytics", label: "Analytics", href: "/analytics" },
  { id: "service-requests", label: "Service Requests", href: "/service-requests" },
  { id: "settings", label: "Settings", href: "/settings" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** View toggle — grid icon vs chart icon (no react-kit match, approximated with Button) */
// TODO: no react-kit match — approximated with <Button variant="secondary" size="sm">
function ViewToggle({
  activeView,
  onToggle,
}: {
  activeView: "grid" | "chart";
  onToggle: (v: "grid" | "chart") => void;
}) {
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.viewToggleBtn} ${activeView === "grid" ? styles.viewToggleBtnActive : ""}`}
        onClick={() => onToggle("grid")}
        aria-label="Grid view"
        type="button"
      >
        {/* grid icon approximated with unicode */}
        &#8862;
      </button>
      <button
        className={`${styles.viewToggleBtn} ${activeView === "chart" ? styles.viewToggleBtnActive : ""}`}
        onClick={() => onToggle("chart")}
        aria-label="Chart view"
        type="button"
      >
        {/* bar-chart icon approximated with unicode */}
        &#9638;
      </button>
    </div>
  );
}

/** Parts / Service pill toggle — approximated with two plain buttons */
// TODO: no react-kit match for inline pill toggle — approximated with styled <button>
function PartsServiceToggle({
  active,
  onChange,
}: {
  active: "parts" | "service";
  onChange: (v: "parts" | "service") => void;
}) {
  return (
    <div className={styles.pillToggle}>
      <button
        type="button"
        className={`${styles.pillToggleBtn} ${active === "parts" ? styles.pillToggleBtnActive : ""}`}
        onClick={() => onChange("parts")}
      >
        Parts
      </button>
      <button
        type="button"
        className={`${styles.pillToggleBtn} ${active === "service" ? styles.pillToggleInactive : ""}`}
        onClick={() => onChange("service")}
      >
        Service
      </button>
    </div>
  );
}

/** Status column cell */
function StatusCell({ status }: { status: OrderStatus }) {
  const tone = status === "Backordered" ? "warning" : "success";
  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}

/** Parts Events data table */
// TODO: no react-kit DataTable match — approximated with native <table> inside a wrapper div
function PartsEventsTable({ rows }: { rows: PartsEvent[] }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Facility</th>
            <th className={styles.th}>WO</th>
            <th className={styles.th}>Ref #</th>
            <th className={styles.th}>PO #</th>
            <th className={styles.th}>Qty</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Order #</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} className={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
              <td className={styles.td}>{row.facility}</td>
              <td className={styles.td}>{row.wo}</td>
              <td className={styles.td}>{row.ref}</td>
              <td className={styles.td}>{row.po}</td>
              <td className={styles.td}>{row.qty}</td>
              <td className={styles.td}>{row.price}</td>
              <td className={styles.td}>
                <StatusCell status={row.status} />
              </td>
              <td className={styles.td}>{row.orderNum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Parts Events Card (the draggable widget)
// ---------------------------------------------------------------------------

function PartsEventsCard() {
  const [view, setView] = useState<"grid" | "chart">("grid");
  const [dataType, setDataType] = useState<"parts" | "service">("parts");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Facility: Chatham Memorial"]);

  const filteredRows = MOCK_PARTS_EVENTS.filter((r) =>
    searchValue
      ? r.facility.toLowerCase().includes(searchValue.toLowerCase()) ||
        r.wo.toLowerCase().includes(searchValue.toLowerCase()) ||
        r.orderNum.toLowerCase().includes(searchValue.toLowerCase())
      : true
  );

  return (
    <section className={styles.partsEventsCard}>
      {/* Card header row */}
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleGroup}>
          {/* Drag handle — no react-kit match */}
          {/* TODO: no react-kit match for drag handle — approximated with a styled span */}
          <span className={styles.dragHandle} aria-hidden>
            &#8801;
          </span>
          <h2 className={styles.cardTitle}>Parts Events</h2>
        </div>

        <div className={styles.cardHeaderActions}>
          {/* Download / export icon — no react-kit match */}
          {/* TODO: no react-kit match for icon-only download action — approximated with Button tertiary */}
          <Button variant="tertiary" size="sm" onClick={() => {}}>
            ↓ Export
          </Button>

          <ViewToggle activeView={view} onToggle={setView} />
          <PartsServiceToggle active={dataType} onChange={setDataType} />
        </div>
      </div>

      {/* Filter / search row */}
      <div className={styles.filterRow}>
        <FilterShell
          chips={activeFilters.map((label) => ({ label, removable: true, onRemove: () => setActiveFilters((f) => f.filter((x) => x !== label)) }))}
          onAddClick={() => {}}
        />
        <div className={styles.searchWrapper}>
          <Input
            label="Search"
            size="md"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            helperText=""
          />
        </div>
        <Button variant="secondary" size="sm" onClick={() => { setSearchValue(""); setActiveFilters([]); }}>
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <PartsEventsTable rows={filteredRows} />

      {/* Pagination */}
      <div className={styles.paginationRow}>
        <Pagination
          page={page}
          totalPages={Math.ceil(MOCK_PARTS_EVENTS.length / 7)}
          total={MOCK_PARTS_EVENTS.length}
          pageSize={7}
          pageSizeOptions={[7, 15, 25]}
          onPageChange={setPage}
          onPageSizeChange={() => {}}
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const MyDashboard: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <div className={styles.pageRoot}>
      {/* Top navigation */}
      <TopNav
        logoSrc="/assets/partssource-logo.svg"
        searchPlaceholder="Search parts, orders, equipment..."
        cartCount={3}
        facilityLabel="Facility"
        facilityName="Chatham Memorial"
        heroTitle="My Dashboard"
        onSearch={() => {}}
        onCartClick={() => {}}
        onHomeClick={() => {}}
      />

      <div className={styles.bodyLayout}>
        {/* Left navigation */}
        <LeftNav
          userInitials="RV"
          userName="R. Veal"
          items={LEFT_NAV_ITEMS}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((c) => !c)}
          onLogout={() => {}}
        />

        {/* Main content area */}
        <main className={styles.mainContent}>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "My Dashboard" },
            ]}
          />

          {/* Page heading */}
          <header className={styles.pageHeading}>
            <h1 className={styles.pageTitle}>My Dashboard</h1>
          </header>

          {/* Dashboard widgets grid */}
          <div className={styles.widgetsGrid}>
            <PartsEventsCard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyDashboard;
