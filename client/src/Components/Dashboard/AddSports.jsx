import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import toast from "react-hot-toast";
import { createSportsAPI, updateSportsAPI } from "../../Services/apiServices";

const AddSports = ({ onClose, initialData, fetchSports }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    min_Players: "",
    image: null,
    skills: [{ skill: "" }],
  });
  const [loading, setLoading] = useState(false);

  // Populate form data if initialData is present (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        description: initialData.description,
        min_Players: initialData.min_Players,
        image: initialData.image || null,
        skills: initialData.skills || [{ skill: "" }],
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = formData.skills.map((skill, idx) =>
      idx === index ? { skill: value } : skill
    );
    setFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }));
  };

  const addSkillField = () => {
    setFormData((prevState) => ({
      ...prevState,
      skills: [...prevState.skills, { skill: "" }],
    }));
  };

  const removeSkillField = (index) => {
    const updatedSkills = formData.skills.filter((_, idx) => idx !== index);
    setFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.description ||
      !formData.min_Players
    ) {
      return "Please fill in all fields.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("min_Players", formData.min_Players);
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }
      formData.skills.forEach((skill, index) => {
        formDataToSend.append(`skills[${index}][skill]`, skill.skill);
      });
      
      const response = initialData
        ? await updateSportsAPI(initialData.id, formDataToSend)
        : await createSportsAPI(formDataToSend);

      if (response && (response.status === 201 || response.status === 200)) {
        fetchSports();
        toast.success(
          initialData
            ? "Sport category updated successfully"
            : "Sport category added successfully"
        );
        resetForm();
        onClose();
      } else {
        throw new Error(
          response?.data?.message || "Failed to save sports category"
        );
      }
    } catch (error) {
      console.error("Error saving sports category:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to save sports category";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      min_Players: "",
      image: null,
      skills: [{ skill: "" }],
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
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

        <h3 className="text-xl font-semibold text-center mb-4">
          {initialData ? "Edit Sport" : "Add Sport"}
        </h3>

        <div className="max-h-[80vh] overflow-y-auto sports-scrollbar py-2 px-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-0"
            encType="multipart/form-data"
          >
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Sport Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={255}
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
              <label className="font-semibold text-gray-700">
                Minimum Players
              </label>
              <input
                type="number"
                name="min_Players"
                min="1"
                value={formData.min_Players}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">
                Image (Max 2MB)
              </label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handleFileChange}
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
                    maxLength={255}
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
                {initialData ? "Update Sport" : "Add Sport"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSports;
