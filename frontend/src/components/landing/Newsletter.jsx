export default function Newsletter() {
    return (
        <div className="bg-plum py-20 relative overflow-hidden">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-4">
                    Join the Velvet Pack
                </h2>
                <p className="text-white/80 font-sans text-lg mb-10 max-w-2xl mx-auto">
                    Subscribe for exclusive offers, new arrivals, and <span className="font-bold text-gold">10% off</span> your first order.
                </p>
                
                <form className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex-1 relative">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/60 font-sans focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="px-8 py-4 bg-gold hover:bg-[#b89d5a] text-plum font-sans font-bold rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] shadow-lg whitespace-nowrap"
                    >
                        Subscribe Now
                    </button>
                </form>
                
                <p className="text-white/50 font-sans text-xs mt-6">
                    By subscribing, you agree to our Terms of Service and Privacy Policy. You can unsubscribe at any time.
                </p>
            </div>
        </div>
    );
}
