import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Building,
  Monitor,
  ArrowLeft,
  CheckCircle,
  X,
  User,
  Mail,
  Phone,
  AlertCircle,
  Tag,
  Music, Trophy, Cpu, Palette, Briefcase, Gamepad2, Film
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../../features/event/eventSlice';
import { useNavigate, useParams } from 'react-router-dom';

export default function EventDetailParticipant() {
  const { id } = useParams();
  const { currentEvent: event, status, error} = useSelector((state)=>state.events);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Fetch event data from API
  useEffect(()=>{
    dispatch(fetchEventById(id))
  }, [dispatch]);

  console.log(event);
  

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    try {
      // Replace with your actual registration API endpoint
      const response = await fetch('/api/register-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          ...registrationData
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

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
    } catch (err) {
      console.error('Registration error:', err);
      alert('Failed to register. Please try again.');
    }
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

  // Loading state
  if (status == "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <X className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Event</h2>
            <p className="text-red-600 mb-4">{error || 'Failed to load event details'}</p>
          </div>
        </div>
      </div>
    );
  }

  const startDateTime = formatDateTime(event.start_time);
  const endDateTime = formatDateTime(event.end_time);

  // Get category name (if categories are stored, otherwise use category_id)
  const categoryName = event.category?.display_name;
  
  // Get organizer name (if organizer data is available)
  const organizerName = event.organizer?.name;

  const categoryIcons = {
    music: <Music className="w-4 h-4" />,
    sports: <Trophy className="w-4 h-4" />,
    technology: <Cpu className="w-4 h-4" />,
    art: <Palette className="w-4 h-4" />,
    business: <Briefcase className="w-4 h-4" />,
    gaming: <Gamepad2 className="w-4 h-4" />,
    film: <Film className="w-4 h-4" />,
  };

  const CategoryIcon = categoryIcons[event.category?.name] || <Tag className="w-4 h-4" />;

  const statusInfo = {
    scheduled: { icon: <Clock className="w-4 h-4" />, style: 'bg-blue-100 text-blue-700' },
    ongoing: { icon: <AlertCircle className="w-4 h-4" />, style: 'bg-green-100 text-green-700' },
    completed: { icon: <CheckCircle className="w-4 h-4" />, style: 'bg-gray-100 text-gray-700' },
    cancelled: { icon: <X className="w-4 h-4" />, style: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Events</span>
          </button>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-xl">
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
            src={event.image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop'}
            alt={event.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-6 left-6 flex gap-3">
            {event.type === 'OnStage' ? (
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
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white shadow-lg flex items-center gap-2">
              {CategoryIcon}
              {categoryName}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.name}</h1>
              <p className="text-gray-600 text-lg mb-4">
                Organized by <span className="font-semibold text-purple-600">{organizerName}</span>
              </p>
              
              {/* Event Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  statusInfo[event.status]?.style || statusInfo.scheduled.style
                }`}>
                  {statusInfo[event.status]?.icon || statusInfo.scheduled.icon}
                  {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Scheduled'}
                </span>
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

                {event.type === 'OnStage' && event.location ? (
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
                ) : event.type === 'Online' && event.link ? (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Online Event</p>
                      <a 
                        href={event.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 hover:underline break-all"
                      >
                        Join Event Link
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Register Button */}
              {event.status === 'scheduled' && (
                <>
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
                </>
              )}

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
                      required
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
                      required
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
                      required
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