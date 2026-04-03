import React, { useEffect, useState } from "react";
import { getHospitals } from "../api";
import { App } from "../navbar/navbar";
import { Pagination } from "../pagination/pagination";
import { Footer } from "../footer/footer";
import { LiveBackground } from "../livebg/LiveBackground";
import { Loader } from "../loader/Loader";
import { useNavigate } from "react-router-dom";

export function Hospitals() {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [SearchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (atob(localStorage.getItem("role")) != 'Admin') {
      navigate("/home");
    }
  });

  useEffect(() => {
    setLoading(true);
    getHospitals({ currentpage: 1, name: SearchTerm })
      .then((response) => {
        if (response.data.status === "success") {
          setTrips(response.data.data);
          setCurrentPage(1);
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
  }, [SearchTerm]);

  useEffect(() => {
    setLoading(true);
    getHospitals({ currentpage: currentPage, name: SearchTerm })
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
  }, [currentPage]);

  return (
    <>
      <App />
      <div className="min-h-screen bg-neutral-50 relative">
        <LiveBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-black tracking-tight">Hospitals Details</h1>
            <input
              type="text"
              placeholder="Search..."
              onKeyUp={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 text-sm glass border border-neutral-200 rounded-lg w-56 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          {/* Table */}
          <div className="glass border border-neutral-200 rounded-xl overflow-hidden shadow-lg animate-fade-in-up delay-100">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Hospital Name</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <Loader message="Loading hospitals..." />
                    </td>
                  </tr>
                ) : trips.length > 0 ? (
                  trips.map((trip, index) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-neutral-500">{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-medium text-black">{trip.hospital_name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.contact_number}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.email_address}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-neutral-400 text-sm"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
