import { TestcaseStatus, UserRole } from "./app.enum";

export interface ITestOutput {
  id: string;
  name: string;
  description: string;
  status: TestcaseStatus;
  conversation: IConversation[];
  screenshots: IScreenshot[];
  console: {
    logs: IConsoleLog[];
    requests: IConsoleRequest[];
  };
}

export interface IConversation {
  id: string;
  role: UserRole | string;
  message: string;
  screenshotId?: string;
}

export interface IScreenshot {
  id: string;
  timestamp: string;
  description?: string;
  image: string;
}

export interface IConsoleLog {
  type: string;
  level: string;
  text: string;
  location: string;
  timestamp: string;
}

export interface IConsoleRequest {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  request: any;
  response: any;
}

export interface ITestSummary {
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  tests: ITestOutput[];
}
