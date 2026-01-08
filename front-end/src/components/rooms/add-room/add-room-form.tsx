import React, { useRef, useState } from "react";
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
import {
  BreadCrumbLayout,
  BreadCrumbs,
  // Icon,
  InputField,
} from "../../../units";

import { useCreateHostelMutation } from "../../../state-management/api/hostel-api";
import { useCloudinaryStorageMutation } from "../../../state-management/api/upload-pics";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AreaData, errorTypes } from "../../../constant";
import toast, { Toaster } from "react-hot-toast";
import LoaderSpinner from "../../../units/loader/loader-spinner";
import { useSelector } from "react-redux";
import { user } from "../../../state-management/local/auth";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
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
      function (value: any) {
        return value >= this.parent.totalBed;
      }
    )
    .required("People number is required"),
  contact: Yup.string()
    .matches(
      /^(97|98)\d{8}$/,
      "Enter a valid Nepali number (10 digits, starting with 97 or 98)"
    )
    .required("Contact is required"),
  frequency: Yup.string().required("Payment frequency is required"),
});

export const RoomAdd = React.memo(() => {
  const userInfo = useSelector(user);
  const nav = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [createHostel] = useCreateHostelMutation();
  const [uploadToCloud, { isLoading }] = useCloudinaryStorageMutation();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

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
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!captchaValue) {
        toast.error("Please complete the reCAPTCHA verification");
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      try {
        const base64Images = await Promise.all(
          images.map(convertToBase64)
        );
        const picsResponse = await uploadToCloud({
          images: base64Images,
        }).unwrap();

        const toPost = {
          ...values,
          ownerId: userInfo?.id,
          ownerEmail: userInfo?.email,
          imgUrls: picsResponse.imgUrls,
          recaptchaToken: captchaValue,
          peopleNumber: Number(values.peopleNumber),
          totalBed: Number(values.totalBed),
          price: values.price.toString(),
          contact: values.contact.toString(),
        };

        await createHostel(toPost).then((data) => {
          if (data.error) {
            const error = data.error as FetchBaseQueryError;
            if ("data" in error) {
              toast.error((error.data as errorTypes).message as string);
            }
            if ("error" in error) {
              toast.error("Server timed out. Please Try Again Later!!!");
            }
          }
          if (data.data) {
            toast.success(data.data.message || "Room created successfully");
            nav("/rooms");
          }
        });
      } catch (error) {
        console.error("Error creating room:", error);
        toast.error("Failed to create room. Please try again.");
      }
    },
  });

  // Handle multiple images
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Check total number of images
      if (images.length + files.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      files.forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (exceeds 10MB)`);
        } else if (
          !["image/jpeg", "image/png", "image/gif"].includes(file.type)
        ) {
          invalidFiles.push(`${file.name} (invalid file type)`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        toast.error(`Invalid files: ${invalidFiles.join(", ")}`);
      }

      if (validFiles.length > 0) {
        setImages((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [
          ...prev,
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <main className="flex flex-col p-4 md:p-6 lg:p-8 gap-6 lg:gap-8">
      <Toaster />
      <BreadCrumbs>
        <BreadCrumbLayout path="/rooms" title="Rooms" />
        <BreadCrumbLayout path="/add-room" title="Add-Rooms" current />
      </BreadCrumbs>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoaderSpinner />
        </div>
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-full md:w-[90%] lg:w-[80%] mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8"
        >
          {/* Image Upload */}
          <div className="border-b border-gray-200 pb-6 md:pb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              House or Room Photos (Maximum 10)
            </h2>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-4 py-8 md:px-6">
              {imagePreviews.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {images.length < 10 && (
                    <label className="mt-4 flex flex-col items-center justify-center rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 cursor-pointer">
                      <span>Add more images</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleImages}
                        accept="image/jpeg,image/png,image/gif"
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex flex-col sm:flex-row text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-brand hover:text-brand-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleImages}
                        accept="image/jpeg,image/png,image/gif"
                      />
                    </label>
                    <p className="pl-0 sm:pl-1 mt-1 sm:mt-0">
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              )}
            </div>
            {images.length === 0 && formik.submitCount > 0 && (
              <p className="mt-2 text-sm text-red-600">
                Please upload at least one image
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="border-b border-gray-200 pb-6 md:pb-8 mt-6 md:mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Room Information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
              {/* Hostel Name */}
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Navigation className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
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
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.location}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="sm:col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (NPR)
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
              <div className="sm:col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="sm:col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="sm:col-span-6 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Paying Frequency
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="frequency"
                    value={formik.values.frequency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                {formik.touched.frequency && formik.errors.frequency && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.frequency}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recaptcha */}
          <div className="mt-6 md:mt-8 flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Ld8w0oqAAAAAOM5St_qQ8Mf781x24L3NovhA47N"
              onChange={handleCaptchaChange}
            />
          </div>
          {!captchaValue && formik.submitCount > 0 && (
            <p className="mt-2 text-sm text-red-600 text-center">
              Please complete the reCAPTCHA verification
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 md:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium sm:order-1 order-2"
              onClick={() => nav("/rooms")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed sm:order-2 order-1"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
});