import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../../../shared/Loader/Loader";
import useTrackingLogger from "../../../../hooks/useTrackingLogger";
import { Helmet } from "react-helmet";

const PaymentForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // new state to disable button
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const { user } = useAuth();
  const { logTracking } = useTrackingLogger();

  // Fetch parcel info using React Query
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcelData/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loader />;
  }

  const amount = parcelInfo?.totalCost || 0;
  const amountInCents = amount * 100; // convert to cents

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) return; // prevent if already processing

    setIsProcessing(true); // disable button immediately

    const card = elements.getElement(CardElement);
    if (!card) {
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (error) {
        setIsError(true);
        setMessage(error.message);
        setIsProcessing(false);
        return;
      }

      setIsError(false);
      setMessage("Payment method created successfully!");

      // Step 2: Create payment intent on server
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res?.data?.clientSecret;

      // Step 3: Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        setIsError(true);
        setMessage(result.error.message);
        setIsProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        setIsError(false);
        setMessage("Payment succeeded!");

        const transactionId = result.paymentIntent.id;

        // Step 4: Save payment info to backend
        const paymentDoc = {
          parcelName: parcelInfo?.parcelName,
          parcelId,
          userName: user?.displayName,
          email: user?.email,
          amount: amount,
          paymentMethod: result.paymentIntent.payment_method_types[0],
          cardType: paymentMethod.card.brand,
          transactionId,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentDoc);
        if (paymentRes.data.insertedId) {
          await Swal.fire({
            title: "Payment Successful!",
            html: `Transaction ID: <strong>${transactionId}</strong>`,
            icon: "success",
            confirmButtonText: "Go to My Parcels",
          });

          // Update tracking log
          await logTracking({
            tracking_id: parcelInfo.trackingId,
            status: "payment done",
            details: `Created by ${user.displayName}`,
            updated_by: `Email: ${user.email}`,
          });

          // Navigate to parcels page
          navigate("/dashboard/myParcels");
        }
      }
    } catch (err) {
      setIsError(true);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsProcessing(false); // re-enable button after process finishes
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl"
    >
       <Helmet>
        <title>Parcel Point | Payment</title>
      </Helmet>
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
          disabled={!stripe || amount === 0 || isProcessing} // disable while processing
          className="w-full bg-brand btn btn-primary text-white py-2 rounded-lg shadow-md hover:bg-brand-dark transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : `Pay ৳${amount}`}
        </button>
      </form>
    </motion.div>
  );
};

export default PaymentForm;
