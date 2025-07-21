

/**
 * NOTE: This service uses browser `localStorage` for data persistence.
 * This implementation ensures that each user's data is stored separately on their own device.
 * However, data is not shared across different devices or browsers, and it is not
 * encrypted. For a production environment requiring data synchronization or enhanced
 * security, a dedicated backend service with a database would be necessary.
 */
import { AppData } from '../components/types';

export const saveAppData = (data: AppData, email: string): void => {
  if (!email) {
      console.error("Cannot save app data without a user email.");
      return;
  }
  const APP_DATA_KEY = `medicalLabQCAppData_${email}`;
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(APP_DATA_KEY, serializedData);
  } catch (error) {
    console.error("Error saving data to local storage:", error);
    // Potentially show an error message to the user
  }
};

export const loadAppData = (email: string): AppData | null => {
   if (!email) {
      console.error("Cannot load app data without a user email.");
      return null;
  }
  const APP_DATA_KEY = `medicalLabQCAppData_${email}`;
  try {
    const serializedData = localStorage.getItem(APP_DATA_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as AppData;
  } catch (error) {
    console.error("Error loading data from local storage:", error);
    // Potentially clear corrupted data or return null
    // localStorage.removeItem(APP_DATA_KEY); 
    return null;
  }
};
