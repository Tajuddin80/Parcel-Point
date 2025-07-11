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

const PaymentForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const { user } = useAuth();
  const { logTracking } = useTrackingLogger();
  // Use TanStack query to fetch parcel info
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcelData/${parcelId}`);
      return res.data;
    },
  });

  // Show loading spinner while data is fetching
  if (isPending) {
    return <Loader></Loader>;
  }
  // console.log(parcelInfo);

  const amount = parcelInfo?.totalCost || 0;
  const amountInCents = amount * 100; // convert in cent

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) return;

    //  step 1: validate te card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.error(error.message);
      setIsError(true);
      setMessage(error.message);
    } else {
      // console.log("PaymentMethod:", paymentMethod);
      setIsError(false);
      setMessage("Payment method created successfully!");

      //  step: 2 create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      // console.log('res from intent :', res);

      const clientSecret = res?.data?.clientSecret;

      // step 3: confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        setIsError(true);
        setMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setIsError(false);
          setMessage("Payment succeeded!");
          // console.log("Payment succeeded!");

          // console.log(result);
          const transactionId = result.paymentIntent.id;
          //  step 4:
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
            Swal.fire({
              title: "Payment Successful!",
              html: `Transaction ID: <strong>${transactionId}</strong>`,
              icon: "success",
              confirmButtonText: "Go to My Parcels",
            }).then(async (result) => {
              if (result.isConfirmed) {

                    // parcel tracking update
                await logTracking({
                  tracking_id: parcelInfo.trackingId,
                  status: "payment done",
                  details: `Created by ${user.displayName}`,
                  updated_by: `Email: ${user.email}`,
                });

                navigate("/dashboard/myParcels");
              }
            });
          }
        }
      }
      // TODO: Handle payment intent confirmation if needed
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
          disabled={!stripe || amount === 0}
          className="w-full bg-brand btn btn-primary text-white py-2 rounded-lg shadow-md hover:bg-brand-dark transition duration-300"
        >
          Pay ৳{amount}
        </button>
      </form>
    </motion.div>
  );
};

export default PaymentForm;
