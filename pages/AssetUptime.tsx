/**
 * AssetUptime — Figma node 3273:2248 "Asset Uptime / Performance"
 * Maps to @partssource/react-kit components throughout.
 */
import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  Breadcrumb,
  SegmentedTabs,
  StatusBadge,
  Button,
  ButtonInline,
  Accordion,
  AlertCard,

  Pagination,
  StatusCard,
  Spinner,
  FilterChip,
} from "@partssource/react-kit";
import DataTable, { ColumnDef, badgeCell } from "./components/DataTable";
import { PSGroupedBarChart } from "./components/Charts";
import StatCard from "./components/StatCard";
import styles from "./AssetUptime.module.css";

const DOWNTIME_CHART_DATA = [
  { month: 'Jan', downtime: 20, benchmark: 30, meanTime: 25 },
  { month: 'Feb', downtime: 45, benchmark: 30, meanTime: 35 },
  { month: 'Mar', downtime: 30, benchmark: 30, meanTime: 28 },
  { month: 'Apr', downtime: 60, benchmark: 30, meanTime: 45 },
  { month: 'May', downtime: 80, benchmark: 30, meanTime: 55 },
  { month: 'Jun', downtime: 55, benchmark: 30, meanTime: 40 },
  { month: 'Jul', downtime: 40, benchmark: 30, meanTime: 35 },
  { month: 'Aug', downtime: 70, benchmark: 30, meanTime: 50 },
  { month: 'Sep', downtime: 35, benchmark: 30, meanTime: 30 },
  { month: 'Oct', downtime: 50, benchmark: 30, meanTime: 42 },
  { month: 'Nov', downtime: 65, benchmark: 30, meanTime: 48 },
  { month: 'Dec', downtime: 45, benchmark: 30, meanTime: 38 },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WorkOrder {
  id: string;
  woCreateDate: string;
  woCompletionDate: string;
  orderNum: string;
  woNum: string;
  serviceType: string;
  assignedTo: string;
  downHours: string;
  status: "Closed Complete" | "Closed Cancelled" | "Work in Progress";
}

interface AlertRow {
  id: string;
  timestamp: string;
  severity: "High" | "Medium" | "Low";
  errorDescription: string;
  problemDescription: string;
  recommendations: string;
  occurrence: string;
}

interface OrderHistoryRow {
  id: string;
  referenceNum: string;
  createdDate: string;
  woNum: string;
  customerPO: string;
  part: string;
  partDescription: string;
  vendorName: string;
  status: "Shipped" | "Pending" | "Delivered";
  statusDate: string;
}

// ---------------------------------------------------------------------------
// Static / mock data
// ---------------------------------------------------------------------------

const LEFT_NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "assets", label: "Assets", href: "/assets" },
  { id: "orders", label: "Orders", href: "/orders" },
  { id: "service", label: "Service Requests", href: "/service" },
  { id: "marketplace", label: "Marketplace", href: "/marketplace" },
  { id: "settings", label: "Settings", href: "/settings" },
];

const BREADCRUMB_ITEMS = [
  { label: "Assets", href: "/assets" },
  { label: "Siemens SOMATOM Definition AS" },
];

const SEGMENT_TABS = [
  { id: "asset", label: "Asset" },
  { id: "event", label: "Event" },
  { id: "performance", label: "Performance" },
  { id: "benchmark", label: "Benchmark" },
];

