import * as React from "react";

/**
 * Merge multiple refs (callback or object) into a single ref callback.
 *
 * Useful when a component needs an internal ref AND a forwarded ref —
 * for example, the `magnetic` Button variant attaches pointer listeners
 * to its DOM node while still honoring the consumer's `ref`.
 */
export function useMergedRef<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return React.useCallback(
    (node: T | null) => {
      for (const ref of refs) {
        if (!ref) continue;
        if (typeof ref === "function") {
          ref(node);
        } else {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
