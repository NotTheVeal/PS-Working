import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  Toggle,
  StatusBadge,
  Dropdown,
} from "@partssource/react-kit";
import DataTable, { ColumnDef } from "./components/DataTable";
import PillToggle from "./components/PillToggle";
import StatCard from "./components/StatCard";
import styles from "./CommandCenter.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrderRowStatus = "Ordered" | "Backordered" | "Shipped" | "Delivered";
type RepairStatus = "Initiated" | "In Progress" | "Shipped Inbound" | "Delivered";
type ExchangeReturnStatus = "Returns Due Soon" | "Returns Past Due" | "Exchanges Due Soon" | "Exchanges Past Due";

interface OpenOrder {
  id: string;
  facility: string;
  wo: string;
  ref: string;
  po: string;
  qty: number;
  price: string;
  status: OrderRowStatus;
  orderNum: string;
}

interface QuoteRow {
  id: string;
  facility: string;
  ref: string;
  modality: string;
  created: string;
  status: string;
  expires: string;
}

interface RepairRow {
  id: string;
  facility: string;
  workOrder: string;
  device: string;
  submitted: string;
  status: RepairStatus;
}

interface ExchangeReturnRow {
  id: string;
  facility: string;
  type: string;
  ref: string;
  due: string;
  status: ExchangeReturnStatus;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const LEFT_NAV_ITEMS = [
  { id: "dashboard", label: "My Dashboard", href: "/dashboard" },
  { id: "command-center", label: "Command Center", href: "/command-center" },
  { id: "orders", label: "Orders", href: "/orders" },
  { id: "parts-events", label: "Parts Events", href: "/parts-events" },
  { id: "quotes", label: "Quotes", href: "/quotes" },
  { id: "repairs", label: "Repairs", href: "/repairs" },
  { id: "analytics", label: "Analytics", href: "/analytics" },
  { id: "service-requests", label: "Service Requests", href: "/service-requests" },
];

const OPEN_ORDERS: OpenOrder[] = [
  { id: "1", facility: "Marymount Hospital", wo: "CW 34343", ref: "8888808", po: "009", qty: 1, price: "$222.42", status: "Ordered", orderNum: "769799" },
  { id: "2", facility: "Marymount Hospital", wo: "WW342342", ref: "4343434", po: "008", qty: 2, price: "$600.35", status: "Shipped", orderNum: "665677" },
  { id: "3", facility: "Marymount Hospital", wo: "343E", ref: "4444534", po: "889", qty: 1, price: "$365.00", status: "Ordered", orderNum: "234433" },
  { id: "4", facility: "Marymount Hospital", wo: "-", ref: "6699322", po: "009877", qty: 3, price: "$400.00", status: "Delivered", orderNum: "234454" },
  { id: "5", facility: "Marymount Hospital", wo: "343243", ref: "3423423", po: "009", qty: 1, price: "$1,300.00", status: "Backordered", orderNum: "333533" },
];

const QUOTES: QuoteRow[] = [
  { id: "1", facility: "Marymount Hospital", ref: "Q-00234", modality: "CT", created: "06/08/2024", status: "New", expires: "06/22/2024" },
  { id: "2", facility: "Marymount Hospital", ref: "Q-00235", modality: "MRI", created: "06/09/2024", status: "Awaiting Quote", expires: "06/23/2024" },
];

const REPAIRS: RepairRow[] = [
  { id: "1", facility: "Marymount Hospital", workOrder: "WO-9881", device: "GE CT Scanner", submitted: "06/01/2024", status: "Initiated" },
  { id: "2", facility: "Marymount Hospital", workOrder: "WO-9882", device: "Philips MRI", submitted: "06/03/2024", status: "Initiated" },
  { id: "3", facility: "Marymount Hospital", workOrder: "WO-9876", device: "Siemens X-Ray", submitted: "05/28/2024", status: "In Progress" },
  { id: "4", facility: "Marymount Hospital", workOrder: "WO-9870", device: "Hologic Mammo", submitted: "05/25/2024", status: "Shipped Inbound" },
];

const EXCHANGES_RETURNS: ExchangeReturnRow[] = [
  { id: "1", facility: "Marymount Hospital", type: "Return", ref: "ER-00112", due: "06/13/2024", status: "Returns Due Soon" },
  { id: "2", facility: "Marymount Hospital", type: "Return", ref: "ER-00108", due: "06/09/2024", status: "Returns Past Due" },
  { id: "3", facility: "Marymount Hospital", type: "Exchange", ref: "ER-00101", due: "05/30/2024", status: "Exchanges Past Due" },
  { id: "4", facility: "Marymount Hospital", type: "Exchange", ref: "ER-00098", due: "05/28/2024", status: "Exchanges Past Due" },
];

const CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Parts", value: "parts" },
  { label: "Service", value: "service" },
];

const MODALITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "CT", value: "ct" },
  { label: "MRI", value: "mri" },
  { label: "X-Ray", value: "xray" },
];

const FACILITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Marymount Hospital", value: "marymount" },
];

const REQUESTER_OPTIONS = [
  { label: "All", value: "all" },
];

