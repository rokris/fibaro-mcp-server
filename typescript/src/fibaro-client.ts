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
}

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
    const response = await this.client.get('/panels/weather');
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
}
