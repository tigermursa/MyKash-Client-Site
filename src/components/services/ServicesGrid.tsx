import React from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

const services = [
  { label: "Electricity Bill", icon: "mdi:flash" },
  { label: "Gas Bill", icon: "mdi:gas-station" },
  { label: "Internet Bill", icon: "mdi:wifi" },
  { label: "Phone Recharge", icon: "mdi:cellphone-charging" },
  { label: "Shop Now", icon: "mdi:shopping" },
  { label: "My Offer", icon: "mdi:tag" },
];

const ServicesGrid: React.FC = () => {
  const handleClick = (serviceLabel: string) => {
    toast.info(`${serviceLabel} service clicked. Feature coming soon!`);
  };

  return (
    <div className="p-4">
      <h3 className="text-center font-semibold p-2"> Other Services</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.label}
            onClick={() => handleClick(service.label)}
            className="group cursor-pointer flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow transition transform hover:scale-105 hover:shadow-xl"
          >
            <Icon icon={service.icon} className="text-[#cf1263] w-12 h-12" />
            <p className="mt-2 text-sm font-medium text-gray-700">
              {service.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;
