import React, { useEffect, useState } from "react";
import { getTrips } from "../api";
import { App } from "../navbar/navbar";
import { Pagination } from "../pagination/pagination";
import { Footer } from "../footer/footer";
import { LiveBackground } from "../livebg/LiveBackground";
import { Loader } from "../loader/Loader";
import { useNavigate } from "react-router-dom";

export function Trips() {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [SearchTerm, setSearchTerm] = useState("");
  const [status, setstatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (atob(localStorage.getItem("role")) != 'Admin') {
      navigate("/home");
    }
  });

  useEffect(() => {
    if(SearchTerm.length < 3){
    }
    setLoading(true);
    getTrips({ currentpage: currentPage, status: status, name: SearchTerm })
      .then((response) => {
        if (response.data.status === "success") {
          setTrips(response.data.data);
          setTotalPages(response.data.totalPages);
        } else {
          setTrips([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, [SearchTerm, currentPage, status]);

  function setSearchTermfucntion (e) {
    if(e.target.value.length > 2){
      setSearchTerm(e.target.value);
    }
  }

  return (
    <>
      <App />
      <div className="min-h-screen bg-neutral-50 relative">
        <LiveBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-black tracking-tight">Trip Details</h1>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 text-sm glass border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                onKeyUp={(e) => setSearchTermfucntion(e)}
                className="px-4 py-2 text-sm glass border border-neutral-200 rounded-lg w-56 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="glass border border-neutral-200 rounded-xl overflow-hidden shadow-lg animate-fade-in-up delay-100">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Ambulance No</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Driver</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Hospital</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Start</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">End</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <Loader message="Loading trips..." />
                    </td>
                  </tr>
                ) : trips.length > 0 ? (
                  trips.map((trip, index) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-neutral-500">{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-medium text-black">{trip.registration_number}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.driver_name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.hospital_name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.trip_start}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.trip_end}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.distance_covered_km} km</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-12 text-center text-neutral-400 text-sm"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {loading ? null : trips.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
