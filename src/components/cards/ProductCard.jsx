import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import Button from "../Button.jsx";
import { peso, useCart } from "../../context/CartContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { useAuthGuard } from "../../hooks/useAuthGuard.jsx";
import LoginRequiredModal from "../../components/ui/LoginRequiredModal.jsx";
import "./ProductCard.css";

/**
 * Product card — Figma `Kapresco product card`:
 * #FFF9F1 fill, 1px #E6CDA9 stroke, 12px radius,
 * shadow 0 12px 30px rgba(68,40,8,.12), image on top,
 * details block padding 20px, centered, gap 10px.
 */
export default function ProductCard({ product, actionLabel = "Order Now", showFavorite = false }) {
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const [added, setAdded] = useState(false);
  const resetTimer = useRef(null);

  const { requireAuth, modalProps } = useAuthGuard();

  const favorite = isFavorite(product.id);
  const inStock = product.inStock !== false;

  const handleAdd = () => {
    if (!inStock) return;
    requireAuth(async () => {
      const ok = await add(product);
      if (!ok) return;
      setAdded(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setAdded(false), 1600);
    });
  };

  const handleFavorite = () => {
    // Favorites live on the account, so they need a session first.
    requireAuth(() => toggle(product.id));
  };

  return (
    <>
      <article className={`product-card${!inStock ? " product-card--out" : ""}`}>
        <Link to={`/menu/${product.id}`} className="product-card__media" tabIndex={-1} aria-hidden="true">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            width="280"
            height="250"
            className="product-card__image"
          />
        </Link>

        {!inStock && (
          <span className="product-card__out-badge" aria-label="Out of stock">Out of stock</span>
        )}

        {showFavorite && (
          <button
            type="button"
            className={`product-card__favorite${favorite ? " is-active" : ""}`}
            aria-label={favorite ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
            aria-pressed={favorite}
            onClick={handleFavorite}
          >
            <Icon name="heart" size={18} color={favorite ? "var(--brown-700)" : "var(--brown-600)"} />
          </button>
        )}

        <div className="product-card__details">
          <h3 className="product-card__name">
            <Link to={`/menu/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="product-card__description">{product.description}</p>

          <p className="product-card__price">
            {product.compareAt && <s className="product-card__compare">{peso(product.compareAt)}</s>}
            {peso(product.price)}
          </p>

          <Button variant="gold" size="md" onClick={handleAdd} iconLeft={added ? <Icon name="check" size={17} color="var(--brown-700)" strokeWidth={2.4} /> : null}>
            {added ? "Added" : actionLabel}
          </Button>
        </div>
      </article>

      <LoginRequiredModal {...modalProps} />
    </>
  );
}
