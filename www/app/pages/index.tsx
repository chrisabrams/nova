// import type { NovaViewConfig } from "nova/core/views/types.ts";
import { useEffect, useState } from "react";

function IndexPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("count", count);
      setCount((count) => count + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return <div>Hello world: {count}</div>;
}

export default IndexPage;
