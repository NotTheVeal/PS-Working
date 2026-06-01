import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  Breadcrumb,
  Button,
  Input,
  Dropdown,
  StatusBadge,
  ListTypeBadge,
  Toggle,
  PillTabs,
  Modal,
  FilterChip,
  FilterShell,
  Pagination,
  ListCard,
  Avatar,
  Tooltip,
} from "@partssource/react-kit";
import styles from "./MyLists.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ListType = "shopping" | "preventative" | "restocking";
type PrivacySetting = "My Facility" | "Just Me" | "Organization";

interface MyList {
  id: string;
  name: string;
  listType: ListType;
  itemCount: number;
  followers: number;
  privacy: PrivacySetting;
  updatedAt: string;
  owner: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const MOCK_LISTS: MyList[] = [
  {
    id: "1",
    name: "Repair Room Storage",
    listType: "shopping",
    itemCount: 14,
    followers: 28,
    privacy: "My Facility",
    updatedAt: "May 28, 2026",
    owner: "R. Veal",
  },
  {
    id: "2",
    name: "ICU Preventive Maintenance",
    listType: "preventative",
    itemCount: 7,
    followers: 12,
    privacy: "Just Me",
    updatedAt: "May 22, 2026",
    owner: "R. Veal",
  },
  {
    id: "3",
    name: "My Favorites",
    listType: "shopping",
    itemCount: 32,
    followers: 5,
    privacy: "Organization",
    updatedAt: "May 15, 2026",
    owner: "R. Veal",
  },
  {
    id: "4",
    name: "Radiology Restocking Q2",
    listType: "restocking",
    itemCount: 19,
    followers: 8,
    privacy: "My Facility",
    updatedAt: "Apr 30, 2026",
    owner: "M. Torres",
  },
  {
    id: "5",
    name: "OR Supplies Bundle",
    listType: "shopping",
    itemCount: 23,
    followers: 41,
    privacy: "Organization",
    updatedAt: "Apr 12, 2026",
    owner: "S. Kim",
  },
  {
    id: "6",
    name: "Maintenance Parts Bundle",
    listType: "preventative",
    itemCount: 10,
    followers: 3,
    privacy: "My Facility",
    updatedAt: "Mar 28, 2026",
    owner: "R. Veal",
  },
  {
    id: "7",
    name: "Lab Equipment Q3",
    listType: "restocking",
    itemCount: 6,
    followers: 0,
    privacy: "Just Me",
    updatedAt: "Mar 14, 2026",
    owner: "R. Veal",
  },
  {
    id: "8",
    name: "Cardiology Consumables",
    listType: "shopping",
    itemCount: 11,
    followers: 15,
    privacy: "Organization",
    updatedAt: "Feb 20, 2026",
    owner: "A. Patel",
  },
];

const LEFT_NAV_ITEMS = [
  { id: "home", label: "Home", href: "/home" },
  { id: "orders", label: "Orders", href: "/orders" },
  { id: "lists", label: "My Lists", href: "/lists", active: true },
  { id: "quotes", label: "Quotes", href: "/quotes" },
  { id: "approvals", label: "Approvals", href: "/approvals" },
  { id: "returns", label: "Returns", href: "/returns" },
];

const TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Shopping", value: "shopping" },
  { label: "Preventative", value: "preventative" },
  { label: "Restocking", value: "restocking" },
];

