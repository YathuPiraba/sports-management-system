import React, { useState, useRef } from "react";
import { TbPlayerTrackNext } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const PersonalDetails = ({ details, handleChange, divisions, onNextStep }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 5);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const formFields = [
    { label: "Username", name: "userName", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Confirm Password", name: "confirm_password", type: "password" },
    { label: "First Name", name: "firstName", type: "text" },
    { label: "Last Name", name: "lastName", type: "text" },
    {
      label: "Date of Birth",
      name: "date_of_birth",
      type: "date",
      max: maxDateString,
    },
    { label: "Gender", name: "gender", type: "select" },
    { label: "NIC", name: "nic", type: "text", maxLength: 12, minLength: 10 },
    { label: "Division Name", name: "divisionName", type: "select" },
  ];

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  // Adjust handleCropComplete function (remove e.preventDefault())
  const handleCropComplete = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const base64Image = canvas.toDataURL("image/jpeg", 0.9);

      setImagePreview(base64Image);

      const res = await fetch(base64Image);
      const buf = await res.blob();
      const file = new File([buf], "profile-image.jpg", { type: "image/jpeg" });

      handleChange({
        target: {
          name: "image",
          value: file,
        },
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "userName",
      "email",
      "password",
      "confirm_password",
      "firstName",
      "lastName",
      "date_of_birth",
      "gender",
      "nic",
      "divisionName",
      // "image",
      "address",
      "contactNo",
      "whatsappNo",
    ];

    requiredFields.forEach((field) => {
      if (!details[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (details.password !== details.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (details.email && !/\S+@\S+\.\S+/.test(details.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNextStep();
    } else {
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="w-auto mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Fields */}
        {formFields.map((field) => (
          <div
            key={field.name}
            className={`${
              field.name === "address" ? "col-span-1 md:col-span-2" : ""
            }`}
            data-error={!!errors[field.name]}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}:<span className="text-red-500 ml-1">*</span>
            </label>
            {field.type === "select" ? (
              field.name === "gender" ? (
                <select
                  name={field.name}
                  value={details[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <select
                  name={field.name}
                  value={details[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Division</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.divisionName}>
                      {division.divisionName} ({division.divisionNo})
                    </option>
                  ))}
                </select>
              )
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={details[field.name] || ""}
                onChange={handleChange}
                minLength={field.minLength || undefined}
                max={field.type === "date" ? maxDateString : undefined}
                maxLength={field.maxLength || undefined}
                className={`w-full p-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-2">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Profile Image Section with Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
          {/* File Input */}
          <div data-error={!!errors.image}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image:
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={onSelectFile}
              className={`w-full p-2 border rounded-lg file:mr-4 file:py-2 file:px-4 
          file:rounded-lg file:border-0 file:text-sm file:font-medium 
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 
          ${errors.image ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-2">{errors.image}</p>
            )}
          </div>

          {/* Image Preview */}
          <div className="flex items-center justify-center md:justify-start">
            {imagePreview && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address:<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="address"
            value={details.address || ""}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            rows="4"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-2">{errors.address}</p>
          )}
        </div>

        {/* Contact Numbers Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
          {[
            { label: "Contact Number", name: "contactNo" },
            { label: "WhatsApp Number", name: "whatsappNo" },
          ].map((field) => (
            <div key={field.name} data-error={!!errors[field.name]}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}:<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name={field.name}
                value={details[field.name] || ""}
                onChange={handleChange}
                maxLength={15}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-2">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px] mx-auto relative">
            <button
              onClick={() => {
                setShowCropModal(false);
                setImgSrc("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoIosClose size={24} />
            </button>

            <h3 className="text-lg font-medium mb-4">Crop Profile Image</h3>

            <div className="max-h-[400px] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => handleCropComplete(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setImgSrc("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCropComplete(crop);
                  setShowCropModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
              >
                Apply
              </button>
              ;
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 lg:py-3 px-2 lg:px-6 rounded-md transition duration-150 ease-in-out"
        >
          <TbPlayerTrackNext size={19} />
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
