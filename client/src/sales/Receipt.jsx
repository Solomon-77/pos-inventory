import React from 'react';

const Receipt = ({ data }) => {
  const { items, total, discountType, date, saleId, amountPaid, change } = data;

  return (
    <>
      <style>
        {`
    .scrollable-items {
      max-height: calc(100vh - 500px);
      min-height: 100px;
      overflow-y: auto;
      margin-bottom: 10px;
    }
    .receipt-header {
      text-align: center;
    }
    .receipt-title {
      font-weight: bold;
      font-size: 1.5em;
      margin-bottom: 10px;
    }
    .receipt-info {
      margin-bottom: 10px;
    }
    .receipt-info p {
      margin: 5px 0;
    }
    .transaction-info {
      text-align: left;
      margin-top: 10px;
    }
    @media screen {
      .receipt-container {
        max-width: 400px;
        margin: 0 auto;
      }
      .scrollable-items {
        max-height: calc(100vh - 500px);
        min-height: 100px;
        overflow-y: auto;
        margin-bottom: 10px;
      }
      .receipt-header {
        text-align: center;
        margin-bottom: 10px;
      }
      .receipt-title {
        font-weight: bold;
        font-size: 1.8em;
        margin-bottom: 15px;
      }
      .receipt-info {
        margin-bottom: 15px;
      }
      .receipt-info h3 {
        font-size: 1.3em;
        margin-bottom: 10px;
      }
      .receipt-info p {
        margin: 8px 0;
        font-size: 0.9em;
      }
      .transaction-info {
        text-align: left;
        margin-top: 15px;
        font-size: 0.9em;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      th, td {
        padding: 8px 4px;
        border-bottom: 1px solid #ddd;
      }
      th {
        font-weight: bold;
        text-align: left;
      }
      .text-right {
        text-align: right;
      }
      .total-line, .amount-paid, .change {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        font-size: 1.1em;
      }
      .change {
        font-weight: bold;
      }
      .footer-text {
        margin-top: 20px;
        font-style: italic;
        font-size: 0.8em;
        text-align: center;
      }
    }
    @media print {
      @page {
        size: 58mm auto;
        margin: 0;
      }
      body {
        width: 58mm;
        margin: 0 auto;
      }
      .receipt-container {
        height: auto;
        overflow: visible;
        padding: 2mm 0;
        border: none;
        box-shadow: none;
      }
      .receipt {
        font-size: 8pt;
        line-height: 1.2;
      }
      .receipt-header {
        position: static;
        text-align: center;
        margin-bottom: 2mm;
        padding-bottom: 0;
      }
      .receipt-title {
        font-size: 10pt;
        font-weight: bold;
        margin-bottom: 1mm;
      }
      .receipt-info {
        font-size: 7pt;
      }
      .receipt table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2mm;
        border-spacing: 0;
      }
      .receipt th, .receipt td {
        padding: 0.5mm 0.3mm;
        border-bottom: 0.3pt solid #ccc;
        font-size: 7pt;
      }
      .receipt th {
        border-bottom: 0.3pt solid black;
        font-weight: bold;
      }
      .receipt .text-right {
        text-align: right;
      }
      .receipt .total-line {
        border-top: 0.3pt solid black;
        padding-top: 0.5mm;
        margin-top: 0.5mm;
        font-size: 8pt;
      }
      .receipt .footer-text {
        margin-top: 2mm;
        font-style: italic;
        font-size: 6pt;
        text-align: center;
      }
      .receipt .item-name {
        word-break: break-word;
        max-width: none;
      }
      .receipt .unit-price,
      .receipt .qty,
      .receipt .item-total {
        min-width: 10mm;
        padding-left: 0.5px;
        padding-right: 0.5px;
      }
      .scrollable-items {
        max-height: none;
        min-height: 0;
        overflow-y: visible;
        margin-bottom: 0;
      }
    }
  `}
      </style>
      <div className="receipt-container">
        <div className="receipt">
          <div className="receipt-header">
            <h2 className="receipt-title">Receipt</h2>
            <div className="receipt-info">
              <h3>GenMed Pharmacy</h3>
              <p>Blk 1 Lot 34 Daang Bakal, Burgos Rod Rizal</p>
              <p>09215533504</p>
            </div>
            <div className="transaction-info">
              <p>Date: {date.toLocaleString()}</p>
              <p>Sale ID: {saleId}</p>
            </div>
          </div>

          <div className="scrollable-items">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Item</th>
                  <th className="text-right unit-price">Price</th>
                  <th className="text-right qty">Qty</th>
                  <th className="text-right item-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="item-name">{item.name}</td>
                    <td className="text-right unit-price">P{item.price.toFixed(2)}</td>
                    <td className="text-right qty">{item.quantity}</td>
                    <td className="text-right item-total">P{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total-line" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>P{total.toFixed(2)}</span>
          </div>

          {discountType && (
            <p>Discount: {discountType}</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Paid:</span>
            <span>P{amountPaid.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Change:</span>
            <span>P{change.toFixed(2)}</span>
          </div>

          <p className="footer-text">
            THIS RECEIPT IS NOT VALID FOR CLAIMING INPUT TAX.
          </p>
        </div>
      </div>
    </>
  );
};

export default Receipt;