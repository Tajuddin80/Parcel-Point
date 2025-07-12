import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import { FaSearch, FaMapMarkerAlt, FaClock, FaUser } from "react-icons/fa";
import { useLocation } from "react-router";

const TrackParcel = () => {
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTrackId = searchParams.get("track") || "";

  const [trackingId, setTrackingId] = useState(initialTrackId);
  const [submittedId, setSubmittedId] = useState(initialTrackId);

  const {
    data: trackingLogs = [],
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["trackingLogs", submittedId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/trackings?tracking_id=${submittedId}`);
      return res.data;
    },
    enabled: !!submittedId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSubmittedId(trackingId.trim());
    }
  };

 

  useEffect(() => {
    if (initialTrackId) {
      setSubmittedId(initialTrackId);
    }
  }, [initialTrackId]);

  return (
    <div className="min-h-screen mx-auto px-4 py-10 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-5xl font-bold mb-6 text-center text-primary"> Track Your Parcel</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center mb-10 px-2">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="input input-bordered text-lg w-full sm:max-w-lg"
        />
        <button className="btn btn-primary text-lg flex items-center gap-2" type="submit">
          <FaSearch /> Track
        </button>
      </form>

      {(isPending || isFetching) && <Loader />}

      {!isPending && trackingLogs.length === 0 && submittedId && (
        <p className="text-center text-gray-600 text-lg">No tracking updates found for this ID.</p>
      )}

      {trackingLogs.length > 0 && (
        <ul className="timeline timeline-vertical">
          {trackingLogs
            .sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
            .map((log, idx) => (
              <li key={log._id}>
                {idx !== 0 && <hr className="bg-primary" />}
                <div
                  className={
                    idx % 2 === 0 ? "timeline-start timeline-box bg-white" : "timeline-end timeline-box bg-white"
                  }
                >
                  <h3 className="font-semibold capitalize text-xl text-primary flex items-center gap-2">
                    <FaMapMarkerAlt /> {log.status}
                  </h3>
                  <p className="text-base text-gray-700 mt-1">{log.details}</p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <FaClock /> {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaUser /> {log.updated_by}
                  </p>
                </div>
                <div className="timeline-middle">
                  <span className="inline-block h-5 w-5 bg-primary rounded-full"></span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TrackParcel;
