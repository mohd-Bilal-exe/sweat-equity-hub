import useUserStore from '@/api/zustand';
import { toast } from 'react-toastify';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  onSnapshot,
  setDoc,
  arrayUnion,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fireApp, fireDatabase, fireStorage } from '..';
import { analytics } from '../analytics';

const auth = getAuth(fireApp);
const googleProvider = new GoogleAuthProvider();

export const firebaseServices = {
  // 🔐 AUTH
  async signUpWithEmail(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        full_name: user.displayName || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      };
      useUserStore.getState().addUser(userData);
      analytics.trackSignUp('email');
      toast.success('Account created successfully!');
      return userData;
    } catch (error) {
      toast.error('Failed to create account: ' + error.message);
      throw error;
    }
  },

  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        full_name: user.displayName || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      };
      const userDoc = await this.getUser(user.uid);

      analytics.trackLogin('email');
      toast.success('Signed in successfully!');
      userDoc && useUserStore.getState().addUser({ ...userData, ...userDoc });
      return { ...userData, ...userDoc };
    } catch (error) {
      toast.error('Failed to sign in: ' + error.message);
      throw error;
    }
  },

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        full_name: user.displayName,
        photoURL: user.photoURL,
      };
      const userDoc = await this.getUser(user.uid);
      userDoc && useUserStore.getState().addUser({ ...userData, ...userDoc });
      !userDoc && this.createUser(userData);
      analytics.trackLogin('google');
      toast.success('Signed in with Google successfully!');
      return { ...userData, ...userDoc };
    } catch (error) {
      toast.error('Failed to sign in with Google: ' + error.message);
      throw error;
    }
  },

  async signOutUser() {
    try {
      await signOut(auth);
      useUserStore.getState().removeUser();
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Failed to sign out: ' + error.message);
      throw error;
    }
  },

  listenToAuthChanges() {
    onAuthStateChanged(auth, user => {
      if (user) {
        useUserStore.getState().addUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          user_type: user.user_type,
        });
      } else {
        useUserStore.getState().removeUser();
      }
    });
  },

  // 👤 USERS
  async createUser(userData) {
    const userRef = doc(fireDatabase, 'users', userData.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, userData);
    }
    return userRef.id;
  },

  async getUser(userId, callback = null) {
    const userRef = doc(fireDatabase, 'users', userId);
    if (callback) {
      return onSnapshot(userRef, docSnap => {
        callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
      });
    } else {
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }
  },

  async updateUser(userId, updates) {
    try {
      await updateDoc(doc(fireDatabase, 'users', userId), updates);
      toast.success('Profile updated successfully!');
    } catch (error) {
      //console.error('Error updating user:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      await deleteDoc(doc(fireDatabase, 'users', userId));
    } catch (error) {
      //console.error('Error deleting user:', error);
      throw error;
    }
  },

  // 💼 JOBS
  async addJob(jobData) {
    try {
      const docRef = await addDoc(collection(fireDatabase, 'jobs'), jobData);

      const user = useUserStore.getState().user;
      if (user?.uid) {
        const userRef = doc(fireDatabase, 'users', user.uid);
        await updateDoc(docRef, { id: docRef.id, companyRef: userRef });
        const userJobs = user.jobs || [];
        await updateDoc(doc(fireDatabase, 'users', user.uid), { jobs: [...userJobs, docRef] });
      }
      analytics.trackJobPost();
      toast.success('Job posted successfully!');
      return docRef.id;
    } catch (error) {
      ////console.error('Error adding job:', error);
      toast.error('Failed to post job');
      throw error;
    }
  },

  async getJob(jobId, callback = null) {
    const jobRef = doc(fireDatabase, 'jobs', jobId);
    if (callback) {
      return onSnapshot(jobRef, docSnap => {
        callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
      });
    } else {
      const docSnap = await getDoc(jobRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }
  },
  async getDocument(docRef) {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  async updateJob(jobId, updates) {
    try {
      await updateDoc(doc(fireDatabase, 'jobs', jobId), updates);
      toast.success('Job updated successfully!');
    } catch (error) {
      //console.error('Error updating job:', error);
      toast.error('Failed to update job');
      throw error;
    }
  },

  async deleteJob(jobId) {
    try {
      // Get job data first to access applications
      const job = await this.getJob(jobId);
      if (!job) {
        toast.error('Job not found');
        return;
      }

      // Delete all applications for this job
      if (job.applications && job.applications.length > 0) {
        for (const appRef of job.applications) {
          const application = await this.getDocument(appRef);
          if (application) {
            // Remove application from applicant's applications array
            const applicant = await this.getUser(application.applicant_id);
            if (applicant?.applications) {
              const updatedApps = applicant.applications.filter(ref => ref.id !== appRef.id);
              await updateDoc(doc(fireDatabase, 'users', application.applicant_id), {
                applications: updatedApps,
              });
            }
            // Delete the application document
            await deleteDoc(appRef);
          }
        }
      }

      // Remove job from employer's jobs array
      const employer = await this.getUser(job.company_id);
      if (employer?.jobs) {
        const jobRef = doc(fireDatabase, 'jobs', jobId);
        const updatedJobs = employer.jobs.filter(ref => ref.id !== jobId);
        await updateDoc(doc(fireDatabase, 'users', job.company_id), {
          jobs: updatedJobs,
        });
      }

      // Delete the job document
      await deleteDoc(doc(fireDatabase, 'jobs', jobId));

      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
      throw error;
    }
  },

  // 📄 JOB APPLICATIONS
  async addJobApplication(applicationData) {
    try {
      const applicantRef = doc(fireDatabase, 'users', applicationData.applicant_id);
      const jobRef = doc(fireDatabase, 'jobs', applicationData.job_id);

      const appData = {
        ...applicationData,

        applicantRef,
        jobRef,
      };
      const docRef = await addDoc(collection(fireDatabase, 'jobApplications'), appData);
      // Update job with application reference
      const job = await this.getJob(applicationData.job_id);
      const jobApplications = job.applications || [];
      await updateDoc(doc(fireDatabase, 'jobs', applicationData.job_id), {
        applications: [...jobApplications, docRef],
      });

      // Update user with application reference
      const user = await this.getUser(applicationData.applicant_id);
      const userApplications = user.applications || [];
      await updateDoc(doc(fireDatabase, 'users', applicationData.applicant_id), {
        applications: [...userApplications, docRef],
      });

      // Update user store with new application
      const currentUser = useUserStore.getState().user;
      if (currentUser?.uid === applicationData.applicant_id) {
        useUserStore.getState().updateUser({
          applications: [...userApplications, docRef],
        });
      }

      analytics.trackJobApplication(applicationData.job_id, 'Job Application');
      toast.success('Application submitted successfully!');
      return docRef.id;
    } catch (error) {
      //console.error('Error adding job application:', error);
      toast.error('Failed to submit application');
      throw error;
    }
  },

  async getJobApplication(applicationId) {
    const docSnap = await getDoc(doc(fireDatabase, 'jobApplications', applicationId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async updateJobApplication(applicationId, updates) {
    await updateDoc(doc(fireDatabase, 'jobApplications', applicationId), updates);
  },

  async deleteJobApplication(applicationId) {
    await deleteDoc(doc(fireDatabase, 'jobApplications', applicationId));
  },

  // 📊 JOB LISTING
  async getAllJobs({ page = 1, startPage = null, endPage = null, filters = {}, callback = null }) {
    let jobsRef = collection(fireDatabase, 'jobs');
    let q = query(jobsRef, limit(10)); // Add filters/pagination logic here

    if (callback) {
      return onSnapshot(q, snapshot => {
        const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(jobs);
      });
    } else {
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  async getAllJobApplications({ jobId }) {
    const q = query(collection(fireDatabase, 'jobApplications'), where('jobId', '==', jobId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // 📁 STORAGE
  async uploadFile(file, path) {
    const storageRef = ref(fireStorage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  },
};
