import React, { useEffect, useState } from "react";
import {
  Activity,
  Columns,
  DollarSign,
  Home,
  Image,
  Mail,
  Navigation,
  Phone,
  User,
  X,
} from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetHostelByIdQuery,
  useUpdateHostelMutation,
} from "../../../state-management/api/hostel-api";
import { useCloudinaryStorageMutation } from "../../../state-management/api/upload-pics";
import toast, { Toaster } from "react-hot-toast";
import {
  BreadCrumbLayout,
  BreadCrumbs,
  HeaderInfoText,
  Icon,
  InputField,
  LoaderSpinner,
} from "../../../units";
import { AreaData, errorTypes } from "../../../constant";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Room title is required"),
  hostelName: Yup.string()
    .min(3, "Aawas name must be at least 3 characters")
    .max(50, "Aawas name must be less than 50 characters")
    .required("Aawas name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  location: Yup.string().required("Location is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .max(1000000, "Price must be reasonable")
    .required("Price is required"),
  totalBed: Yup.number()
    .typeError("Total beds must be a number")
    .positive("Total beds must be a positive number")
    .integer("Total beds must be a whole number")
    .max(20, "Total beds cannot exceed 20")
    .required("Total beds is required"),
  peopleNumber: Yup.number()
    .typeError("People number must be a number")
    .positive("People number must be a positive number")
    .integer("People number must be a whole number")
    .max(50, "People number cannot exceed 50")
    .test(
      "min-beds",
      "People number cannot be less than total beds",
      function (value:any) {
        return value >= this.parent.totalBed;
      }
    )
    .required("People number is required"),
 contact: Yup.string()
     .matches(/^(97|98)\d{8}$/, "Enter a valid Nepali number (10 digits, starting with 97 or 98)")
     .required("Contact is required"),
  frequency: Yup.string().required("Payment frequency is required"),
});

// interface RoomDetails {
//   title: string;
//   hostelName: string;
//   imgUrls: string[];
//   location: string;
//   price: string;
//   frequency: string;
//   peopleNumber: number;
//   totalBed: number;
//   email: string;
//   contact: string;
//   ownerEmail: string;
//   ownerId: string;
// }