// ---------------------------------------------------------------------------
// Operational Activity data
// ---------------------------------------------------------------------------

const OPERATIONAL_ACTIVITY = {
  quotes: { total: 4, rows: [{ label: "New", value: 2 }, { label: "Expiring", value: 0, neutral: true }, { label: "Awaiting Quote", value: 0, neutral: true }, { label: "Critical Hard Down", value: 2, critical: true }] },
  openOrders: { total: 68, rows: [{ label: "Ordered", value: 52 }, { label: "Shipped", value: 14 }, { label: "Delivered", value: 2 }, { label: "Critical Hard Down", value: 0, critical: true }] },
  exchangesReturns: { total: 4, rows: [{ label: "Returns Due Soon", value: 1 }, { label: "Returns Past Due", value: 1, critical: true }, { label: "Exchanges Due Soon", value: 0, neutral: true }, { label: "Exchanges Past Due", value: 3, critical: true }] },
  repairs: { total: 4, rows: [{ label: "Initiated", value: 4 }, { label: "In Progress", value: 0, neutral: true }, { label: "Shipped Inbound", value: 0, neutral: true }, { label: "Delivered", value: 0, neutral: true }] },
};

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const ORDER_COLUMNS: ColumnDef<OpenOrder>[] = [
  { key: "facility", header: "Facility" },
  { key: "wo", header: "WO" },
  { key: "ref", header: "Ref #" },
  { key: "po", header: "PO #" },
  { key: "qty", header: "Qty" },
  { key: "price", header: "Price" },
  {
    key: "status",
    header: "Status",
    render: (val) => {
      const tone = val === "Backordered" ? "warning" : val === "Shipped" ? "info" : val === "Delivered" ? "success" : "neutral";
      return <StatusBadge tone={tone}>{String(val)}</StatusBadge>;
    },
  },
  { key: "orderNum", header: "Order #" },
];

const QUOTE_COLUMNS: ColumnDef<QuoteRow>[] = [
  { key: "facility", header: "Facility" },
  { key: "ref", header: "Quote #" },
  { key: "modality", header: "Modality" },
  { key: "created", header: "Created" },
  {
    key: "status",
    header: "Status",
    render: (val) => {
      const tone = val === "New" ? "info" : "neutral";
      return <StatusBadge tone={tone}>{String(val)}</StatusBadge>;
    },
  },
  { key: "expires", header: "Expires" },
];

const REPAIR_COLUMNS: ColumnDef<RepairRow>[] = [
  { key: "facility", header: "Facility" },
  { key: "workOrder", header: "Work Order" },
  { key: "device", header: "Device" },
  { key: "submitted", header: "Submitted" },
  {
    key: "status",
    header: "Status",
    render: (val) => {
      const tone = val === "Shipped Inbound" ? "info" : val === "In Progress" ? "warning" : "neutral";
      return <StatusBadge tone={tone}>{String(val)}</StatusBadge>;
    },
  },
];

const EXCHANGE_COLUMNS: ColumnDef<ExchangeReturnRow>[] = [
  { key: "facility", header: "Facility" },
  { key: "type", header: "Type" },
  { key: "ref", header: "Ref #" },
  { key: "due", header: "Due Date" },
  {
    key: "status",
    header: "Status",
    render: (val) => {
      const tone = String(val).includes("Past Due") ? "critical" : "warning";
      return <StatusBadge tone={tone}>{String(val)}</StatusBadge>;
    },
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const PERIOD_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: '5day' as const, label: '5 Day' },
];

function PeriodToggle({
  active,
  onChange,
}: {
  active: 'all' | '5day';
  onChange: (v: 'all' | '5day') => void;
}) {
  return (
    <PillToggle options={PERIOD_OPTIONS} value={active} onChange={onChange} />
  );
}

