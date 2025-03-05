import type { JSX } from "react";

import SovendusLandingPageDemoForm from "./demo-form";
import SovendusLandingPageDemoScript from "./script";

export default function SovendusLandingPageDemo(): JSX.Element {
  return (
    <div>
      <h1 style={{ paddingBottom: "40px" }}>This is a example landing page</h1>
      <div>
        <SovendusLandingPageDemoForm />
      </div>
      <SovendusLandingPageDemoScript />
    </div>
  );
}
