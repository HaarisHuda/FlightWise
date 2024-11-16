import React, { useState } from 'react';
import axios from 'axios';

const PayPalComponent = () => {
  // Hardcoded searchId and amount for now
  const searchId = 6; // Hardcoded searchId
  const amount = 500.00; // Hardcoded amount in USD

  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const [approvalUrl, setApprovalUrl] = useState(null);

  // Step 1: Create Payment and Redirect to PayPal Approval URL
  const createPayment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/flights/paypal/payment/${searchId}/`, // Backend URL to create payment
        { amount: amount },
        { headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
         } }
      );

      if (response.data.approval_url) {
        setApprovalUrl(response.data.approval_url);
        window.location.href = response.data.approval_url; // Redirect to PayPal
      }
    } catch (err) {
      setError("Error creating payment");
      console.error(err);
    }
  };

  // Step 2: Handle Payment Execution After Approval
  const executePayment = async (paymentId, payerId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/flights/paypal/execute/',
        {
          payment_id: paymentId,
          payer_id: payerId
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setPaidFor(true);
      }
    } catch (err) {
      setError("Error executing payment");
      console.error(err);
    }
  };

  // If payment was successful
  if (paidFor) {
    return <h2>Payment successful! Thank you for your purchase.</h2>;
  }

  // If there was an error during the process
  if (error) {
    return <h2>Uh oh, something went wrong with your payment. Please try again.</h2>;
  }

  // Render the PayPal button
  return (
    <div>
      {!approvalUrl ? (
        <div>
          <h3>Total Amount: ${amount}</h3>
          <button onClick={createPayment} className="btn btn-primary">
            Pay with PayPal
          </button>
        </div>
      ) : (
        <div>
          <h3>Redirecting to PayPal...</h3>
        </div>
      )}
    </div>
  );
};

export default PayPalComponent;
