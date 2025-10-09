import { useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Users, Share2, Heart, Building, Monitor, ArrowLeft, CheckCircle, X, User, Mail, Phone } from 'lucide-react';

export default function EventDetailPage() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Sample event data
  const event = {
    id: 1,
    name: 'Summer Music Festival 2025',
    description: 'Join us for an unforgettable night of live music featuring top artists from around the world. Experience incredible performances, amazing food, and an atmosphere like no other. This festival brings together music lovers from all walks of life for three days of non-stop entertainment.\n\nFeaturing:\n- 20+ International Artists\n- 5 Different Stages\n- Food & Beverage Options\n- VIP Lounges\n- After Parties',
    start_time: '2025-10-15T18:00:00',
    end_time: '2025-10-15T23:00:00',
    status: 'scheduled',
    type: 'onstage',
    location: 'Central Park, New York, NY 10024',
    link: null,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop',
    category: 'Music',
    attendees: 1200,
    capacity: 1500,
    organizer: 'EventPro Inc.',
    price: '$45'
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return {
      fullDate: `${dayName}, ${month} ${day}, ${year}`,
      time: `${hours}:${minutes} ${ampm}`
    };
  };

  const startDateTime = formatDateTime(event.start_time);
  const endDateTime = formatDateTime(event.end_time);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    
    setIsRegistered(true);
    setShowSuccess(true);
    setIsRegistrationOpen(false);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    setRegistrationData({
      fullName: '',
      email: '',
      phone: '',
      notes: ''
    });
  };

  const closeModal = () => {
    setIsRegistrationOpen(false);
    setRegistrationData({
      fullName: '',
      email: '',
      phone: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Events</span>
          </button>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-xl animate-slide-in">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-green-800 font-semibold">Registration Successful!</p>
            <p className="text-green-600 text-sm">You're registered for this event</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-6 left-6 flex gap-3">
            {event.type === 'onstage' ? (
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-90 text-blue-700 flex items-center gap-2 shadow-lg">
                <Building className="w-4 h-4" />
                On Stage
              </span>
            ) : (
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-90 text-purple-700 flex items-center gap-2 shadow-lg">
                <Monitor className="w-4 h-4" />
                Online Event
              </span>
            )}
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white shadow-lg">
              {event.category}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.name}</h1>
              <p className="text-gray-600 text-lg mb-4">Organized by <span className="font-semibold text-purple-600">{event.organizer}</span></p>
              
              {/* Event Stats */}
              <div className="flex flex-wrap gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">
                    <span className="font-bold text-gray-900">{event.attendees}</span> / {event.capacity} attendees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600">{event.price}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {Math.round((event.attendees / event.capacity) * 100)}% filled
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Event Details</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">{startDateTime.fullDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-800">
                      {startDateTime.time} - {endDateTime.time}
                    </p>
                  </div>
                </div>

                {event.type === 'onstage' ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800">{event.location}</p>
                      <a href="#" className="text-purple-600 text-sm hover:underline mt-1 inline-block">
                        View on map
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Online Event</p>
                      <a href={event.link} className="font-semibold text-purple-600 hover:underline">
                        Join Event Link
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Register Button */}
              {!isRegistered ? (
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Register Now
                </button>
              ) : (
                <div className="w-full py-4 bg-green-50 border-2 border-green-500 text-green-700 rounded-lg font-bold text-lg text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  You're Registered!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegistrationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Register for Event</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">{event.name}</h3>
                <p className="text-sm text-gray-500">{startDateTime.fullDate} at {startDateTime.time}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={registrationData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={registrationData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={registrationData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={registrationData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition resize-none"
                    placeholder="Any special requirements or questions..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRegistration}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl"
                >
                  Confirm Registration
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}