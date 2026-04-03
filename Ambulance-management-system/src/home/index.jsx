import { App } from "../navbar/navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../footer/footer";
import { LiveBackground } from "../livebg/LiveBackground";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("toastMessage")) {
      toast.success("Login Successful...", { transition: Slide });
      localStorage.removeItem("toastMessage");
    }
  }, []);

  return (
    <>
      <App />
      <div className="min-h-screen bg-white relative">
        <LiveBackground />
        <ToastContainer />

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-6">
              <img
                className="h-12 w-auto animate-fade-in-up"
                src="/pics/logo1.webp"
                alt="Hyper Ambulance"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight animate-fade-in-up delay-100">
                Sabse Tezz<br />Sabse Aage...
              </h1>
              <p className="text-neutral-500 text-lg leading-relaxed max-w-md animate-fade-in-up delay-200">
                India's largest ambulance service with 1 Million+ customers.
                Experience the quickest and most reliable medical assistance
                right at your doorstep.
              </p>
              <div className="flex gap-4 pt-2 animate-fade-in-up delay-300">
                <button className="px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300">
                  Book Now
                </button>
                <button className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg border-2 border-black hover:bg-black hover:text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  Book Advance
                </button>
              </div>
            </div>
            <div className="md:w-1/2 animate-slide-right delay-200">
              <img
                src="/pics/pic1.webp"
                alt="Ambulance Service"
                className="w-full rounded-2xl shadow-2xl grayscale hover:grayscale-0 hover:scale-[1.02] transition-all duration-700"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative z-10 glass-dark text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in-up">Why Choose Us?</h2>
            <p className="text-neutral-400 text-lg leading-relaxed animate-fade-in-up delay-100">
              At Hyper Ambulance, we offer a wide range of medical services to
              meet your needs. Our fleet is equipped with all necessary equipment
              to ensure the highest standard of medical care. Quick, reliable,
              and efficient.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { value: "24/7", label: "Always Available" },
                { value: "1M+", label: "Happy Customers" },
                { value: "500+", label: "Ambulances" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-6 border border-neutral-800 rounded-xl hover:border-neutral-600 hover:bg-white/5 transition-all duration-300 animate-fade-in-up delay-${(i + 2) * 100}`}
                >
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-neutral-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
