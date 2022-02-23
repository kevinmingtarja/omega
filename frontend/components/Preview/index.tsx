import { useEffect, useState } from "react";

const Preview = () => {
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(Math.random());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <iframe key={key} src="http://localhost:4000"></iframe>
    </>
  );
};

export default Preview;