/** Operational activity column — header + sub-rows */
function ActivityStack({
  title,
  total,
  rows,
}: {
  title: string;
  total: number;
  rows: { label: string; value: number; neutral?: boolean; critical?: boolean }[];
}) {
  return (
    <div className={styles.activityStack}>
      <div className={styles.activityRowHeader}>
        <span>{title}</span>
        <span>{total}</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className={styles.activityRow}>
          <span>{row.label}</span>
          <span
            className={
              row.critical
                ? styles.activityValueCritical
                : row.neutral
                ? styles.activityValueNeutral
                : styles.activityValueNormal
            }
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Order-detail section card */
function OrderTableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.orderTableCard}>
      <div className={styles.orderTableHeader}>
        <h3 className={styles.orderTableTitle}>{title}</h3>
        {/* TODO: no react-kit match for inline "View All" text link — approximated with <button> */}
        <button type="button" className={styles.orderTableViewAll}>
          View All
        </button>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

const CommandCenter: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<"all" | "5day">("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [category, setCategory] = useState("all");
  const [modality, setModality] = useState("all");
  const [facility, setFacility] = useState("all");
  const [requester, setRequester] = useState("all");

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.pageRoot}>
      {/* Top navigation */}
      <TopNav />

      <div className={styles.bodyLayout}>
        {/* Left navigation */}
        <LeftNav
          userInitials="MH"
          userName="Marymount Hospital"
          items={LEFT_NAV_ITEMS}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((c) => !c)}
          onLogout={() => {}}
        />

        {/* Main scrollable content */}
        <main className={styles.mainContent}>
          {/* ── Sticky filter bar ────────────────────────────── */}
          <div className={styles.stickyBar}>
            {/* Pro badge — no react-kit StatusBadge "brand" variant — approximated with styled span */}
            {/* TODO: no react-kit match for "Pro" branded pill — approximated with <span> */}
            <span className={styles.proBadge}>Pro</span>

            <div className={styles.filterItems}>
              {/* Category filter */}
              <div className={styles.filterItem}>
                {/* TODO: no react-kit match for inline label+value filter item — approximated with Dropdown */}
                <Dropdown
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={(v) => setCategory(String(v))}
                  label="Category"
                />
              </div>

              {/* Modality filter */}
              <div className={styles.filterItem}>
                <Dropdown
                  options={MODALITY_OPTIONS}
                  value={modality}
                  onChange={(v) => setModality(String(v))}
                  label="Modality"
                />
              </div>

              {/* Facility filter */}
              <div className={styles.filterItem}>
                <Dropdown
                  options={FACILITY_OPTIONS}
                  value={facility}
                  onChange={(v) => setFacility(String(v))}
                  label="Facility"
                />
              </div>

              {/* Requester filter */}
              <div className={styles.filterItem}>
                <Dropdown
                  options={REQUESTER_OPTIONS}
                  value={requester}
                  onChange={(v) => setRequester(String(v))}
                  label="Requester"
                />
              </div>

              <button
                type="button"
                className={styles.filterClear}
                onClick={() => {
                  setCategory("all");
                  setModality("all");
                  setFacility("all");
                  setRequester("all");
                }}
              >
                Clear all filters
              </button>
            </div>

            <div className={styles.stickyBarRight}>
              {/* Auto Refresh toggle */}
              <div className={styles.autoRefreshToggle}>
                <Toggle
                  checked={autoRefresh}
                  onChange={(checked) => setAutoRefresh(checked)}
                  label="Auto Refresh"
                />
              </div>
            </div>
          </div>

          {/* ── Content area ──────────────────────────────────── */}
          <div className={styles.contentArea}>
            {/* Section header: date + date picker */}
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionDate}>{today}</h1>
              {/* TODO: no react-kit match for standalone date-picker input — approximated with Dropdown */}
              <Dropdown
                options={[{ label: today, value: "today" }]}
                value="today"
                onChange={() => {}}
                label="Date"
              />
            </div>

            {/* ── KPI cards ──────────────────────────────────── */}
            <div className={styles.kpiRow}>
              <StatCard label="Parts" value={9} />
              <StatCard label="Service Requests" value={3} />
              <StatCard label="Quotes" value={4} />
              <StatCard label="Total Spend (YTD)" value="$14,320" />
            </div>

            {/* ── Operational Activity ───────────────────────── */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Operational Activity</h2>
                <PeriodToggle active={periodFilter} onChange={setPeriodFilter} />
              </div>
              <div className={styles.activityColumns}>
                <ActivityStack
                  title="Quotes"
                  total={OPERATIONAL_ACTIVITY.quotes.total}
                  rows={OPERATIONAL_ACTIVITY.quotes.rows}
                />
                <ActivityStack
                  title="Open Orders"
                  total={OPERATIONAL_ACTIVITY.openOrders.total}
                  rows={OPERATIONAL_ACTIVITY.openOrders.rows}
                />
                <ActivityStack
                  title="Exchanges & Returns"
                  total={OPERATIONAL_ACTIVITY.exchangesReturns.total}
                  rows={OPERATIONAL_ACTIVITY.exchangesReturns.rows}
                />
                <ActivityStack
                  title="Repairs"
                  total={OPERATIONAL_ACTIVITY.repairs.total}
                  rows={OPERATIONAL_ACTIVITY.repairs.rows}
                />
              </div>
            </div>

            {/* ── Open Orders table ──────────────────────────── */}
            <OrderTableCard title="Open Orders">
              <DataTable<OpenOrder>
                columns={ORDER_COLUMNS}
                rows={OPEN_ORDERS}
                rowKey="id"
              />
            </OrderTableCard>

            {/* ── Quotes & Repairs side-by-side ─────────────── */}
            <div className={styles.orderTablesRow}>
              <OrderTableCard title="Quotes">
                <DataTable<QuoteRow>
                  columns={QUOTE_COLUMNS}
                  rows={QUOTES}
                  rowKey="id"
                />
              </OrderTableCard>

              <OrderTableCard title="Repairs">
                <DataTable<RepairRow>
                  columns={REPAIR_COLUMNS}
                  rows={REPAIRS}
                  rowKey="id"
                />
              </OrderTableCard>
            </div>

            {/* ── Exchanges & Returns table ──────────────────── */}
            <OrderTableCard title="Exchanges & Returns">
              <DataTable<ExchangeReturnRow>
                columns={EXCHANGE_COLUMNS}
                rows={EXCHANGES_RETURNS}
                rowKey="id"
              />
            </OrderTableCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommandCenter;
