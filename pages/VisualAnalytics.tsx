import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  Breadcrumb,
  Button,
  Dropdown,
  FilterChip,
  AnalyticsCard,
  Accordion,
} from "@partssource/react-kit";
import { PSVerticalBarChart, PSStackedBarChart } from "./components/Charts";
import { PSLineChart } from "./components/LineCharts";
import { PSPieChart } from "./components/PieCharts";
import styles from "./VisualAnalytics.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterState {
  facility: string;
  customer: string;
  dateRange: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const LEFT_NAV_ITEMS = [
  { id: "oneview", label: "OneView", href: "/oneview" },
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "service-orders", label: "Service Orders", href: "/service-orders" },
  { id: "parts-center", label: "Parts Center", href: "/parts-center" },
  { id: "parts-management", label: "Parts Management", href: "/parts-management" },
  { id: "service-operations", label: "Service Operations", href: "/service-operations" },
  { id: "tools", label: "Tools", href: "/tools" },
  { id: "approvals", label: "Approvals", href: "/approvals" },
  { id: "assets", label: "Assets", href: "/assets" },
  { id: "my-lists", label: "My Lists", href: "/my-lists" },
];

const FACILITY_OPTIONS = [
  { label: "All Facilities", value: "all" },
  { label: "Chatham Memorial", value: "chatham" },
  { label: "Riverside Health", value: "riverside" },
  { label: "Valley Medical Center", value: "valley" },
];

const CUSTOMER_OPTIONS = [
  { label: "All Customers", value: "all" },
  { label: "Customer A", value: "a" },
  { label: "Customer B", value: "b" },
];

const DATE_RANGE_OPTIONS = [
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
  { label: "Year to Date", value: "ytd" },
];

// ---------------------------------------------------------------------------
// Sample chart data
// ---------------------------------------------------------------------------

const SPEND_TREND_DATA = [
  { month: 'Jan', spend: 95000 }, { month: 'Feb', spend: 102000 },
  { month: 'Mar', spend: 98000 }, { month: 'Apr', spend: 115000 },
  { month: 'May', spend: 108000 }, { month: 'Jun', spend: 120000 },
];

const PARTS_BREAKDOWN_DATA = [
  { category: 'Q1', OEM: 40000, Aftermarket: 60000 },
  { category: 'Q2', OEM: 45000, Aftermarket: 70000 },
  { category: 'Q3', OEM: 38000, Aftermarket: 65000 },
  { category: 'Q4', OEM: 50000, Aftermarket: 75000 },
];

const OEM_MIX_DATA = [
  { name: 'OEM', value: 22 },
  { name: 'Aftermarket', value: 78 },
];

const UPTIME_TREND_DATA = [
  { month: 'Jan', uptime: 82 }, { month: 'Feb', uptime: 85 },
  { month: 'Mar', uptime: 83 }, { month: 'Apr', uptime: 87 },
  { month: 'May', uptime: 84 }, { month: 'Jun', uptime: 86 },
];

const OVERNIGHT_RATE_DATA = [
  { month: 'Jan', rate: 10 }, { month: 'Feb', rate: 11 },
  { month: 'Mar', rate: 9 },  { month: 'Apr', rate: 13 },
  { month: 'May', rate: 12 }, { month: 'Jun', rate: 10 },
];

// ---------------------------------------------------------------------------
// KPI Section: Service Budget
// ---------------------------------------------------------------------------

