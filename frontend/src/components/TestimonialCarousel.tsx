'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Entrepreneur',
    location: 'New York, USA',
    content: 'MyGrowVest has transformed my financial future. The daily returns are consistent and the platform is incredibly user-friendly.',
    rating: 5,
    profit: '$12,450',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Engineer',
    location: 'Singapore',
    content: 'I have been investing with MyGrowVest for 6 months now. The transparency and reliability are unmatched in the industry.',
    rating: 5,
    profit: '$8,900',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Business Owner',
    location: 'London, UK',
    content: 'The referral program helped me earn additional income while my investments grew. Highly recommend to anyone serious about wealth building.',
    rating: 5,
    profit: '$15,600',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Financial Advisor',
    location: 'Toronto, Canada',
    content: 'As a financial professional, I appreciate the clear terms and consistent performance. MyGrowVest delivers on its promises.',
    rating: 5,
    profit: '$22,100',
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Investors Say
          </h2>
          <p className="text-xl text-white/70">
            Join thousands of satisfied investors who trust MyGrowVest
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="glass-card text-center max-w-3xl mx-auto"
              >
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <StarIcon key={i} className="h-6 w-6 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-white/90 leading-relaxed mb-6">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-white">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-white/70">
                        {testimonials[currentIndex].role}
                      </div>
                      <div className="text-white/60 text-xs">
                        {testimonials[currentIndex].location}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-400">
                        {testimonials[currentIndex].profit}
                      </div>
                      <div className="text-white/70 text-xs">
                        Total Profit
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 glass-button p-3 rounded-full hover:scale-105"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 glass-button p-3 rounded-full hover:scale-105"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary-400 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}