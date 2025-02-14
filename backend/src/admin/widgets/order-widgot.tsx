import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container } from "@medusajs/ui";
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types";
// The widget
const OrderWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center gap-1  px-6 py-4">
        <small className="font-medium">Passport/ID : </small>{" "}
        {/* @ts-ignore  */}
        <small>{data?.shipping_address?.metadata?.title}</small>
      </div>
    </Container>
  );
};
// The widget's configurations
export const config = defineWidgetConfig({
  zone: "order.details.side.before",
});
export default OrderWidget;