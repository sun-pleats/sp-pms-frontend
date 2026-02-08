import { ProgressSpinner } from 'primereact/progressspinner';
import './component.scss';

export default function AppLoader() {
  return (
    <div className="app-loader">
      <div className="loader-card">
        {/* Optional logo */}
        {/* <img src="/logo.svg" alt="App Logo" className="loader-logo" /> */}

        <h2 className="loader-title">Sunpleats</h2>
        <p className="loader-subtitle">Planning your route like a local…</p>

        <ProgressSpinner strokeWidth="4" animationDuration="1.2s" />
      </div>
    </div>
  );
}
