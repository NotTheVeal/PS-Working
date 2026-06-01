import React, { useState } from "react";
import {
  TopNav,
  LeftNav,
  Button,
  Dropdown,
  Avatar,
  StatusCard,
} from "@partssource/react-kit";
import styles from "./LandingPage.module.css";

// ---------------------------------------------------------------------------
// Asset URLs from Figma (valid for 7 days)
// ---------------------------------------------------------------------------
const imgHeroBanner =
  "https://www.figma.com/api/mcp/asset/0a5d311b-5e10-4978-8160-5fa2c2c6ecae";
const imgClevelandClinicLogo =
  "https://www.figma.com/api/mcp/asset/eb3e9ef1-41ed-4675-8df4-2d6a58551a56";
const imgPromoRepair =
  "https://www.figma.com/api/mcp/asset/4ba0ac6b-b4b0-442e-8a50-b1bf58f7283e";
const imgPromoTripp =
  "https://www.figma.com/api/mcp/asset/079b59f6-0bcd-4b63-bfca-ad9bbd9b8d70";
const imgExclusive1 =
  "https://www.figma.com/api/mcp/asset/37834f70-6415-4b3b-99e6-c1cffab4f55b";
const imgExclusive2 =
  "https://www.figma.com/api/mcp/asset/17b4d4e8-b469-493e-b48f-36e21d2fb1f0";
const imgExclusive3 =
  "https://www.figma.com/api/mcp/asset/34a9cd25-7e79-4823-bfe4-f65354258d26";
const imgPartsSourceLogo =
  "https://www.figma.com/api/mcp/asset/0d7b46d3-e123-4be4-9b0d-b52e58b08117";
const imgClevelandClinicProBadge =
  "https://www.figma.com/api/mcp/asset/de8cc4e5-9bdb-49a4-be27-e9561c843589";

// ---------------------------------------------------------------------------
// Left nav items
// ---------------------------------------------------------------------------
const LEFT_NAV_ITEMS = [
  { id: "lists", label: "My Lists", icon: "lists" },
  { id: "dashboard", label: "My Dashboard", icon: "home" },
  { id: "asset-uptime", label: "Asset Uptime", icon: "asset" },
  { id: "analytics", label: "Visual Analytics", icon: "analytics" },
  { id: "parts-center", label: "Parts Center", icon: "parts", hasChildren: true },
  { id: "service-center", label: "Service Center", icon: "service", hasChildren: true },
  { id: "tools", label: "Tools", icon: "tools", hasChildren: true },
];

const MANUFACTURER_OPTIONS = [
  { label: "GE Healthcare", value: "ge" },
  { label: "Philips", value: "philips" },
  { label: "Siemens Healthineers", value: "siemens" },
  { label: "Mindray", value: "mindray" },
  { label: "Spacelabs", value: "spacelabs" },
];

