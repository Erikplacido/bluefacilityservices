
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { InfoIcon } from '../constants';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleSelectService = () => {
    if (service.isEnabled) {
      navigate(`/booking/${service.id}`);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 ${!service.isEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover"/>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-bold text-primary">
            From {formatPrice(service.basePrice + service.includedItems.reduce((sum, item) => sum + (item.basePrice * item.defaultQuantity), 0))}
          </p>
          {service.longDescription && (
            <div className="relative group">
               <InfoIcon className="text-gray-500 hover:text-primary" />
               <div className="absolute z-10 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 break-words">
                {service.longDescription}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleSelectService}
          disabled={!service.isEnabled}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors
            ${service.isEnabled 
              ? 'bg-primary hover:bg-blue-600' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {service.isEnabled ? 'Book This Service' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
