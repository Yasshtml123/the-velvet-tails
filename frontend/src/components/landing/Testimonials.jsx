import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Jenkins",
            pet: "Luna (Golden Retriever)",
            initials: "SJ",
            text: "The velvet collar is absolutely stunning! Luna looks so elegant, and the quality is unmatched. I've already ordered the matching leash.",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Chen",
            pet: "Milo (Persian Cat)",
            initials: "MC",
            text: "Finally found a breakaway collar that actually looks luxurious. Milo seems very comfortable wearing it all day.",
            rating: 5
        },
        {
            id: 3,
            name: "Emma Watson",
            pet: "Bella (French Bulldog)",
            initials: "EW",
            text: "The night walk set gives me such peace of mind. Not only is it highly visible, but it also maintains that premium feel.",
            rating: 4
        }
    ];

    return (
        <div className="relative py-16 lg:py-24 overflow-hidden">
            {/* Background Image with Plum Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544568100-847a948585b9?w=1920&h=1080&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-plum/85 mix-blend-multiply"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                        Happy Tails
                    </h2>
                    <p className="text-cream/80 font-sans text-lg max-w-2xl mx-auto">
                        Don't just take our word for it. See what our furry friends and their humans have to say.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div 
                            key={testimonial.id}
                            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl relative"
                        >
                            <Quote className="absolute top-6 right-6 w-10 h-10 text-plum/10" />
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-gray-300'}`} 
                                    />
                                ))}
                            </div>
                            
                            <p className="text-charcoal italic font-serif mb-8 text-lg leading-relaxed">
                                "{testimonial.text}"
                            </p>
                            
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-plum text-white flex items-center justify-center font-bold font-sans">
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <h4 className="text-charcoal font-bold font-sans text-sm">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-charcoal/60 font-sans text-xs">
                                        {testimonial.pet}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
