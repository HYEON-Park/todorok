import { useEffect } from 'react';

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splash">
      <div className="splash-inner">
        <img src="./splash-icon.png" alt="투두록" className="splash-img" />
      </div>
    </div>
  );
}
