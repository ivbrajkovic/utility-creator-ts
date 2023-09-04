import { useAppContextSubscribeMany } from "../context/AppObservableContext";
import { useRenderCount } from "../hooks/useRenderCount";

const Cube1 = () => {
  const renderCount = useRenderCount("Cube1");
  const [{ name, count }, setValue] = useAppContextSubscribeMany([
    "name",
    "count",
  ]);

  return (
    <div className="cube cube-1">
      <p>Render: {renderCount}</p>
      <p>Name: {JSON.stringify(name, null, 2)}</p>
      <p>Count: {count}</p>

      <button
        onClick={() => {
          setValue({ name: "React 321", count: 321 });
        }}
      >
        Set values
      </button>
    </div>
  );
};
export default Cube1;
