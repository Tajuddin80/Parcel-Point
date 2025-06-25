import { useState } from "react";

const tabs = [
  { label: "Story", key: "story" },
  { label: "Mission", key: "mission" },
  { label: "Success", key: "success" },
  { label: "Team & Others", key: "team" },
];

const content = {
  story: `
    We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. 
    Over the years, our commitment to real-time tracking, efficient logistics, and customer-first 
    service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive 
    business delivery, we ensure it reaches its destination — on time, every time.
  `,
  mission: `
    Our mission is to redefine logistics through innovation and technology. We aim to create a seamless 
    delivery experience where customers feel empowered and informed. From live tracking to contactless 
    handovers, our goal is to keep improving the way the world ships.
  `,
  success: `
    We've successfully delivered millions of parcels nationwide with 99% on-time performance. 
    Our user-first approach and reliability have earned us recognition across logistics and e-commerce 
    industries. Thanks to our growing team and technology, we continue to scale new heights.
  `,
  team: `
    Our team is made up of logistics veterans, software engineers, customer support experts, 
    and passionate delivery agents. Together, we ensure each package is handled with care. 
    Beyond logistics, we support SMEs, partner with NGOs, and run sustainable delivery programs.
  `,
};

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <section data-aos="fade-left" className=" px-4 py-12 mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-[#03373D] mb-2">
        About Us
      </h2>
      <p className="text-gray-600 max-w-3xl mb-6">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
      </p>

      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 text-base font-medium transition-colors duration-200 ${
                activeTab === tab.key
                  ? "text-[#6A861A] border-b-2 border-[#6A861A]"
                  : "text-gray-500 hover:text-[#6A861A]"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
        {content[activeTab]
          .trim()
          .split("\n")
          .map((para, idx) => (
            <p key={idx}>{para.trim()}</p>
          ))}
      </div>
    </section>
  );
}
