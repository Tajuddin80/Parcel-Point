import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  // Log a new update
  const logTracking = async ({ tracking_id, status, details, updated_by }) => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        updated_by,
      };
      await axiosSecure.post("/trackings", payload);
    } catch (err) {
      // Optional: Notify or toast
      console.error("Error logging tracking update:", err);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
