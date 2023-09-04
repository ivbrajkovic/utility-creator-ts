import { useAppContext } from "../context/AppObservableContext";
import { useRenderCount } from "../hooks/useRenderCount";

const Cube4 = () => {
  const renderCount = useRenderCount("Cube4");
  const observable = useAppContext();

  return (
    <div className="cube cube-3">
      <p>Render: {renderCount}</p>
      <div>
        <button
          onClick={() => {
            const observed = observable.observed;
            observed.name = "React 123";
            observed.count = 123;
          }}
        >
          Batch update
        </button>
      </div>
      <br />
      <div>
        <button onClick={() => observable.printSubscribers(true)}>
          Print subscribers
        </button>
      </div>
      <div>
        <button onClick={() => observable.printObservedValues(true)}>
          Print values
        </button>
      </div>
    </div>
  );
};
export default Cube4;
