import React, { useState, useRef } from "react";
import { Button } from "antd";
import toast from "react-hot-toast";
import { createSportsAPI } from "../../Services/apiServices";

const AddSports = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    minPlayers: "",
    image: null,
    skills: [{ skill: "" }]
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        image: files[0]  // Store the selected file directly as `image`
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index].skill = value;
    setFormData((prevState) => ({
      ...prevState,
      skills: newSkills
    }));
  };

  const addSkillField = () => {
    setFormData((prevState) => ({
      ...prevState,
      skills: [...prevState.skills, { skill: "" }]
    }));
  };

  const removeSkillField = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      skills: prevState.skills.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      minPlayers: "",
      image: null,
      skills: [{ skill: "" }]
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;  // Reset file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("min_Players", formData.minPlayers);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image); // Append image file
      }
      
      formDataToSend.append("skills", JSON.stringify(formData.skills));

      // Log FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await createSportsAPI(formDataToSend);
      if (response && response.status === 200) {
        toast.success("Sports added Successfully");
        resetForm();
        onClose();
      } else {
        toast.error("Failed to create sports category");
      }
    } catch (error) {
      console.error("Failed to create sports category", error);
      const errorMessage = error?.response?.data?.message || "Failed to create sports category";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white rounded-lg w-full max-w-lg p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <h3 className="text-xl font-semibold text-center mb-4">Add New Sport</h3>
        
        <div className="max-h-[80vh] overflow-y-auto sports-scrollbar py-2 px-6">
          <form onSubmit={handleSubmit} className="space-y-4 mt-0" encType="multipart/form-data">
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Sport Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a type</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="water">Water Sport</option>
                <option value="extreme">Extreme Sport</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                rows={3}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Minimum Players</label>
              <input
                type="number"
                name="minPlayers"
                min="1"
                value={formData.minPlayers}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                ref={fileInputRef}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Skills</label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter skill"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkillField(index)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSkillField}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Skill
              </button>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="default"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
              >
                Add Sport
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSports;
