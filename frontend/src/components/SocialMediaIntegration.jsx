import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaYoutube, FaLinkedin, FaShare, FaHeart, FaBookmark, FaComment } from "react-icons/fa";

const SocialMediaIntegration = ({ productUrl, productName, productImage }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out ${productName} on Thiaworld!`)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(productName)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out ${productName} on Thiaworld! ${productUrl}`)}`
  };

  const handleShare = (platform) => {
    const url = shareUrls[platform];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
  };

  const handleLike = () => {
    // Silent like action
  };

  const handleSave = () => {
    // Silent save action
  };

  return (
    <div className="space-y-4">
      {/* Social Share Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Share:</span>
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          title="Share on Facebook"
        >
          <FaFacebook size={16} />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
          title="Share on Twitter"
        >
          <FaTwitter size={16} />
        </button>
        <button
          onClick={() => handleShare('pinterest')}
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          title="Share on Pinterest"
        >
          <FaPinterest size={16} />
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
          title="Share on LinkedIn"
        >
          <FaLinkedin size={16} />
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          title="Share on WhatsApp"
        >
          <FaComment size={16} />
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          title="More options"
        >
          <FaShare size={16} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaHeart className="text-red-500" />
          <span className="text-sm">Like</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaBookmark className="text-[#f4c542]" />
          <span className="text-sm">Save</span>
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share this product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaFacebook className="text-blue-600 text-2xl" />
                  <span className="text-xs">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaTwitter className="text-sky-500 text-2xl" />
                  <span className="text-xs">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('pinterest')}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaPinterest className="text-red-600 text-2xl" />
                  <span className="text-xs">Pinterest</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaLinkedin className="text-blue-700 text-2xl" />
                  <span className="text-xs">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaComment className="text-green-500 text-2xl" />
                  <span className="text-xs">WhatsApp</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaShare className="text-gray-600 text-2xl" />
                  <span className="text-xs">Copy Link</span>
                </button>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-[#f4c542] text-white rounded-lg hover:bg-[#caa43b]"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaIntegration;