const TAB_ITEMS = [
  { id: "my-lists", label: "My Lists", count: 8 },
  { id: "shared", label: "Shared with Me", count: 3 },
  { id: "standing", label: "Standing Orders", count: 2 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MyLists: React.FC = () => {
  const [activeTab, setActiveTab] = useState("my-lists");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("shopping");
  const [showH2Prices, setShowH2Prices] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Derived data
  const filtered = MOCK_LISTS.filter((list) => {
    const matchesSearch = list.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || list.listType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateList = () => {
    setCreateModalOpen(false);
    setNewListName("");
    setNewListType("shopping");
  };

  const handleRemoveFilter = (filterLabel: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filterLabel));
    if (filterLabel.startsWith("Type:")) setTypeFilter("all");
  };

  const handleTypeSelect = (value: string) => {
    setTypeFilter(value);
    if (value !== "all") {
      const label = `Type: ${TYPE_OPTIONS.find((o) => o.value === value)?.label}`;
      setActiveFilters((prev) =>
        prev.filter((f) => !f.startsWith("Type:")).concat(label)
      );
    } else {
      setActiveFilters((prev) => prev.filter((f) => !f.startsWith("Type:")));
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Navigation */}
      <div className={styles.topNavWrapper}>
        {/* TODO: no react-kit match for branded top bar with cart/account — approximated with TopNav */}
        <TopNav />
      </div>

      <div className={styles.bodyWrapper}>
        {/* Left Navigation */}
        <div className={styles.leftNavWrapper}>
          <LeftNav
            userInitials="RV"
            userName="R. Veal"
            items={LEFT_NAV_ITEMS}
            collapsed={navCollapsed}
            onToggleCollapse={() => setNavCollapsed((c) => !c)}
            onLogout={() => {}}
          />
        </div>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Page Header Row */}
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumbRow}>
              <Breadcrumb
                items={[
                  { label: "My Lists", href: "/lists" },
                ]}
              />
            </div>

            <div className={styles.headerActions}>
              {/* TODO: no react-kit match for H2 price toggle label — approximated with Toggle */}
              <div className={styles.toggleRow}>
                <Toggle
                  checked={showH2Prices}
                  onChange={() => setShowH2Prices((v) => !v)}
                />
                <span className={styles.toggleLabel}>Show H2 Prices</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
              >
                + Create New List
              </Button>
            </div>
          </div>

          {/* Tabs + Filter Bar */}
          <div className={styles.tabsSection}>
            <PillTabs
              items={TAB_ITEMS}
              activeId={activeTab}
              onChange={setActiveTab}
            />

            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <Input
                  label="Find a list"
                  size="md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.typeDropdown}>
                <Dropdown
                  options={TYPE_OPTIONS}
                  onSelect={handleTypeSelect}
                />
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <FilterShell
                chips={activeFilters}
                onAddClick={() => {}}
                addLabel="Add Filter"
              >
                {activeFilters.map((f) => (
                  <FilterChip
                    key={f}
                    label={f}
                    removable
                    onRemove={() => handleRemoveFilter(f)}
                  />
                ))}
              </FilterShell>
            )}
          </div>

          {/* List Cards Grid */}
          <div className={styles.cardGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                {/* TODO: no react-kit match for empty list illustration — approximated with EmptyState */}
                <span className={styles.emptyText}>
                  No lists match your search.
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setActiveFilters([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filtered.map((list) => (
                <div key={list.id} className={styles.cardWrapper}>
                  {/* TODO: no react-kit match for a "List Landing Card" variant — approximated with ListCard */}
                  <ListCard variant="list">
                    <div className={styles.listCardInner}>
                      <div className={styles.listCardHeader}>
                        <span className={styles.listName}>{list.name}</span>
                        {/* TODO: no react-kit match for vertical ellipsis menu — approximated with Tooltip */}
                        <Tooltip content="List options">
                          <span className={styles.moreIcon}>⋮</span>
                        </Tooltip>
                      </div>

                      <div className={styles.listCardMeta}>
                        <ListTypeBadge tone={list.listType} />
                        <span className={styles.metaPrivacy}>
                          {list.privacy}
                        </span>
                      </div>

                      <div className={styles.listCardStats}>
                        <StatusBadge tone="neutral">
                          {list.itemCount} items
                        </StatusBadge>
                        <div className={styles.followersRow}>
                          <Avatar size="xs" tone="blue" />
                          <span className={styles.followersCount}>
                            {list.followers}
                          </span>
                        </div>
                      </div>

                      <div className={styles.listCardFooter}>
                        <span className={styles.updatedText}>
                          Updated {list.updatedAt}
                        </span>
                        <div className={styles.listCardActions}>
                          <Button variant="tertiary" size="sm">
                            Edit
                          </Button>
                          <Button variant="primary" size="sm">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ListCard>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filtered.length / 8)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>

      {/* Create List Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New List"
        width={480}
        footer={
          <div className={styles.modalFooter}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateList}
            >
              Create List
            </Button>
          </div>
        }
      >
        <div className={styles.modalBody}>
          <Input
            label="List Name"
            size="lg"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            helperText="Give your list a descriptive name."
          />
          <div className={styles.modalTypeDropdown}>
            <Dropdown
              options={TYPE_OPTIONS.filter((o) => o.value !== "all")}
              onSelect={setNewListType}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyLists;
