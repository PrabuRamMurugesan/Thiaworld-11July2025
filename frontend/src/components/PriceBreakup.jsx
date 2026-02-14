import React, { useState, useMemo } from 'react'
import { TbArrowBadgeDown, TbArrowBadgeUp } from "react-icons/tb";

// Format INR currency
function formatINR(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function PriceBreakup({ product }) {
  const [viewMore, setViewMore] = useState(false);

  // Calculate price breakdown values from product data
  const priceData = useMemo(() => {
    if (!product || !product.breakdown) {
      // Default values if no product data
      return {
        total: { view: 6120, discount: 48960, finalValue: 61200, change24H: 80 },
        shipping: { view: 0, discount: 0, finalValue: 0, change24H: 0 },
        gst: { view: 5610, discount: 44880, finalValue: 56100, change24H: 70 },
        grandTotal: { view: 4590, discount: null, finalValue: 45900, change24H: -40 },
        gstPercent: 3
      };
    }

    const breakdown = product.breakdown;
    
    // actualPrice = price BEFORE discount (Gold Value + Making + Wastage + Stone)
    const actualPrice = breakdown.actualPrice || 
      (breakdown.goldValue || 0) + 
      (breakdown.makingValue || 0) + 
      (breakdown.wastageValue || 0) + 
      (breakdown.stoneValue || 0);
    
    // salesPrice = price AFTER discount (before GST)
    const salesPrice = breakdown.salesPrice || actualPrice;
    
    // Discount amount
    const discountAmount = breakdown.discount || 0;
    
    // GST percentage
    const gstPercent = Number(product.gst || 3);
    
    // Price after discount (before GST)
    const priceAfterDiscount = actualPrice - discountAmount;
    
    // GST calculations
    // GST on price BEFORE discount
    const gstOnBeforeDiscount = Math.round((actualPrice * gstPercent) / 100);
    // GST on price AFTER discount
    const gstOnAfterDiscount = Math.round((priceAfterDiscount * gstPercent) / 100);
    // GST discount (difference)
    const gstDiscount = gstOnBeforeDiscount - gstOnAfterDiscount;
    
    // Final price = price after discount + GST after discount
    const finalPrice = priceAfterDiscount + gstOnAfterDiscount;
    
    // Calculate values for table
    const totalView = actualPrice; // Price BEFORE discount
    const totalDiscount = discountAmount;
    const totalFinalValue = priceAfterDiscount; // Price AFTER discount (before GST)
    
    const shippingView = 0;
    const shippingDiscount = 0;
    const shippingFinalValue = 0;
    
    const gstView = gstOnBeforeDiscount; // GST on price before discount
    const gstFinalValue = gstOnAfterDiscount; // GST on price after discount
    
    const grandTotalView = priceAfterDiscount; // Subtotal after discount
    const grandTotalFinalValue = finalPrice; // Final price with GST
    
    // Mock 24H change values (you can replace with actual data if available)
    const change24H = Math.round(actualPrice * 0.01); // 1% change
    
    return {
      total: {
        view: totalView,
        discount: totalDiscount,
        finalValue: totalFinalValue,
        change24H: change24H
      },
      shipping: {
        view: shippingView,
        discount: shippingDiscount,
        finalValue: shippingFinalValue,
        change24H: 0
      },
      gst: {
        view: gstView,
        discount: gstDiscount,
        finalValue: gstFinalValue,
        change24H: Math.round(gstView * 0.01)
      },
      grandTotal: {
        view: grandTotalView,
        discount: null,
        finalValue: grandTotalFinalValue,
        change24H: -Math.round(grandTotalView * 0.01)
      },
      gstPercent: gstPercent
    };
  }, [product]);
  return (
     <div
            style={{
              background:
                "linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #fff8e1 100%)",
              boxShadow: "0 0 25px rgba(255, 215, 0, 0.3)",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "left",
              margin: "20px",
            }}
          >
            <h1
              style={{
                color: "#7a5901",
                fontWeight: "700",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Price Breakup
            </h1>
    
            {/* Toggle Button */}
            <div style={{ position: "relative" }}>
              <h6
                onClick={() => setViewMore(!viewMore)}
                style={{
                  background: "linear-gradient(90deg, #5e500a 0%, #ff4e50 100%)",
                  color: "white",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  fontSize: "11px",
                  width: "fit-content",
                  position: "absolute", // ✅ pins it to parent’s corner
                  top: "-40px",
                  right: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {viewMore ? (
                  <>
                    View Less <TbArrowBadgeUp size={14} />
                  </>
                ) : (
                  <>
                    View More <TbArrowBadgeDown size={14} />
                  </>
                )}
              </h6>
            </div>
    
            {/* Table 1 — Summary */}
            {!viewMore && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <thead style={{ backgroundColor: "#f5deb3" }}>
                    <tr>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "left",
                        }}
                      >
                        Component
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Value
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Discount
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Final Value
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Change (24H)
                      </th>
                    </tr>
                  </thead>
    
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.discount)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.total.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.total.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.total.change24H))}
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Shipping
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.shipping.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.shipping.discount)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.shipping.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.shipping.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.shipping.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.shipping.change24H))}
                      </td>
                    </tr>
                    <tr></tr>
    
                    <tr style={{ backgroundColor: "#fff9e5" }}>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        GST({priceData.gstPercent}%)
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.gst.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.gst.discount)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.gst.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.gst.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.gst.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.gst.change24H))}
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Grand Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.grandTotal.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.grandTotal.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.grandTotal.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.grandTotal.change24H >= 0 ? "+" : "–"}₹{formatINR(Math.abs(priceData.grandTotal.change24H))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
    
            {/* Table 2 — Detailed */}
            {viewMore && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <thead style={{ backgroundColor: "#f5deb3" }}>
                    <tr>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "left",
                        }}
                      >
                        Component
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Weight
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Value
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Discount
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Final Value
                      </th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderBottom: "3px solid #c8a200",
                          color: "#7a5901",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Change (24H)
                      </th>
                    </tr>
                  </thead>
    
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: "700",
                          color: "#5c4b00",
                        }}
                      >
                        Gold
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        {product?.purity || "91.6"} Gold
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        {(() => {
                          // choose rate from priceSource or compute from breakdown if available
                          const rateFromSource = product?.priceSource?.ratePerGram;
                          if (rateFromSource) return `₹${formatINR(rateFromSource)}`;
                          const goldVal = product?.breakdown?.goldValue;
                          const weight = product?.netWeight;
                          if (goldVal && weight) {
                            const computed = goldVal / weight;
                            return `₹${formatINR(computed)}`;
                          }
                          return "—";
                        })()}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        {product?.netWeight ? `${product.netWeight}g` : "-"}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        {product?.breakdown?.goldValue ? `₹${formatINR(product.breakdown.goldValue)}` : "-"}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        {product?.breakdown?.discount ? `₹${formatINR(product.breakdown.discount)}` : "₹0"}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.total.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.total.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.total.change24H))}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.discount)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.total.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.total.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.total.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.total.change24H))}
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Shipping
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.shipping.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.shipping.discount)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.shipping.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.shipping.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.shipping.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.shipping.change24H))}
                      </td>
                    </tr>
                    <tr></tr>
    
                    <tr style={{ backgroundColor: "#fff9e5" }}>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        GST({priceData.gstPercent}%)
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.gst.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.gst.discount)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.gst.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.gst.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.gst.change24H >= 0 ? "+" : ""}₹{formatINR(Math.abs(priceData.gst.change24H))}
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Grand Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.grandTotal.view)}
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹{formatINR(priceData.grandTotal.finalValue)}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: priceData.grandTotal.change24H >= 0 ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {priceData.grandTotal.change24H >= 0 ? "+" : "–"}₹{formatINR(Math.abs(priceData.grandTotal.change24H))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <p
              style={{
                fontSize: "14px",
                color: "#7a5901",
                marginTop: "20px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              *Rates are indicative and may vary by city and market.
            </p>
          </div>
    
  )
}

export default PriceBreakup