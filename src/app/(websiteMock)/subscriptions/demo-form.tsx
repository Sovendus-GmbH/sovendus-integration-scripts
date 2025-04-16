import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  JSX,
  SetStateAction,
} from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "sovendus-integration-settings-ui/ui";
import type {
  OrderValueData,
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

export function SovendusRewardsPageDemoForm({
  config,
  setConfig,
  setConfigOpen: _setConfigOpen,
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
  setConfigOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const handleIframeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      orderData: { ...prevData.orderData, [name]: value },
    }));
  };

  const handleOrderValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      orderData: {
        ...prevData.orderData,
        orderValue: {
          ...(prevData.orderData.orderValue || {}),
          [name]: value,
        },
      },
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
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl font-bold">
          Subscription Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="iframe">Iframe Data</TabsTrigger>
              <TabsTrigger value="consumer">Consumer Data</TabsTrigger>
            </TabsList>

            <TabsContent value="iframe" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(config.orderData).map((key) => {
                  // Special handling for orderValue which is an object
                  if (key === "orderValue") {
                    const orderValue = config.orderData.orderValue || {};
                    return (
                      <div
                        key={key}
                        className="col-span-1 md:col-span-2 p-4 bg-muted/30 rounded-lg"
                      >
                        <h4 className="text-md font-medium mb-3">
                          Order Value
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            "netOrderValue",
                            "grossOrderValue",
                            "shippingValue",
                            "taxValue",
                            "taxPercent",
                          ].map((valueKey) => (
                            <div
                              key={valueKey}
                              className="flex flex-col space-y-1"
                            >
                              <label className="text-sm font-medium">
                                {valueKey}:
                              </label>
                              <input
                                type="text"
                                name={valueKey}
                                value={
                                  (orderValue[
                                    valueKey as keyof OrderValueData
                                  ] as string | undefined) || ""
                                }
                                onChange={handleOrderValueChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Regular fields
                  const value =
                    config.orderData[key as keyof typeof config.orderData];
                  return (
                    <div key={key} className="flex flex-col space-y-1">
                      <label className="text-sm font-medium">{key}:</label>
                      <input
                        type="text"
                        name={key}
                        value={value as string | undefined}
                        onChange={handleIframeChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="consumer" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(config.customerData).map((key) => (
                  <div key={key} className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">{key}:</label>
                    <input
                      type="text"
                      name={key}
                      value={
                        config.customerData[
                          key as keyof typeof config.customerData
                        ] as string | undefined
                      }
                      onChange={handleConsumerChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end items-center gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => _setConfigOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleFormSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Save Form Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
