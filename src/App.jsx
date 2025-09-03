import './App.css';
import Pages from '@/pages/index.jsx';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { firebaseServices } from './api/firebase/services';
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
  }, [user?.uid]);
  return (
    <>
      <Pages />
      <Toaster />
    </>
  );
}

export default App;
