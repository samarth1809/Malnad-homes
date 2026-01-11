
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, storage } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UpdateProfileParams {
  name?: string;
  firstName?: string;
  lastName?: string;
  contact?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  address?: string;
  avatar?: string;
  photoFile?: File | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string, photoFile?: File | null) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UpdateProfileParams) => Promise<void>;
  updatePassword: (oldPw: string, newPw: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load metadata from local storage for high-fidelity user details
  const getUserMeta = (uid: string) => {
    const meta = localStorage.getItem(`malnad_user_meta_${uid}`);
    return meta ? JSON.parse(meta) : {};
  };

  const saveUserMeta = (uid: string, meta: any) => {
    localStorage.setItem(`malnad_user_meta_${uid}`, JSON.stringify(meta));
  };

  // Map Firebase User to App User with extended metadata
  const mapUser = (fbUser: FirebaseUser): User => {
    const meta = getUserMeta(fbUser.uid);
    return {
      id: fbUser.uid,
      name: fbUser.displayName || meta.name || 'User',
      firstName: meta.firstName || fbUser.displayName?.split(' ')[0] || '',
      lastName: meta.lastName || fbUser.displayName?.split(' ').slice(1).join(' ') || '',
      contact: meta.contact || '',
      gender: meta.gender || undefined,
      dob: meta.dob || '',
      address: meta.address || '',
      email: fbUser.email || '',
      role: 'user', // Default role
      avatar: fbUser.photoURL || undefined,
      settings: {
        language: 'en',
        theme: 'dark',
        notifications: true
      }
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      // Only set user if email is verified (or if it's a provider like Google)
      if (fbUser && (fbUser.emailVerified || fbUser.providerData[0]?.providerId === 'google.com')) {
        setUser(mapUser(fbUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified && userCredential.user.providerData[0]?.providerId === 'password') {
        // Resend verification email if not verified
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        throw new Error("Email not verified");
      }
      
    } catch (error: any) {
      if (error.message === "Email not verified") {
        throw error;
      }
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        throw new Error("Password or Email Incorrect");
      }
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error("Sign in cancelled");
      }
      throw new Error("Failed to sign in with Google");
    }
  };

  const signup = async (name: string, email: string, password: string, photoFile?: File | null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      let photoURL = "";

      // Upload Profile Photo if provided
      if (photoFile) {
        try {
          const storageRef = ref(storage, `avatars/${userCredential.user.uid}/${photoFile.name}`);
          await uploadBytes(storageRef, photoFile);
          photoURL = await getDownloadURL(storageRef);
        } catch (storageError) {
          console.error("Failed to upload profile photo:", storageError);
          photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`;
        }
      } else {
         photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`;
      }

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL
      });

      // Initialize metadata
      saveUserMeta(userCredential.user.uid, {
        name,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ')
      });

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error("User already exists. Sign in?");
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error("No user found with this email address.");
      }
      throw error;
    }
  };

  const updateProfileData = async (data: UpdateProfileParams) => {
    if (!auth.currentUser) return;
    
    let photoURL = data.avatar || auth.currentUser.photoURL || "";

    if (data.photoFile) {
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${Date.now()}_${data.photoFile.name}`);
      await uploadBytes(storageRef, data.photoFile);
      photoURL = await getDownloadURL(storageRef);
    }

    const newDisplayName = data.name || (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : auth.currentUser.displayName);

    await updateProfile(auth.currentUser, {
      displayName: newDisplayName,
      photoURL: photoURL
    });

    // Update metadata in local storage
    const currentMeta = getUserMeta(auth.currentUser.uid);
    const newMeta = {
      ...currentMeta,
      name: newDisplayName,
      firstName: data.firstName || currentMeta.firstName,
      lastName: data.lastName || currentMeta.lastName,
      contact: data.contact || currentMeta.contact,
      gender: data.gender || currentMeta.gender,
      dob: data.dob || currentMeta.dob,
      address: data.address || currentMeta.address,
    };
    saveUserMeta(auth.currentUser.uid, newMeta);
    
    if (user) {
        setUser({ 
          ...user, 
          ...newMeta,
          avatar: photoURL 
        });
    }
  };

  const updateUserPassword = async (oldPw: string, newPw: string) => {
     console.log("Password update requested - requires re-auth flow implementation");
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      loginWithGoogle,
      signup, 
      logout, 
      resetPassword,
      updateProfile: updateProfileData, 
      updatePassword: updateUserPassword 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
