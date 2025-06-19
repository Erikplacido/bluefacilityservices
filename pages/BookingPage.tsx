
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Service, Booking, RecurrenceType, BookingItem, IncludedItemConfig, ExtraItemConfig, CustomerInfo, BookingPreferences, ServiceItem } from '../types';
import { SERVICES_DATA } from '../services/mockData';
import { RECURRENCE_OPTIONS, TIME_SLOTS, InfoIcon, PlusIcon, MinusIcon, CLEANING_PRODUCTS_FEE, CLEANING_EQUIPMENT_FEE, VALID_POSTCODES_EXAMPLE, POSTCODE_VALIDATION_ENABLED } from '../constants';
import ItemCounter from '../components/ItemCounter';
import Modal from '../components/Modal';

// Define props for FormInput to include 'min'
interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string | null;
  min?: string; // Added min prop
}

const FormInput: React.FC<FormInputProps> = 
  ({label, id, type="text", value, onChange, required=false, placeholder, error, min}) => (
  <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input type={type} id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} min={min} // Pass min to input element
             className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors`} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

interface FormSelectProps {
    label: string;
    id: string;
    value: string;
    onChange: (val: string) => void;
    options: {value: string | number; label: string}[]; // Allow number for value, e.g. contractDuration
    required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> =
    ({label, id, value, onChange, options, required=false}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} required={required}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors bg-white">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

interface FormCheckboxProps {
    label: string;
    id: string;
    checked: boolean;
    onChange: (val: boolean) => void;
    sublabel?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = 
    ({label, id, checked, onChange, sublabel}) => (
    <div className="flex items-start mb-4">
        <div className="flex items-center h-5">
            <input id={id} name={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
                   className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
            {sublabel && <p className="text-gray-500">{sublabel}</p>}
        </div>
    </div>
);


const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  // const [currentStep, setCurrentStep] = useState(1); // currentStep is not used
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; description: string } | null>(null);
  const [recurrenceWarningModal, setRecurrenceWarningModal] = useState<{ title: string, message: string} | null>(null);
  const [postcodeError, setPostcodeError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      navigate('/');
      return;
    }
    const service = SERVICES_DATA.find(s => s.id === serviceId && s.isEnabled);
    if (service) {
      setSelectedService(service);
      setBooking({
        serviceId: service.id,
        serviceName: service.name,
        serviceBasePrice: service.basePrice,
        address: '',
        postcode: '',
        recurrence: RecurrenceType.OneTime,
        selectedDate: new Date().toISOString().split('T')[0],
        numberOfDays: 1,
        timeWindow: TIME_SLOTS[0].value,
        configuredIncludedItems: service.includedItems.map(item => ({ 
            itemId: item.id, 
            name: item.name, 
            quantity: item.defaultQuantity, 
            pricePerUnit: item.basePrice 
        })),
        configuredExtraItems: [],
        preferences: {
          willBeHome: false, accessInfo: '', hasAllergies: false, allergiesDetails: '',
          hasPets: false, petsDetails: '', hasCleaningProducts: true, hasCleaningEquipment: true,
        },
        customerInfo: { firstName: '', lastName: '', email: '', phone: '', abnOrTfn: '' },
        contractDuration: service.id === RecurrenceType.OneTime ? 1 : 2, // Default for recurring
        agreedToTerms: false,
        discountCode: '',
        pointsApplied: 0,
      });
    } else {
      navigate('/'); // Service not found or not enabled
    }
  }, [serviceId, navigate]);

  const handleInputChange = useCallback(<K extends keyof Booking>(field: K, value: Booking[K]) => {
    setBooking(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleCustomerInfoChange = useCallback((field: keyof CustomerInfo, value: string) => {
    setBooking(prev => prev ? { ...prev, customerInfo: { ...prev.customerInfo, [field]: value } } : null);
  }, []);

  const handlePreferencesChange = useCallback((field: keyof BookingPreferences, value: string | boolean) => {
    setBooking(prev => prev ? { ...prev, preferences: { ...prev.preferences, [field]: value } } : null);
  }, []);
  
  const handlePostcodeChange = (value: string) => {
    handleInputChange('postcode', value);
    if (POSTCODE_VALIDATION_ENABLED && selectedService) {
      if (value && !selectedService.availablePostcodes.includes(value) && !VALID_POSTCODES_EXAMPLE.includes(value) /* Fallback for demo */) {
        setPostcodeError(`Service not available for postcode ${value}. Available in: ${selectedService.availablePostcodes.join(', ') || VALID_POSTCODES_EXAMPLE.join(', ')}.`);
      } else {
        setPostcodeError(null);
      }
    }
  };


  const updateItemQuantity = (item: ServiceItem, newQuantity: number, itemListType: 'included' | 'extra') => {
    setBooking(prev => {
      if (!prev) return null;
      let itemsList: BookingItem[] = itemListType === 'included' ? [...prev.configuredIncludedItems] : [...prev.configuredExtraItems];
      const itemIndex = itemsList.findIndex(bi => bi.itemId === item.id);

      if (newQuantity > 0) {
        if (itemIndex > -1) {
          itemsList[itemIndex] = { ...itemsList[itemIndex], quantity: newQuantity };
        } else {
          itemsList.push({ itemId: item.id, name: item.name, quantity: newQuantity, pricePerUnit: item.basePrice });
        }
      } else { // Quantity is 0 or less
        if (itemListType === 'extra') { // Extras can be removed
          itemsList = itemsList.filter(bi => bi.itemId !== item.id);
        } else { // Included items must meet minQuantity
            const config = selectedService?.includedItems.find(i => i.id === item.id);
            if (config && newQuantity >= config.minQuantity) {
                 if (itemIndex > -1) itemsList[itemIndex] = { ...itemsList[itemIndex], quantity: newQuantity };
            } else if (config && newQuantity < config.minQuantity && itemIndex > -1) {
                // If trying to go below min, set to min
                itemsList[itemIndex] = { ...itemsList[itemIndex], quantity: config.minQuantity };
            }
        }
      }
      return itemListType === 'included' ? { ...prev, configuredIncludedItems: itemsList } : { ...prev, configuredExtraItems: itemsList };
    });
  };
  
  const toggleExtraItemCheckbox = (item: ExtraItemConfig, checked: boolean) => {
    updateItemQuantity(item, checked ? 1 : 0, 'extra');
  };

  const totalPrice = useMemo(() => {
    if (!booking || !selectedService) return 0;
    let total = booking.serviceBasePrice;
    
    booking.configuredIncludedItems.forEach(item => {
      const config = selectedService.includedItems.find(i => i.id === item.itemId);
      if (config) total += item.quantity * config.basePrice;
    });
    booking.configuredExtraItems.forEach(item => {
      const config = selectedService.extraItems.find(i => i.id === item.itemId);
      if (config) total += item.quantity * config.basePrice;
    });

    if (!booking.preferences.hasCleaningProducts) total += CLEANING_PRODUCTS_FEE;
    if (!booking.preferences.hasCleaningEquipment) total += CLEANING_EQUIPMENT_FEE;
    
    total *= booking.numberOfDays;
    // Apply discounts if any (future implementation)
    // total -= booking.pointsApplied * 100; // 1 point = $1
    return total;
  }, [booking, selectedService]);

  const handleRecurrenceChange = (newRecurrence: RecurrenceType) => {
    handleInputChange('recurrence', newRecurrence);
    let title = '';
    let message = '';
    if (newRecurrence === RecurrenceType.Weekly) {
        title = "Weekly Recurrence";
        message = "The Weekly recurrence will execute the chosen service weekly at the specified address until this contract is concluded or cancelled. Payment will be processed 48h before each service.";
    } else if (newRecurrence === RecurrenceType.Fortnightly) {
        title = "Fortnightly Recurrence";
        message = "The Fortnightly recurrence will execute the chosen service every 15 days at the specified address until this contract is concluded or cancelled. Payment will be processed 48h before each service.";
    } else if (newRecurrence === RecurrenceType.Monthly) {
        title = "Monthly Recurrence";
        message = "The Monthly recurrence will execute the chosen service every 30 days at the specified address until this contract is concluded or cancelled. Payment will be processed 48h before each service.";
    }
    if (title && message) {
        setRecurrenceWarningModal({title, message});
    }
  };

  const renderItemSection = (title: string, items: (IncludedItemConfig | ExtraItemConfig)[], itemListType: 'included' | 'extra') => (
    <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map(item => {
          const currentBookingItem = (itemListType === 'included' ? booking?.configuredIncludedItems : booking?.configuredExtraItems)?.find(bi => bi.itemId === item.id);
          const quantity = currentBookingItem?.quantity || 0;
          
          // Determine item's specific UI type ('checkbox' or 'counter') if it's an ExtraItemConfig
          const itemSpecificUiType = itemListType === 'extra' ? (item as ExtraItemConfig).type : undefined;
          // Get IncludedItemConfig if item is of that type, for accessing minQuantity
          const includedConfig = itemListType === 'included' ? (item as IncludedItemConfig) : null;

          return (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow">
              <div className="flex-grow mb-2 sm:mb-0">
                <div className="flex items-center">
                  <h4 className="text-lg text-gray-800">{item.name}</h4>
                  <button onClick={() => setInfoModalContent({ title: item.name, description: item.description })} className="ml-2 text-primary hover:text-blue-700">
                    <InfoIcon />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {/* Both IncludedItemConfig and ExtraItemConfig have defaultQuantity */}
                  Price: ${((item.basePrice * (quantity || item.defaultQuantity || 0 )) / 100).toFixed(2)}
                  {/* Show total for counter type only if it's an extra item and quantity > 0 */}
                  {itemListType === 'extra' && itemSpecificUiType === 'counter' && quantity > 0 ? ` (Total: $${(item.basePrice * quantity / 100).toFixed(2)})` : ''}
                </p>
                 {/* Show Min quantity only for included items */}
                 {itemListType === 'included' && includedConfig && <p className="text-xs text-gray-500">Min: {includedConfig.minQuantity}</p>}
              </div>
              <div className="flex-shrink-0">
                {/* Render checkbox for extra items of type 'checkbox' */}
                {itemListType === 'extra' && itemSpecificUiType === 'checkbox' ? (
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-6 w-6 text-primary rounded focus:ring-primary border-gray-300"
                    checked={quantity > 0}
                    onChange={(e) => toggleExtraItemCheckbox(item as ExtraItemConfig, e.target.checked)} 
                  />
                ) : (
                  // Render ItemCounter for included items or extra items of type 'counter'
                  <ItemCounter
                    quantity={quantity}
                    onIncrement={() => updateItemQuantity(item, quantity + 1, itemListType)}
                    onDecrement={() => updateItemQuantity(item, quantity - 1, itemListType)}
                    minQuantity={itemListType === 'included' && includedConfig ? includedConfig.minQuantity : 0}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcodeError) {
        alert("Please fix the errors in the form before proceeding.");
        return;
    }
    if (!booking?.address || !booking?.postcode || !booking?.customerInfo.firstName || !booking?.customerInfo.email) {
        alert("Please fill in all required fields: Address, Postcode, First Name, Email.");
        return;
    }
    setShowSummaryModal(true);
  };

  const handleFinalCheckout = () => {
    if (!booking?.agreedToTerms) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
    console.log("Final Booking Details:", booking, "Total Price:", totalPrice);
    alert(`Booking submitted! Total: $${(totalPrice / 100).toFixed(2)}. Check console for details. (Stripe integration would be here)`);
    setShowSummaryModal(false);
    navigate('/');
  };
  
  const getRecurrenceSuffix = (recurrence: RecurrenceType) => {
    switch(recurrence) {
        case RecurrenceType.Weekly: return "weeks";
        case RecurrenceType.Fortnightly: return "fortnights";
        case RecurrenceType.Monthly: return "months";
        default: return "";
    }
  };

  if (!selectedService || !booking) {
    return <div className="text-center p-10">Loading booking details or service not found...</div>;
  }

  const getRepetitionDates = () => {
    if (!booking || booking.recurrence === RecurrenceType.OneTime || !booking.selectedDate) return [];
    const dates = [];
    // Ensure date is parsed in UTC to avoid timezone shifts if only date string is available
    const [year, month, day] = booking.selectedDate.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day));
    
    const contractLength = booking.contractDuration || 2; 

    for (let i = 1; i < contractLength; i++) { 
        const nextDate = new Date(startDate.getTime()); // Clone startDate
        if (booking.recurrence === RecurrenceType.Weekly) {
            nextDate.setUTCDate(startDate.getUTCDate() + (7 * i));
        } else if (booking.recurrence === RecurrenceType.Fortnightly) {
            nextDate.setUTCDate(startDate.getUTCDate() + (14 * i)); // Corrected to 14 for fortnightly
        } else if (booking.recurrence === RecurrenceType.Monthly) {
            const expectedMonth = (startDate.getUTCMonth() + i) % 12;
            nextDate.setUTCMonth(startDate.getUTCMonth() + i);
            // If month rolled over to an unexpected month (e.g. Jan 31 + 1 month = Mar 3), set to last day of correct previous month
            if (nextDate.getUTCMonth() !== expectedMonth) {
                nextDate.setUTCDate(0); // Sets to the last day of the previous month
            }
        }
        dates.push(nextDate.toLocaleDateString('en-AU', { timeZone: 'UTC' }));
    }
    return dates;
  };

  const contractDurationOptions = () => {
    if (!booking || booking.recurrence === RecurrenceType.OneTime) return [];
    const maxDuration = 12; 
    const options = [];
    for (let i = 2; i <= maxDuration; i++) { 
        options.push({ value: i, label: `${i} ${getRecurrenceSuffix(booking.recurrence)}` });
    }
    return options;
  };
  

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Arrange your service: {selectedService.name}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <section className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Enter your Address" id="address" value={booking.address} onChange={val => handleInputChange('address', val)} required placeholder="e.g. 123 Example St, Sydney" />
            <FormInput label="Postcode" id="postcode" value={booking.postcode} onChange={handlePostcodeChange} required placeholder="e.g. 2000" error={postcodeError}/>
            <FormSelect label="Recurrence" id="recurrence" value={booking.recurrence} onChange={val => handleRecurrenceChange(val as RecurrenceType)} options={RECURRENCE_OPTIONS} required />
            <FormInput label="Number of Days" id="numberOfDays" type="number" value={String(booking.numberOfDays)} onChange={val => handleInputChange('numberOfDays', parseInt(val) || 1)} required min="1" />
            <FormInput label="Date" id="date" type="date" value={booking.selectedDate} onChange={val => handleInputChange('selectedDate', val)} required 
                       min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
            />
            <FormSelect label="Time Window" id="time_window" value={booking.timeWindow} onChange={val => handleInputChange('timeWindow', val)} options={TIME_SLOTS} required />
          </div>
        </section>

        {selectedService.includedItems.length > 0 && renderItemSection('Included Items (adjust quantities)', selectedService.includedItems, 'included')}
        {selectedService.extraItems.length > 0 && renderItemSection('Optional Extras', selectedService.extraItems, 'extra')}
        
        <section className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormCheckbox label="I will be at the property" id="willBeHome" checked={booking.preferences.willBeHome} onChange={val => handlePreferencesChange('willBeHome', val)} />
                {!booking.preferences.willBeHome && (
                    <FormInput label="Access Info (if not home)" id="accessInfo" value={booking.preferences.accessInfo} onChange={val => handlePreferencesChange('accessInfo', val)} placeholder="e.g. Key under mat, code 1234" />
                )}
                <FormCheckbox label="I have pets" id="hasPets" checked={booking.preferences.hasPets} onChange={val => handlePreferencesChange('hasPets', val)} />
                {booking.preferences.hasPets && (
                    <FormInput label="Pet Details (optional)" id="petsDetails" value={booking.preferences.petsDetails} onChange={val => handlePreferencesChange('petsDetails', val)} placeholder="e.g. Friendly dog, cat hides" />
                )}
                 <FormCheckbox label="I have allergies" id="hasAllergies" checked={booking.preferences.hasAllergies} onChange={val => handlePreferencesChange('hasAllergies', val)} />
                {booking.preferences.hasAllergies && (
                    <FormInput label="Allergy Details" id="allergiesDetails" value={booking.preferences.allergiesDetails} onChange={val => handlePreferencesChange('allergiesDetails', val)} placeholder="e.g. Allergic to dust, specific chemical" required={booking.preferences.hasAllergies} />
                )}
                <FormCheckbox label="I will provide cleaning products" id="hasCleaningProducts" checked={booking.preferences.hasCleaningProducts} onChange={val => handlePreferencesChange('hasCleaningProducts', val)} 
                    sublabel={!booking.preferences.hasCleaningProducts ? `A $${(CLEANING_PRODUCTS_FEE/100).toFixed(2)} fee will be added.` : ''} />
                <FormCheckbox label="I will provide cleaning equipment (Mop & Vacuum)" id="hasCleaningEquipment" checked={booking.preferences.hasCleaningEquipment} onChange={val => handlePreferencesChange('hasCleaningEquipment', val)} 
                    sublabel={!booking.preferences.hasCleaningEquipment ? `A $${(CLEANING_EQUIPMENT_FEE/100).toFixed(2)} fee will be added.` : ''} />
            </div>
        </section>

        <section className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="First Name" id="firstName" value={booking.customerInfo.firstName} onChange={val => handleCustomerInfoChange('firstName', val)} required />
                <FormInput label="Last Name" id="lastName" value={booking.customerInfo.lastName} onChange={val => handleCustomerInfoChange('lastName', val)} required />
                <FormInput label="Email" id="email" type="email" value={booking.customerInfo.email} onChange={val => handleCustomerInfoChange('email', val)} required />
                <FormInput label="Mobile Number" id="phone" type="tel" value={booking.customerInfo.phone} onChange={val => handleCustomerInfoChange('phone', val)} required />
                <FormInput label="ABN or TFN (Optional)" id="abnOrTfn" value={booking.customerInfo.abnOrTfn} onChange={val => handleCustomerInfoChange('abnOrTfn', val)} />
            </div>
        </section>
        
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-top z-40 flex justify-between items-center">
            <div>
                <span className="font-semibold">{booking.numberOfDays} Day(s)</span> - Total: <span className="text-xl font-bold">${(totalPrice / 100).toFixed(2)}</span>
            </div>
            <button 
                type="submit"
                className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
                disabled={!!postcodeError}
            >
                Proceed to Checkout
            </button>
        </div>
      </form>
      
      {recurrenceWarningModal && (
        <Modal isOpen={true} onClose={() => setRecurrenceWarningModal(null)} title={recurrenceWarningModal.title}>
            <p className="text-gray-600">{recurrenceWarningModal.message}</p>
            <button onClick={() => setRecurrenceWarningModal(null)} className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-blue-600">
                Acknowledge
            </button>
        </Modal>
      )}

      {infoModalContent && (
        <Modal isOpen={true} onClose={() => setInfoModalContent(null)} title={infoModalContent.title}>
          <p className="text-gray-600">{infoModalContent.description}</p>
        </Modal>
      )}

      <Modal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)} title="Booking Summary" size="xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
            <p><strong>Address:</strong> {booking.address}, {booking.postcode}</p>
            {/* Ensure date is parsed correctly, considering potential timezone issues with only date string */}
            <p><strong>Date:</strong> {new Date(booking.selectedDate.replace(/-/g, '/')).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} for {booking.numberOfDays} day(s)</p>
            <p><strong>Time:</strong> {TIME_SLOTS.find(ts => ts.value === booking.timeWindow)?.label}</p>
            <p><strong>Recurrence:</strong> {RECURRENCE_OPTIONS.find(ro => ro.value === booking.recurrence)?.label}</p>

            <div className="mt-2">
                <h4 className="font-semibold">Included Items:</h4>
                {booking.configuredIncludedItems.filter(i => i.quantity > 0).length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {booking.configuredIncludedItems.filter(i => i.quantity > 0).map(item => <li key={item.itemId}>{item.name} x {item.quantity}</li>)}
                    </ul>
                ) : <p className="text-sm text-gray-500">None selected beyond defaults.</p>}
            </div>
            <div className="mt-2">
                <h4 className="font-semibold">Extra Items:</h4>
                {booking.configuredExtraItems.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {booking.configuredExtraItems.map(item => <li key={item.itemId}>{item.name} x {item.quantity}</li>)}
                    </ul>
                ) : <p className="text-sm text-gray-500">No extra items selected.</p>}
            </div>

            {booking.recurrence !== RecurrenceType.OneTime && (
                <>
                    <FormSelect label="Contract Duration" id="contractDuration" value={String(booking.contractDuration)} 
                        onChange={val => handleInputChange('contractDuration', parseInt(val))} 
                        options={contractDurationOptions()} required
                    />
                    {getRepetitionDates().length > 0 && (
                         <div className="mt-2">
                            <h4 className="font-semibold">Future Service Dates (examples):</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {getRepetitionDates().slice(0,3).map((dateStr, idx) => <li key={idx}>{dateStr}</li>)}
                                {getRepetitionDates().length > 3 && <li>...and so on.</li>}
                            </ul>
                        </div>
                    )}
                </>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormInput label="Discount Code" id="discountCode" value={booking.discountCode} onChange={val => handleInputChange('discountCode', val)} placeholder="Enter code" />
                <FormInput label="Apply Points (1 point = $1)" id="pointsApplied" type="number" value={String(booking.pointsApplied)} onChange={val => handleInputChange('pointsApplied', parseInt(val) || 0)} min="0" />
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="font-bold text-lg">Total Price: ${(totalPrice / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-600">Note: For recurring services, this is the price per occurrence. Payment will be processed 48 hours before each scheduled service.</p>
            </div>

            <div className="mt-6 border-t pt-4">
                 <FormCheckbox label="I agree to the Terms and Conditions" id="agreedToTerms" checked={booking.agreedToTerms} onChange={val => handleInputChange('agreedToTerms', val)} />
                 <div className="mt-2 text-xs text-gray-500 h-20 overflow-y-auto border p-2 rounded">
                    <strong>Terms & Conditions (Summary):</strong><br/>
                    - Service will be provided as configured on the selected date(s) and time window.<br/>
                    - For recurring services, the service will repeat as per the chosen frequency and contract duration.<br/>
                    - Payment is due 48 hours prior to each service execution. Card details will be captured now, and charged automatically.<br/>
                    - Cancellations or rescheduling must be made at least 48 hours in advance to avoid fees.<br/>
                    - Early termination of a recurring contract may incur a penalty proportional to the remaining contract term.<br/>
                    - The company is not liable for pre-existing damages. Please report any service issues within 24 hours.<br/>
                    - By checking this box, you confirm all details are correct and agree to these terms.
                 </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setShowSummaryModal(false)} className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                Back to Edit
            </button>
            <button 
                onClick={handleFinalCheckout} 
                disabled={!booking.agreedToTerms}
                className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Confirm & Proceed to Payment
            </button>
        </div>
      </Modal>
      <style>{`
        .shadow-top { box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06); }
      `}</style>
    </div>
  );
};

export default BookingPage;
