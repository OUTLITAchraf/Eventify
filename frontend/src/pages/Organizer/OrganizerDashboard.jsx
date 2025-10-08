import { useState } from 'react';
import { Calendar, Plus, Users, Eye, Edit, Trash2, TrendingUp, DollarSign, MapPin, ExternalLink, Search, MoreVertical, CheckCircle, Clock, AlertCircle, Building, Monitor, User, User2, User2Icon } from 'lucide-react';

export default function OrganizerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMenu, setShowMenu] = useState(null);

  const stats = [
    { label: 'Total Events', value: '24', icon: Calendar, color: 'purple', change: '+12%' },
    { label: 'Total Attendees', value: '3,847', icon: Users, color: 'blue', change: '+23%' },
    { label: 'Active Events', value: '8', icon: TrendingUp, color: 'green', change: '+5%' },
    { label: 'Total Revenue', value: '$45,320', icon: DollarSign, color: 'yellow', change: '+18%' }
  ];

  const events = [
    {
      id: 1,
      name: 'Summer Music Festival 2025',
      description: 'Join us for an unforgettable night of live music featuring top artists from around the world.',
      start_time: '2025-10-15T18:00:00',
      end_time: '2025-10-15T23:00:00',
      status: 'scheduled',
      type: 'onstage',
      location: 'Central Park, NY',
      link: null,
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Tech Innovation Summit',
      description: 'Connect with industry leaders and explore the latest technological innovations.',
      start_time: '2025-10-20T09:00:00',
      end_time: '2025-10-20T17:00:00',
      status: 'scheduled',
      type: 'onplatform',
      location: null,
      link: 'https://zoom.us/j/123456789',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Art Gallery Opening',
      description: 'Experience contemporary art from emerging artists in an exclusive gallery opening.',
      start_time: '2025-10-18T19:00:00',
      end_time: '2025-10-18T22:00:00',
      status: 'ongoing',
      type: 'onstage',
      location: 'Modern Art Museum, Downtown',
      link: null,
      image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'Marathon Championship',
      description: 'Annual city marathon championship with prizes for top finishers.',
      start_time: '2025-10-25T07:00:00',
      end_time: '2025-10-25T12:00:00',
      status: 'scheduled',
      type: 'onstage',
      location: 'City Stadium',
      link: null,
      image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      name: 'Online Coding Bootcamp',
      description: 'Learn full-stack development in this intensive 6-week online bootcamp.',
      start_time: '2025-11-01T10:00:00',
      end_time: '2025-12-15T18:00:00',
      status: 'ongoing',
      type: 'onplatform',
      location: null,
      link: 'https://meet.google.com/abc-defg-hij',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      name: 'Startup Pitch Night',
      description: 'Watch innovative startups pitch their ideas to leading investors.',
      start_time: '2025-11-05T18:30:00',
      end_time: '2025-11-05T21:30:00',
      status: 'completed',
      type: 'onstage',
      location: 'Innovation Hub',
      link: null,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    },
    {
      id: 7,
      name: 'Jazz Night Live',
      description: 'Enjoy an evening of smooth jazz with talented musicians.',
      start_time: '2025-11-08T20:00:00',
      end_time: '2025-11-08T23:00:00',
      status: 'scheduled',
      type: 'onstage',
      location: 'Blue Note Club',
      link: null,
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop',
    },
    {
      id: 8,
      name: 'Photography Workshop',
      description: 'Learn professional photography techniques from experts.',
      start_time: '2025-11-10T10:00:00',
      end_time: '2025-11-10T16:00:00',
      status: 'scheduled',
      type: 'onplatform',
      location: null,
      link: 'https://meet.google.com/xyz-abcd-efg',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop',
    },
  ];

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return {
      date: `${month} ${day}, ${year}`,
      time: `${hours}:${minutes} ${ampm}`
    };
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      ongoing: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    const icons = {
      scheduled: Clock,
      ongoing: AlertCircle,
      completed: CheckCircle
    };
    const Icon = icons[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <User className='w-9 h-9 text-purple-600'/>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Organizer Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your events</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-105">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              purple: 'bg-purple-100 text-purple-600',
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              yellow: 'bg-yellow-100 text-yellow-600'
            };
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">My Events</h2>
              <p className="text-gray-500 text-sm">Manage and track your events</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => {
                const datetime = formatDateTime(event.start_time);
                
                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                  >
                    {/* Event Image */}
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(showMenu === event.id ? null : event.id);
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {showMenu === event.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10">
                            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm">
                              <Edit className="w-4 h-4" />
                              Edit Event
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 border-t text-sm">
                              <Trash2 className="w-4 h-4" />
                              Delete Event
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        {event.type === 'onstage' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-blue-700 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            On Stage
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-purple-700 flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            Online
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 min-h-14">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                          <span>{datetime.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                          <span>{datetime.time}</span>
                        </div>
                        {event.type === 'onstage' ? (
                          <div className="flex items-start text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600 text-sm">
                            <ExternalLink className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                            <span className="truncate text-purple-600 hover:underline">
                              Join Online
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}