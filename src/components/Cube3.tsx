import { useAppContextSubscribe } from "../context/AppObservableContext";
import { useRenderCount } from "../hooks/useRenderCount";

const Cube3 = () => {
  const renderCount = useRenderCount("Cube3");
  const [count, setCount] = useAppContextSubscribe("count");

  return (
    <div className="cube cube-3">
      <p>Render count: {renderCount}</p>
      <p>Count: {JSON.stringify(count, null, 2)}</p>
      <button onClick={() => setCount(count + 1)}>Increase count</button>
    </div>
  );
};
export default Cube3;
