"use client";

import * as React from "react";
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | {
      type: "UPDATE_TOAST";
      toast: Partial<ToasterToast> & { id: string };
    }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};

export const reducer = (
  state: State,
  action: Action
): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(
          0,
          TOAST_LIMIT
        ),
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id
            ? { ...t, ...action.toast }
            : t
        ),
      };
    case "DISMISS_TOAST": {
      if (action.toastId)
        addToRemoveQueue(action.toastId);
      else
        state.toasts.forEach((t) =>
          addToRemoveQueue(t.id)
        );
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ||
          action.toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined)
        return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter(
          (t) => t.id !== action.toastId
        ),
      };
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

export function toast({
  ...props
}: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const update = (toast: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...toast, id },
    });
  const dismiss = () =>
    dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, update, dismiss };
}

export function useToast() {
  const [state, setState] = React.useState<State>(
    memoryState
  );

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
