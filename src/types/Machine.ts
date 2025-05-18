export interface Machine {
  machineId: string;
  timestamp: string;
  hostname: string;
  platform: string;
  osVersion: string;
  model: string;
  checks: {
    diskEncryption: {
      encrypted: boolean;
      details: string;
    };
    osUpdates: {
      upToDate: boolean;
      details: string;
    };
    antivirus: {
      installed: boolean;
      enabled: boolean;
      details: string;
    };
    sleepSettings: {
      compliant: boolean;
      timeoutMinutes: number;
      details: string;
    };
  };
}