declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    securityLevel?: string;
    fontFamily?: string;
    fontSize?: number;
    flowchart?: any;
    class?: any;
    sequence?: any;
  }

  interface RenderResult {
    svg: string;
  }

  const mermaid: {
    initialize: (config: MermaidConfig) => void;
    render: (id: string, chart: string) => Promise<RenderResult>;
  };

  export default mermaid;
} 