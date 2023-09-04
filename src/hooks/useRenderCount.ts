import { useEffect, useRef } from "react";

export const useRenderCount = (component = "useRenderCount") => {
  const renderCount = useRef(1);
  useEffect(() => {
    console.log(component, ++renderCount.current);
  });

  useEffect(() => {
    console.log(component, "mounted");
    return () => {
      console.log(component, " unmounted");
    };
  }, [component]);

  return renderCount.current;
};
