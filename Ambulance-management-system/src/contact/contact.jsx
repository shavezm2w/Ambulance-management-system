import './contact.css'
import { App } from '../navbar/navbar';
import {  useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { Footer } from "../footer/footer"
import { LiveBackground } from "../livebg/LiveBackground"

export function Contact (){
    const navigate= useNavigate();

    useEffect(() => {
        if (atob(localStorage.getItem("tokken")) !== "112") {
            navigate("/");
        }
    }, [navigate]);

    return(
        <>
        <App/>
        <div className="min-h-screen bg-white relative">
          <LiveBackground />
          <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-black tracking-tight mb-6 animate-fade-in-up">Contact Us</h1>
            <div className="w-16 h-1 bg-black mb-12 animate-fade-in-up delay-100"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 border-2 border-black rounded-xl animate-fade-in-up delay-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 animate-pulse-glow">
                <h3 className="text-lg font-semibold text-black mb-4">Emergency Line</h3>
                <p className="text-3xl font-bold text-black">6387523912</p>
                <p className="text-neutral-500 text-sm mt-2">Shavez — Available 24/7</p>
              </div>
              <div className="glass p-8 border border-neutral-200 rounded-xl animate-fade-in-up delay-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-semibold text-black mb-4">Head Office</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Hyper Ambulance Pvt. Ltd.<br/>
                  New Delhi, India<br/>
                  support@hyperambulance.com
                </p>
              </div>
            </div>
          </section>
        </div>
        <Footer/>
        </>
    );
}
