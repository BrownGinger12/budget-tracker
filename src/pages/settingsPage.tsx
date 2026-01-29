// src/pages/SettingsPage.tsx
import React, { useState } from "react";
import { useAuth } from "../context/authContext";

const SettingsPage: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    contactNumber: userProfile?.contactNumber || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      await updateUserProfile({
        name: editForm.name,
        email: editForm.email,
        contactNumber: editForm.contactNumber,
      });

      setMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      contactNumber: userProfile?.contactNumber || "",
    });
    setIsEditing(false);
    setMessage("");
  };

  if (!userProfile) {
    return (
      <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Account Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-800">{userProfile.name}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled
                  title="Email cannot be changed"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-800">{userProfile.email}</p>
                </div>
              )}
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Email address cannot be changed for security reasons
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.contactNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-800">{userProfile.contactNumber}</p>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
