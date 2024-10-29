import React from 'react'

const HowItWorks = () => {
    return (
        <section id='how-it-works' className="pb-20 bg-cb-bg">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-cb-primary">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="text-4xl mb-4 text-cb-primary">1</div>
                        <h3 className="text-xl font-semibold mb-2 text-cb-text">Enter Your Repo</h3>
                        <p className="text-cb-text-muted">Provide your GitHub repository URL to generate a contributors&apos; wall.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-4 text-cb-primary">2</div>
                        <h3 className="text-xl font-semibold mb-2 text-cb-text">Generate Wall</h3>
                        <p className="text-cb-text-muted">We&apos;ll create an interactive wall showcasing all contributors to your project.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-4 text-cb-primary">3</div>
                        <h3 className="text-xl font-semibold mb-2 text-cb-text">Embed & Celebrate</h3>
                        <p className="text-cb-text-muted">Embed the wall in your README or website to celebrate your contributors.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks