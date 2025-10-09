import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  User,
  Users,
  Trash2,
  CheckCircle,
  AlertCircle,
  Building,
  ArrowLeft,
  Monitor,
  Tag,
} from "lucide-react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../../features/event/eventSlice";

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    currentEvent: event,
    status,
    error,
  } = useSelector((state) => state.events);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error || "Failed to load event details"}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Event not found</div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    // Return early if status is undefined
    if (!status) return null;

    const styles = {
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      ongoing: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    const icons = {
      scheduled: Clock,
      ongoing: AlertCircle,
      completed: CheckCircle,
    };

    // Default to 'scheduled' if status is not in the list
    const validStatus = styles[status] ? status : "scheduled";
    const Icon = icons[validStatus];

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${styles[validStatus]}`}
      >
        <Icon className="w-3 h-3" />
        {validStatus.charAt(0).toUpperCase() + validStatus.slice(1)}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Use the correct enum values from your schema (Assuming 'onplatform ' is correct from previous context)
  const isOnline = event.type === "Online" || event.type === "OnStage ";

  // Action button text change
  const actionText = isOnline ? "Join Event" : "View Location";
  const ActionIcon = isOnline ? ExternalLink : MapPin;
  const LocationIcon = isOnline ? Monitor : Building;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- HERO SECTION: Image and Title --- */}
      {/* 💡 Increased image height from h-80 to h-96 */}
      <div className="relative w-full h-96 bg-gray-900 shadow-xl">
        {/* Event Image */}
        <img
          src={
            event.image ||
            "https://placehold.co/1200x500/1f2937/9ca3af?text=No+Image+Available&font=roboto"
          }
          alt={event.name}
          className="w-full h-full object-cover opacity-60"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>

        {/* Title and Details */}
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-white">
          <div className="flex justify-between items-end">
            <div>
              {/* Event Name */}
              {/* 💡 Added space below title (mb-3 instead of mb-2) */}
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                {event.name}
              </h1>

              {/* Date Range */}
              {/* 💡 Added space below date range (mb-3 instead of mb-1) */}
              <p className="text-lg text-gray-300 flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5" />
                {formatDateTime(event.start_time)}
                <span className="text-gray-500 mx-1">to</span>
                {formatDateTime(event.end_time)}
              </p>

              {/* 💡 Status Badge: uses default top margin from parent div for spacing */}
              <div>{getStatusBadge(event.status)}</div>
            </div>

            {/* Action Buttons (Reintroduced) */}
            <div className="flex gap-4">
              <Link
                to="/dashboard-organizer"
                className="flex items-center gap-2 px-5 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMN 1 & 2: DESCRIPTION */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
              <br />
              <br />
              This is a placeholder for the rest of the event's detailed
              narrative.
            </p>
          </div>
        </div>

        {/* COLUMN 3: KEY DETAILS */}
        <div className="lg:col-span-1 space-y-8">
          {/* Location/Link Card */}
          <div className="bg-purple-50 border-l-4 border-purple-600 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <LocationIcon className="w-5 h-5 text-purple-600" />
              {/* Use the 'type' value to change the header */}
              {isOnline
                ? "Online Access (On Platform)"
                : "Venue Location (On Stage)"}
            </h3>
            <p className="text-purple-700 font-medium">
              {isOnline ? "Meeting Link" : "Address"}
            </p>
            <p className="text-gray-700 mt-1 break-all">
              {isOnline ? (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-1"
                >
                  {event.link}
                </a>
              ) : (
                event.location
              )}
            </p>
          </div>

          {/* Quick Facts Card (Now taking full line each) */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Facts
            </h3>

            {/* 💡 REVISED Layout: Using space-y-4 to make them take full line, removing grid-cols-2 for this block */}
            <div className="space-y-4">
              {/* Event Category */}
              <div className="flex flex-col gap-1 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <p className="text-sm text-gray-500 font-medium">Category</p>
                </div>
                {/* Assumes event object includes a nested category object with a display_name */}
                <p className="text-base font-semibold text-gray-800 ml-7">
                  {event.category?.display_name || "Uncategorized"}
                </p>
              </div>

              {/* Event Type (Full Line) */}
              <div className="flex flex-col gap-1 border-b pb-4">
                {" "}
                {/* Optional separator line */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <p className="text-sm text-gray-500 font-medium">Type</p>
                </div>
                <p className="text-base font-semibold text-gray-800 ml-7">
                  {isOnline ? "Online" : "On Stage"}
                </p>
              </div>

              {/* Organizer (Full Line) */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <p className="text-sm text-gray-500 font-medium">Organizer</p>
                </div>
                {/* 💡 Fixed Organizer Name Access to event.organizer?.name */}
                <p className="text-base font-semibold text-gray-800 ml-7">
                  {event.organizer?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
