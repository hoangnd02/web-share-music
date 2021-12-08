
export interface User {
  uid: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  email: string | null;
  state: string | null;
  role: string | null;
}

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warn = 'warn'
}

export enum Placement {
  BottomLeft = "bottomLeft",
  BottomCenter = "bottomCenter",
  BottomRight = "bottomRight",
  TopLeft = "topLeft",
  TopCenter = "topCenter",
  TopRight = "topRight",
}
export interface NotificationOptions {
  title: string;
  description?: string;
  placement?: Placement;
  duration?: number;
}
  