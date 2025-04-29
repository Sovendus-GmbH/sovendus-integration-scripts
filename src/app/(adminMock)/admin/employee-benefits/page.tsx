"use client";

import type { JSX } from "react";
import { EmployeeBenefitsDemo as _EmployeeBenefitsDemo } from "sovendus-integration-settings-ui/demo-style-less";

import { clearStorage } from "../../../(websiteMock)/site/components/self-tester";

export default function EmployeeBenefitsDemo(): JSX.Element {
  return (
    <_EmployeeBenefitsDemo urlPrefix="/admin" clearStorage={clearStorage} />
  );
}
