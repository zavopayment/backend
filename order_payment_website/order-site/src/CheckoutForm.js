
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { data: clientSecret } = await axios.post("http://localhost:4242/create-payment-intent", {
      amount: 5000,
    });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(`Payment failed: ${result.error.message}`);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment succeeded 🎉");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded mb-4" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={!stripe}>
        Pay ₹50
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </form>
  );
}

export default CheckoutForm;
