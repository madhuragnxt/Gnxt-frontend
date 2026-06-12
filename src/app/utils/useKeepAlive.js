import { useEffect } from "react";

// Get the API base URL from the environment or default to local development port
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

/**
 * Custom React Hook to establish a keep-alive ping mechanism.
 * It sends a GET request to the backend health endpoint every 7 minutes
 * to keep server instances (such as serverless/idle-sleeping environments) active.
 */
export function useKeepAlive() {
  console.log("[Keep-Alive] useKeepAlive hook function invoked");

  useEffect(() => {
    console.log("[Keep-Alive] useEffect registered and executing");
    // 7 minutes in milliseconds (7 * 60 * 1000)
    const INTERVAL_MS = 420000;

    const pingBackend = async () => {
      try {
        console.log("[Keep-Alive] Initiating ping request to:", `${API_URL}/health`);
        const response = await fetch(`${API_URL}/health`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`[Keep-Alive] Ping successful at ${new Date().toLocaleTimeString()}:`, data.message || "Server Active");
      } catch (error) {
        // Handle failures gracefully without throwing or crashing the application
        console.error(`[Keep-Alive] Failed to ping backend at ${new Date().toLocaleTimeString()}:`, error.message);
      }
    };

    // Execute immediately when the application loads
    pingBackend();

    // Set up the recurring interval to keep the connection active
    const timer = setInterval(pingBackend, INTERVAL_MS);

    // Clean up the interval when the component is unmounted to prevent memory leaks
    return () => {
      clearInterval(timer);
      console.log("[Keep-Alive] Hook unmounted. Cleared interval timer.");
    };
  }, []);
}
