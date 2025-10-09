import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Search, Building, Monitor, MapPin, ExternalLink, Clock } from 'lucide-react';
import { fetchEvents, fetchCategories } from '../features/event/eventSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { events, categories, status, error } = useSelector((state) => state.events);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchEvents());
  }, [dispatch]);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Filter events by category and search (for main section)
  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category_id === categories.find(cat => cat.name === selectedCategory)?.id;
    return matchesSearch && matchesCategory;
  }) || [];

  // Get only scheduled events (separate section - not affected by category filter)
  const scheduledEvents = events?.filter(event => event.status === 'scheduled') || [];

    if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">
          {error || 'Failed to load events'}
        </div>
      </div>
    );
  }

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-gray-200">
      <div className="relative">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          {event.type === 'OnStage' ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-blue-700 flex items-center gap-1 shadow-lg">
              <Building className="w-3 h-3" />
              On Stage
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-purple-700 flex items-center gap-1 shadow-lg">
              <Monitor className="w-3 h-3" />
              Online
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 min-h-14">
          {event.name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
            <span>{formatTime(event.start_time)}</span>
          </div>

          {event.type === 'OnStage' ? (
            <div className="flex items-start text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          ) : (
            <div className="flex items-center text-purple-600 text-sm">
              <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate hover:underline">Join Online</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Events That Inspire You
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Find and join thousands of amazing events happening around you
            </p>

            <div className="bg-white rounded-xl shadow-2xl p-2">
              <div className="flex items-center px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category.name
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.display_name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events By Category (filtered) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategory === 'all' ? 'All Events' : categories.find(cat => cat.name === selectedCategory)?.display_name}
            </h2>
            <p className="text-gray-600">Browse events by category</p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Scheduled Events Section (Fixed - Not affected by filters) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Scheduled Events</h2>
            <p className="text-gray-600">Upcoming events you can register for</p>
          </div>

          {scheduledEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No scheduled events</h3>
              <p className="text-gray-500">Check back later for upcoming events</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {scheduledEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
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