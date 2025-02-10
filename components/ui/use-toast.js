// Copied from https://ui.shadcn.com/docs/components/toast
"use client";

import { useEffect, useState } from "react";

const TOAST_TIMEOUT = 5000;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => Date.now() - toast.createdAt < TOAST_TIMEOUT)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toast = ({ title, description, variant = "default" }) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        description,
        variant,
        createdAt: Date.now(),
      },
    ]);
  };

  return { toast, toasts };
}