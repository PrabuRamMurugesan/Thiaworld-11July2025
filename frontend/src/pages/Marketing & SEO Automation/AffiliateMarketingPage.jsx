import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaShareAlt,
  FaQrcode,
  FaCopy,
  FaWallet,
} from "react-icons/fa";
import { AiOutlineBarChart } from "react-icons/ai";
import { MdLeaderboard, MdOutlineMoney } from "react-icons/md";
import { BsLink45Deg } from "react-icons/bs";
import { QRCodeCanvas } from "qrcode.react"; // ✅ CORRECT named import
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AffiliateMarketingPage = () => {
  const [userData, setUserData] = useState({
    referralCode: "BBSAFF12345",
    totalClicks: 1235,
    conversions: 154,
    commission: 8450,
    eligibleCommission: 5200,
    rank: 8,
  });

  const [productId, setProductId] = useState("");
  const [alias, setAlias] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [referralHistory, setReferralHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState("");
  const qrRef = useRef(null);

  const [leaderboard] = useState([
    { rank: 1, name: "Rahul M.", clicks: 3200, conversions: 280, commission: 15000 },
    { rank: 2, name: "Priya K.", clicks: 2950, conversions: 240, commission: 12400 },
    { rank: 3, name: "Aakash S.", clicks: 2600, conversions: 210, commission: 11250 },
  ]);

  const referralLink = `https://bbscart.com/r/${userData.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateLink = () => {
    if (!productId) return alert("Please enter product ID");
    const link = `https://bbscart.com/product/${productId}?ref=${userData.referralCode}${alias ? `&alias=${alias}` : ""}`;
    setCustomLink(link);
    setReferralHistory(prev => [{ link, productId, date: new Date().toLocaleString() }, ...prev.slice(0, 4)]);
  };

  const handleWithdraw = () => {
    if (userData.eligibleCommission < 100) {
      setWithdrawStatus("Minimum ₹100 required for withdrawal.");
      return;
    }
    setWithdrawStatus("Withdrawal request submitted!");
    setUserData(prev => ({ ...prev, eligibleCommission: 0 }));
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "referral_qr.png";
      a.click();
    }
  };

  return (
    <>
    <Header/>
    <div className="container my-4">
      <h2 className="text-center mb-4 xl:text-4xl">Affiliate Marketing Program</h2>

      {/* Referral Link Section */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">Your Referral Link</div>
        <div className="card-body">
          <div className="input-group mb-2 ">
            <input type="text" className="form-control" value={referralLink} readOnly />
            <button onClick={handleCopy} className="btn btn-outline-secondary  d-flex align-items-center flex-row gap-2">
              <FaCopy className="me-1   w-25" /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>

         <div className="d-flex flex-row   flex-wrap gap-2 justify-content-between pt-4 ">
                 <div className="text-muted mb-2 border p-3 w-25">
             {/* QR Code */}
          <div className="d-flex flex-row gap-2 align-items-start justify-center mt-3">
            <div ref={qrRef}>
              <QRCodeCanvas value={referralLink} size={220} />
            </div>
          
          </div>

          {/* Share Buttons */}
          <div className="d-flex flex-wrap gap-2 justify-center mt-3 ">
            <div>
                  <button className="btn btn-outline-dark d-flex align-items-center w-100  py-2 px-3 justify-center " onClick={downloadQRCode}>
              <FaQrcode className="me-2 "/> Download Q  R Code
            </button>
            </div>
         
          </div>

          <div className="d-flex flex-wrap gap-2  justify-center mt-3">
               <button className="btn btn-primary">
              <FaShareAlt className="me-1" /> WhatsApp
            </button>
            <button className="btn btn-danger">
              <FaShareAlt className="me-1" /> Instagram
            </button>
          </div>
          </div>

           <div className="row mb-4 w-75">
        <StatCard icon={<AiOutlineBarChart size={30} />} label="Clicks" value={userData.totalClicks} color="primary" />
        <StatCard icon={<MdOutlineMoney size={30} />} label="Conversions" value={userData.conversions} color="success" />
        <StatCard icon={<FaWallet size={30} />} label="Commission" value={`₹${userData.commission}`} color="warning" />
        <StatCard icon={<MdLeaderboard size={30} />} label="Rank" value={`#${userData.rank}`} color="info" />
      </div>
         </div>
        </div>
      </div>

      {/* Stat Cards */}
     

      {/* Custom Link Generator */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white"><BsLink45Deg className="me-2" /> Generate Custom Link</div>
        <div className="card-body row g-2">
          <div className="col-md-4">
            <input type="text" placeholder="Product ID / Slug" className="form-control" value={productId} onChange={(e) => setProductId(e.target.value)} />
          </div>
          <div className="col-md-4">
            <input type="text" placeholder="Custom Alias (optional)" className="form-control" value={alias} onChange={(e) => setAlias(e.target.value)} />
          </div>
          <div className="col-md-4">
            <button className="btn btn-success w-100" onClick={handleGenerateLink}>Generate</button>
          </div>
          {customLink && (
            <div className="col-12 mt-2">
              <strong>Generated Link:</strong> <a href={customLink} target="_blank" rel="noreferrer">{customLink}</a>
            </div>
          )}
        </div>
      </div>

      {/* Referral History */}
      <div className="card mb-4">
        <div className="card-header bg-light">📋 Recent Generated Links</div>
        <div className="card-body">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Product ID</th>
                <th>Link</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {referralHistory.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.productId}</td>
                  <td style={{ wordBreak: "break-word" }}>{r.link}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
              {referralHistory.length === 0 && (
                <tr><td colSpan="4" className="text-center">No links generated yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">💰 Withdraw Earnings</div>
        <div className="card-body">
          <p>Eligible Earnings: <strong>₹{userData.eligibleCommission}</strong></p>
          <button className="btn btn-primary" onClick={handleWithdraw}>Request Withdrawal</button>
          {withdrawStatus && <p className="mt-2 text-success">{withdrawStatus}</p>}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">🏆 Top Affiliates</div>
        <div className="card-body">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Clicks</th>
                <th>Conversions</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.rank}</td>
                  <td>{user.name}</td>
                  <td>{user.clicks}</td>
                  <td>{user.conversions}</td>
                  <td>₹{user.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips and FAQ */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-warning">📌 Boost Your Earnings</div>
            <div className="card-body">
              <ul>
                <li>Target trending products or festivals</li>
                <li>Share product reviews & videos</li>
                <li>Use Instagram Reels + referral link in bio</li>
                <li>Build trust with your audience</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">📘 FAQ & Rules</div>
            <div className="card-body">
              <p><strong>Q:</strong> How is commission calculated?</p>
              <p><strong>A:</strong> Based on final purchase amount after returns.</p>
              <p><strong>Q:</strong> When do I get paid?</p>
              <p><strong>A:</strong> Within 7–14 days of withdrawal request.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

// Reusable Stat Card
const StatCard = ({ icon, label, value, color }) => (
  <div className="col-md-3">
    <div className="card text-center">
      <div className="card-body">
        <div className={`text-${color}`}>{icon}</div>
        <h6 className="mt-2">{label}</h6>
        <h4>{value}</h4>
      </div>
    </div>
  </div>
);

export default AffiliateMarketingPage;
