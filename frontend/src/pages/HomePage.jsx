import { useState } from 'react';
import { Calendar, Search, MapPin, Clock, Users, Heart, Star, TrendingUp, Music, Briefcase, Palette, Dumbbell, Menu, X } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'art', name: 'Art & Culture', icon: Palette },
    { id: 'sports', name: 'Sports', icon: Dumbbell },
  ];

  const featuredEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      date: 'Oct 15, 2025',
      time: '6:00 PM',
      location: 'Central Park, NY',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
      category: 'Music',
      attendees: 1200,
      price: 'From $45',
      featured: true
    },
    {
      id: 2,
      title: 'Tech Innovation Summit',
      date: 'Oct 20, 2025',
      time: '9:00 AM',
      location: 'Convention Center, SF',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      category: 'Business',
      attendees: 850,
      price: '$150',
      featured: true
    },
    {
      id: 3,
      title: 'Art Gallery Opening',
      date: 'Oct 18, 2025',
      time: '7:00 PM',
      location: 'Modern Art Museum',
      image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=500&fit=crop',
      category: 'Art',
      attendees: 320,
      price: 'Free',
      featured: false
    },
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: 'Marathon Championship',
      date: 'Oct 25, 2025',
      time: '7:00 AM',
      location: 'City Stadium',
      image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&h=400&fit=crop',
      category: 'Sports',
      attendees: 500,
      price: '$30'
    },
    {
      id: 5,
      title: 'Food & Wine Festival',
      date: 'Nov 2, 2025',
      time: '5:00 PM',
      location: 'Harbor District',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
      category: 'Music',
      attendees: 680,
      price: '$55'
    },
    {
      id: 6,
      title: 'Startup Pitch Night',
      date: 'Nov 5, 2025',
      time: '6:30 PM',
      location: 'Innovation Hub',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
      category: 'Business',
      attendees: 200,
      price: 'Free'
    },
    {
      id: 7,
      title: 'Jazz Night Live',
      date: 'Nov 8, 2025',
      time: '8:00 PM',
      location: 'Blue Note Club',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop',
      category: 'Music',
      attendees: 150,
      price: '$40'
    },
    {
      id: 8,
      title: 'Photography Workshop',
      date: 'Nov 10, 2025',
      time: '10:00 AM',
      location: 'Creative Studio',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop',
      category: 'Art',
      attendees: 45,
      price: '$75'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Events That Inspire You
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Find and join thousands of amazing events happening around you
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <div className="flex items-center px-4 py-2 border-t md:border-t-0 md:border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Events</h2>
              <p className="text-gray-600">Don't miss these amazing upcoming events</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  {event.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      Featured
                    </div>
                  )}
                  <button className="absolute top-4 left-4 bg-white rounded-full p-2 hover:bg-gray-100 transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-600 font-semibold mb-2">{event.category}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} attending
                    </div>
                    <div className="text-purple-600 font-bold">{event.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
            <p className="text-gray-600">More events you might love</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="text-xs text-purple-600 font-semibold mb-2">{event.category}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Calendar className="w-3 h-3 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <MapPin className="w-3 h-3 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-purple-600 font-bold text-sm">{event.price}</div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Eventify</span>
              </div>
              <p className="text-gray-400 text-sm">
                Discover and join amazing events happening around you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Careers</div>
                <div className="hover:text-white cursor-pointer">Press</div>
                <div className="hover:text-white cursor-pointer">Blog</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="hover:text-white cursor-pointer">Help Center</div>
                <div className="hover:text-white cursor-pointer">Contact Us</div>
                <div className="hover:text-white cursor-pointer">Privacy Policy</div>
                <div className="hover:text-white cursor-pointer">Terms of Service</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="hover:text-white cursor-pointer">Facebook</div>
                <div className="hover:text-white cursor-pointer">Twitter</div>
                <div className="hover:text-white cursor-pointer">Instagram</div>
                <div className="hover:text-white cursor-pointer">LinkedIn</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2025 Eventify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}