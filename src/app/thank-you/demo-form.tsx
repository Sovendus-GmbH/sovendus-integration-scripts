import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  JSX,
  SetStateAction,
} from "react";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

export function SovendusThankyouPageDemoForm({
  config,
  setConfig,
}: {
  config: {
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  };
  setConfig: Dispatch<
    SetStateAction<{
      orderData: SovendusConversionsData;
      customerData: SovendusConsumerData;
    }>
  >;
}): JSX.Element {
  const handleIframeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      orderData: { ...prevData.orderData, [name]: value },
    }));
  };

  const handleConsumerChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      customerData: { ...prevData.customerData, [name]: value },
    }));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Stores the form configuration in localStorage
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Iframe Data</h3>
      {Object.keys(config.orderData).map((key) => {
        const value = config.orderData[key as keyof typeof config.orderData];
        return (
          <div key={key} className="flex items-center">
            <label className="w-32 text-right mr-4">{key}:</label>
            <input
              type="text"
              name={key}
              value={value as string | undefined}
              onChange={handleIframeChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        );
      })}
      <h3 className="text-lg font-semibold">Consumer Data</h3>
      {Object.keys(config.customerData).map((key) => (
        <div key={key} className="flex items-center">
          <label className="w-32 text-right mr-4">{key}:</label>
          <input
            type="text"
            name={key}
            value={
              config.customerData[key as keyof typeof config.customerData] as
                | string
                | undefined
            }
            onChange={handleConsumerChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Form Data
      </button>
    </form>
  );
}
