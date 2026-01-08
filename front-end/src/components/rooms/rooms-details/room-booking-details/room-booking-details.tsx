import React, { useState } from "react";
import {
  Button,
  HeaderInfoText,
  InfoText,
  InputField,
  LoaderSpinner,
  MediumInfoText,
} from "../../../../units";
import { useSelector } from "react-redux";
import { user } from "../../../../state-management/local/auth";
import { useBookHostelMutation } from "../../../../state-management/api/booking-api";
import toast, { Toaster } from "react-hot-toast";
import { errorTypes } from "../../../../constant";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageSquare, Calendar, Users, CreditCard } from "react-feather";
import { useGetOTPMutation } from "../../../../state-management/api/otp-api";
import * as Yup from "yup";

interface bookingPropTypes {
  price: string;
  frequency: string;
  contact: number;
  email: string;
  hostelName: string;
  imgUrl: string;
  location: string;
  peopleNumber: number;
  title: string;
  totalBed: number;
  id: string;
  ownerEmail?: string;
  ownerId: string;
}

// Validation schemas
const createBookingSchema = (availableSeats: number) => Yup.object().shape({
  dateValue: Yup.string()
    .required("Check-in date is required")
    .test('future-date', 'Check-in date must be in the future', (value) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  people: Yup.number()
    .required("Number of people is required")
    .min(1, "At least 1 person is required")
    .max(10, "Maximum 10 people allowed")
    .test('available-seats', `Only ${availableSeats} seats available`, (value) => {
      return value ? value <= availableSeats : false;
    }),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{2,5}$/, "OTP must be 2 to 5 digits")
});