export const EditRoom = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch room data
  const { data: roomData, isLoading: isRoomLoading, refetch } =
    useGetHostelByIdQuery(id!);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [updateHostel, { isLoading: updateHostelLoading }] =
    useUpdateHostelMutation();
  const [uploadToCloud, { isLoading: uploadLoading }] =
    useCloudinaryStorageMutation();

  const formik = useFormik({
    initialValues: {
      title: "",
      hostelName: "",
      location: "",
      price: "",
      frequency: "",
      peopleNumber: 0,
      totalBed: 0,
      email: "",
      contact: "",
      imgUrls: [] as string[],
      ownerEmail: "",
      ownerId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let finalImageUrls = [...values.imgUrls];
        if (images.length > 0) {
          const base64Images = await Promise.all(images.map(convertToBase64));
          const picsResponse = await uploadToCloud({ images: base64Images }).unwrap();
          finalImageUrls = [...finalImageUrls, ...picsResponse.imgUrls];
        }

        const toPost = {
          ...values,
          imgUrls: finalImageUrls,
          contact: values.contact.toString(),
          price: values.price.toString(),
        };

        const resp = await updateHostel({ id: id!, data: toPost }).unwrap();
        toast.success(resp.msg || "Room updated successfully!");
        refetch();
        navigate(`/room-details/${id}`);
      } catch (error: any) {
        console.error("Update error:", error);
        if (error.data) {
          toast.error((error.data as errorTypes).message as string);
        } else if (error.error) {
          toast.error("Server timed out. Please Try Again Later!!!");
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
  });

  // Populate form with existing room data
  useEffect(() => {
    if (roomData) {
      const imgUrls = roomData.imgUrls || (roomData.imgUrl ? [roomData.imgUrl] : []);
      
      formik.setValues({
        title: roomData.title || "",
        hostelName: roomData.hostelName || "",
        location: roomData.location || "",
        price: roomData.price || "",
        frequency: roomData.frequency || "",
        peopleNumber: roomData.peopleNumber || 0,
        totalBed: roomData.totalBed || 0,
        email: roomData.email || "",
        contact: roomData.contact?.toString() || "",
        imgUrls: imgUrls,
        ownerEmail: roomData.ownerEmail || "",
        ownerId: roomData.owner || "",
      });

      setImagePreviews(imgUrls);
    }
  }, [roomData]);

  // Handle new image selection
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Check total number of images
      if (imagePreviews.length + files.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (exceeds 10MB)`);
        } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          invalidFiles.push(`${file.name} (invalid file type)`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
      }

      if (validFiles.length > 0) {
        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    if (index < formik.values.imgUrls.length) {
      // Removing existing image stored in DB
      const removedUrl = newPreviews[index];
      formik.setFieldValue(
        'imgUrls', 
        formik.values.imgUrls.filter((url) => url !== removedUrl)
      );
    } else {
      // Removing newly added image
      newImages.splice(index - formik.values.imgUrls.length, 1);
    }

    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const isLoading = isRoomLoading || updateHostelLoading || uploadLoading;

  return (
    <main className="flex flex-col p-4 md:p-6 lg:p-8 gap-6 lg:gap-8">
      <Toaster />
      <BreadCrumbs>
        <BreadCrumbLayout path="/rooms" title="Rooms" />
        <BreadCrumbLayout path={`/room-details/${id}`} title="Room Details" />
        <BreadCrumbLayout path="" title="Edit Room" current />
      </BreadCrumbs>

      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <form onSubmit={formik.handleSubmit} className="flex flex-col w-full md:w-[90%] lg:w-[80%] m-auto">
          {/* Image Upload */}
          <div className="border-b border-gray-900/10 pb-8 md:pb-12">
            <HeaderInfoText title="Edit Room Images" />
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-4 md:px-6 py-8 md:py-10">
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 md:h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} className="md:w-3 md:h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Icon name={Image} className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-300" />
                  <label
                    htmlFor="file-upload"
                    className="mt-4 cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 text-sm md:text-base"
                  >
                    Upload files
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleImages}
                      accept="image/jpeg,image/png,image/gif"
                    />
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Other Form Fields */}
          <div className="border-b border-gray-900/10 pb-8 md:pb-12">
            <div className="mt-8 md:mt-10 grid grid-cols-1 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 sm:grid-cols-6">
              {/* Hostel Name */}
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Aawas Name
                </label>
                <InputField
                  inputName="hostelName"
                  inputType="text"
                  inputValue={formik.values.hostelName}
                  iconname={Home}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.hostelName}
                  touched={formik.touched.hostelName}
                  required
                />
              </div>

              {/* Room Title */}
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Room Title
                </label>
                <InputField
                  inputName="title"
                  inputType="text"
                  inputValue={formik.values.title}
                  iconname={Activity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.title}
                  touched={formik.touched.title}
                  required
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Email Address
                </label>
                <InputField
                  inputName="email"
                  inputType="email"
                  inputValue={formik.values.email}
                  iconname={Mail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.email}
                  touched={formik.touched.email}
                  required
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Location
                </label>
                <div className="mt-2 rounded-lg p-3 md:p-4 bg-input-bg flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-gray-400" />
                  <select
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-input-bg w-full outline-none text-sm md:text-base"
                    required
                  >
                    <option value="">Select a location</option>
                    {AreaData.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.location && formik.errors.location && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
                )}
              </div>

              {/* Price */}
              <div className="sm:col-span-6 md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Price
                </label>
                <InputField
                  inputName="price"
                  inputType="number"
                  inputValue={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  iconname={DollarSign}
                  min={0}
                  error={formik.errors.price}
                  touched={formik.touched.price}
                  required
                />
              </div>

              {/* Total Bed */}
              <div className="sm:col-span-6 md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Total Bed
                </label>
                <InputField
                  inputName="totalBed"
                  inputType="number"
                  inputValue={formik.values.totalBed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  iconname={Columns}
                  min={0}
                  max={20}
                  error={formik.errors.totalBed}
                  touched={formik.touched.totalBed}
                  required
                />
              </div>

              {/* People Number */}
              <div className="sm:col-span-6 md:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Total People that can reside
                </label>
                <InputField
                  inputName="peopleNumber"
                  inputType="number"
                  inputValue={formik.values.peopleNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  iconname={User}
                  min={formik.values.totalBed || 0}
                  max={50}
                  error={formik.errors.peopleNumber}
                  touched={formik.touched.peopleNumber}
                  required
                />
              </div>

              {/* Contact */}
              <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Contact
                </label>
                <InputField
                  inputName="contact"
                  inputType="tel"
                  inputValue={formik.values.contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  iconname={Phone}
                  pattern="[0-9]*"
                  error={formik.errors.contact}
                  touched={formik.touched.contact}
                  required
                />
              </div>

              {/* Frequency */}
              <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Price Paying Frequency
                </label>
                <div className="mt-2 rounded-lg p-3 md:p-4 bg-input-bg">
                  <select
                    name="frequency"
                    value={formik.values.frequency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-input-bg w-full outline-none text-sm md:text-base"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                {formik.touched.frequency && formik.errors.frequency && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.frequency}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-x-6">
            <button
              type="button"
              className="w-full sm:w-auto text-sm bg-love px-3 py-2 rounded-md text-white font-semibold hover:animate-glow mt-3 sm:mt-0"
              onClick={() => navigate(`/room-details/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-brand px-3 py-2 text-sm text-white font-semibold hover:animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
});