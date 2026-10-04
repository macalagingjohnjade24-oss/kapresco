import { useState } from "react";
import PageIntro from "../components/ui/PageIntro.jsx";
import Button from "../components/Button.jsx";
import ProductCard from "../components/cards/ProductCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import "./Orders.css";

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const { ids, clear } = useFavorites();
  const { products: catalogue, loading, error, reload } = useProducts();
  const [confirming, setConfirming] = useState(false);

  const products = ids.map((id) => catalogue.find((p) => p.id === id)).filter(Boolean);

  const handleClear = () => {
    clear();
    setConfirming(false);
  };

  return (
    <>
      <PageIntro
        eyebrow="SAVED FOR LATER"
        title="Favorites"
        description="The drinks you keep coming back to — saved in one warm little list."
        image="/images/untitled-design-1-5efb0725.png"
      />

      <section className="section orders">
        <div className="container">
          {loading ? (
            <LoadingState
              title="Loading your favorites…"
              description="Pulling your saved drinks from the menu."
            />
          ) : error ? (
            <EmptyState
              icon="alert-circle"
              title="We couldn’t load the menu"
              description={error}
              actionLabel="Try again"
              onAction={reload}
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon="heart"
              title={isAuthenticated ? "No favorites yet" : "Sign in to save favorites"}
              description={
                isAuthenticated
                  ? "Tap the heart on any drink and it’ll show up here."
                  : "Log in and your saved drinks will follow you around."
              }
              actionLabel={isAuthenticated ? "Explore Our Menu" : "Login"}
              actionTo={isAuthenticated ? "/menu" : "/login"}
            />
          ) : (
            <>
              <div className="orders__filters">
                <p className="orders__note" style={{ margin: 0 }}>
                  {products.length} saved {products.length === 1 ? "drink" : "drinks"}
                </p>

                {confirming ? (
                  <span className="orders__confirm">
                    <span>Remove all?</span>
                    <Button variant="danger" size="sm" onClick={handleClear}>
                      Yes, clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                      Cancel
                    </Button>
                  </span>
                ) : (
                  <button type="button" className="chip" style={{ marginLeft: "auto" }} onClick={() => setConfirming(true)}>
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid--3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} showFavorite />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
