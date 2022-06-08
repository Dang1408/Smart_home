import AsyncStorage from '@react-native-async-storage/async-storage';

const BUILDINGS_STORAGE_KEY: string = "@safe1:buildings";
const DEFAULT_BUILDING_STORAGE_KEY: string = "@safe1:default-building";
const USER_STORAGE_KEY: string = "@safe1:user";

class StorageService {
  async set(payload: any, key: string) {
    try {
      let decodedPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(key, decodedPayload);
    } catch (err) {
      console.error(`Error setting ${key} AsyncStorage: ${err}`);
    }
  }

  async get(key: string): Promise<any> {
    try {
      let decodedPayload = await AsyncStorage.getItem(key);
      return decodedPayload != null ? JSON.parse(decodedPayload) : null;
    } catch (err) {
      console.log(`Error getting ${key} AsyncStorage: ${err}`);
    }
  }

  async setUser(user: any) {
    return await this.set(user, USER_STORAGE_KEY);
  }

  async getUser(): Promise<any> {
    return await this.get(USER_STORAGE_KEY);
  }

  async setBuildings(buildings: any) {
    return await this.set(buildings, BUILDINGS_STORAGE_KEY);
  }

  async getBuildings(): Promise<any> {
    return await this.get(BUILDINGS_STORAGE_KEY);
  }

  async setDefaultBuilding(building: any) {
    return await this.set(building, DEFAULT_BUILDING_STORAGE_KEY);
  }

  async getDefaultBuilding(): Promise<any> {
    return await this.get(DEFAULT_BUILDING_STORAGE_KEY);
  }

  async clear() {
    try {
      let keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch(err) {
      console.error("Error clearing AsyncStorage");
    }
  }
};

export default new StorageService();