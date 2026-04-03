import React, { useEffect, useState } from "react";
import { getDrivers, getDriverById, addDriver, updateDriver, deleteDriver } from "../api";
import { App } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { LiveBackground } from "../livebg/LiveBackground";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../pagination/pagination";
import { Loader, ButtonLoader } from "../loader/Loader";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Drivers() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState("Submit");
  const [status, setstatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact_number: "",
    license_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pin_code: "",
    id: ""
  });

  useEffect(() => {
    if (atob(localStorage.getItem("role")) != 'Admin') {
      navigate("/home");
    }
  });

  const fetchDrivers = (page, statusVal, search) => {
    setLoading(true);
    getDrivers({ currentpage: page, name: search, status: statusVal })
      .then((response) => {
        if (response.data.status === "success") {
          setTrips(response.data.data);
          setTotalPages(response.data.totalPages);
        } else {
          setTrips([]);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers(1, status, searchTerm);
    setCurrentPage(1);
  }, [status]);

  useEffect(() => {
    fetchDrivers(1, status, searchTerm);
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchDrivers(currentPage, status, searchTerm);
  }, [currentPage, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (formType == "Submit") {
      addDriver(formData)
        .then((response) => {
          if (response.data.status === "Success") {
            toast.success("New driver registered", { transition: Slide });
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
    } else if (formType == "Update") {
      updateDriver(formData)
        .then((response) => {
          if (response.data.status === "Success") {
            toast.success("Driver Updated", { transition: Slide });
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
    setFormType('Update');
    setIsOpen(true);
    const driverId = e.target.value;
    setFormData({ id: driverId });
    getDriverById(driverId)
      .then((response) => {
        if (response.data.status === "Success") {
          setFormData({
            name: response.data.data.name,
            age: response.data.data.age,
            gender: response.data.data.gender,
            contact_number: response.data.data.contact_number,
            license_number: response.data.data.license_number,
            address_line1: response.data.data.address_line1,
            address_line2: response.data.data.address_line2,
            city: response.data.data.city,
            state: response.data.data.state,
            pin_code: response.data.data.pin_code,
            id: response.data.data.id,
          });
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const deleteValue = (e) => {
    if (confirm("Are you sure you want to delete this row")) {
      const deleteId = e.target.value;
      deleteDriver(deleteId)
        .then((response) => {
          if (response.data.status === "success") {
            toast.success("Row deleted", { transition: Slide });
            fetchDrivers(currentPage, status, searchTerm);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2";

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
              <h1 className="text-2xl font-bold text-black tracking-tight">Drivers Details</h1>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setFormType("Submit");
                  setFormData({
                    name: "",
                    age: "",
                    gender: "",
                    contact_number: "",
                    license_number: "",
                    address_line1: "",
                    address_line2: "",
                    city: "",
                    state: "",
                    pin_code: "",
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
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">License</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Address</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <Loader message="Loading drivers..." />
                    </td>
                  </tr>
                ) : trips.length > 0 ? (
                  trips.map((trip, index) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-neutral-500">{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-medium text-black">{trip.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                          trip.driver_status == 1
                            ? "bg-neutral-100 text-black"
                            : trip.driver_status == 0
                            ? "bg-black text-white"
                            : "bg-neutral-200 text-neutral-600"
                        }`}>
                          {trip.driver_status == 2
                            ? "Maintenance"
                            : trip.driver_status == 0
                              ? "On Trip"
                              : trip.driver_status == 1
                                ? "Available"
                                : "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.contact_number}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.license_number}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{trip.address}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            value={trip.id}
                            onClick={updateValue}
                            className="px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all"
                          >
                            Update
                          </button>
                          <button
                            value={trip.id}
                            onClick={deleteValue}
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
                    <td colSpan="7" className="py-12 text-center text-neutral-400 text-sm">
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

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8 max-h-[85vh] overflow-y-auto animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">
                  {formType === "Submit" ? "Add Driver" : "Update Driver"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-black text-2xl transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Driver Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Gender</label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} className="accent-black" required />
                      <span className="text-sm text-neutral-700">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} className="accent-black" required />
                      <span className="text-sm text-neutral-700">Female</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Number</label>
                    <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>License Number</label>
                    <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address Line 1</label>
                  <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} className={inputClass} required />
                </div>

                <div>
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} className={inputClass} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Pin Code</label>
                    <input type="text" name="pin_code" value={formData.pin_code} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? <ButtonLoader /> : formType}
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
