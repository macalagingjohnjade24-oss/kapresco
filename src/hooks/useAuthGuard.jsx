import { useState, useCallback } from "react";
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
  const [_pendingAction, setPendingAction] = useState(null);

  // The return path to send user back after login/signup
  const returnTo = location.pathname + location.search;

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action();
      } else {
        setPendingAction(action);
        setModalOpen(true);
      }
    },
    [isAuthenticated]
  );

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setPendingAction(null);
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