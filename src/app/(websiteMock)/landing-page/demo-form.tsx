"use client";

import type { Dispatch, JSX, SetStateAction } from "react";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DialogFooter,
} from "sovendus-integration-settings-ui/ui";

export default function SovendusLandingPageDemoForm({
  setConfigOpen,
}: {
  setConfigOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [testForm, setTestForm] = useState(initialForm);
  function onchange(value: string, elementKey: string): void {
    setTestForm((prevForm) => {
      const newForm = { ...prevForm };
      (
        (newForm as { [key: string]: { value: string } })[elementKey] as {
          value: string;
        }
      ).value = value;
      return newForm;
    });
  }
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl font-bold">URL Parameters Configuration</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Apply URL parameters to test various features of the integration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(testForm).map(([elementKey, elementData]) => {
            return (
              <div key={elementKey} className="flex flex-col space-y-2">
                <label
                  htmlFor={elementKey}
                  className="text-sm font-medium"
                >
                  {elementData.key}
                </label>
                <input
                  type="text"
                  id={elementKey}
                  onChange={(event) =>
                    onchange(event.currentTarget.value, elementKey)
                  }
                  value={elementData.value || ""}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end items-center gap-3 mt-8 pt-4 border-t">
          <Button variant="outline" onClick={() => setConfigOpen(false)}>
            Cancel
          </Button>
          <ApplyFormButton testForm={testForm} />
        </div>
      </CardContent>
    </Card>
  );
}

export type InitialFormType = {
  [paramKey in
    | "checkoutProductsToken"
    | "legacy_profityId"
    | "debug"
    | "couponCode"]: {
    value: string | undefined;
    key: string;
  };
};

export const initialForm: InitialFormType = {
  checkoutProductsToken: {
    value: "test-checkoutProductsToken",
    key: "sovReqToken",
  },
  legacy_profityId: { value: "test-profityId", key: "puid" },
  couponCode: { value: "test-couponCode", key: "sovCouponCode" },
  debug: { value: "debug", key: "sovDebugLevel" },
};

function ApplyFormButton({
  testForm,
}: {
  testForm: InitialFormType;
}): JSX.Element {
  function createTargetUrl(): string {
    const params = new URLSearchParams();
    Object.values(testForm).forEach((valueData) => {
      if (valueData.value) {
        params.append(valueData.key, valueData.value);
      }
    });
    return `/?${params.toString()}`;
  }

  const targetUrl = createTargetUrl();
  return (
    <a href={targetUrl}>
      <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Apply Values
      </Button>
    </a>
  );
}
