import './about.css'
import {App} from '../navbar/navbar'
import {  useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { Footer } from "../footer/footer"
import { LiveBackground } from "../livebg/LiveBackground"

export function AboutUs() {

    const navigate= useNavigate();

    useEffect(() => {
      if (atob(localStorage.getItem("tokken")) !== "112") {
          navigate("/");
      }
  }, [navigate]);

    return (
        <>
        <App />
        <div className="min-h-screen bg-white relative">
          <LiveBackground />
          <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-black tracking-tight mb-6 animate-fade-in-up">About Us</h1>
            <div className="w-16 h-1 bg-black mb-8 animate-fade-in-up delay-100"></div>
            <p className="text-neutral-500 text-lg leading-relaxed mb-8 animate-fade-in-up delay-200">
              Welcome to Hyper Ambulance — India's most trusted and largest ambulance service provider.
              We are committed to delivering fast, reliable, and professional emergency medical services
              across the nation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 border border-neutral-200 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-300 animate-pulse-glow">
                <h3 className="text-lg font-semibold text-black mb-2">Our Mission</h3>
                <p className="text-neutral-500 text-sm">To provide the fastest emergency response and save lives with cutting-edge medical transport.</p>
              </div>
              <div className="glass p-6 border border-neutral-200 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-400 animate-pulse-glow">
                <h3 className="text-lg font-semibold text-black mb-2">Our Vision</h3>
                <p className="text-neutral-500 text-sm">To be accessible to every citizen in India with a response time under 10 minutes.</p>
              </div>
            </div>
          </section>
        </div>
        <Footer/>
        </>
    );
 }
