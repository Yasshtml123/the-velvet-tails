import React, { useState } from 'react';
import { Mail, Phone, Camera, ArrowRight, ChevronDown, Clock } from 'lucide-react';

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the US. International orders usually arrive within 7-14 business days depending on customs."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn and unwashed items in their original packaging. Custom engraved items are final sale."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! Shipping costs and delivery times vary by country and will be calculated at checkout."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also view your order status in your Velvet Tails account."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally handle form submission here
    alert("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-0 pb-20">
      {/* 1. Hero Header */}
      <section className="relative bg-gradient-to-br from-plum to-plum/80 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 animate-fade-in-slide-up">
            We'd Love to Hear From You
          </h1>
          <p className="text-lg md:text-xl font-sans max-w-2xl mx-auto text-cream/90 animate-fade-in-slide-up" style={{ animationDelay: '100ms' }}>
            Questions, feedback, or just want to share a photo of your furry friend? We're here and happy to help.
          </p>
        </div>
      </section>

      {/* 2. Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-10 sm:-mt-16 z-10 mb-16">
        <div className="grid sm:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-plum/5 border border-blush/30 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-plum shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-plum mb-2">Email Us</h3>
            <p className="font-sans text-charcoal/70">support@thevelvettails.com</p>
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-plum/5 border border-blush/30 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-plum shadow-sm">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-plum mb-2">Call Us</h3>
            <p className="font-sans text-charcoal/70">+91 98730 62819</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-plum/5 border border-blush/30 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-plum shadow-sm">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-plum mb-2">Instagram</h3>
            <p className="font-sans text-charcoal/70">@the_velvet_tails</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* 3. Interactive "Send a Message" Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-blush/40">
            <h2 className="text-3xl font-serif font-bold text-plum mb-2">Send a Message</h2>
            <p className="text-charcoal/60 font-sans mb-8">Fill out the form below and we'll get back to you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-charcoal/80 font-sans">Your Name</label>
                  <input type="text" id="name" required className="w-full px-4 py-3 bg-gray-50 border border-blush/50 rounded-xl focus:ring-2 focus:ring-plum/20 focus:border-plum outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-charcoal/80 font-sans">Email Address</label>
                  <input type="email" id="email" required className="w-full px-4 py-3 bg-gray-50 border border-blush/50 rounded-xl focus:ring-2 focus:ring-plum/20 focus:border-plum outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-charcoal/80 font-sans">Subject</label>
                <input type="text" id="subject" required className="w-full px-4 py-3 bg-gray-50 border border-blush/50 rounded-xl focus:ring-2 focus:ring-plum/20 focus:border-plum outline-none transition-all" placeholder="How can we help?" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-charcoal/80 font-sans">Message</label>
                <textarea id="message" required rows="5" className="w-full px-4 py-3 bg-gray-50 border border-blush/50 rounded-xl focus:ring-2 focus:ring-plum/20 focus:border-plum outline-none transition-all resize-none" placeholder="Type your message here..."></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 bg-plum text-white rounded-full font-sans font-bold hover:bg-plum/90 transition-all transform hover:scale-105 shadow-lg shadow-plum/20">
                  Send Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <p className="text-sm text-charcoal/50 font-sans flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  We typically reply within 24 hours
                </p>
              </div>
            </form>
          </div>

          {/* 4. FAQs Accordion Section */}
          <div className="lg:py-4">
            <h2 className="text-3xl font-serif font-bold text-plum mb-2">FAQs</h2>
            <p className="text-charcoal/60 font-sans mb-8">Quick answers to common questions.</p>
            
            <div className="space-y-4 mb-10">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-blush/40 rounded-2xl overflow-hidden transition-all duration-300 hover:border-plum/30 shadow-sm hover:shadow-md">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-sans font-semibold text-charcoal pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-plum transition-transform duration-300 flex-shrink-0 ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{ maxHeight: activeFaq === index ? '200px' : '0' }}
                  >
                    <div className="px-6 pb-5 text-charcoal/70 font-sans leading-relaxed border-t border-blush/20 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Response Guarantee badge */}
            <div className="bg-cream rounded-2xl p-6 border border-blush/50 flex items-start shadow-sm">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mr-4">
                <Clock className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-plum text-lg mb-1">Quick Response Guarantee</h4>
                <p className="font-sans text-sm text-charcoal/70">
                  Our dedicated support team works around the clock to ensure you and your pet get the help you need, exactly when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