const WORK_ORDERS: WorkOrder[] = [
  {
    id: "1",
    woCreateDate: "06/11/2025 7:32 AM",
    woCompletionDate: "NOT SET",
    orderNum: "PS000224",
    woNum: "CWKD0006414",
    serviceType: "Service Event",
    assignedTo: "W. Smith",
    downHours: "0 Hours",
    status: "Work in Progress",
  },
  {
    id: "2",
    woCreateDate: "05/22/2025 9:00 AM",
    woCompletionDate: "05/29/2025 3:00 PM",
    orderNum: "PS000198",
    woNum: "CWKD0032355",
    serviceType: "Service Event",
    assignedTo: "Bob Tomlin",
    downHours: "0 Hours",
    status: "Closed Complete",
  },
  {
    id: "3",
    woCreateDate: "04/10/2025 11:00 AM",
    woCompletionDate: "04/18/2025 2:00 PM",
    orderNum: "PS000172",
    woNum: "CWKD0032062",
    serviceType: "Preventive Maintenance",
    assignedTo: "A. Johnson",
    downHours: "6 Hours",
    status: "Closed Complete",
  },
  {
    id: "4",
    woCreateDate: "03/05/2025 8:15 AM",
    woCompletionDate: "03/06/2025 4:30 PM",
    orderNum: "PS000145",
    woNum: "CWKD0032280",
    serviceType: "Service Event",
    assignedTo: "R. Patel",
    downHours: "32 Hours",
    status: "Closed Complete",
  },
  {
    id: "5",
    woCreateDate: "02/14/2025 10:00 AM",
    woCompletionDate: "02/14/2025 6:00 PM",
    orderNum: "PS000131",
    woNum: "CWKD0032286",
    serviceType: "Emergency",
    assignedTo: "CT Group",
    downHours: "8 Hours",
    status: "Closed Cancelled",
  },
  {
    id: "6",
    woCreateDate: "01/20/2025 7:00 AM",
    woCompletionDate: "01/22/2025 1:00 PM",
    orderNum: "PS000118",
    woNum: "CWKD0032277",
    serviceType: "Service Event",
    assignedTo: "W. Smith",
    downHours: "54 Hours",
    status: "Closed Complete",
  },
  {
    id: "7",
    woCreateDate: "12/03/2024 9:30 AM",
    woCompletionDate: "12/05/2024 5:00 PM",
    orderNum: "PS000101",
    woNum: "CWKD0032287",
    serviceType: "Preventive Maintenance",
    assignedTo: "Bob Tomlin",
    downHours: "0 Hours",
    status: "Closed Complete",
  },
];

const ALERT_ROWS: AlertRow[] = [
  {
    id: "1",
    timestamp: "01/05/2026 6:58 PM",
    severity: "High",
    errorDescription: "Calibration check failed",
    problemDescription: "Daily calibration failing. Details: Daily calibration.",
    recommendations: "Check for obstructions",
    occurrence: "1",
  },
  {
    id: "2",
    timestamp: "01/04/2026 2:00 PM",
    severity: "Medium",
    errorDescription: "Tape switch is not present",
    problemDescription: "Tape switch not present",
    recommendations: "Please check connections and tape switches",
    occurrence: "1",
  },
  {
    id: "3",
    timestamp: "01/03/2026 9:15 AM",
    severity: "Medium",
    errorDescription: "Tube warmup skipped",
    problemDescription: "SR 272--1767639535 0 1 Mon Jan 5 18:58:55 2026 200110036 4-- D-VCT012",
    recommendations: "Skipping tube warm ups often can result in degraded image quality",
    occurrence: "1-3",
  },
];

const ORDER_HISTORY: OrderHistoryRow[] = [
  {
    id: "1",
    referenceNum: "8585760",
    createdDate: "06/11/2025",
    woNum: "CWKD0006414",
    customerPO: "PO63669601",
    part: "21338303",
    partDescription: "Vertical Motor Controller",
    vendorName: "Multi Diagnostic Imaging",
    status: "Shipped",
    statusDate: "06/12/2025",
  },
  {
    id: "2",
    referenceNum: "8585759",
    createdDate: "06/11/2025",
    woNum: "CWKD0006414",
    customerPO: "N/A",
    part: "LYTRON 506841",
    partDescription: "Cooling Unit Replacement",
    vendorName: "Lytron Inc.",
    status: "Pending",
    statusDate: "N/A",
  },
];

// ---------------------------------------------------------------------------
// Column defs
// ---------------------------------------------------------------------------

const WO_STATUS_TONE: Record<WorkOrder["status"], "success" | "warning" | "neutral"> = {
  "Closed Complete": "success",
  "Closed Cancelled": "neutral",
  "Work in Progress": "warning",
};

const WO_COLUMNS: ColumnDef<WorkOrder>[] = [
  { key: "woCreateDate", header: "WO Create Date" },
  { key: "woCompletionDate", header: "WO Completion Date" },
  { key: "orderNum", header: "Order #" },
  { key: "woNum", header: "WO #" },
  { key: "serviceType", header: "Service Type" },
  { key: "assignedTo", header: "Assigned To" },
  { key: "downHours", header: "Down Hours" },
  {
    key: "status",
    header: "Status",
    render: (v) =>
      badgeCell(v as string, WO_STATUS_TONE[v as WorkOrder["status"]]),
  },
];

const SEVERITY_TONE: Record<AlertRow["severity"], "critical" | "warning" | "info"> = {
  High: "critical",
  Medium: "warning",
  Low: "info",
};

