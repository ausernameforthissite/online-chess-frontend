declare module "*.png" 

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const path: string;
  export default path;
}

declare module "*.module.css";