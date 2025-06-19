
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Price in AUD cents
}

export interface IncludedItemConfig extends ServiceItem {
  minQuantity: number;
  defaultQuantity: number;
}

export interface ExtraItemConfig extends ServiceItem {
  defaultQuantity: number;
  type: 'checkbox' | 'counter';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  basePrice: number; // Price for the service itself, in AUD cents
  availablePostcodes: string[];
  isEnabled: boolean;
  includedItems: IncludedItemConfig[];
  extraItems: ExtraItemConfig[];
}

export enum RecurrenceType {
  OneTime = 'one-time',
  Weekly = 'weekly',
  Fortnightly = 'fortnightly',
  Monthly = 'monthly',
}

export interface BookingItem {
  itemId: string;
  name: string; // Keep name for summary
  quantity: number;
  pricePerUnit: number; // Keep price for summary
}

export interface BookingPreferences {
  willBeHome: boolean;
  accessInfo: string;
  hasAllergies: boolean;
  allergiesDetails: string;
  hasPets: boolean;
  petsDetails: string;
  hasCleaningProducts: boolean; // True if user has, false if needs to be provided (adds cost)
  hasCleaningEquipment: boolean; // True if user has, false if needs to be provided (adds cost)
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  abnOrTfn: string;
}

export interface Booking {
  serviceId: string | null;
  serviceName: string;
  serviceBasePrice: number;
  address: string;
  postcode: string;
  recurrence: RecurrenceType;
  selectedDate: string; // ISO string e.g. "2024-07-28"
  numberOfDays: number;
  timeWindow: string; // e.g., "07:00-08:00"
  configuredIncludedItems: BookingItem[];
  configuredExtraItems: BookingItem[];
  preferences: BookingPreferences;
  customerInfo: CustomerInfo;
  contractDuration: number; // In terms of recurrence type (e.g., 2 for 2 weeks/months)
  agreedToTerms: boolean;
  discountCode: string;
  pointsApplied: number;
}

export interface TimeSlot {
  value: string; // "07:00"
  label: string; // "07:00 - 08:00"
}
