import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useCallback } from "react"; // 💡 Added useCallback
import {
  Calendar,
  Plus,
  Users,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  MapPin,
  ExternalLink,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Monitor,
  User,
  User2,
  User2Icon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, deleteEvent } from "../../features/event/eventSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 💡 Added toast import

export default function OrganizerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, status, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const organizerEvents = events
    ? events.filter((event) => event.organizer_id === user?.id)
    : [];

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const getStatusBadge = (status) => {
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
    const Icon = icons[status];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${styles[status]}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Add a helper function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // 💡 Updated handleDelete to use toast.promise and useCallback
  const handleDelete = useCallback(async () => {
    const eventName = eventToDelete?.name || "the event";
    setDeleteModalOpen(false); // Close modal before API call

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await dispatch(deleteEvent(eventToDelete.id)).unwrap();

        // Clear the temporary state variables on success
        setEventToDelete(null);
        setShowMenu(null);

        resolve();
      } catch (error) {
        console.error("Failed to delete event:", error);
        // Reject with a useful error message
        reject(error.message || "The deletion request failed.");
      }
    });

    toast.promise(deletePromise, {
      loading: `Deleting ${eventName}...`,
      success: `${eventName} deleted successfully!`,
      error: (err) => `Error: ${err}`,
    });
  }, [dispatch, eventToDelete]); // eventToDelete is crucial dependency

  // Add this component inside your OrganizerDashboard component
  const DeleteConfirmationDialog = () => (
    <Transition appear show={deleteModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setDeleteModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete Event
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{eventToDelete?.name}"?
                    This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  {/* 💡 Disabled Delete button when Redux status is 'loading' */}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  const handleEventClick = (eventId) => {
    navigate(`/detail-event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (No changes needed) */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <User className="w-9 h-9 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Organizer Dashboard
                </h1>
                <p className="text-sm text-gray-500">Manage your events</p>
              </div>
            </div>
            <Link
              to={"/create-event"}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events Section (No changes needed) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                My Events
              </h2>
              <p className="text-gray-500 text-sm">
                Manage and track your events
              </p>
            </div>
          </div>

          {/* Loading State (No changes needed) */}
          {status === "loading" && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          )}

          {/* Error State (No changes needed) */}
          {status === "failed" && (
            <div className="p-12 text-center text-red-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p>{error || "Failed to load events"}</p>
            </div>
          )}

          {/* Empty State (No changes needed) */}
          {status === "succeeded" && organizerEvents.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                Create your first event to get started
              </p>
            </div>
          )}

          {/* Events Grid (No changes needed in rendering logic) */}
          {status === "succeeded" && organizerEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {organizerEvents.map((event) => {
                const datetime_start = formatDateTime(event.start_time);
                const datetime_end = formatDateTime(event.end_time);

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    {/* Event Image */}
                    <div className="relative">
                      <img
                        src={
                          event.image
                            ? event.image
                            : "https://placehold.co/600x400?text=No+Image+Available&font=roboto"
                        }
                        alt={event.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(
                              showMenu === event.id ? null : event.id
                            );
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {showMenu === event.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10">
                            <button
                              onClick={() => handleEventClick(event.id)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <Link
                              to={`/update-event/${event.id}`}
                              onClick={() => setShowMenu(null)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Event
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEventToDelete(event);
                                setDeleteModalOpen(true);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 border-t text-sm cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Event
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        {event.type === "OnStage" ? (
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
                          <span>{datetime_start.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                          <span>
                            {datetime_start.time} to {datetime_end.time}
                          </span>
                        </div>
                        {event.type === "OnStage" ? (
                          <div className="flex items-start text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
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

        <DeleteConfirmationDialog />
      </div>
    </div>
  );
}
