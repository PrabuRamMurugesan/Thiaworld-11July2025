import React, { useState } from "react";
import ChatFloatingButton from "./ChatFloatingButton";
import ChatPanel from "./ChatPanel";
import BrandAIChat from "./BrandAIChat";

const BrandAIWidget = ({ brand }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatFloatingButton onClick={() => setOpen(true)} brand={brand} />
      <ChatPanel isOpen={open} onClose={() => setOpen(false)} brand={brand}>
        <BrandAIChat brand={brand} />
      </ChatPanel>
    </>
  );
};

export default BrandAIWidget;