const ALERT_COLUMNS: ColumnDef<AlertRow>[] = [
  { key: "timestamp", header: "Alert Initiation Timestamp" },
  {
    key: "severity",
    header: "Severity",
    render: (v) => badgeCell(v as string, SEVERITY_TONE[v as AlertRow["severity"]]),
  },
  { key: "errorDescription", header: "Error Description" },
  { key: "problemDescription", header: "Problem Description" },
  { key: "recommendations", header: "Recommendation(s)" },
  { key: "occurrence", header: "Occurrence" },
];

const ORDER_STATUS_TONE: Record<OrderHistoryRow["status"], "success" | "warning" | "info"> = {
  Shipped: "success",
  Delivered: "success",
  Pending: "warning",
};

const ORDER_HISTORY_COLUMNS: ColumnDef<OrderHistoryRow>[] = [
  { key: "referenceNum", header: "Reference #" },
  { key: "createdDate", header: "Created Date" },
  { key: "woNum", header: "WO #" },
  { key: "customerPO", header: "Customer PO" },
  { key: "part", header: "Part" },
  { key: "partDescription", header: "Part Description" },
  { key: "vendorName", header: "Vendor Name" },
  {
    key: "status",
    header: "Status",
    render: (v) => badgeCell(v as string, ORDER_STATUS_TONE[v as OrderHistoryRow["status"]]),
  },
  { key: "statusDate", header: "Status Date" },
];

