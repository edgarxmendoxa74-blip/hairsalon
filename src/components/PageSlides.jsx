import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = {
  dashboard: [
    { title: "Welcome to Fix Salon", text: "Your hair specialist — a live overview of the day at a glance." },
    { title: "Today's Revenue", text: "Track sales, appointments and walk-ins as they happen." },
    { title: "Stay Stocked", text: "Low-stock alerts appear here so you never run out of essentials." }
  ],
  appointments: [
    { title: "Book in Seconds", text: "Tap New Appointment to schedule a client with their preferred stylist." },
    { title: "Today's Schedule", text: "See upcoming bookings and keep the chairs full." },
    { title: "Update Status", text: "Mark appointments confirmed, completed or cancelled." }
  ],
  clients: [
    { title: "Client Profiles", text: "Keep contact details, notes and visit history in one place." },
    { title: "VIP Loyalty", text: "Recognise your best clients with VIP status." },
    { title: "Service History", text: "Review past services to recommend the perfect next treatment." }
  ],
  services: [
    { title: "Services & Pricing", text: "Maintain your full menu with prices in Philippine Peso (₱)." },
    { title: "Keep It Current", text: "Edit durations and prices as your offerings change." },
    { title: "Popular Picks", text: "Highlight signature services your clients love." }
  ],
  staff: [
    { title: "Meet the Team", text: "Manage stylist profiles, roles and availability." },
    { title: "Commission Ready", text: "Staff details feed directly into service tracking." },
    { title: "Stay Organised", text: "Add or update team members anytime." }
  ],
  tracking: [
    { title: "Staff Service Tracking", text: "Log every service performed by each stylist." },
    { title: "Performance Insights", text: "See who is performing best across the week." },
    { title: "Accurate Records", text: "Tracked services keep payouts and reports accurate." }
  ],
  inventory: [
    { title: "Inventory Control", text: "Monitor products and supplies in real time." },
    { title: "Low-Stock Alerts", text: "Restock before you run out." },
    { title: "Track Usage", text: "Know what is used per service and what sells at the counter." }
  ],
  sales: [
    { title: "Touch POS", text: "Ring up services and products quickly on the tablet." },
    { title: "Flexible Payments", text: "Record cash and other payment methods with ease." },
    { title: "Transaction Register", text: "Review every sale made today." }
  ],
  analytics: [
    { title: "Analytics", text: "Trends and top performers across your whole salon." },
    { title: "Weekly Revenue", text: "See how the last 7 days compare." },
    { title: "Top Performers", text: "Find your best stylists, services and clients." }
  ],
  reports: [
    { title: "Reports & Analytics", text: "Understand how the salon is performing." },
    { title: "Revenue Trends", text: "Spot your best days and top services." },
    { title: "Team Results", text: "Compare stylist output at a glance." }
  ]
};

const PageSlides = ({ pageId }) => {
  const slides = SLIDES[pageId] || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => setIndex(0), [pageId]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, slides.length, pageId]);

  if (!slides.length) return null;
  const go = (d) => setIndex((i) => (i + d + slides.length) % slides.length);

  return (
    <section
      className="page-slides"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="page-slides-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div className="page-slide" key={i} aria-hidden={i !== index}>
            <div className="page-slide-title">{s.title}</div>
            <div className="page-slide-text">{s.text}</div>
          </div>
        ))}
      </div>
      <button className="page-slides-arrow left" onClick={() => go(-1)} aria-label="Previous slide">
        <ChevronLeft size={18} />
      </button>
      <button className="page-slides-arrow right" onClick={() => go(1)} aria-label="Next slide">
        <ChevronRight size={18} />
      </button>
      <div className="page-slides-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default PageSlides;
