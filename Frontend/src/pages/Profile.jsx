import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { FiSave, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const Profile = () => {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();

  // Edit profile state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName]   = useState(user?.lastName  || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Avatar initials
  const initials = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase();

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return toast.error('Name fields are required');

    try {
      setProfileLoading(true);
      const response = await API.put('/user/profile', { firstName, lastName });
      // Update AuthContext so navbar/sidebar reflect new name instantly
      login(response.data.user, token);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.error('All password fields are required');
    if (newPassword !== confirmPassword)
      return toast.error('New passwords do not match');
    if (newPassword.length < 6)
      return toast.error('New password must be at least 6 characters');

    try {
      setPasswordLoading(true);
      await API.put('/user/password', { oldPassword, newPassword });
      toast.success('Password changed!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      {/* Top bar */}
      <div className="h-14 border-b border-light-border dark:border-dark-border flex items-center justify-between px-6">
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 text-light-subtext dark:text-dark-subtext hover:text-primary transition text-sm"
        >
          <IoMdArrowBack size={18} />
          Back to Chat
        </button>
        <ThemeToggle />
      </div>

      {/* Page content */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Avatar + name header */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold select-none">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-light-subtext dark:text-dark-subtext text-sm mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Edit Profile card */}
        <div className="bg-light-sidebar dark:bg-dark-sidebar rounded-2xl border border-light-border dark:border-dark-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiUser size={18} className="text-primary" />
            <h2 className="text-light-text dark:text-dark-text font-semibold">Edit Profile</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-light-subtext dark:text-dark-subtext text-xs font-medium uppercase tracking-wide">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-light-text dark:text-dark-text text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-light-subtext dark:text-dark-subtext text-xs font-medium uppercase tracking-wide">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-light-text dark:text-dark-text text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-light-subtext dark:text-dark-subtext text-xs font-medium uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-light-subtext dark:text-dark-subtext text-sm opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:opacity-50"
              >
                <FiSave size={15} />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password card */}
        <div className="bg-light-sidebar dark:bg-dark-sidebar rounded-2xl border border-light-border dark:border-dark-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiLock size={18} className="text-primary" />
            <h2 className="text-light-text dark:text-dark-text font-semibold">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-light-subtext dark:text-dark-subtext text-xs font-medium uppercase tracking-wide">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-light-subtext dark:text-dark-subtext text-xs font-medium uppercase tracking-wide">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-light-subtext dark:text-dark-subtext text-xs font-medium uppercase tracking-wide">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:opacity-50"
              >
                <FiLock size={15} />
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;