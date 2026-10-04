import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import Rating from "../components/ui/Rating.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ProductCard from "../components/cards/ProductCard.jsx";
import { PRODUCT_REVIEWS } from "../data/site.js";
import { useProducts } from "../context/ProductsContext.jsx";
import { peso, useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthGuard } from "../hooks/useAuthGuard.jsx";
import LoginRequiredModal from "../components/ui/LoginRequiredModal.jsx";
import NotFound from "./NotFound.jsx";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const { add } = useCart();
  const { isAuthenticated } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  const { requireAuth, modalProps } = useAuthGuard();

  const product = useMemo(() => products.find((p) => p.id === productId), [products, productId]);

  const [size, setSize] = useState(product?.sizes?.[0] ?? "Regular");
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  // Reset the form whenever the route changes to a different product.
  const [lastId, setLastId] = useState(productId);
  if (productId !== lastId) {
    setLastId(productId);
    setSize(product?.sizes?.[0] ?? "Regular");
    setQty(1);
    setAdded(false);
    setFavorite(false);
  }

  if (productsLoading) {
    return (
      <LoadingState
        title="Brewing your drink…"
        description="Loading this item from the Kapresco menu."
      />
    );
  }

  if (!product) return <NotFound />;

  // Size pricing comes from the catalogue (`products.size_adjustments`), the
  // same table the database charges against when the order is placed.
  const sizeAdjustment = Number(product.sizeAdjustments?.[size] ?? 0);
  const unitPrice = product.price + sizeAdjustment;

  const related = products.filter((p) => p.id !== product.id && p.tags.some((t) => product.tags.includes(t))).slice(0, 3);
  const fallback = products.filter((p) => p.id !== product.id && !related.includes(p)).slice(0, 3 - related.length);
  const suggestions = [...related, ...fallback];

  const handleAdd = () => {
    requireAuth(async () => {
      const ok = await add(product, size, qty);
      if (!ok) return;
      setAdded(true);
      window.clearTimeout(handleAdd.t);
      handleAdd.t = window.setTimeout(() => setAdded(false), 2400);
    });
  };

  return (
    <>
      <div className="container product-breadcrumbs">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="section product">
        <div className="container product__layout">
          {/* ---- Gallery ---- */}
          <div className="product__gallery">
            <div className="product__image-frame">
              <img src={product.detailImage ?? product.image} alt={product.name} className="product__image" />
            </div>
            <div className="product__thumbs">
              <button type="button" className="product__thumb is-active" aria-label={`${product.name} view 1`}>
                <img src={product.detailImage ?? product.image} alt="" />
              </button>
              <button type="button" className="product__thumb" aria-label={`${product.name} view 2`}>
                <img src={product.image} alt="" />
              </button>
              <button type="button" className="product__thumb" aria-label={`${product.name} view 3`}>
                <img src="/images/set-of-realistic-coffee-cups-with-iced-coffee-in-transparent-background-9c7550e9.png" alt="" />
              </button>
            </div>
          </div>

          {/* ---- Details ---- */}
          <div className="product__info">
            <div className="product__title-row">
              <h1 className="product__name">{product.name}</h1>
              <button
                type="button"
                className={`product__favorite${favorite ? " is-active" : ""}`}
                aria-pressed={favorite}
                aria-label={favorite ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
                onClick={() => setFavorite((v) => !v)}
              >
                <Icon name="heart" size={20} color={favorite ? "var(--brown-700)" : "var(--brown-600)"} />
              </button>
            </div>

            <div className="product__meta">
              <Rating value={product.rating} showValue />
              <span className="product__reviews">({product.reviews} reviews)</span>
            </div>

            <p className="product__price">
              {product.compareAt && <s>{peso(product.compareAt)}</s>}
              {peso(product.price)}
            </p>

            <p className="product__blurb">{product.longDescription ?? product.description}</p>

            {product.sizes.length > 1 && (
              <fieldset className="product__option">
                <legend className="product__option-label">Size</legend>
                <div className="product__option-list">
                  {product.sizes.map((s) => {
                    const adjustment = Number(product.sizeAdjustments?.[s] ?? 0);
                    return (
                      <button
                        key={s}
                        type="button"
                        className={`option-pill${size === s ? " is-active" : ""}`}
                        aria-pressed={size === s}
                        onClick={() => setSize(s)}
                      >
                        {s}
                        {adjustment > 0 && <span className="option-pill__delta">+{peso(adjustment)}</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="product__buy">
              <div className="quantity" role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Icon name="minus" size={16} color="var(--brown-700)" strokeWidth={2.2} />
                </button>
                <span className="quantity__value" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  disabled={qty >= 20}
                  aria-label="Increase quantity"
                >
                  <Icon name="plus" size={16} color="var(--brown-700)" strokeWidth={2.2} />
                </button>
              </div>

              <Button variant="gold" size="lg" onClick={handleAdd} iconLeft={added ? <Icon name="check" size={18} color="var(--brown-700)" strokeWidth={2.4} /> : null}>
                {added ? `Added — ${peso(unitPrice * qty)}` : `Add to Cart · ${peso(unitPrice * qty)}`}
              </Button>
            </div>

            {added && (
              <div className="product__notice" role="status">
                <Icon name="check-circle" size={18} color="var(--success)" strokeWidth={1.8} />
                <span>{qty} × {product.name} ({size}) is in your cart.</span>
                <Link to="/cart">Go to cart</Link>
              </div>
            )}

            {!isAuthenticated && (
              <p className="product__signin-hint">
                <Icon name="user" size={16} color="var(--text-muted)" strokeWidth={1.7} />
                <Link to="/login">Log in</Link> to save this drink to your favorites and track orders.
              </p>
            )}

            <ul className="product__specs">
              <li>
                <span className="product__spec-label">Ingredients</span>
                <span className="product__spec-value">{product.ingredients}</span>
              </li>
              <li>
                <span className="product__spec-label">Serving size</span>
                <span className="product__spec-value">{product.nutrition.serving}</span>
              </li>
              <li>
                <span className="product__spec-label">Calories</span>
                <span className="product__spec-value">{product.nutrition.calories} kcal</span>
              </li>
              <li>
                <span className="product__spec-label">Caffeine</span>
                <span className="product__spec-value">{product.nutrition.caffeine}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Reviews ---- */}
      <section className="section product-reviews">
        <div className="container">
          <SectionHeading
            eyebrow="KAPRESCO MOMENTS"
            title="What Our Peeps Say"
            description="Real words from the Kapresco crowd — no scripting, just honest brews."
          />

          <div className="product-reviews__grid">
            {PRODUCT_REVIEWS.map((r) => (
              <figure key={r.name} className="review-card">
                <Rating value={r.rating} />
                <blockquote className="review-card__body">{r.body}</blockquote>
                <figcaption className="review-card__name">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---- You might also like ---- */}
      <section className="section product-related">
        <div className="container">
          <SectionHeading eyebrow="MORE TO SIP" title="You Might Also Like" />
          <div className="product-related__grid">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <LoginRequiredModal {...modalProps} />
    </>
  );
}
