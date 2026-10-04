import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import Icon from "../components/Icon.jsx";
import { CATEGORIES } from "../data/site.js";
import { useProducts } from "../context/ProductsContext.jsx";
import "./Menu.css";

const VALID = new Set(CATEGORIES.map((c) => c.id));
const AVAILABILITY = ["all", "in-stock"];
const SORT_OPTIONS = ["recommended", "name-az", "price-low-high"];

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("category") ?? "all";
  const category = VALID.has(raw) ? raw : "all";
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("recommended");

  const { products, loading, error, reload } = useProducts();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchesCategory = category === "all" || p.tags.includes(category);
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesAvailability =
        availability === "all" || (availability === "in-stock" && p.inStock);
      return matchesCategory && matchesQuery && matchesAvailability;
    });

    if (sort === "name-az") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price-low-high") {
      list = [...list].sort((a, b) => a.price - b.price);
    }
    return list;
  }, [products, category, query, availability, sort]);

  const setCategory = (id) => {
    if (id === "all") {
      params.delete("category");
    } else {
      params.set("category", id);
    }
    setParams(params, { replace: true });
  };

  const activeCategory = CATEGORIES.find((c) => c.id === category)?.label ?? "All Products";

  return (
    <>
      {/* ---- Menu Hero — Figma "Menu hero" frame: 1366×417, #442808 bg, 27% scrim,
            white title 700 64px/76.8, white description 400 24px/34.8, pad 100 ---- */}
      <header className="menu-hero" role="banner">
        <img src="/images/coffee-image-7499d99f.png" alt="" className="menu-hero__image" aria-hidden="true" />
        <span className="menu-hero__scrim" aria-hidden="true" />
        <div className="container menu-hero__inner">
          <h1 className="menu-hero__title">Kapresco Menu</h1>
          <p className="menu-hero__desc">Brewed, baked, and served with preskong vibes.</p>
        </div>
      </header>

      <section className="section menu" aria-labelledby="catalog-heading">
        <div className="container">
          {/* ---- Search with gold action button ---- */}
          <div className="menu__search-row">
            <label htmlFor="menu-search" className="menu__search-label">Search the menu</label>
            <div className="menu__search">
              <input
                id="menu-search"
                type="search"
                className="menu__search-input"
                placeholder="Search the menu…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search the menu"
              />
              <button
                type="button"
                className="menu__search-btn"
                aria-label="Search"
              >
                <Icon name="search" size={22} color="#fff" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* ---- Filter chips: Categories / Availability / Sort ---- */}
          <div className="menu__filters">
            {/* Categories */}
            <div className="menu__filter-group" role="group" aria-label="Categories">
              <span className="menu__filter-label">Categories</span>
              <div className="menu__chips" role="tablist">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={category === c.id}
                    className={`chip${category === c.id ? " chip--active" : ""}`}
                    onClick={() => setCategory(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="menu__filter-group" role="group" aria-label="Availability">
              <span className="menu__filter-label">Availability</span>
              <div className="menu__chips" role="radiogroup">
                {["All items", "In stock"].map((label, idx) => {
                  const val = AVAILABILITY[idx];
                  return (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={availability === val}
                      className={`chip${availability === val ? " chip--active" : ""}`}
                      onClick={() => setAvailability(val)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort by */}
            <div className="menu__filter-group" role="group" aria-label="Sort by">
              <span className="menu__filter-label">Sort by</span>
              <div className="menu__chips" role="radiogroup">
                {["Recommended", "Name A–Z", "Price low–high"].map((label, idx) => {
                  const val = SORT_OPTIONS[idx];
                  return (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={sort === val}
                      className={`chip${sort === val ? " chip--active" : ""}`}
                      onClick={() => setSort(val)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---- Catalog heading ---- */}
          <div className="menu__catalog-header">
            <h2 id="catalog-heading" className="menu__catalog-title">
              {activeCategory}
              <span className="menu__catalog-count">
                {loading ? "…" : `${filtered.length} items`}
              </span>
            </h2>
          </div>

          {/* ---- Status message banner (sample catalog notice) ---- */}
          {category === "all" && (
            <div className="menu__status" role="status" aria-live="polite">
              <p className="menu__status-text">
                Non-coffee, pastry, and seasonal entries are sample catalog content, not confirmed business offerings. Prices and availability are not yet confirmed.
              </p>
              <div className="menu__status-chips">
                <span className="status-chip">Pastries — Sample catalog</span>
                <span className="status-chip">Non-Coffee & Seasonal — Sample catalog</span>
              </div>
            </div>
          )}

          {/* ---- Loading / Error / Grid / Empty ---- */}
          {loading ? (
            <LoadingState
              title="Brewing the menu…"
              description="Fetching the latest drinks, pastries, and prices from Kapresco."
            />
          ) : error ? (
            <EmptyState
              icon="alert-circle"
              title="We couldn’t load the menu"
              description={error}
              actionLabel="Try again"
              onAction={reload}
            />
          ) : filtered.length > 0 ? (
            <div className="grid grid--3 menu__grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} showFavorite />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="search"
              title="No brews match that search"
              description="Try a different name, or browse the full Kapresco menu."
              actionLabel="Clear filters"
              onAction={() => {
                setQuery("");
                setCategory("all");
              }}
            />
          )}

          {/* ---- Footer note ---- */}
          {!loading && !error && (
            <p className="menu__footer-note" role="status" aria-live="polite">
              Showing all {filtered.length} {filtered.length === 1 ? "item" : "items"} in this view
            </p>
          )}
        </div>
      </section>
    </>
  );
}