function ServiceBudgetSection() {
  return (
    <section className={styles.kpiSection}>
      <h2 className={styles.sectionTitle}>Service Budget</h2>
      <div className={styles.kpiRow}>
        <AnalyticsCard
          title="Contracted Service Spend"
          value="$1.2M"
          layout="wide"
          delta="+5.3%"
          benchmark="vs last month"
        />
        <AnalyticsCard
          title="Missed Savings"
          value="$75K"
          layout="wide"
          delta="-0.1%"
          benchmark="vs last year"
        />
        <AnalyticsCard
          title="OEM Spend Percent"
          value="22%"
          layout="wide"
          delta="-5%"
          benchmark="22% below peer benchmark"
        />
        <AnalyticsCard
          title="Spend to OEM"
          value="$1.5M"
          layout="wide"
          delta="+10%"
          benchmark="-3% below peer benchmark"
        />
      </div>
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <PSVerticalBarChart
            title="Spend: Contracted Service"
            data={SPEND_TREND_DATA}
            bars={[{ dataKey: 'spend', label: 'Spend ($)' }]}
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// KPI Section: Parts Management
// ---------------------------------------------------------------------------

function PartsManagementSection() {
  return (
    <section className={styles.kpiSection}>
      <h2 className={styles.sectionTitle}>Parts Management</h2>
      <div className={styles.kpiRow}>
        <AnalyticsCard
          title="Total Parts Spend"
          value="$1.2M"
          layout="wide"
          delta="+12%"
          benchmark="vs last month"
        />
        <AnalyticsCard
          title="Parts Orders"
          value="84%"
          layout="wide"
          delta="+0.7%"
          benchmark="vs last year"
        />
        <AnalyticsCard
          title="Parts Spend"
          value="$1.5M"
          layout="wide"
          delta="-5%"
          benchmark="15% below peer benchmark"
        />
        <AnalyticsCard
          title="OEM Purchases"
          value="18%"
          layout="wide"
          delta="+10%"
          benchmark="18% below peer benchmark"
        />
      </div>
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <PSStackedBarChart
            title="Parts Spend Breakdown"
            data={PARTS_BREAKDOWN_DATA}
            bars={[{ dataKey: 'OEM', label: 'OEM' }, { dataKey: 'Aftermarket', label: 'Aftermarket' }]}
          />
        </div>
        <div className={styles.chartCard}>
          <PSPieChart title="OEM vs. Aftermarket Mix" data={OEM_MIX_DATA} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// KPI Section: Service Operations / Biomed
// ---------------------------------------------------------------------------

function ServiceOperationsSection() {
  return (
    <section className={styles.kpiSection}>
      <h2 className={styles.sectionTitle}>Service Operations</h2>
      <div className={styles.kpiRow}>
        <AnalyticsCard
          title="Asset Uptime"
          value="84%"
          layout="wide"
          delta="+0.7%"
          benchmark="-.20% below peer benchmark"
        />
        <AnalyticsCard
          title="Quality Return Rate"
          value="0.7%"
          layout="wide"
          delta="-0.1%"
          benchmark="-3% below peer benchmark"
        />
        <AnalyticsCard
          title="Biomed Orders Shipped Overnight"
          value="12%"
          layout="wide"
          delta="+5.3%"
          benchmark="vs last month"
        />
        <AnalyticsCard
          title="Biomed Overnight Shipping Rate"
          value="10%"
          layout="wide"
          delta="+10%"
          benchmark="18% below peer benchmark"
        />
      </div>
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <PSLineChart
            title="Asset Uptime Trend"
            data={UPTIME_TREND_DATA}
            lines={[{ dataKey: 'uptime', label: 'Uptime %' }]}
          />
        </div>
        <div className={styles.chartCard}>
          <PSVerticalBarChart
            title="Biomed Overnight Shipping Rate"
            data={OVERNIGHT_RATE_DATA}
            bars={[{ dataKey: 'rate', label: 'Overnight Rate %' }]}
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Actionable Events / Accordion section
// ---------------------------------------------------------------------------

function ActionableEventsSection() {
  return (
    <section className={styles.actionableSection}>
      <Accordion title="Actionable Events Updates" variant="filled">
        <div className={styles.actionableContent}>
          <p className={styles.actionableText}>
            Review 3 open service orders requiring approval. 2 parts orders are overdue. 1 missed
            savings opportunity detected this week.
          </p>
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </div>
      </Accordion>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

interface FilterBarProps {
  filters: FilterState;
  onFacilityChange: (v: string) => void;
  onCustomerChange: (v: string) => void;
  onDateRangeChange: (v: string) => void;
  onClearAll: () => void;
}

function FilterBar({
  filters,
  onFacilityChange,
  onCustomerChange,
  onDateRangeChange,
  onClearAll,
}: FilterBarProps) {
  const facilityLabel =
    FACILITY_OPTIONS.find((o) => o.value === filters.facility)?.label ?? "All Facilities";
  const customerLabel =
    CUSTOMER_OPTIONS.find((o) => o.value === filters.customer)?.label ?? "All Customers";

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterControls}>
        <Dropdown
          options={FACILITY_OPTIONS}
          value={filters.facility}
          onChange={onFacilityChange}
          label="Facility"
        />
        <Dropdown
          options={CUSTOMER_OPTIONS}
          value={filters.customer}
          onChange={onCustomerChange}
          label="Customer"
        />
        <Dropdown
          options={DATE_RANGE_OPTIONS}
          value={filters.dateRange}
          onChange={onDateRangeChange}
          label="Date Range"
        />
      </div>

      <div className={styles.filterChips}>
        <FilterChip label={`Facility: ${facilityLabel}`} onRemove={() => onFacilityChange("all")} />
        <FilterChip label={`Customer: ${customerLabel}`} onRemove={() => onCustomerChange("all")} />
        <Button variant="tertiary" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
        <Button variant="tertiary" size="sm">
          Save Filter Set
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const VisualAnalytics: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    facility: "all",
    customer: "all",
    dateRange: "30d",
  });

  const handleClearAll = () =>
    setFilters({ facility: "all", customer: "all", dateRange: "30d" });

  return (
    <div className={styles.pageRoot}>
      <TopNav />

      <div className={styles.body}>
        <LeftNav
          userInitials="DM"
          userName="Doug M."
          items={LEFT_NAV_ITEMS}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((c) => !c)}
          onLogout={() => console.log("logout")}
        />

        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <Breadcrumb
              items={[
                { label: "OneView", href: "/oneview" },
                { label: "Visual Analytics" },
              ]}
            />
            <h1 className={styles.pageTitle}>Visual Analytics</h1>
          </div>

          <FilterBar
            filters={filters}
            onFacilityChange={(v) => setFilters((f) => ({ ...f, facility: v }))}
            onCustomerChange={(v) => setFilters((f) => ({ ...f, customer: v }))}
            onDateRangeChange={(v) => setFilters((f) => ({ ...f, dateRange: v }))}
            onClearAll={handleClearAll}
          />

          <div className={styles.content}>
            <ActionableEventsSection />
            <ServiceBudgetSection />
            <PartsManagementSection />
            <ServiceOperationsSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualAnalytics;
