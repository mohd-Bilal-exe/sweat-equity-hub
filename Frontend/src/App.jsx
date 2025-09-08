import './App.css';
import Pages from '@/pages/index.jsx';
import { Toaster } from '@/components/ui/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { firebaseServices } from './api/firebase/services';
import { analytics } from './api/firebase/analytics';
import useUserStore from './api/zustand';

function App() {
  const { user, updateUser } = useUserStore();

  useEffect(() => {
    firebaseServices.listenToAuthChanges();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    
    let unsubscribe;
    firebaseServices.getUser(user.uid, userData => {
      updateUser(userData);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid, updateUser]);
  return (
    <>
      <Pages />
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
