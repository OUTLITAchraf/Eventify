import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Calendar,
  Plus,
  MapPin,
  ExternalLink,
  Clock,
  FileImage,
  FileText,
  Tag,
  Upload,
  X,
  Folder as Category,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, fetchCategories } from "../../features/event/eventSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Event Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  start_time: yup
    .date()
    .required("Start Date & Time is required")
    .typeError("Must be a valid date and time"),
  end_time: yup
    .date()
    .required("End Date & Time is required")
    .typeError("Must be a valid date and time")
    .min(yup.ref("start_time"), "End time must be after start time"),
  status: yup.string().oneOf(["scheduled", "ongoing", "completed"]).required(),
  type: yup.string().oneOf(["OnStage", "Online"]).required(),
  category_id: yup
    .number()
    .required("Category is required")
    .min(1, "Please select a category")
    .typeError("Category must be a number"),
  location: yup.string().when("type", {
    is: "OnStage",
    then: (schema) =>
      schema
        .required('Physical Location is required for "On Stage" events')
        .min(5, "Location must be detailed"),
    otherwise: (schema) => schema.notRequired().transform(() => ""),
  }),
  link: yup.string().when("type", {
    is: "Online",
    then: (schema) =>
      schema
        .url("Must be a valid URL")
        .required('Online Meeting Link is required for "On Platform" events'),
    otherwise: (schema) => schema.notRequired().transform(() => ""),
  }),
  image: yup
    .mixed()
    .required("An event image is required")
    .test("fileSize", "File size is too large (max 10MB)", (value) => {
      // Allow if null (if nullable schema was used), but here it's required
      return !value || value.size <= 10485760;
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        !value || ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      );
    }),
});

const defaultValues = {
  name: "",
  description: "",
  start_time: "",
  end_time: "",
  status: "scheduled",
  type: "OnStage",
  category_id: 0,
  location: "",
  link: "",
  image: null,
};

// --- CLOUDINARY UPLOAD FUNCTION (UPDATED) ---
const uploadToCloudinary = async (file) => {
  if (!file) return null;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary credentials are not set in the environment variables."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    // Return the secure URL provided by Cloudinary
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Provide a more user-friendly error
    throw new Error(
      "Failed to upload image. Check your Cloudinary configuration."
    );
  }
};

