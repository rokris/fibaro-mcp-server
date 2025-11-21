/**
 * Fibaro Home Center 2 API Client
 */

import axios, { AxiosInstance } from 'axios';
import https from 'https';

export interface FibaroDevice {
  id: number;
  name: string;
  roomID: number;
  type: string;
  enabled?: boolean;
  visible?: boolean;
  properties?: Record<string, any>;
  actions?: Record<string, any>;
  interfaces?: string[];
  baseType?: string;
}

export interface FibaroIcon {
  id: number;
  deviceType?: string;
  iconSetName?: string;
  name?: string;
}

export type FibaroIconsResponse = FibaroIcon[] | { device: FibaroIcon[] };

export interface FibaroRoom {
  id: number;
  name: string;
  sectionID?: number;
}

export interface FibaroScene {
  id: number;
  name: string;
  roomID: number;
  type?: string;
  enabled?: boolean;
  autostart?: boolean;
  runConfig?: string;
  runningInstances?: number;
  visible?: boolean;
  isLua?: boolean;
  triggers?: {
    properties?: any[];
    globals?: any[];
    events?: any[];
    weather?: any[];
  };
  actions?: {
    devices?: any[];
    scenes?: any[];
    groups?: any[];
  };
  lua?: string;
  html?: string;
}

export interface FibaroSystemInfo {
  serialNumber: string;
  hcVersion: string;
  platform: string;
  mac: string;
}

export interface FibaroGlobalVariable {
  name: string;
  value: string;
  modified: number;
  isEnum?: boolean;
  enumValues?: string[];
}

