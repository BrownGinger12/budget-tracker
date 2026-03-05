// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/types";
import { auth, db } from "../firebase/firebaseConfig";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    name: string,
    contactNumber: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  recordActivity: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to check if dates are consecutive days
  const isConsecutiveDay = (
    lastActivityDate: Date,
    currentDate: Date,
  ): boolean => {
    const lastDate = new Date(lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);

    const current = new Date(currentDate);
    current.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (current.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff === 1;
  };

  // Helper function to check if it's the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);

    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime();
  };

  // Helper function to check if streak should be reset (more than 1 day gap)
  const shouldResetStreak = (
    lastActivityDate: Date,
    currentDate: Date,
  ): boolean => {
    const lastDate = new Date(lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);

    const current = new Date(currentDate);
    current.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (current.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff > 1;
  };

  // Check and update streak on login/profile load
  const checkAndUpdateStreak = async (profile: UserProfile) => {
    if (!currentUser) return profile;

    const currentDate = new Date();
    const lastActivityDate = profile.lastActivityDate
      ? new Date(profile.lastActivityDate)
      : null;

    // If no last activity, this is first activity
    if (!lastActivityDate) {
      return profile;
    }

    // Check if we need to reset streak (more than 1 day gap)
    if (shouldResetStreak(lastActivityDate, currentDate)) {
      const updatedProfile = {
        ...profile,
        streak: 0,
      };

      // Update in Firestore
      await setDoc(doc(db, "users", currentUser.uid), updatedProfile, {
        merge: true,
      });

      return updatedProfile;
    }

    return profile;
  };

  // Record activity (call this when user performs actions like adding expense, setting budget)
  const recordActivity = async () => {
    if (!currentUser || !userProfile) return;

    const currentDate = new Date();
    const lastActivityDate = userProfile.lastActivityDate
      ? new Date(userProfile.lastActivityDate)
      : null;

    let newStreak = userProfile.streak || 0;

    if (!lastActivityDate) {
      // First activity ever
      newStreak = 1;
    } else if (isSameDay(lastActivityDate, currentDate)) {
      // Same day activity - don't change streak
      return;
    } else if (isConsecutiveDay(lastActivityDate, currentDate)) {
      // Consecutive day - increase streak
      newStreak = newStreak + 1;
    } else if (shouldResetStreak(lastActivityDate, currentDate)) {
      // Gap of more than 1 day - reset streak
      newStreak = 1;
    }

    const updatedProfile: Partial<UserProfile> = {
      streak: newStreak,
      lastActivityDate: currentDate,
    };

    // Update Firestore
    await setDoc(doc(db, "users", currentUser.uid), updatedProfile, {
      merge: true,
    });

    // Update local state
    setUserProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    contactNumber: string,
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      name,
      email,
      contactNumber,
      streak: 0,
      avatarUrl: null,
      createdAt: new Date(),
      lastActivityDate: null,
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, data, { merge: true });

    // Update local state
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          let profile = userDoc.data() as UserProfile;

          // Check and update streak on login
          profile = await checkAndUpdateStreak(profile);

          setUserProfile(profile);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    setUserProfile,
    recordActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
