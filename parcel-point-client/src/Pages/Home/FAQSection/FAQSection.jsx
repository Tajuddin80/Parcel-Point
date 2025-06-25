import React from "react";
import { FaArrowRight } from "react-icons/fa";

const faqs = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here’s how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, our posture corrector is designed to comfortably fit and support a wide range of ages and body types.",
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Absolutely. With consistent use, most users experience improved posture and reduced back discomfort over time.",
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Yes, our advanced models include vibration alerts to gently remind you when you're slouching.",
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can sign up for restock notifications via email on our product page. We'll alert you as soon as it’s available!",
  },
];

const FAQSection = () => {
  return (
    <section data-aos="fade-right" className="py-16 mb-10 rounded-4xl px-4 md:px-16 bg-white text-center ">
      {/* Heading */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#03373D]">
          Frequently Asked Question (FAQ)
        </h2>
        <p className="mt-4 text-gray-600 mx-auto text-sm sm:text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className=" mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`collapse collapse-arrow rounded-lg ${
              idx === 0
                ? "bg-[#DFF1F3] text-[#03373D] border border-[#B6D9D4]"
                : "bg-white text-[#03373D] shadow"
            }`}
          >
            <input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
            <div className="collapse-title text-left font-semibold text-base md:text-lg">
              {faq.question}
            </div>
            <div className="collapse-content text-left text-sm text-gray-700">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-10 flex justify-center">
        <button className="btn bg-[#D8F45D] text-black rounded-full px-6 py-3 flex items-center gap-2 hover:scale-105 transition">
          See More FAQ’s <FaArrowRight className="text-xl" />
        </button>
      </div>
    </section>
  );
};

export default FAQSection;
