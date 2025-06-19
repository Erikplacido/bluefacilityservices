
import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { SERVICES_DATA } from '../services/mockData';

const ServicesPage: React.FC = () => {
  const enabledServices = SERVICES_DATA.filter(service => service.isEnabled);
  const disabledServices = SERVICES_DATA.filter(service => !service.isEnabled);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Our Services</h1>
        <p className="text-lg text-gray-600">Choose the service that best fits your needs.</p>
      </header>
      
      {enabledServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {enabledServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {disabledServices.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center border-t pt-8">Coming Soon / Currently Unavailable</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {disabledServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}

      {SERVICES_DATA.length === 0 && (
        <p className="text-center text-gray-500 text-xl">No services available at the moment. Please check back later.</p>
      )}
    </div>
  );
};

export default ServicesPage;
