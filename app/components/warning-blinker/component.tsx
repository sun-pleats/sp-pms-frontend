import './component.scss';

interface WarningBlinkerProps {
  message?: any;
  color?: 'red' | 'yellow' | 'green'
}

export default function WarningBlinker({ message, color }: WarningBlinkerProps) {
  return (
    <div className={`bg-${color ?? 'red'}-500 text-white p-2 mb-2 font-medium flex items-center animate-pulse`}>
      <i className="pi pi-exclamation-triangle text-yellow-200 mr-2"></i>
      {message}
    </div>
  );
}
