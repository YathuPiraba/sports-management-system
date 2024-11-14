import React, { useState, useRef } from "react";
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

const ClubDetails = ({ details, handleChange, divisions }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef(null);

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
      const file = new File([buf], "club-image.jpg", { type: "image/jpeg" });

      handleChange({
        target: {
          name: "clubImage",
          value: file,
        },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700">Club Name</label>
        <input
          type="text"
          name="clubName"
          value={details.clubName}
          onChange={handleChange}
          className="mt-1 p-1.5 w-full border rounded"
        />
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex-grow">
          <label className="block text-gray-700">Club Image</label>
          <input
            type="file"
            name="clubImage"
            accept="image/*"
            onChange={onSelectFile}
            className="mt-1 p-1.5 w-full border rounded file:mr-4  
            file:rounded-lg file:border-0 file:text-sm file:font-medium 
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {imagePreview && (
          <div className="w-16 h-16 mt-1 rounded-lg overflow-hidden border-2 border-blue-500 flex-shrink-0">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-gray-700">Address</label>
        <textarea
          name="clubAddress"
          value={details.clubAddress}
          onChange={handleChange}
          className="mt-1 p-1.5 w-full border rounded"
          rows="3"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-gray-700">Club History</label>
        <textarea
          name="club_history"
          value={details.club_history}
          onChange={handleChange}
          className="mt-1 p-1.5 w-full border rounded"
          rows="4"
        />
      </div>

      <div>
        <label className="block text-gray-700">Contact Number</label>
        <input
          type="text"
          name="clubContactNo"
          maxLength={15}
          value={details.clubContactNo}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Division Name</label>
        <select
          name="clubDivisionName"
          value={details.clubDivisionName}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        >
          <option value="">Select Division</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.divisionName}>
              {division.divisionName} ({division.divisionNo})
            </option>
          ))}
        </select>
      </div>

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

            <h3 className="text-lg font-medium mb-4">Crop Club Image</h3>

            <div className="max-h-[400px] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => handleCropComplete(c)}
                aspect={1}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetails;
