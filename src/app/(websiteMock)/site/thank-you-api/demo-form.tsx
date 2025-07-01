import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  JSX,
  SetStateAction,
} from "react";
import {
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

export function SovendusThankyouPageApiDemoForm({
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
  const handleOrderDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
          ...prevData.orderData.orderValue,
          [name]: parseFloat(value) || 0,
        } as OrderValueData,
      },
    }));
  };

  const handleCouponCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const codes = value
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code.length > 0);
    setConfig((prevData) => ({
      ...prevData,
      orderData: {
        ...prevData.orderData,
        usedCouponCodes: codes,
        usedCouponCode: codes[0] || "",
      },
    }));
  };

  const handleCustomerDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      customerData: { ...prevData.customerData, [name]: value },
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Form submission is handled by the parent component
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          🎉 New Generic React API Demo
        </h3>
        <p className="text-sm text-blue-600">
          This demo shows the new generic React API that works with any React
          application. The banner below uses inline styles and accepts data as
          props instead of relying on Shopify hooks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="order">Order Data</TabsTrigger>
            <TabsTrigger value="customer">Customer Data</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order ID
                    </label>
                    <input
                      type="text"
                      name="orderId"
                      value={config.orderData.orderId || ""}
                      onChange={handleOrderDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ORDER-12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      name="orderCurrency"
                      value={config.orderData.orderCurrency || ""}
                      onChange={handleOrderDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="EUR"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gross Amount
                    </label>
                    <input
                      type="number"
                      name="grossOrderValue"
                      value={config.orderData.orderValue?.grossOrderValue || ""}
                      onChange={handleOrderValueChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="149.99"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Shipping Amount
                    </label>
                    <input
                      type="number"
                      name="shippingValue"
                      value={config.orderData.orderValue?.shippingValue || ""}
                      onChange={handleOrderValueChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5.99"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tax Percent
                    </label>
                    <input
                      type="number"
                      name="taxPercent"
                      value={config.orderData.orderValue?.taxPercent || ""}
                      onChange={handleOrderValueChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="20"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Voucher Codes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={config.orderData.usedCouponCodes?.join(", ") || ""}
                    onChange={handleCouponCodeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SAVE10, FREE_SHIP, WELCOME20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter multiple voucher codes separated by commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="consumerFirstName"
                      value={config.customerData.consumerFirstName || ""}
                      onChange={handleCustomerDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="consumerLastName"
                      value={config.customerData.consumerLastName || ""}
                      onChange={handleCustomerDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="consumerEmail"
                    value={config.customerData.consumerEmail || ""}
                    onChange={handleCustomerDataChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="consumerPhone"
                    value={config.customerData.consumerPhone || ""}
                    onChange={handleCustomerDataChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+49123456789"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="consumerCity"
                      value={config.customerData.consumerCity || ""}
                      onChange={handleCustomerDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Berlin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="consumerZipcode"
                      value={config.customerData.consumerZipcode || ""}
                      onChange={handleCustomerDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10115"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="consumerStreetWithNumber"
                    value={config.customerData.consumerStreetWithNumber || ""}
                    onChange={handleCustomerDataChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Main Street 123"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
