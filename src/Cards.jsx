import React from "react";
import { Check } from "lucide-react";

const Cards = () => {
  const plans = [
    {
      name: "Basic",
      price: "19",
      icon: "🦊",
      ribbonColor: "from-blue-500 to-blue-600",
      buttonColor: "from-blue-500 to-blue-700",
      features: [
        "Unlock all features from our site",
        "24/7 Priority support",
        "Access to Pro group",
        "Cancel anytime you want",
        "Advanced analytics dashboard"
      ]
    },
    {
      name: "Standard",
      price: "24",
      icon: "🐼",
      ribbonColor: "from-purple-500 to-purple-600",
      buttonColor: "from-purple-500 to-purple-700",
      features: [
        "Unlock all features from our site",
        "24/7 Priority support",
        "Access to Pro group",
        "Cancel anytime you want",
        "Advanced analytics dashboard"
      ],
      isPopular: true
    },
    {
      name: "Professional",
      price: "32",
      icon: "👤",
      ribbonColor: "from-orange-400 to-yellow-500",
      buttonColor: "from-orange-400 to-yellow-600",
      features: [
        "Unlock all features from our site",
        "24/7 Priority support",
        "Access to Pro group",
        "Cancel anytime you want",
        "Advanced analytics dashboard"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-pink-50 to-purple-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col ${
              plan.isPopular ? "transform scale-105" : ""
            }`}
          >
            {/* Ribbon */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 overflow-hidden`}
            >
              <div
                className={`absolute top-0 right-0 bg-gradient-to-br ${plan.ribbonColor} text-white font-bold text-lg w-24 h-24 flex items-start justify-end pt-2 pr-3 transform rotate-45 translate-x-6 -translate-y-6 shadow-lg`}
              >
                {plan.price}
              </div>
            </div>

            {/* Popular Badge */}
            {plan.isPopular && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-normal text-gray-700 uppercase tracking-wide">
                Most Popular
              </div>
            )}

            {/* Icon */}
            <div className="text-4xl mb-4 mt-2">{plan.icon}</div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {plan.name}
            </h2>

            {/* Features */}
            <ul className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${plan.buttonColor} text-white font-bold text-base hover:opacity-90 transition-opacity shadow-md`}
            >
              Buy now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;

