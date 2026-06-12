import { useState } from "react";
import { Loader2, Ban } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

export function CancelButton({ plantNumber, currentStatus, onStatusUpdated }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCancel = async () => {
    if (currentStatus === "Cancelled") return;

    // Use token from context, fallback to localStorage directly
    const authToken = token || localStorage.getItem("gnxt_token");

    if (!authToken) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/invoices/${plantNumber}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ status: "Cancelled" }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Cancellation failed");
      }

      if (onStatusUpdated) {
        onStatusUpdated(plantNumber, "Cancelled");
      }
      setOpen(false);
    } catch (err) {
      console.error("Cancel invoice error:", err);
      alert(`Cancel failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "Cancelled") {
    return (
      <span className="text-slate-300 cursor-not-allowed" title="Already Cancelled">
        <Ban className="w-4 h-4 opacity-50" />
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="text-amber-500 hover:text-red-600 transition-colors"
        title="Cancel Invoice Group"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Ban className="w-4 h-4" />
        )}
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-white border border-border shadow-lg rounded-xl max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">
              Cancel Invoice Group?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 mt-2">
              Are you sure you want to cancel all invoices under Plant No. <strong className="font-semibold text-slate-900">{plantNumber}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel 
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm transition-colors"
              disabled={loading}
            >
              No, Keep
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              disabled={loading}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Yes, Cancel Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CancelButton;