export default function CreateEventForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: submitError } = useSelector((state) => state.events);
  const { categories } = useSelector((state) => state.events);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const eventType = watch("type");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // --- IMAGE HANDLERS ---
  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setValue("image", file, { shouldValidate: true });

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue]
  );

  const removeImage = useCallback(() => {
    setValue("image", null, { shouldValidate: true });
    setImagePreview(null);
  }, [setValue]);

  const onSubmit = async (data) => {
    const createPromise = new Promise(async (resolve, reject) => {
      let imageUrl = null;

      try {
        // 1. Upload image to Cloudinary first
        if (data.image) {
          // Show loading message specific to image upload
          toast.loading("Uploading image...", { id: "image-upload" });
          imageUrl = await uploadToCloudinary(data.image);
          toast.success("Image uploaded successfully!", { id: "image-upload" });
        } else {
          // This shouldn't happen if validation is correct, but as a fallback
          reject(new Error("Image data is missing."));
          return;
        }

        const formattedData = {
          name: data.name,
          description: data.description,
          start_time: data.start_time
            ? new Date(data.start_time)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null,
          end_time: data.end_time
            ? new Date(data.end_time)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null,
          status: data.status,
          type: data.type,
          category_id: data.category_id,
          location: data.type === "OnStage" ? data.location : null,
          link: data.type === "Online" ? data.link : null,
          image: imageUrl,
        };

        // 3. Dispatch the event creation thunk (using JSON payload)
        const result = await dispatch(createEvent(formattedData)).unwrap();

        // Success: Resolve the promise with the new event data
        resolve(result);
      } catch (err) {
        // Error: Reject the promise with the error message
        console.error("Creation failed:", err);
        // Clear any lingering image upload toast if the dispatch failed later
        toast.dismiss("image-upload");
        const errorMessage =
          err.message ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          "The event creation failed due to a server error.";
        reject(new Error(errorMessage));
      }
    });

    // Use toast.promise to display feedback for the overall event creation
    await toast
      .promise(createPromise, {
        loading: "Creating event...",
        success: (new_event) =>
          `Event "${new_event.name}" created successfully!`,
        error: (err) => `Error: ${err.message}`, // Use err.message from the rejected promise
      })
      .then((new_event) => {
        // Redirect to the new event detail page
        navigate(`/organizer/dashboard`);
      }).catch((err) => {
        console.log("Event creation error :", err);
      });
  };

  const ErrorMessage = useMemo(
    () =>
      ({ name }) => {
        const error = errors[name];
        return error ? (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        ) : null;
      },
    [errors]
  );

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setImagePreview(null);
  }, [reset]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Create New Event
              </h1>
              <p className="text-sm text-gray-500">
                Fill in the details to create your event
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="name"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter event name"
                      />
                    )}
                  />
                  <ErrorMessage name="name" />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id="description"
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition resize-none ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Describe your event in detail..."
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a detailed description of your event
                  </p>
                  <ErrorMessage name="description" />
                </div>
              </div>
            </div>

            <hr />

            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Date & Time
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Start Date & Time */}
                <div>
                  <label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="start_time"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="datetime-local"
                        id="start_time"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${
                          errors.start_time
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  <ErrorMessage name="start_time" />
                </div>

                {/* End Date & Time */}
                <div>
                  <label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="end_time"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="datetime-local"
                        id="end_time"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${
                          errors.end_time ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  <ErrorMessage name="end_time" />
                </div>
              </div>
            </div>

            <hr />

            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Event Configuration
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Status Select */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="status"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer ${
                          errors.status ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  />
                  <ErrorMessage name="status" />
                </div>

                {/* Event Type Select */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="type"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer ${
                          errors.type ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="OnStage">
                          On Stage (Physical Event)
                        </option>
                        <option value="Online">
                          On Platform (Online Event)
                        </option>
                      </select>
                    )}
                  />
                  <ErrorMessage name="type" />
                </div>

                {/* Category Select */}
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        // Convert value to number for validation
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        id="category_id"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer ${
                          errors.category_id
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value={0} disabled>
                          Select Event Category
                        </option>
                        {/* Map over fetched categories */}
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.display_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <ErrorMessage name="category_id" />
                </div>
              </div>
            </div>

            <hr />

            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                {/* Conditional Title based on 'type' */}
                {eventType === "OnStage" ? (
                  <>
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Event Location
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                    Event Link
                  </>
                )}
              </h2>

              {/* Conditional Input based on 'type' */}
              {eventType === "OnStage" ? (
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Physical Location <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...field}
                          type="text"
                          id="location"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${
                            errors.location
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter event location address"
                        />
                      </div>
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide the complete address where the event will take place
                  </p>
                  <ErrorMessage name="location" />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Online Meeting Link <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...field}
                          type="url"
                          id="link"
                          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition ${
                            errors.link ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="https://zoom.us/j/123456789"
                        />
                      </div>
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the URL for the online event (Zoom, Google Meet, etc.)
                  </p>
                  <ErrorMessage name="link" />
                </div>
              )}
            </div>

            <hr />

            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-purple-600" />
                Event Image
              </h2>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition">
                  {/* Since file inputs are tricky with React Hook Form, we handle the state manually but link it via setValue */}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-1">
                      Click to upload event image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {/* Optional: Display an error if you add required validation for the image later */}
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit" // Crucial for form submission
                // Disabled when submitting or when Redux status is 'loading'
                disabled={isSubmitting || status === "loading"}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold transition shadow-lg transform hover:scale-105 ${
                  isSubmitting || status === "loading"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
                }`}
              >
                {isSubmitting || status === "loading" ? (
                  "Creating..."
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Event
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Reset Form
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">
                Event Creation Tips
              </h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Choose a clear and descriptive event name</li>
                <li>• Provide detailed information in the description</li>
                <li>
                  • Select the appropriate event type (Physical or Online)
                </li>
                <li>• Add a high-quality image to attract more attendees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
