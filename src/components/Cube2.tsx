import { useAppContextSubscribe } from "../context/AppObservableContext";
import { useRenderCount } from "../hooks/useRenderCount";

const Cube2 = () => {
  const renderCount = useRenderCount("Cube2");
  const [count] = useAppContextSubscribe("count");
  return (
    <div className="cube cube-2">
      <p>Render count: {renderCount}</p>
      <p>Count: {JSON.stringify(count, null, 2)}</p>
    </div>
  );
};
export default Cube2;
