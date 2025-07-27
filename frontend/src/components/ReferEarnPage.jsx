import React, { useState } from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaXTwitter,
  FaCopy,
  FaGift,
  FaUserPlus,
  FaChartLine,
  FaRegClock
} from "react-icons/fa6";
import { Button, Form, InputGroup, Table, Alert, Badge, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Footer from "./Footer";

const ReferEarnPage = () => {
  const referralCode = "BBSCART1234";
  const referralLink = `https://bbscart.com/signup?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const referralStats = {
    invited: 12,
    signedUp: 8,
    completedOrders: 5,
    totalReward: "₹500",
    level: "Silver",
    progress: 50,
  };

  const referralHistory = [
    { email: "user1@gmail.com", status: "Signed Up", reward: "₹100" },
    { email: "user2@gmail.com", status: "Order Completed", reward: "₹100" },
    { email: "user3@gmail.com", status: "Pending", reward: "-" },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (inviteEmail) {
      setInviteSent(true);
      setTimeout(() => setInviteSent(false), 2500);
      setInviteEmail("");
    }
  };

  return (
    <>
    <Header/>
    <div className="container py-5 bg-light">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">🎁 Invite Friends & Earn Rewards</h2>
        <p className="text-muted">Share your referral link and earn up to <strong>₹1000/month</strong></p>
      </div>

      {/* Referral Banner */}
      <div className="mb-4 p-4 shadow-sm rounded text-white" style={{ background: "linear-gradient(135deg, #690b2f, #330011)" }}>
        <h4 className="mb-2 fw-semibold"><FaGift /> Your Referral Code</h4>
        <InputGroup className="mb-3">
          <Form.Control readOnly value={referralLink} />
          <Button variant="light" className="fw-medium" onClick={handleCopy}><FaCopy /> Copy</Button>
        </InputGroup>
        {copied && <Alert variant="success">Referral link copied!</Alert>}
        <div className="d-flex gap-2 flex-wrap mb-3">
          <Button variant="success" className="fw-medium text-uppercase" onClick={() => window.open(`https://wa.me/?text=Join BBSCART & earn rewards! ${referralLink}`)}><FaWhatsapp /> WhatsApp</Button>
          <Button variant="primary" className="fw-medium text-uppercase" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`)}><FaFacebook /> Facebook</Button>
          <Button variant="dark" className="fw-medium text-uppercase" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Shop+and+Earn+with+BBSCART&url=${referralLink}`)}><FaXTwitter /> X (Twitter)</Button>
        </div>
      </div>

      {/* Email Invite */}
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold text-dark"><FaUserPlus /> Invite via Email</h5>
        <Form className="d-flex gap-2 flex-wrap mt-3">
          <Form.Control type="email" placeholder="Enter email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <Button variant="info" className="fw-semibold" onClick={handleInvite}>Send Invite</Button>
        </Form>
        {inviteSent && <Alert variant="success" className="mt-2">Invitation sent!</Alert>}
      </div>

      {/* Stats & Level */}
      <div className="card shadow-sm mb-4 p-4" style={{ background: "linear-gradient(135deg, #690b2f, #330011)" }}  >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-semibold text-white"><FaChartLine /> Your Stats</h5>
          <Badge bg="secondary" className="px-3 py-2 rounded-pill ">Level: {referralStats.level}</Badge>
        </div>
        <ul className="list-group list-group-flush mt-3">
          <li className="list-group-item">👥 Total Invited: {referralStats.invited}</li>
          <li className="list-group-item">✅ Signed Up: {referralStats.signedUp}</li>
          <li className="list-group-item">🛒 Orders Completed: {referralStats.completedOrders}</li>
          <li className="list-group-item">🏆 Total Rewards Earned: {referralStats.totalReward}</li>
        </ul>
        <div className="mt-3">
          <label className="fw-semibold mb-1 text-white">Progress to Next Tier</label>
          <ProgressBar now={referralStats.progress} label={`${referralStats.progress}%`} variant="info" className="rounded-pill" />
        </div>
      </div>

      {/* Referral History */}
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold text-dark"><FaRegClock /> Referral History</h5>
        <Table bordered hover responsive className="mt-3">
          <thead className="table-primary text-white">
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {referralHistory.map((ref, index) => (
              <tr key={index}>
                <td>{ref.email}</td>
                <td>{ref.status}</td>
                <td>{ref.reward}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Coming Soon */}
      <div className="alert alert-warning border-start border-4 border-warning-subtle">
        <h6 className="fw-bold">🚀 Coming Soon Features</h6>
        <ul className="mb-0 ps-3">
          <li className="mb-1">🏆 Leaderboard for Top Referrers</li>
          <li className="mb-1">🎮 Gamified Referral Badges</li>
          <li className="mb-1">🤖 AI Fraud Prevention</li>
          <li className="mb-1">📈 Referral Conversion Analytics</li>
          <li className="mb-1">⏳ Time-limited Campaign Boosters</li>
        </ul>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ReferEarnPage;
