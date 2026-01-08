
import React from "react";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount?: number;
  // Add more fields as needed from your orders table
}

const OrdersList: React.FC<{ orders: Order[] }> = ({ orders }) => {
  if (!orders.length) return null;
  return (
    <div className="divide-y border rounded bg-white shadow">
      {orders.map((order) => (
        <div key={order.id} className="p-4 text-sm flex items-center justify-between">
          <span>ID : {order.id}</span>
          <span>Status : {order.status}</span>
          <span>
            {order.total_amount !== undefined
              ? `Montant: ${order.total_amount} F CFA`
              : ""}
          </span>
          <span>
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;

