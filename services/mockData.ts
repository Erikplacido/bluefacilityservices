
import { Service, IncludedItemConfig, ExtraItemConfig } from '../types';

const includedBedrooms: IncludedItemConfig = {
  id: 'inc-bed', name: 'Bedrooms', description: 'Standard cleaning for bedrooms: dusting, vacuuming, surfaces.', basePrice: 2500, minQuantity: 1, defaultQuantity: 1
};
const includedBathrooms: IncludedItemConfig = {
  id: 'inc-bath', name: 'Bathrooms', description: 'Standard cleaning for bathrooms: toilet, shower, sink, floor.', basePrice: 3000, minQuantity: 1, defaultQuantity: 1
};
const includedFloors: IncludedItemConfig = {
  id: 'inc-floor', name: 'Floors (Common Areas)', description: 'Vacuuming and mopping of common area floors.', basePrice: 2000, minQuantity: 1, defaultQuantity: 1
};

const extraFridge: ExtraItemConfig = {
  id: 'ext-fridge', name: 'Clean Inside Fridge', description: 'Thorough cleaning of the inside of your refrigerator.', basePrice: 2000, defaultQuantity: 0, type: 'checkbox'
};
const extraOven: ExtraItemConfig = {
  id: 'ext-oven', name: 'Clean Inside Oven', description: 'Detailed cleaning of the inside of your oven.', basePrice: 3500, defaultQuantity: 0, type: 'checkbox'
};
const extraWindows: ExtraItemConfig = {
  id: 'ext-windows', name: 'Interior Windows (per window)', description: 'Cleaning of interior side of windows.', basePrice: 800, defaultQuantity: 0, type: 'counter'
};
const extraLaundry: ExtraItemConfig = {
    id: 'ext-laundry', name: 'Laundry Wash & Fold (per load)', description: 'Wash and fold one load of laundry.', basePrice: 2500, defaultQuantity: 0, type: 'counter'
};


export const SERVICES_DATA: Service[] = [
  {
    id: 'house-cleaning',
    name: 'Standard House Cleaning',
    description: 'Comprehensive cleaning for a sparkling home.',
    longDescription: 'Our standard house cleaning service covers all the essentials to make your home shine. This includes dusting all surfaces, vacuuming carpets and rugs, mopping hard floors, cleaning bathrooms (toilets, showers, sinks, mirrors), and tidying the kitchen (wiping countertops, sink, exterior of appliances). Perfect for regular upkeep.',
    imageUrl: 'https://picsum.photos/seed/house/400/300',
    basePrice: 5000, // Base price for the service visit, e.g. call-out fee
    availablePostcodes: ['2000', '2001', '3000', '3001'],
    isEnabled: true,
    includedItems: [includedBedrooms, includedBathrooms, includedFloors],
    extraItems: [extraFridge, extraOven, extraWindows, extraLaundry],
  },
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning Service',
    description: 'Intensive cleaning for a thorough refresh.',
    longDescription: 'Our deep cleaning service goes beyond the standard clean. It includes everything in the standard service plus more detailed work like cleaning baseboards, light fixtures, window sills, door frames, and tackling hard-to-reach areas. Ideal for a seasonal clean or preparing for a special occasion.',
    imageUrl: 'https://picsum.photos/seed/deepclean/400/300',
    basePrice: 8000,
    availablePostcodes: ['2000', '3000', '4000'],
    isEnabled: true,
    includedItems: [
        {...includedBedrooms, basePrice: 3500, minQuantity: 1, defaultQuantity: 1}, 
        {...includedBathrooms, basePrice: 4000, minQuantity: 1, defaultQuantity: 1},
        {...includedFloors, basePrice: 2500, minQuantity: 1, defaultQuantity: 1},
        {id: 'inc-kitchen', name: 'Kitchen Deep Clean', description: 'Detailed cleaning of kitchen surfaces, including microwave interior.', basePrice: 3000, minQuantity: 1, defaultQuantity: 1}
    ],
    extraItems: [extraFridge, extraOven, extraWindows, {...extraLaundry, basePrice: 3000}],
  },
  {
    id: 'office-cleaning',
    name: 'Office Cleaning',
    description: 'Keep your workspace pristine and productive.',
    longDescription: 'Professional cleaning services tailored for office environments. We cover workstations, common areas, restrooms, and kitchenettes. Services include dusting, vacuuming, trash removal, and sanitization of high-touch surfaces. Create a healthier and more productive workspace for your team.',
    imageUrl: 'https://picsum.photos/seed/office/400/300',
    basePrice: 10000, // Often priced per sq ft or hour, simplified here
    availablePostcodes: ['2000', '2005', '2010'],
    isEnabled: true,
    includedItems: [
        {id: 'inc-desks', name: 'Workstations (per 5)', description: 'Cleaning of desks and surrounding areas.', basePrice: 5000, minQuantity:1, defaultQuantity: 1},
        {id: 'inc-common', name: 'Common Areas', description: 'Cleaning of reception, hallways.', basePrice: 4000, minQuantity:1, defaultQuantity: 1},
        {id: 'inc-restroom', name: 'Restrooms (per unit)', description: 'Cleaning and sanitizing office restrooms.', basePrice: 3000, minQuantity:1, defaultQuantity: 1},
    ],
    extraItems: [
        {...extraWindows, name: 'Office Interior Windows (per large pane)', basePrice: 1500},
        {id: 'ext-kitchenette', name: 'Kitchenette Deep Clean', description: 'Detailed cleaning of office kitchenette.', basePrice: 4000, defaultQuantity: 0, type: 'checkbox'}
    ],
  },
  {
    id: 'disabled-service',
    name: 'Gardening Service (Coming Soon)',
    description: 'Currently unavailable. Check back later!',
    imageUrl: 'https://picsum.photos/seed/gardening/400/300',
    basePrice: 0,
    availablePostcodes: [],
    isEnabled: false,
    includedItems: [],
    extraItems: [],
  }
];
