import './component.scss';

interface WarningBlinkerProps {
  message?: any;
}

export default function WarningBlinker({ message }: WarningBlinkerProps) {
  return (
    <div className="bg-red-500 text-white p-2 mb-2 font-medium flex items-center animate-pulse">
      <i className="pi pi-exclamation-triangle text-yellow-200 mr-2"></i>
      {message}
    </div>
  );
}