const MODEL_OPTIONS = [
  { label: "Dash 3000", value: "dash3000" },
  { label: "IntelliVue MP50", value: "mp50" },
  { label: "CARESCAPE B650", value: "b650" },
  { label: "BeneVision N17", value: "n17" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LandingPage: React.FC = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  return (
    <div className={styles.pageRoot}>
      {/* ------------------------------------------------------------------ */}
      {/* Top utility bar                                                     */}
      {/* ------------------------------------------------------------------ */}
      <header className={styles.utilityBar}>
        <nav className={styles.utilityLinks}>
          <span className={styles.utilityPhone}>877-497-6412</span>
          <a href="#help" className={styles.utilityLink}>Help</a>
          <a href="#about" className={styles.utilityLink}>About Us</a>
        </nav>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main nav bar                                                        */}
      {/* ------------------------------------------------------------------ */}
      {/* TODO: no react-kit match for top search bar with orange button — approximated with TopNav */}
      <div className={styles.mainNav}>
        <div className={styles.mainNavInner}>
          <img src={imgPartsSourceLogo} alt="PartsSource" className={styles.psLogo} />

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              aria-label="Search"
            />
            <button className={styles.searchButton} aria-label="Find">
              {/* magnifier icon approximated */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="white" strokeWidth="1.5" />
                <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className={styles.navActions}>
            <button className={styles.categoriesBtn}>Categories +</button>

            {/* Cart icon — TODO: no react-kit cart icon, approximated with Button */}
            <div className={styles.cartWrapper}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.cartIcon}>
                <path d="M4 6h2l3.5 14h13L26 10H9" stroke="#002" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="13" cy="26" r="1.5" fill="#002" />
                <circle cx="22" cy="26" r="1.5" fill="#002" />
              </svg>
              <span className={styles.cartBadge}>3</span>
            </div>

            <div className={styles.navDivider} />

            <div className={styles.facilityInfo}>
              <span className={styles.facilityLabel}>Selected Facility</span>
              <span className={styles.facilityName}>Marymount Hospital</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Welcome / Pro Account bar                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.welcomeBar}>
        <span className={styles.welcomeText}>Welcome</span>
        <div className={styles.proAccountBadge}>
          <img src={imgClevelandClinicProBadge} alt="Cleveland Clinic" className={styles.proLogo} />
          <div className={styles.proBarDivider} />
          <span className={styles.proAccountLabel}>PRO ACCOUNT</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Body: Left nav + main content                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.body}>
        {/* Left navigation */}
        {/* TODO: LeftNav react-kit component does not support the exact icon/structure shown; approximated with LeftNav */}
        <LeftNav
          userInitials="DM"
          userName="Doug M."
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((c) => !c)}
          onLogout={() => {}}
          items={LEFT_NAV_ITEMS.map((item) => ({
            id: item.id,
            label: item.label,
            onClick: () => {},
          }))}
        />

        {/* Main content */}
        <main className={styles.main}>
          {/* Hero banner */}
          <section className={styles.heroBanner}>
            <img src={imgHeroBanner} alt="Connect to the largest network of pre-qualified service technicians" className={styles.heroImage} />
            <div className={styles.heroOverlay}>
              <h1 className={styles.heroHeading}>
                Connect to the largest network of pre-qualified service technicians
              </h1>
              <p className={styles.heroSubheading}>
                Access our evidence-based network of 5,000+ service technicians for quality equipment repairs.
              </p>
              <Button variant="primary" size="lg">LEARN MORE</Button>
            </div>
          </section>

          {/* Account info row */}
          <div className={styles.accountRow}>
            {/* Facility + user info */}
            <div className={styles.accountInfo}>
              <img src={imgClevelandClinicLogo} alt="CC Mar-C" className={styles.accountLogo} />
              <div className={styles.accountUserInfo}>
                <span className={styles.accountName}>Brian Thomas</span>
                <span className={styles.accountTier}>PRO ACCOUNT</span>
              </div>
            </div>

            {/* Stat cards */}
            {/* TODO: no react-kit "mini stat card" — approximated with custom styled divs */}
            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Quotes for Review</span>
                <span className={styles.statValue}>2 Quotes</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Repair Items Received</span>
                <span className={styles.statValue}>25 Items</span>
              </div>
            </div>
          </div>

          {/* Promo banners */}
          <div className={styles.promoBanners}>
            <div className={styles.promoBannerItem}>
              <img src={imgPromoRepair} alt="Complete End-to-End Repair Service" className={styles.promoBannerImage} />
            </div>
            <div className={styles.promoBannerItem}>
              <img src={imgPromoTripp} alt="Tripp-Lite Antimicrobial Power Strips and Surge Protectors" className={styles.promoBannerImage} />
            </div>
          </div>

          {/* Shop by Device */}
          <div className={styles.shopByDevice}>
            <span className={styles.shopByDeviceTitle}>Shop by Device</span>
            <div className={styles.shopByDeviceControls}>
              <Dropdown
                options={MANUFACTURER_OPTIONS}
                onSelect={(val) => setSelectedManufacturer(val)}
              />
              <Dropdown
                options={MODEL_OPTIONS}
                onSelect={(val) => setSelectedModel(val)}
              />
              {/* TODO: no react-kit orange "FIND" button variant — approximated with primary Button */}
              <Button variant="primary" size="lg">FIND</Button>
            </div>
          </div>

          {/* Exclusively at PartsSource */}
          <section className={styles.exclusiveSection}>
            <h2 className={styles.exclusiveHeading}>Exclusively at PartsSource</h2>
            <div className={styles.exclusiveGrid}>
              <div className={styles.exclusiveCard}>
                <img src={imgExclusive1} alt="Quality & Affordability All in One" className={styles.exclusiveImage} />
                <p className={styles.exclusiveCaption}>Quality &amp; Affordability All in One</p>
              </div>
              <div className={styles.exclusiveCard}>
                <img src={imgExclusive2} alt="Tired of Waiting for Repairs?" className={styles.exclusiveImage} />
                <p className={styles.exclusiveCaption}>Tired of Waiting for Repairs?</p>
              </div>
              <div className={styles.exclusiveCard}>
                <img src={imgExclusive3} alt="Reach the Nation's Largest Network With On-Site Services" className={styles.exclusiveImage} />
                <p className={styles.exclusiveCaption}>Reach the Nation&apos;s Largest Network With On-Site Services</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
