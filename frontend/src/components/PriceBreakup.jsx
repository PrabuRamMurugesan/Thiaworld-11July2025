import React ,{useState}from 'react'

import { TbArrowBadgeDown, TbArrowBadgeUp } from "react-icons/tb";

function PriceBreakup() {
    
      const [viewMore, setViewMore] = useState(false);
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
                        View
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
                        ₹6,120
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹48,960
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹61,200
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹80
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Shipping
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹0
                      </td>
                    </tr>
                    <tr></tr>
    
                    <tr style={{ backgroundColor: "#fff9e5" }}>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        GST(3%)
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹5,610
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹44,880
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹56,100
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹70
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Grand Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹4,590
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹45,900
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "red",
                          fontWeight: "600",
                        }}
                      >
                        –₹40
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
                        91.6 Gold
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹6,120
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹48,960
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹61,200
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹61,200
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹80
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹6,120
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹48,960
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹61,200
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹80
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Shipping
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>{" "}
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>₹0</td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹0
                      </td>
                    </tr>
                    <tr></tr>
    
                    <tr style={{ backgroundColor: "#fff9e5" }}>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        GST(3%)
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>{" "}
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹5,610
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹44,880
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹56,100
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontWeight: "600",
                        }}
                      >
                        +₹70
                      </td>
                    </tr>
    
                    <tr>
                      <td style={{ padding: "12px 16px", color: "#5c4b00" }}>
                        Grand Total
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>{" "}
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹4,590
                      </td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}></td>
                      <td style={{ textAlign: "center", color: "#5c4b00" }}>
                        ₹45,900
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "red",
                          fontWeight: "600",
                        }}
                      >
                        –₹40
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