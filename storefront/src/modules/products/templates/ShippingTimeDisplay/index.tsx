const getShippingInfo = () => {
  const shippingOptions = [
    { day: "today", hours: 4, minutes: 35 },
    { day: "today", hours: 4, minutes: 15 },
    { day: "tomorrow", hours: 5, minutes: 20 },
    { day: "tomorrow", hours: 4, minutes: 45 },
    { day: "Monday", hours: 4, minutes: 30 },
    { day: "Monday", hours: 5, minutes: 0 },
  ];

  return shippingOptions[Math.floor(Math.random() * shippingOptions.length)];
};

const ShippingTimeDisplay = () => {
  const shippingInfo = getShippingInfo();

  return (
    <span className="text-ui-fg-base text-base ml-2">
      <span className="font-normal">Ships </span>
      <span className="font-semibold">{shippingInfo.day}</span>
      <span className="font-normal"> if ordered within </span>
      <span className="font-semibold">
        {shippingInfo.hours} hrs {shippingInfo.minutes > 0 ? `${shippingInfo.minutes} min` : ""}
      </span>
    </span>
  );
};

export default ShippingTimeDisplay;
