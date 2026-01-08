import React, { useState, useEffect } from "react";
import { Button, InputField, LoaderSpinner, MediumInfoText } from "../../units";
import toast, { Toaster } from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useUpdateBybookingIdMutation } from "../../state-management/api/booking-api";

type errorTypes = { message: string; status: number };

interface UpdateBookingProps {
  id: string;
  setPopup: React.Dispatch<React.SetStateAction<string>>;
}

export const UpdateBookingDetails = React.memo(
  ({ id, setPopup }: UpdateBookingProps) => {
    const [formValues, setFormValues] = useState({
      checkOutDate: "",
      remark: "",
    });

    const [updateBooking, { isLoading: updating }] =
      useUpdateBybookingIdMutation();

    // ✅ close modal on ESC press
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setPopup("");
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [setPopup]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
      });
    };

    const validateForm = () => {
      if (!formValues.checkOutDate) {
        toast.error("Checkout date is required ❌");
        return false;
      }
      if (new Date(formValues.checkOutDate) < new Date()) {
        toast.error("Checkout date cannot be in the past ❌");
        return false;
      }
      if (!formValues.remark.trim()) {
        toast.error("Description is required ❌");
        return false;
      }
      return true;
    };

    const handleUpdateBooking = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateForm()) return;

      const payload = {
        id,
        checkOutDate: formValues.checkOutDate,
        remark: formValues.remark.trim(),
      };

      await updateBooking(payload).then((res) => {
        if ("error" in res) {
          const error = res.error as FetchBaseQueryError;
          if ("data" in error) {
            toast.error((error.data as errorTypes).message as string);
          } else {
            toast.error("Server timed out. Please Try Again Later!!!");
          }
        }
        if ("data" in res) {
          toast.success("Booking updated successfully ✅");
          setTimeout(() => {
            setFormValues({ checkOutDate: "", remark: "" });
            setPopup(""); // close modal
          }, 1000);
        }
      });
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setPopup("")}
      >
        {/* Modal Box */}
        <main
          className="flex flex-col gap-5 bg-card-bg-brand p-4 sm:p-6 rounded-lg w-full max-w-lg sm:max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Toaster />
          {updating && <LoaderSpinner />}

          {/* Header */}
          <section className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <MediumInfoText title="Update Booking" />
              <button
                onClick={() => setPopup("")}
                className="p-1 rounded-full hover:bg-gray-200 transition"
                aria-label="Cancel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>
            </div>

            {/* Inputs */}
            <InputField
              inputType="date"
              name="checkOutDate"
              inputValue={formValues.checkOutDate}
              onChange={handleChange}
            />
            <InputField
              inputType="text"
              name="remark"
              inputValue={formValues.remark}
              onChange={handleChange}
              placeholder="Add descriptions..."
            />
          </section>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Button
              onClick={handleUpdateBooking}
              className="w-full sm:w-auto py-2 rounded-md"
            >
              Update
            </Button>
          </div>
        </main>
      </div>
    );
  }
);