export const RoomBookingDetails = React.memo((data: bookingPropTypes) => {
  const [localInputFieldValue, setLocalinputFieldValue] = useState({
    dateValue: "",
    otp: "",
    people: 0,
    otpLayout: false,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const userInfo = useSelector(user);
  const [bookHostel, { isLoading: bookingLoading }] = useBookHostelMutation();
  const [getOtp, { isLoading: optLoading }] = useGetOTPMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLocalinputFieldValue(prev => ({
      ...prev,
      [name]: name === 'people' ? Number(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateBookingForm = async () => {
    try {
      const bookingSchema = createBookingSchema(data.peopleNumber);
      await bookingSchema.validate(localInputFieldValue, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        const newErrors: {[key: string]: string} = {};
        validationErrors.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        
        // Mark all fields as touched to show errors
        const newTouched: {[key: string]: boolean} = {};
        validationErrors.inner.forEach(error => {
          if (error.path) {
            newTouched[error.path] = true;
          }
        });
        setTouched(prev => ({ ...prev, ...newTouched }));
      }
      return false;
    }
  };

  const validateOtpForm = async () => {
    try {
      await otpSchema.validate(localInputFieldValue, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        const newErrors: {[key: string]: string} = {};
        validationErrors.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        
        // Mark OTP field as touched
        setTouched(prev => ({ ...prev, otp: true }));
      }
      return false;
    }
  };

  const bookRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validate OTP form
    const isValid = await validateOtpForm();
    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    const bookingDetails = {
      otp: localInputFieldValue.otp,
      userId: userInfo?.id,
      roomId: data.id,
      checkInDate: localInputFieldValue.dateValue,
      checkOutDate: null,
      paymentStatus: "Pending",
      people: Number(localInputFieldValue.people),
      payment: "0",
      status: "pending",
      remark: "",
      transactionId: "",
      pidx: "",
      isActiveStatus: false,
    };

    await bookHostel(bookingDetails).then((res) => {
      if ("error" in res) {
        const error = res.error as FetchBaseQueryError;
        if ("data" in error) {
          toast.error((error.data as errorTypes).message as string);
        } else {
          toast.error("Server timed out. Please Try Again Later!!!");
        }
      }
      if ("data" in res) {
        toast.success("Thank you for booking with us. You will be updated soon!!");
        setTimeout(() => {
          setLocalinputFieldValue({
            dateValue: "",
            otp: "",
            people: 0,
            otpLayout: false
          });
        }, 1000);
      }
    });
  };

  const sendOtp = async () => {
    // Validate booking form first
    const isValid = await validateBookingForm();
    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    // Check if user is logged in
    if (!userInfo?.id) {
      toast.error("Please log in to book a room");
      return;
    }

    const userData = {
      userName: userInfo?.name ?? userInfo?.userName,
      address: userInfo?.address,
      email: userInfo?.email,
      contact: userInfo?.contact,
      role: userInfo?.role,
      userId: userInfo?.id,
    };

    await getOtp(userData).then((result) => {
      if (result.error) {
        const error = result.error as FetchBaseQueryError;
        if ("data" in error) {
          toast.error((error.data as errorTypes).message as string);
        } else if ("error" in error) {
          toast.error("Server timed out. Please Try Again Later!!!");
        }
        return;
      }

      if (result.data) {
        toast.success(result.data.msg);
        localStorage.setItem("booking-token", JSON.stringify(result.data.token));
        setLocalinputFieldValue(prev => ({
          ...prev,
          otpLayout: true,
        }));
      }
    });
  };

  if (localInputFieldValue.otpLayout) {
    return (
      <main className="booking-container otp-view">
        <Toaster />
        {bookingLoading && <LoaderSpinner />}
        <div className="booking-header">
          <MediumInfoText title="Verify OTP" className="uppercase" />
          <p className="otp-instructions">Please enter the verification code sent to your email</p>
        </div>
        <form onSubmit={bookRoom} className="booking-form">
          <div className="input-group">
            <InputField
              iconname={MessageSquare}
              inputType="text"
              name="otp"
              inputValue={localInputFieldValue.otp}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter 2-5 digit OTP"
              required
              error={errors.otp}
              touched={touched.otp}
              maxLength={5}
            />
            {errors.otp && touched.otp && (
              <p className="input-error">{errors.otp}</p>
            )}
          </div>
          <Button type="submit" disabled={bookingLoading} className="btn-primary full-width">
            {bookingLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <button 
          className="back-button" 
          onClick={() => setLocalinputFieldValue(prev => ({ ...prev, otpLayout: false }))}
        >
          ← Back to booking details
        </button>
      </main>
    );
  }

  return (
    <main className="booking-container">
      <Toaster />
      {optLoading && <LoaderSpinner />}
      
      <div className="booking-header">
        <div className="price-display">
          <HeaderInfoText title={data.price} />
          <InfoText title={`/ ${data.frequency}`} />
        </div>
        <div className="availability-badge">
          {data.peopleNumber > 0 ? `${data.peopleNumber} seats available` : 'Fully booked'}
        </div>
      </div>
      
      <section className="booking-details">
        <div className="detail-row">
          <InfoText title="Check-in Date" />
          <div className="input-group">
            <InputField
              iconname={Calendar}
              inputType="date"
              name="dateValue"
              inputValue={localInputFieldValue.dateValue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dateValue}
              touched={touched.dateValue}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dateValue && touched.dateValue && (
              <p className="input-error">{errors.dateValue}</p>
            )}
          </div>
        </div>

        <div className="detail-row">
          <InfoText title="Number of Guests" />
          <div className="input-group">
            <InputField
              iconname={Users}
              inputType="number"
              name="people"
              inputValue={localInputFieldValue.people}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.people}
              touched={touched.people}
              min="1"
              max={data.peopleNumber}
            />
            {errors.people && touched.people && (
              <p className="input-error">{errors.people}</p>
            )}
          </div>
        </div>
      </section>
      
      <div className="booking-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{data.price}</span>
        </div>
        <div className="summary-row">
          <span>Taxes & Fees</span>
          <span>Included</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{data.price}</span>
        </div>
      </div>
      
      <Button 
        onClick={sendOtp} 
        disabled={optLoading || !localInputFieldValue.dateValue || !localInputFieldValue.people || data.peopleNumber === 0}
        className="btn-primary full-width"
      >
        {optLoading ? "Sending OTP..." : "Verify & Send OTP"}
      </Button>
      
      <div className="payment-info">
        <CreditCard size={16} />
        <span>No payment required now. Pay at the property.</span>
      </div>
      
      {/* Show all validation errors at the bottom */}
      {Object.keys(errors).length > 0 && (
        <div className="validation-errors">
          <p className="error-title">Please fix the following errors:</p>
          <ul className="error-list">
            {Object.entries(errors).map(([_, error], index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <style>{`
        .booking-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        
        .booking-container.otp-view {
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
        }
        
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .price-display {
          display: flex;
          align-items: flex-end;
          gap: 4px;
        }
        
        .availability-badge {
          background: #10B981;
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .booking-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .input-group {
          position: relative;
        }
        
        .input-error {
          color: #EF4444;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .booking-summary {
          background: #F9FAFB;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        
        .summary-row.total {
          font-weight: 600;
          font-size: 16px;
        }
        
        .summary-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 4px 0;
        }
        
        .btn-primary {
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563EB;
        }
        
        .btn-primary:disabled {
          background: #9CA3AF;
          cursor: not-allowed;
        }
        
        .full-width {
          width: 100%;
        }
        
        .payment-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          color: #6B7280;
        }
        
        .validation-errors {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 16px;
          margin-top: 8px;
        }
        
        .error-title {
          color: #DC2626;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .error-list {
          color: #DC2626;
          font-size: 14px;
          padding-left: 20px;
          margin: 0;
        }
        
        .error-list li {
          margin-bottom: 4px;
        }
        
        .otp-instructions {
          color: #6B7280;
          font-size: 14px;
          margin-top: 8px;
        }
        
        .back-button {
          background: none;
          border: none;
          color: #3B82F6;
          cursor: pointer;
          font-size: 14px;
          margin-top: 16px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .booking-container {
            padding: 20px;
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #E5E7EB;
          }
          
          .booking-header {
            flex-direction: column;
            gap: 12px;
          }
          
          .availability-badge {
            align-self: flex-start;
          }
        }
        
        @media (max-width: 480px) {
          .booking-container {
            padding: 16px;
          }
          
          .booking-summary {
            padding: 12px;
          }
        }
      `}</style>
    </main>
  );
});