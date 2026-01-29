// src/pages/ProfilePage.tsx
import React, { useState, useRef } from "react";
import { Flame, Eye, EyeOff, Camera, Upload } from "lucide-react";
import { useAuth } from "../context/authContext";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const ProfilePage: React.FC = () => {
  const { userProfile, setUserProfile } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
      setShowImageUploadModal(true);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !userProfile) return;

    setUploadingImage(true);
    setError("");

    try {
      const userRef = doc(db, "users", auth.currentUser?.uid || "");

      await updateDoc(userRef, {
        avatarUrl: selectedImage,
      });

      // Update local user profile
      setUserProfile({
        ...userProfile,
        avatarUrl: selectedImage,
      });

      setSuccess("Profile picture updated successfully!");

      setTimeout(() => {
        setShowImageUploadModal(false);
        setSelectedImage(null);
        setSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to update profile picture. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setError("No user is currently logged in");
        return;
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess("");
      }, 2000);
    } catch (error: any) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak");
      } else if (error.code === "auth/requires-recent-login") {
        setError(
          "Please log out and log in again before changing your password",
        );
      } else {
        setError("Failed to update password. Please try again.");
      }
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const closeImageUploadModal = () => {
    setShowImageUploadModal(false);
    setSelectedImage(null);
    setError("");
    setSuccess("");
  };

  if (!userProfile) {
    return (
      <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">View your account information</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>

          <div className="relative px-6 pb-6">
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white">
                    {getInitials(userProfile.name)}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
                  title="Change profile picture"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {userProfile.name}
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 mb-8 shadow-md">
              <div className="flex items-center justify-center space-x-4 text-white">
                <Flame className="w-12 h-12" />
                <div className="text-center">
                  <p className="text-4xl font-bold">{userProfile.streak}</p>
                  <p className="text-sm opacity-90">Day Streak</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Full Name
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {userProfile.name}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email Address
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {userProfile.email}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact Number
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {userProfile.contactNumber}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Member Since
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {userProfile.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Confirmation Modal */}
      {showImageUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Update Profile Picture
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {selectedImage && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Preview:</p>
                <div className="flex justify-center">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeImageUploadModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors duration-200"
                disabled={uploadingImage}
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Change Password
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
