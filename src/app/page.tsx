import Button from '../components/ui/Button';
import HomeSearchFilter from '../components/HomeSearchFilter';
import { 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
    const features = [
        {
            icon: MagnifyingGlassIcon,
            title: 'Smart Search',
            description: 'Find scholarships that match your profile with our AI-powered search engine.'
        },
        {
            icon: UserGroupIcon,
            title: 'Personalized Matches',
            description: 'Get recommendations tailored to your academic background and interests.'
        },
        {
            icon: ChartBarIcon,
            title: 'Application Tracking',
            description: 'Keep track of all your scholarship applications in one place.'
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Available Scholarships' },
        { number: '50,000+', label: 'Students Helped' },
        { number: '$100M+', label: 'Scholarships Awarded' },
        { number: '500+', label: 'Partner Universities' }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Engineering Student',
            content: 'ScholarMatch helped me find the perfect scholarship for my computer science degree. The process was so simple!',
            rating: 5
        },
        {
            name: 'Michael Chen',
            role: 'Medical Student',
            content: 'I never thought I could afford medical school until I found three scholarships through this platform.',
            rating: 5
        },
        {
            name: 'Emily Rodriguez',
            role: 'Business Student',
            content: 'The AI recommendations were spot-on. I got matched with scholarships I never would have found on my own.',
            rating: 5
        }
    ];    return (
        <div>
              {/* Hero Section */}
            <section className="relative z-0 mx-4 md:mx-8 lg:mx-12">
                <div className="relative bg-cover bg-center rounded-none py-16" style={{ 
                    backgroundImage: 'url("/images/university.jpg")'
                }}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Find your scholarship with ScholarMatch
                            </h1>
                            <p className="text-lg text-gray-600">
                                Discover thousands of opportunities worldwide!
                            </p>
                        </div>
                    </div>
                </div>                {/* Filter section - positioned to overlap the hero image */}
                <div className="relative z-10 -mt-12 max-w-4xl mx-auto px-4">
                    {/* Using the HomeSearchFilter component which handles the navigation */}
                    <HomeSearchFilter />
                </div>
            </section>

            {/* Featured Scholarships */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold mb-8">Featured scholarships</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="relative aspect-[4/3]">
                            <img src="/images/scholarships/undergraduate.jpg" alt="Undergraduate" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-sm font-medium rounded">
                                Undergraduate
                            </div>
                        </div>
                        <div className="relative aspect-[4/3]">
                            <img src="/images/scholarships/masters.jpg" alt="Master's" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-sm font-medium rounded">
                                Master's
                            </div>
                        </div>
                        <div className="relative aspect-[4/3]">
                            <img src="/images/scholarships/phd.jpg" alt="PhD" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-sm font-medium rounded">
                                PhD
                            </div>
                        </div>
                        <div className="relative aspect-[4/3]">
                            <img src="/images/scholarships/medical.jpg" alt="Medical" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-sm font-medium rounded">
                                Medical School
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Scholarship Providers */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold mb-8">Top scholarship providers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <img src="/images/providers/scholarship-hub.jpg" alt="Scholarship Hub" className="w-full h-32 object-cover rounded" />
                            </div>
                            <h3 className="text-sm font-medium">Scholarship Hub</h3>
                            <p className="text-xs text-gray-500">Global</p>
                            <button className="mt-4 text-sm text-blue-600 hover:underline">Apply now →</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <img src="/images/providers/future-leaders.jpg" alt="Future Leaders Fund" className="w-full h-32 object-cover rounded" />
                            </div>
                            <h3 className="text-sm font-medium">Future Leaders Fund</h3>
                            <p className="text-xs text-gray-500">International</p>
                            <button className="mt-4 text-sm text-blue-600 hover:underline">Apply now →</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <img src="/images/providers/dream-achievers.jpg" alt="Dream Achievers Program" className="w-full h-32 object-cover rounded" />
                            </div>
                            <h3 className="text-sm font-medium">Dream Achievers Program</h3>
                            <p className="text-xs text-gray-500">National</p>
                            <button className="mt-4 text-sm text-blue-600 hover:underline">Apply now →</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <img src="/images/providers/global-scholars.jpg" alt="Global Scholars Network" className="w-full h-32 object-cover rounded" />
                            </div>
                            <h3 className="text-sm font-medium">Global Scholars Network</h3>
                            <p className="text-xs text-gray-500">Regional</p>
                            <button className="mt-4 text-sm text-blue-600 hover:underline">Apply now →</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <img src="/images/providers/opportunity-seekers.jpg" alt="Opportunity Seekers Club" className="w-full h-32 object-cover rounded" />
                            </div>
                            <h3 className="text-sm font-medium">Opportunity Seekers Club</h3>
                            <p className="text-xs text-gray-500">Local</p>
                            <button className="mt-4 text-sm text-blue-600 hover:underline">Apply now →</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose ScholarMatch?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform combines cutting-edge technology with comprehensive scholarship databases to give you the best chance of success.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <feature.icon className="h-12 w-12 text-primary-600 mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            What Students Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hear from students who found their dream scholarships
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-8">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">
                                    "{testimonial.content}"
                                </p>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600">
                <div className="container text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Ready to Find Your Scholarship?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who have already found their perfect scholarship match. It's free and takes less than 5 minutes to get started.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="xl" 
                            variant="secondary"
                            className="bg-white text-primary-600 hover:bg-gray-50"
                        >
                            Create Free Account
                        </Button>
                        <Button 
                            size="xl" 
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-primary-600"
                        >
                            Browse Scholarships
                        </Button>
                    </div>                </div>
            </section>
        </div>
    );
};

export default HomePage;