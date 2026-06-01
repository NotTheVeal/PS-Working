import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  StatusBadge,
  Checkbox,
  Toggle,
  Pagination,
} from "@partssource/react-kit";
import styles from "./TablePageView.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ApprovalStatus = "Requoted" | "eQuoted" | "Initiated" | "Pending";

interface ApprovalRow {
  id: string;
  orderNum: string;
  refNum: string;
  itemNum: string;
  description: string;
  requoteReason: string;
  condition: string;
  qty: number;
  facility: string;
  priority: string;
  status: ApprovalStatus;
  created: string;
  inCart: boolean;
  rowType: "normal" | "striped" | "requoted";
}

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const APPROVAL_ROWS: ApprovalRow[] = [
  {
    id: "1",
    orderNum: "5242342",
    refNum: "5242342",
    itemNum: "242342-2",
    description: "Ultrasound Transducer Probe Array",
    requoteReason: "Minimum Order Quantity / Alt Sourced",
    condition: "Recertified",
    qty: 1,
    facility: "Marymount Hospital",
    priority: "Normal",
    status: "Requoted",
    created: "2/22/26",
    inCart: false,
    rowType: "requoted",
  },
  {
    id: "2",
    orderNum: "5242343",
    refNum: "5242343",
    itemNum: "242342-5",
    description: "Patient Monitor Module ECG",
    requoteReason: "-",
    condition: "New OEM",
    qty: 1,
    facility: "Marymount Hospital",
    priority: "Normal",
    status: "eQuoted",
    created: "4/02/26",
    inCart: false,
    rowType: "striped",
  },
  {
    id: "3",
    orderNum: "5242333",
    refNum: "5242333",
    itemNum: "242344-8",
    description: "Chatham Memorial Hospital",
    requoteReason: "242344-8",
    condition: "2000Plus",
    qty: 2,
    facility: "Corrective",
    priority: "Normal",
    status: "Initiated",
    created: "3/15/26",
    inCart: false,
    rowType: "normal",
  },
];

const LEFT_NAV_ITEMS = [
  { id: "orders", label: "Orders", href: "#" },
  { id: "approvals", label: "Approvals", href: "#", active: true },
  { id: "parts-quotes", label: "Parts Quotes", href: "#" },
  { id: "awaiting-po", label: "Awaiting PO", href: "#" },
  { id: "exchanges-returns", label: "Exchanges & Returns", href: "#" },
];

// ---------------------------------------------------------------------------
// Status badge tone helper
// ---------------------------------------------------------------------------

function statusTone(
  status: ApprovalStatus
): "info" | "neutral" | "warning" | "success" | "critical" {
  switch (status) {
    case "Requoted":
      return "info";
    case "eQuoted":
      return "success";
    case "Initiated":
      return "neutral";
    case "Pending":
      return "warning";
    default:
      return "neutral";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TablePageView: React.FC = () => {
  const [onlyMe, setOnlyMe] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === APPROVAL_ROWS.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(APPROVAL_ROWS.map((r) => r.id)));
    }
  };

  return (
    <div className={styles.page}>
      {/* ------------------------------------------------------------------ */}
      {/* Top Navigation                                                       */}
      {/* ------------------------------------------------------------------ */}
      {/* TODO: no react-kit match for the dark sub-banner with page title — approximated with <div> */}
      <TopNav />

      {/* Dark blue page-title banner */}
      <div className={styles.pageBanner}>
        <span className={styles.pageBannerTitle}>Approvals</span>
        <div className={styles.pageBannerRight}>
          <img
            src="https://www.figma.com/api/mcp/asset/710eac62-1fa1-40c5-bf48-41b68475f17d"
            alt="Cleveland Clinic"
            className={styles.pageBannerLogo}
          />
          <span className={styles.pageBannerDivider} />
          <span className={styles.pageBannerPro}>PRO ACCOUNT</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Body layout: LeftNav + main content                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.body}>
        {/* Left Navigation */}
        <LeftNav
          userInitials="DM"
          userName="Doug M."
          items={LEFT_NAV_ITEMS.map((item) => ({
            id: item.id,
            label: item.label,
          }))}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((c) => !c)}
          onLogout={() => {}}
        />

        {/* Main content area */}
        <main className={styles.main}>
          {/* View controls row */}
          <div className={styles.controlsRow}>
            <div className={styles.onlyMeControl}>
              {/* TODO: no react-kit match for labelled toggle inline — approximated with <Toggle> */}
              <Toggle
                checked={onlyMe}
                onChange={() => setOnlyMe((v) => !v)}
                label="Only Me"
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Approvals Table                                                   */}
          {/* ---------------------------------------------------------------- */}
          {/* TODO: no react-kit match for a generic data table — approximated with <table> */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.thCheck}>
                    <Checkbox
                      checked={selectedRows.size === APPROVAL_ROWS.length}
                      onChange={toggleAll}
                      label=""
                    />
                  </th>
                  <th className={styles.th}>Order #</th>
                  <th className={styles.th}>Ref #</th>
                  <th className={styles.th}>Item #</th>
                  <th className={`${styles.th} ${styles.thWide}`}>Description</th>
                  <th className={`${styles.th} ${styles.thWider}`}>Requote Reason</th>
                  <th className={styles.th}>Condition</th>
                  <th className={styles.thNarrow}>Qty</th>
                  <th className={styles.th}>Facility</th>
                  <th className={styles.th}>Priority</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Created</th>
                  <th className={styles.th}>In Cart</th>
                </tr>
              </thead>
              <tbody>
                {APPROVAL_ROWS.map((row) => (
                  <tr
                    key={row.id}
                    className={[
                      styles.dataRow,
                      row.rowType === "requoted" ? styles.rowRequoted : "",
                      row.rowType === "striped" ? styles.rowStriped : "",
                      selectedRows.has(row.id) ? styles.rowSelected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <td className={styles.tdCheck}>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        label=""
                      />
                    </td>
                    <td className={styles.td}>{row.orderNum}</td>
                    <td className={styles.td}>{row.refNum}</td>
                    <td className={styles.td}>{row.itemNum}</td>
                    <td className={styles.td}>{row.description}</td>
                    <td className={styles.td}>{row.requoteReason}</td>
                    <td className={styles.td}>{row.condition}</td>
                    <td className={styles.td}>{row.qty}</td>
                    <td className={styles.td}>{row.facility}</td>
                    <td className={styles.td}>{row.priority}</td>
                    <td className={styles.td}>
                      <StatusBadge tone={statusTone(row.status)} label={row.status} />
                    </td>
                    <td className={styles.td}>{row.created}</td>
                    <td className={styles.td}>{row.inCart ? "Yes" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            <span className={styles.legendLabel}>Legend:</span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.swatchCritical}`} />
              Critical Items
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.swatchMinQty}`} />
              This item has a min. order qty.
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.swatchRequoted}`} />
              This item has been Requoted
            </span>
          </div>

          {/* Pagination */}
          <div className={styles.paginationRow}>
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TablePageView;
