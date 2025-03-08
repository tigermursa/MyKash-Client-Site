import { useEffect } from "react";

// Extend the window object type
declare global {
  interface Window {
    RocketChat: any;
  }
}

const RocketChatWidget = () => {
  useEffect(() => {
    // Define RocketChat on the window
    window.RocketChat = function (c: any) {
      window.RocketChat._.push(c);
    };
    window.RocketChat._ = []; // Ensure this is an array
    window.RocketChat.url = "http://localhost:3000/livechat";

    // Create and insert the script tag
    const script = document.createElement("script");
    script.src =
      "http://localhost:3000/livechat/rocketchat-livechat.min.js?_=201903270000";
    script.async = true;
    document.body.appendChild(script);

    // Clean up if needed
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render any visible element
};

export default RocketChatWidget;
