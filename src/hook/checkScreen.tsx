/**
 * useScreenOrientation hook: Returns 'portrait' or 'landscape' based on device orientation.
 * Listens to orientation and resize events.
 */
import { useEffect, useState } from "react";

function getOrientation() {
  if (typeof window === "undefined") return "portrait";
  if (
    window.screen &&
    window.screen.orientation &&
    window.screen.orientation.type
  ) {
    return window.screen.orientation.type.startsWith("landscape")
      ? "landscape"
      : "portrait";
  }
  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

export function useScreenOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    getOrientation()
  );

  useEffect(() => {
    function handleChange() {
      setOrientation(getOrientation());
    }

    window.addEventListener("orientationchange", handleChange);
    window.addEventListener("resize", handleChange);

    return () => {
      window.removeEventListener("orientationchange", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  return orientation;
}
