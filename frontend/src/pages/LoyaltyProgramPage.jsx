import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { FaStar, FaGift, FaTrophy, FaCrown, FaGem, FaShareAlt, FaHistory, FaTicketAlt } from "react-icons/fa";

const LoyaltyProgramPage = () => {
  const navigate = useNavigate();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [tierInfo, setTierInfo] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const stored = localStorage.getItem("bbsUser");
    if (!stored) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    const userId = parsed.user?._id || parsed.userId;

    if (userId) {
      fetchLoyaltyData(userId);
    }
  }, [navigate]);

  const fetchLoyaltyData = async (userId) => {
    setLoading(true);
    try {
      const [programRes, tierRes, rewardsRes, historyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URI}/loyalty/user/${userId}`),
        axios.get(`${import.meta.env.VITE_API_URI}/loyalty/user/${userId}/tier`),
        axios.get(`${import.meta.env.VITE_API_URI}/loyalty/user/${userId}/rewards`),
        axios.get(`${import.meta.env.VITE_API_URI}/loyalty/user/${userId}/history`)
      ]);

      setLoyaltyData(programRes.data);
      setTierInfo(tierRes.data);
      setRewards(rewardsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "bronze": return <FaStar className="text-amber-600" />;
      case "silver": return <FaStar className="text-gray-400" />;
      case "gold": return <FaTrophy className="text-yellow-500" />;
      case "platinum": return <FaCrown className="text-gray-300" />;
      case "diamond": return <FaGem className="text-blue-400" />;
      default: return <FaStar className="text-gray-400" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "bronze": return "bg-amber-600";
      case "silver": return "bg-gray-400";
      case "gold": return "bg-yellow-500";
      case "platinum": return "bg-gray-300";
      case "diamond": return "bg-blue-400";
      default: return "bg-gray-400";
    }
  };

  const handleRedeemReward = async (reward) => {
    try {
      const stored = JSON.parse(localStorage.getItem("bbsUser"));
      const userId = stored.user?._id || stored.userId;

      await axios.post(`${import.meta.env.VITE_API_URI}/loyalty/user/${userId}/redeem`, {
        points: reward.pointsRequired,
        description: `Redeemed: ${reward.name}`
      });

      fetchLoyaltyData(userId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyReferralCode = () => {
    if (loyaltyData?.referralCode) {
      navigator.clipboard.writeText(loyaltyData.referralCode);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4c542]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Loyalty Program</h1>

          {/* Overview Card */}
          {loyaltyData && tierInfo && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full ${getTierColor(tierInfo.currentTier)} flex items-center justify-center text-white text-3xl`}>
                    {getTierIcon(tierInfo.currentTier)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{tierInfo.currentTier} Member</h2>
                    <p className="text-gray-600">{loyaltyData.points} Points</p>
                    <p className="text-sm text-gray-500">
                      {tierInfo.nextTier ? `${tierInfo.pointsToNextTier} points to ${tierInfo.nextTier.name}` : 'Highest tier achieved!'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#f4c542]">{tierInfo.tierInfo.multiplier}x</p>
                    <p className="text-sm text-gray-600">Points Multiplier</p>
                  </div>
                </div>
              </div>

              {/* Tier Benefits */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Your Benefits:</h3>
                <div className="flex flex-wrap gap-2">
                  {tierInfo.tierInfo.benefits.map((benefit, index) => (
                    <span key={index} className="px-3 py-1 bg-[#f4c542] text-white rounded-full text-sm">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Referral Section */}
          {loyaltyData && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShareAlt className="text-[#f4c542]" />
                Refer & Earn
              </h3>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <p className="text-gray-600 mb-2">Share your referral code and earn 500 points for each friend who joins!</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={loyaltyData.referralCode}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={handleCopyReferralCode}
                      className="px-4 py-2 bg-[#f4c542] text-white rounded-lg hover:bg-[#caa43b]"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#f4c542]">{loyaltyData.referrals?.length || 0}</p>
                  <p className="text-sm text-gray-600">Referrals</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 font-medium ${activeTab === "overview" ? "border-b-2 border-[#f4c542] text-[#f4c542]" : "text-gray-600"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("rewards")}
                className={`px-6 py-3 font-medium ${activeTab === "rewards" ? "border-b-2 border-[#f4c542] text-[#f4c542]" : "text-gray-600"}`}
              >
                Rewards
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-3 font-medium ${activeTab === "history" ? "border-b-2 border-[#f4c542] text-[#f4c542]" : "text-gray-600"}`}
              >
                History
              </button>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">How to Earn Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Purchase Products</p>
                      <p className="text-sm text-gray-600">Earn 1 point for every ₹100 spent</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Refer Friends</p>
                      <p className="text-sm text-gray-600">Earn 500 points per referral</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Write Reviews</p>
                      <p className="text-sm text-gray-600">Earn 50 points per review</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Birthday Bonus</p>
                      <p className="text-sm text-gray-600">Earn 100 points on your birthday</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "rewards" && rewards && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Available Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewards.rewards.map((reward) => (
                      <div key={reward.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FaGift className="text-[#f4c542]" />
                              <h4 className="font-semibold">{reward.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                            <p className="text-sm font-medium text-[#f4c542]">{reward.pointsRequired} points</p>
                          </div>
                          <button
                            onClick={() => handleRedeemReward(reward)}
                            disabled={!reward.available}
                            className={`px-4 py-2 rounded-lg ${
                              reward.available
                                ? "bg-[#f4c542] text-white hover:bg-[#caa43b]"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {reward.available ? "Redeem" : "Locked"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Points History</h3>
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{item.type}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-bold ${item.points > 0 ? "text-green-600" : "text-red-600"}`}>
                          {item.points > 0 ? "+" : ""}{item.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoyaltyProgramPage;
