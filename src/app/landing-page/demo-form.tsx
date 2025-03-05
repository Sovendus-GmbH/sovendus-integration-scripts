"use client";

import type { JSX } from "react";
import { useState } from "react";

export default function SovendusLandingPageDemoForm(): JSX.Element {
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
    <>
      <div className="flex gap-10 flex-row">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Apply URL params to test some features
          </h2>
          <div className="space-y-4">
            {Object.entries(testForm).map(([elementKey, elementData]) => {
              return (
                <div key={elementKey} className="flex flex-col">
                  <label
                    htmlFor={elementKey}
                    className="block text-sm font-medium text-gray-700"
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ApplyFormButton testForm={testForm} />
    </>
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
    return `/landing-page?${params.toString()}`;
  }

  const targetUrl = createTargetUrl();
  return (
    <div className="pt-5">
      <a href={targetUrl}>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Apply values
        </button>
      </a>
    </div>
  );
}