export class FibaroClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(
    host: string,
    username: string,
    password: string,
    useHttps: boolean = false,
    timeout: number = 30000
  ) {
    const protocol = useHttps ? 'https' : 'http';
    this.baseUrl = `${protocol}://${host}/api`;

    this.client = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username,
        password,
      },
      timeout,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Disable SSL verification for local network
      }),
    });
  }

  /**
   * Get all devices
   */
  async getDevices(): Promise<FibaroDevice[]> {
    const response = await this.client.get<FibaroDevice[]>('/devices');
    return response.data;
  }

  /**
   * Get specific device by ID
   */
  async getDevice(deviceId: number): Promise<FibaroDevice> {
    const response = await this.client.get<FibaroDevice>(`/devices/${deviceId}`);
    return response.data;
  }

  /**
   * Call an action on a device
   */
  async callAction(deviceId: number, action: string, args?: any[]): Promise<any> {
    const response = await this.client.post(`/devices/${deviceId}/action/${action}`, {
      args: args || [],
    });
    return response.data;
  }

  /**
   * Get all rooms
   */
  async getRooms(): Promise<FibaroRoom[]> {
    const response = await this.client.get<FibaroRoom[]>('/rooms');
    return response.data;
  }

  /**
   * Get specific room by ID
   */
  async getRoom(roomId: number): Promise<FibaroRoom> {
    const response = await this.client.get<FibaroRoom>(`/rooms/${roomId}`);
    return response.data;
  }

  /**
   * Get all scenes
   */
  async getScenes(): Promise<FibaroScene[]> {
    const response = await this.client.get<FibaroScene[]>('/scenes');
    return response.data;
  }

  /**
   * Get specific scene by ID
   */
  async getScene(sceneId: number): Promise<FibaroScene> {
    const response = await this.client.get<FibaroScene>(`/scenes/${sceneId}`);
    return response.data;
  }

  /**
   * Trigger/execute a scene
   */
  async triggerScene(sceneId: number): Promise<any> {
    const response = await this.client.post(`/scenes/${sceneId}/action/start`);
    return response.data;
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<FibaroSystemInfo> {
    const response = await this.client.get<FibaroSystemInfo>('/settings/info');
    return response.data;
  }

  /**
   * Get weather information
   */
  async getWeather(): Promise<any> {
    const response = await this.client.get('/weather');
    return response.data;
  }

  /**
   * Get location information
   */
  async getLocation(): Promise<any> {
    const response = await this.client.get('/panels/location');
    return response.data;
  }

  /**
   * Get system diagnostics
   */
  async getDiagnostics(): Promise<any> {
    const response = await this.client.get('/diagnostics');
    return response.data;
  }

  /**
   * Get icons metadata
   */
  async getIcons(): Promise<FibaroIconsResponse> {
    const response = await this.client.get('/icons');
    return response.data;
  }

  /**
   * Get consumption listings / reports
   */
  async getConsumption(): Promise<any> {
    const response = await this.client.get('/consumption');
    return response.data;
  }

  /**
   * Get iOS devices registered with the system
   */
  async getIOSDevices(): Promise<any[]> {
    const response = await this.client.get('/iosDevices');
    return response.data;
  }

  /**
   * Get RGB programs
   */
  async getRGBPrograms(): Promise<any[]> {
    const response = await this.client.get('/RGBPrograms');
    return response.data;
  }

  /**
   * Get tracking schedules
   */
  async getTrackingSchedules(): Promise<any[]> {
    const response = await this.client.get('/trackingSchedules');
    return response.data;
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<any[]> {
    const response = await this.client.get('/users');
    return response.data;
  }

  /**
   * Get specific user by ID
   */
  async getUser(userId: number): Promise<any> {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  /**
   * Get all sections
   */
  async getSections(): Promise<any[]> {
    const response = await this.client.get('/sections');
    return response.data;
  }

  /**
   * Get specific section by ID
   */
  async getSection(sectionId: number): Promise<any> {
    const response = await this.client.get(`/sections/${sectionId}`);
    return response.data;
  }

  /**
   * Get energy consumption
   */
  async getEnergy(type: string, id: number): Promise<any> {
    const response = await this.client.get(`/panels/energy?type=${type}&id=${id}`);
    return response.data;
  }

  /**
   * Get temperature data
   */
  async getTemperaturePanel(type: string, method: string, id: number): Promise<any> {
    const response = await this.client.get(`/panels/temperature?type=${type}&method=${method}&id=${id}`);
    return response.data;
  }

  /**
   * Get all global variables
   */
  async getGlobalVariables(): Promise<FibaroGlobalVariable[]> {
    const response = await this.client.get<FibaroGlobalVariable[]>('/globalVariables');
    return response.data;
  }

  /**
   * Get specific global variable by name
   */
  async getGlobalVariable(varName: string): Promise<FibaroGlobalVariable> {
    const response = await this.client.get<FibaroGlobalVariable>(`/globalVariables/${varName}`);
    return response.data;
  }

  /**
   * Set a global variable value
   */
  async setGlobalVariable(varName: string, value: any): Promise<any> {
    const response = await this.client.put(`/globalVariables/${varName}`, {
      value: String(value),
    });
    return response.data;
  }

  /**
   * Get aggregated home status
   */
  async getHomeStatus(): Promise<any> {
    const [devices, rooms, weather] = await Promise.all([
      this.getDevices(),
      this.getRooms(),
      this.getWeather(),
    ]);

    const activeDevices = devices.filter((d) => {
      // Check for lights/switches that are ON
      if (d.properties && (d.properties.value === 'true' || d.properties.value > 0)) {
        // Exclude sensors and main controllers from "active" list if they are just reporting data
        const type = (d.type || '').toLowerCase();
        if (
          type.includes('sensor') ||
          type.includes('meter') ||
          type.includes('thermostat') ||
          type.includes('smoke') ||
          type.includes('remote')
        ) {
          return false;
        }
        return true;
      }
      return false;
    });

    const breachedSensors = devices.filter((d) => {
      // Check for motion/door sensors that are breached/active
      if (d.properties && (d.properties.value === 'true' || d.properties.value > 0)) {
        const type = (d.type || '').toLowerCase();
        if (type.includes('motion') || type.includes('door') || type.includes('window')) {
          return true;
        }
      }
      return false;
    });

    const temperatures = devices
      .filter((d) => d.type && d.type.toLowerCase().includes('temperature'))
      .map((d) => ({
        id: d.id,
        name: d.name,
        value: d.properties ? parseFloat(d.properties.value) : null,
        roomID: d.roomID,
      }))
      .filter((t) => t.value !== null && !isNaN(t.value));

    const avgTemp =
      temperatures.length > 0
        ? temperatures.reduce((sum, t) => sum + (t.value || 0), 0) / temperatures.length
        : null;

    // Map room names to IDs for easier lookup
    const roomMap = new Map(rooms.map((r) => [r.id, r.name]));

    return {
      weather,
      activeDevices: activeDevices.map((d) => ({
        id: d.id,
        name: d.name,
        room: roomMap.get(d.roomID) || 'Unknown',
        value: d.properties?.value,
      })),
      breachedSensors: breachedSensors.map((d) => ({
        id: d.id,
        name: d.name,
        room: roomMap.get(d.roomID) || 'Unknown',
        value: d.properties?.value,
      })),
      temperature: {
        average: avgTemp ? parseFloat(avgTemp.toFixed(1)) : null,
        sensors: temperatures.map((t) => ({
          name: t.name,
          value: t.value,
          room: roomMap.get(t.roomID) || 'Unknown',
        })),
      },
    };
  }
}
