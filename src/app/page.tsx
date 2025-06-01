import Button from '../components/ui/Button';
import HomeSearchFilter from '../components/HomeSearchFilter';
import FeaturedProviders from '../components/FeaturedProviders';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Imagr1 from '../../public/images/undergraduate.png'

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
        <div className="mx-4 md:mx-8 lg:mx-12">
              {/* Hero Section */}
            <section className="relative z-0">
                <div className="relative bg-cover bg-center rounded-none py-16" style={{ 
                    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.5) 100%), url("/images/university.jpg")'
                }}>                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Find your scholarship with ScholarMatch
                            </h1>
                            <p className="text-lg text-gray-600">
                                Discover thousands of opportunities worldwide!
                            </p>
                        </div>
                    </div>
                </div>                
                {/* Filter section - positioned to overlap the hero image */}                <div className="relative z-10 -mt-12 max-w-4xl mx-auto">
                    {/* Using the HomeSearchFilter component which handles the navigation */}
                    <HomeSearchFilter />
                </div></section>            
                {/* Featured Scholarships */}
            <section className="py-12 z-0">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold mb-8">Featured scholarships</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Link href="/scholarships/search?education_level=undergraduate" className="relative aspect-[3/3.5] group cursor-pointer">
                            <img src={Imagr1.src} alt="Undergraduate" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-sm font-medium group-hover:bg-blue-50 transition-colors">
                                Undergraduate
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                        </Link>
                        
                        {/* 2nd card split into two parts */}
                        <div className="grid grid-rows-2 gap-3">
                            <Link href="/scholarships/search?education_level=masters" className="relative aspect-[3/1.7] group cursor-pointer">
                                <img src={Imagr1.src} alt="Master's" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-medium group-hover:bg-blue-50 transition-colors">
                                    Master's
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                            </Link>
                            <Link href="/scholarships/search?field_of_study=research" className="relative aspect-[3/1.7] group cursor-pointer">
                                <img src={Imagr1.src} alt="Research" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-medium group-hover:bg-blue-50 transition-colors">
                                    Research
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                            </Link>
                        </div>
                        {/* 4th card split into two parts */}
                        <div className="grid grid-rows-2 gap-3">
                            <Link href="/scholarships/search?field_of_study=medicine" className="relative aspect-[3/1.7] group cursor-pointer">
                            <img src={Imagr1.src} alt="PhD" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-medium group-hover:bg-blue-50 transition-colors">
                                    Medical School
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                            </Link>
                            <Link href="/scholarships/search?field_of_study=engineering" className="relative aspect-[3/1.7] group cursor-pointer">
                            <img src={Imagr1.src} alt="PhD" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-medium group-hover:bg-blue-50 transition-colors">
                                    Engineering
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                            </Link>
                        </div>
                        
                        <Link href="/scholarships/search?education_level=phd" className="relative aspect-[3/3.5] group cursor-pointer">
                            <img src={Imagr1.src} alt="PhD" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 text-sm font-medium group-hover:bg-blue-50 transition-colors">
                                PhD
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                        </Link>
                        
                        
                    </div>
                </div>
            </section>{/* Top Scholarship Providers */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold mb-8">Top scholarship providers</h2>
                    {/* FeaturedProviders component with horizontal scroll for > 5 items */}
                    <FeaturedProviders />
                </div>
            </section>
            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto">
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
                <div className="container mx-auto">
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
             {/* CTA Section */}
            <section className="py-20 bg-primary-600">
                <div className="container mx-auto text-center">
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