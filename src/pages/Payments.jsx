import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Payments.css";

function Payments() {
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);

  const [form, setForm] = useState({
    client: "",
    package: "",
    amount: "",
    paymentMethod: "cash",
    status: "paid",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClients();
    loadPackages();
    loadPayments();
  }, []);

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Clients error:", error);
    }
  };

  const loadPackages = async () => {
    try {
      const response = await api.get("/packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Packages error:", error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await api.get("/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Payments error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "package" && value) {
      const selectedPackage = packages.find(
        (pkg) => pkg._id === value
      );

      if (selectedPackage) {
        setForm((previous) => ({
          ...previous,
          package: value,
          amount: selectedPackage.price,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/payments", {
        client: form.client,
        package: form.package || null,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        status: form.status,
      });

      setMessage("Payment created successfully!");

      setForm({
        client: "",
        package: "",
        amount: "",
        paymentMethod: "cash",
        status: "paid",
      });

      loadPayments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create payment"
      );
    }
  };

  return (
    <div className="payments-page">
      <h1>Payments</h1>

      <p>Manage client payments and revenue.</p>

      <div className="client-form">
        <h2>Create Payment</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="client"
            value={form.client}
            onChange={handleChange}
            required
          >
            <option value="">Select Client</option>

            {clients.map((client) => (
              <option
                key={client._id}
                value={client._id}
              >
                {client.name}
              </option>
            ))}
          </select>

          <select
            name="package"
            value={form.package}
            onChange={handleChange}
          >
            <option value="">Select Package</option>

            {packages.map((pkg) => (
              <option
                key={pkg._id}
                value={pkg._id}
              >
                {pkg.name} - ₹{pkg.price}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="1"
          />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="razorpay">Online</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <button type="submit">
            Create Payment
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>

      <div className="client-list">
        <h2>Payment History</h2>

        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          payments.map((payment) => (
            <div
              className="client-card"
              key={payment._id}
            >
              <h3>
                {payment.client?.name || "Client"}
              </h3>

              <p>
                Amount: ₹{Number(payment.amount).toFixed(2)}
              </p>

              <p>
                Method: {payment.paymentMethod}
              </p>

              <p>
                Status: {payment.status}
              </p>

              {payment.package && (
                <p>
                  Package: {payment.package.name}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Payments;