import React from "react";
import './services.css';
import {App} from '../navbar/navbar'
import { Footer } from "../footer/footer"
import { LiveBackground } from "../livebg/LiveBackground"

export function Services(){
    return(
        <>
        <App/>
        <div className="min-h-screen bg-white relative">
          <LiveBackground />
          <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-black tracking-tight mb-6 animate-fade-in-up">Our Services</h1>
            <div className="w-16 h-1 bg-black mb-12 animate-fade-in-up delay-100"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Emergency Response", desc: "24/7 rapid emergency ambulance dispatch with average response time under 15 minutes." },
                { title: "ICU on Wheels", desc: "Fully equipped mobile ICU units with ventilators, monitors, and trained paramedics." },
                { title: "Patient Transfer", desc: "Safe and comfortable inter-hospital patient transfers with medical supervision." },
                { title: "Air Ambulance", desc: "Helicopter and fixed-wing air ambulance services for critical and remote cases." },
                { title: "Event Medical", desc: "Standby ambulance and medical teams for corporate events, sports, and gatherings." },
                { title: "Advance Booking", desc: "Schedule ambulance services in advance for planned medical appointments and procedures." },
              ].map((service, i) => (
                <div
                  key={i}
                  className={`glass group p-6 border border-neutral-200 rounded-xl hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-${(i + 1) * 100}`}
                >
                  <h3 className="text-lg font-semibold text-black mb-3">{service.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Footer/>
        </>
    );
}
