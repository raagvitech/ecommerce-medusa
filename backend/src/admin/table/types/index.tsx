// types.ts
export type Product = {
    id: string;
    title: string;
    metadata?: Record<string, any> | null;
  };
  
  export type TableData = {
    summary: string;
    workingMechanism: string;
    characteristics: Array<{
      label: string;
      value: string;
    }>;
    certificates: Array<{
      title: string;
      url: string;
      uploadDate: string;
    }>;
    benefits: Array<{
      description: string;
    }>;
    sideEffects: Array<{
      description: string;
    }>;
    references: Array<{
      text: string;
      link: string;
    }>;
    preparation: Array<{
      title: string;
      description: string;
      subSteps: Array<{
        title: string;
        description: string;
      }>;
    }>;
  };
  