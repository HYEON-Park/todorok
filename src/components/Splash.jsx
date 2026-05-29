import { useEffect } from 'react';

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splash">
      <img src="/icon_1.jpg" alt="" className="splash-img" />
    </div>
  );
}
