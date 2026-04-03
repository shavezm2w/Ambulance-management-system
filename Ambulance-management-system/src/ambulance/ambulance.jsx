import React, { useEffect, useState } from "react";
import { getAmbulances, getAmbulanceById, addAmbulance, updateAmbulance, deleteAmbulance } from "../api";
import { App } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { LiveBackground } from "../livebg/LiveBackground";
import { Pagination } from "../pagination/pagination";
import { Loader, ButtonLoader } from "../loader/Loader";
import { ToastContainer, Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

export function Ambulance() {
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState({
    exp: "",
    iat: "",
    iss: "",
    sub: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("tokken");
    if (token) {
      try {
        const decoded = jwtDecode(atob(token));
        setDecodedToken(decoded);
        if (decoded.exp < Math.floor(Date.now() / 1000)) {
          localStorage.removeItem("tokken");
          localStorage.removeItem("role");
          localStorage.setItem("toastMessage", 1);
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid Token:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Updated Decoded Token:", decodedToken.exp);
    const date = new Date(decodedToken.exp * 1000);
    console.log(date.toLocaleString());
  }, [decodedToken]);

  const [formData, setFormData] = useState({
    registration_number: "",
    ambulance_type: "",
  });
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [SearchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [FormType, setFormType] = useState("Submit");
  const [updateButton, setUpdateButton] = useState();
  const [status, setstatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (atob(localStorage.getItem("role")) != "Admin") {
      navigate("/home");
    }
  });

  const fetchAmbulances = (page, statusVal, search) => {
    setLoading(true);
    getAmbulances({ currentpage: page, status: statusVal, name: search })
      .then((response) => {
        if (response.data.status === "Success") {
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
  };

  useEffect(() => {
    fetchAmbulances(1, status, SearchTerm);
    setCurrentPage(1);
  }, [status]);

  useEffect(() => {
    fetchAmbulances(1, status, SearchTerm);
    setCurrentPage(1);
  }, [SearchTerm]);

  useEffect(() => {
    fetchAmbulances(currentPage, status, SearchTerm);
  }, [currentPage, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const Submit = (e) => {
    e.preventDefault();
    const data = { name: formData.registration_number, ambulance_type: formData.ambulance_type };

    setSubmitting(true);
    if (FormType == "Submit") {
      addAmbulance(data)
        .then((response) => {
          if (response.data.status === "Success") {
            toast.success("New ambulance registered", { transition: Slide });
            setIsOpen(false);
            e.target.reset();
            setCurrentPage(totalPages);
          } else {
            toast.error("There was an error", { transition: Slide });
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => setSubmitting(false));
    } else if (FormType == "Update") {
      data.id = updateButton;
      updateAmbulance(data)
        .then((response) => {
          if (response.data.status === "Success") {
            toast.success("Ambulance Updated", { transition: Slide });
            setIsOpen(false);
            e.target.reset();
          } else {
            toast.error("There was an error", { transition: Slide });
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => setSubmitting(false));
    }
  };

  const updateValue = (e) => {
    setFormType("Update");
    setIsOpen(true);
    setUpdateButton(e.target.value);
  };

  useEffect(() => {
    if (updateButton) {
      getAmbulanceById(updateButton)
        .then((response) => {
          if (response.data.status === "Success") {
            setFormData({
              registration_number: response.data.data.registration_number,
              ambulance_type: response.data.data.ambulance_type,
            });
          } else {
            setFormData({
              registration_number: "",
              ambulance_type: "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [updateButton]);

  function deleteValue(e) {
    if (confirm("Are you sure you want to delete this row")) {
      const deleteId = e.target.value;
      deleteAmbulance(deleteId)
        .then((response) => {
          if (response.data.status === "success") {
            toast.success("Row deleted", { transition: Slide });
            fetchAmbulances(currentPage, status, SearchTerm);
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }

  return (
    <>
      <App />
      <ToastContainer />
      <div className="min-h-screen bg-neutral-50 relative">
        <LiveBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-black tracking-tight">Ambulance Details</h1>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setFormType("Submit");
                  setUpdateButton();
                  setFormData({
                    registration_number: "",
                    ambulance_type: "",
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                + Add New
              </button>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 text-sm glass border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                onKeyUp={(e) => setSearchTerm(e.target.value)}
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
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <Loader message="Loading ambulances..." />
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
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.ambulance_type}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                          trip.ambulance_status == 1
                            ? "bg-neutral-100 text-black"
                            : trip.ambulance_status == 0
                            ? "bg-black text-white"
                            : "bg-neutral-200 text-neutral-600"
                        }`}>
                          {trip.ambulance_status == 3
                            ? "Grounded"
                            : trip.ambulance_status == 2
                            ? "Maintenance"
                            : trip.ambulance_status == 0
                            ? "On Trip"
                            : trip.ambulance_status == 1
                            ? "Available"
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            value={trip.id}
                            onClick={(e) => updateValue(e)}
                            className="px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all"
                          >
                            Update
                          </button>
                          <button
                            value={trip.id}
                            onClick={(e) => deleteValue(e)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-neutral-700 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
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
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">
                  {FormType === "Submit" ? "Add Ambulance" : "Update Ambulance"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-black text-2xl transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={Submit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Ambulance Type
                  </label>
                  <input
                    type="text"
                    name="ambulance_type"
                    value={formData.ambulance_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? <ButtonLoader /> : FormType}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
