// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";

// const AIChatBox = () => {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hi! How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const response = await axios.post("/api/chat", { message: input }); // Adjust endpoint
//       const botMessage = { sender: "bot", text: response.data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Sorry, something went wrong!" },
//       ]);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div className="w-full max-w-md mx-auto shadow-lg border rounded-lg flex flex-col h-[500px]">
//       <div className="bg-yellow-600 text-white p-4 rounded-t-lg font-bold">
//         AI Chat Support
//       </div>
//       <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-lg max-w-xs ${
//               msg.sender === "user"
//                 ? "bg-yellow-100 self-end text-right"
//                 : "bg-white self-start text-left"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <div className="p-2 flex items-center border-t gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded-lg"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <button
//           className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
//           onClick={handleSend}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AIChatBox;

import React, { useState } from "react";

const ChatLoginBox = ({ onStartChat }) => {
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = "Please fill in required fields.";
    if (!formData.mobile) errs.mobile = "Please fill in required fields.";
    if (!formData.email) errs.email = "Please fill in required fields.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onStartChat(formData);
  };

  return (
    <div className="w-[300px] h-[600px] shadow-xl rounded-xl bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#eeeeee] p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className=" w-100 h-100">
           <img src="/assets/BBS.png" className="w-[50px] h-[50px]" alt="" />
          </div>
          <div>
            <p className="font-bold">BBSCART</p>
            <p className="text-xs text-gray-500">Product Expert</p>
          </div>
        </div>
        <button className="text-xl">⋮</button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col justify-center">
        <p className="mb-6 text-sm">
          Welcome to BBSCART! Please fill in the form below before starting the chat.
        </p>

        <label className="text-sm font-medium">Name: *</label>
        <input
          type="text"
          className="border rounded p-2 mt-1 mb-1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

        <label className="text-sm font-medium">Mobile: *</label>
        <input
          type="tel"
          className="border rounded p-2 mt-1 mb-1"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        />
        {errors.mobile && <p className="text-red-500 text-xs mb-2">{errors.mobile}</p>}

        <label className="text-sm font-medium">E-mail: *</label>
        <input
          type="email"
          className="border rounded p-2 mt-1 mb-4"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-xs mb-4">{errors.email}</p>}

        <button
          type="submit"
          className="bg-[#7c1c1c] text-white py-2 rounded-lg text-center font-semibold"
        >
          Start the chat
        </button>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pb-2">
        Powered by <span className="text-red-500 font-semibold">LiveChat</span>
      </div>
    </div>
  );
};

export default ChatLoginBox;
