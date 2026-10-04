import { useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation } from "react-router-dom";
import LoginRequiredModal from "../components/ui/LoginRequiredModal.jsx";

/**
 * useAuthGuard — reusable authentication guard for ordering actions.
 *
 * Usage:
 *   const { requireAuth, modalProps } = useAuthGuard();
 *
 *   const handleOrder = () => {
 *     requireAuth(() => {
 *       // User is authenticated, proceed with ordering
 *       addToCart(product);
 *     });
 *   };
 *
 *   return (
 *     <>
 *       <Button onClick={handleOrder}>Order Now</Button>
 *       <LoginRequiredModal {...modalProps} />
 *     </>
 *   );
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  // Held in a ref, not state: passing a function to useState's setter would
  // make React invoke it as a functional state updater, which executes the
  // action even though the user is not authenticated. The pending action is
  // only ever cleared — it must never run on its own.
  const pendingActionRef = useRef(null);

  // The return path to send user back after login/signup
  const returnTo = location.pathname + location.search;

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action();
      } else {
        pendingActionRef.current = action;
        setModalOpen(true);
      }
    },
    [isAuthenticated]
  );

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    pendingActionRef.current = null;
  }, []);

  const modalProps = {
    isOpen: modalOpen,
    onClose: handleModalClose,
    returnTo,
  };

  return {
    requireAuth,
    modalProps,
    isPending: modalOpen,
  };
}

/**
 * Higher-order component wrapper for components that need auth on multiple actions.
 * Usage: wrap component with withAuthGuard(Component)
 */
export function withAuthGuard(WrappedComponent) {
  return function WithAuthGuard(props) {
    const { requireAuth, modalProps } = useAuthGuard();
    return (
      <>
        <WrappedComponent {...props} requireAuth={requireAuth} />
        <LoginRequiredModal {...modalProps} />
      </>
    );
  };
}