import { Link } from 'react-router-dom';

export default function AboutPreview() {
    return (
        <div className="py-16 lg:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left: Image with offset elements */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* Decorative Background Elements */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/20 rounded-2xl -z-10"></div>
                        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blush rounded-full -z-10"></div>
                        
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&h=1000&fit=crop" 
                                alt="Happy dog with owner" 
                                className="w-full h-[500px] object-cover"
                            />
                            {/* Inner gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"></div>
                        </div>
                    </div>
                    
                    {/* Right: Story Text & Stats */}
                    <div className="w-full lg:w-1/2">
                        <div className="text-gold font-sans font-semibold tracking-[0.2em] uppercase text-sm mb-4">
                            Our Story
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-charcoal mb-6 leading-tight">
                            Elevating the bond between you and your pet.
                        </h2>
                        <p className="text-charcoal/70 font-sans text-lg mb-8 leading-relaxed">
                            At The Velvet Tails, we believe that pet accessories should be as stylish and high-quality as the items we buy for ourselves. Born out of a frustration with uninspired pet gear, we set out to create pieces where exceptional design meets everyday practicality.
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mb-10 pb-10 border-b border-blush/50">
                            <div>
                                <div className="text-3xl font-bold font-serif text-plum mb-1">50+</div>
                                <div className="text-xs font-sans font-semibold text-charcoal/60 uppercase tracking-wider">Products</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold font-serif text-plum mb-1">10K+</div>
                                <div className="text-xs font-sans font-semibold text-charcoal/60 uppercase tracking-wider">Happy Pets</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold font-serif text-plum mb-1">4.8</div>
                                <div className="text-xs font-sans font-semibold text-charcoal/60 uppercase tracking-wider">Avg Rating</div>
                            </div>
                        </div>
                        
                        <Link 
                            to="/products" 
                            className="inline-flex items-center justify-center px-8 py-3 bg-charcoal text-white font-sans font-medium rounded-full hover:bg-plum transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-plum/30"
                        >
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
