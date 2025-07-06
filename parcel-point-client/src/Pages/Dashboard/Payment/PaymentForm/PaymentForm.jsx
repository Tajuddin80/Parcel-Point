import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null || !card) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.error(error.message);
      setIsError(true);
      setMessage(error.message);
    } else {
      console.log("PaymentMethod:", paymentMethod);
      setIsError(false);
      setMessage("Payment method created successfully!");
      // Here, confirm payment intent or proceed further
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-brand">
        Pay For Your Parcel
      </h2>

      {message && (
        <div
          className={`alert ${
            isError ? "alert-error" : "alert-success"
          } shadow-lg mb-4`}
        >
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: { color: "#e53e3e" },
              },
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!stripe}
          className="w-full bg-brand btn btn-primary text-white py-2 rounded-lg shadow-md hover:bg-brand-dark transition duration-300"
        >
          Pay For Parcel
        </button>
      </form>
    </motion.div>
  );
};

export default PaymentForm;