// ---------------------------------------------------------------------------
// Stat card — no react-kit equivalent for this metric tile
// TODO: no react-kit match — approximated with custom div using CSS Modules
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Activity item — maps to AlertCard from react-kit
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const AssetUptime: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("performance");
  const [woPage, setWoPage] = useState(1);
  const [alertPage, setAlertPage] = useState(1);
  const [orderHistoryPage, setOrderHistoryPage] = useState(1);

  return (
    <div className={styles.pageRoot}>
      {/* ── Top navigation ────────────────────────────── */}
      <TopNav />

      <div className={styles.bodyLayout}>
        {/* ── Left navigation ───────────────────────────── */}
        <LeftNav
          userInitials="RV"
          userName="R. Veal"
          items={LEFT_NAV_ITEMS}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((c) => !c)}
          onLogout={() => {}}
        />

        {/* ── Main content ──────────────────────────────── */}
        <main className={styles.mainContent}>
          {/* Breadcrumb + page meta row */}
          <div className={styles.topMetaRow}>
            <Breadcrumb items={BREADCRUMB_ITEMS} />
            <div className={styles.pageMetaRight}>
              <span className={styles.pageLastUpdated}>Page last updated: 11:30am ET</span>
              {/* TODO: no react-kit match for "Refresh" icon link — approximated with ButtonInline */}
              <ButtonInline onClick={() => {}}>Refresh</ButtonInline>
            </div>
          </div>

          {/* ── Segmented tabs ────────────────────────────── */}
          <SegmentedTabs
            items={SEGMENT_TABS}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          {/* ── Asset header strip ────────────────────────── */}
          <div className={styles.assetHeader}>
            <div className={styles.assetHeaderLeft}>
              {/* Status pill */}
              <div className={styles.statusRow}>
                {/* TODO: no react-kit match for inline colored dot — approximated with StatusBadge */}
                <StatusBadge tone="success">Operational</StatusBadge>
                <span className={styles.elapsedLabel}>Elapsed Time Since Operational</span>
              </div>

              <div className={styles.assetInfo}>
                {/* Device logo placeholder */}
                {/* TODO: no react-kit match for brand logo image — approximated with ImageBlock text fallback */}
                <div className={styles.assetLogoPlaceholder} aria-label="Siemens logo" />
                <div className={styles.assetNameBlock}>
                  <span className={styles.assetManufacturer}>Siemens Medical Solutions</span>
                  <span className={styles.assetModel}>SOMATOM Definition AS</span>
                </div>
              </div>
            </div>

            {/* Asset status bar */}
            <div className={styles.assetStatusBar}>
              {/* Currently operational — no active down event shown */}
            </div>
          </div>

          {/* ── Total Asset Downtime section ──────────────── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Total Asset Downtime</h2>
              <ButtonInline onClick={() => {}}>View Fleet Analytics</ButtonInline>
            </div>

            {/* Stat cards */}
            <div className={styles.statRow}>
              <StatCard value="100" unit="Hours" label="Avg cumulative downtime per asset" delta="5.2% vs last month" trend="up" />
              <div className={styles.statDivider} />
              <StatCard value="$400,000" label="Downtime Costs" delta="20th percentile" trend="up" />
              <div className={styles.statDivider} />
              <StatCard value="$1,000" label="Avg Downtime Cost per Hour" delta="15% vs last month" trend="down" />
            </div>

            {/* Mean time callout */}
            <div className={styles.meanTimeRow}>
              <div className={styles.meanTimeCard}>
                <span className={styles.meanTimeValue}>120</span>
                <span className={styles.meanTimeUnit}>Days</span>
                <span className={styles.meanTimeLabel}>Mean Time Between Failure</span>
              </div>
              <div className={styles.meanTimeCard}>
                <span className={styles.meanTimeValue}>150</span>
                <span className={styles.meanTimeUnit}>Days</span>
                <span className={styles.meanTimeLabel}>Mean Time to Repair</span>
              </div>
            </div>
          </section>

          {/* ── Downtime Trends ───────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Downtime Trends</h2>
            <PSGroupedBarChart
              title=""
              data={DOWNTIME_CHART_DATA}
              bars={[
                { dataKey: 'downtime', label: 'System Downtime' },
                { dataKey: 'benchmark', label: 'Benchmark' },
                { dataKey: 'meanTime', label: 'Mean Time' },
              ]}
            />
          </section>

          {/* ── Activity Drawer (accordion) ───────────────── */}
          <Accordion title="Activity" variant="filled">
            <div className={styles.activityList}>
              {/* Alert card 1 — part order recommended */}
              <AlertCard
                title="Recommended Part"
                description="Strategic stocking of select components will aid in repair resolution times. Recommend the following part #'s: 230-456-09 and 45-907-53"
                severity="info"
                timestamp="June 11, 2025 – 09:07am"
                location="ER #1"
              />

              {/* Alert card 2 — part order approved */}
              <AlertCard
                title="Part Order Approved"
                description="Part ordered: Vertical Motor Controller — Shipping from Locker ETA: 6/11/2025 2:30pm"
                severity="success"
                timestamp="June 11, 2025 – 09:07am"
                location="ER #1"
              />

              {/* Alert card 3 — WO generated */}
              <AlertCard
                title="New WO Generated"
                description="Equipment Status: Hard Down | Assigned: CT Group | Elapsed Down Time: 00d 00h 02m | Est. Clinical Availability: TBD — CWKD0006414"
                severity="warning"
                timestamp="June 11, 2025 – 07:32am"
                location="ER #1"
              />
            </div>
          </Accordion>

          {/* ── Telemetry — Glassbeam Device Signal ──────── */}
          <Accordion title="Telemetry — Glassbeam Device Signal" variant="row">
            {/* TODO: no react-kit match for embedded telemetry screenshot — approximated with placeholder */}
            <div className={styles.telemetryPlaceholder}>
              <Spinner />
              <span className={styles.telemetryLabel}>Loading Glassbeam telemetry…</span>
            </div>
          </Accordion>

          {/* ── Remote Monitoring Activity (search alerts) ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Remote Monitoring Activity</h2>
              {/* TODO: no react-kit match for inline search input in header — approximated with FilterChip */}
              <FilterChip label="Search Alerts" onRemove={() => {}} />
            </div>
            <DataTable columns={ALERT_COLUMNS} rows={ALERT_ROWS} rowKey="id" />
            <div className={styles.tableFooter}>
              <span className={styles.rowCount}>1-3 of 3</span>
              <Pagination
                currentPage={alertPage}
                totalPages={1}
                onPageChange={setAlertPage}
              />
            </div>
          </section>

          {/* ── Work Orders ───────────────────────────────── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Work Orders</h2>
              <div className={styles.woFilters}>
                <FilterChip label="CT Scanner" onRemove={() => {}} />
                <FilterChip label="Magnetom Aero" onRemove={() => {}} />
              </div>
            </div>
            <DataTable columns={WO_COLUMNS} rows={WORK_ORDERS} rowKey="id" />
            <div className={styles.tableFooter}>
              <span className={styles.rowCount}>1-7 of 7</span>
              <Pagination
                currentPage={woPage}
                totalPages={1}
                onPageChange={setWoPage}
              />
            </div>
          </section>

          {/* ── Order History (parts / service events) ────── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Order History</h2>
            </div>
            <DataTable columns={ORDER_HISTORY_COLUMNS} rows={ORDER_HISTORY} rowKey="id" />
            <div className={styles.tableFooter}>
              <span className={styles.rowCount}>1-2 of 2</span>
              <Pagination
                currentPage={orderHistoryPage}
                totalPages={1}
                onPageChange={setOrderHistoryPage}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AssetUptime;
