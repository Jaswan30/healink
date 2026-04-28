import React from "react";

export default function History() {
  const hasHistory = false; // simulate no purchase history
  return (
    <div className="page-container">
      <h2>Purchase History</h2>
      {hasHistory ? (
        <p>Here are your previous purchases.</p>
      ) : (
        <p>No purchase history found.</p>
      )}
    </div>
  );
}
