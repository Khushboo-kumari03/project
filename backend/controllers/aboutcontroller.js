const getAboutData = async (req, res) => {
    try {
        // In a real application, this data might come from a database
        const aboutData = {
            companyInfo: {
                name: "V-!magine",
                tagline: "Your Gateway to the Future of Technology",
                description: "V-!magine is your one-stop destination for next-gen electronics and tech essentials. We're not just a store; we're your partner in embracing the digital future.",
                heroImage: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                officeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            },
            missionVision: {
                mission: {
                    title: "Our Mission",
                    description: "To make cutting-edge technology accessible, affordable, and exciting for everyone. We believe that innovation should be within everyone's reach.",
                    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                vision: {
                    title: "Our Vision",
                    description: "To lead the digital lifestyle revolution by bridging people with intelligent gadgets that enhance their daily lives.",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                }
            },
            productRange: [
                {
                    title: "Smart Home Devices",
                    description: "Transform your living space with intelligent automation",
                    icon: "home",
                    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Mobile & Computer Accessories",
                    description: "Enhance your digital experience with premium accessories",
                    icon: "mobile-alt",
                    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Wearables & Health Tech",
                    description: "Stay connected and monitor your wellness",
                    icon: "watch",
                    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "DIY Electronic Kits",
                    description: "Build and learn with hands-on tech projects",
                    icon: "tools",
                    image: "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                }
            ],
            uniqueFeatures: [
                {
                    title: "Futuristic Selection",
                    description: "Always ahead with the latest tech trends",
                    icon: "rocket",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Fast Delivery",
                    description: "Quick and reliable shipping nationwide",
                    icon: "truck",
                    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Customer First",
                    description: "24/7 support and easy returns",
                    icon: "users",
                    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Tech Updates",
                    description: "Regular insights and tech news",
                    icon: "blog",
                    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                }
            ],
            timeline: [
                {
                    year: "2024",
                    event: "V-!magine was born with a vision to revolutionize tech retail",
                    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    year: "2025",
                    event: "Reached 10,000+ happy customers and expanded product range",
                    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    year: "2026",
                    event: "Launched our innovative tech blog and community platform",
                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                }
            ],
            testimonials: [
                {
                    name: "John Doe",
                    image: "https://randomuser.me/api/portraits/men/1.jpg",
                    quote: "V-!magine has transformed how I shop for tech. Their selection and service are unmatched!",
                    background: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    name: "Jane Smith",
                    image: "https://randomuser.me/api/portraits/women/1.jpg",
                    quote: "The quality of products and customer support is exceptional. Truly a tech lover's paradise!",
                    background: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    name: "Mike Johnson",
                    image: "https://randomuser.me/api/portraits/men/2.jpg",
                    quote: "Fast delivery and great prices. V-!magine is my go-to for all tech needs!",
                    background: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                }
            ],
            gallery: [
                {
                    title: "Our Office",
                    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Product Showcase",
                    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Team Collaboration",
                    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                },
                {
                    title: "Customer Support",
                    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                }
            ]
        };

        res.status(200).json({
            success: true,
            data: aboutData
        });
    } catch (error) {
        console.error('Error fetching about data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching about page data'
        });
    }
};

module.exports = {
    getAboutData
}; 