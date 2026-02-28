import { useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  writeBatch, 
  serverTimestamp, 
  query, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db, APP_ID, PUBLIC_COLLECTION } from '../services/firebase';
import { useDataStore, PaymentData } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';

export const useData = () => {
  const { dataList, isLoading, errorMsg, setDataList, setLoading, setErrorMsg } = useDataStore();
  const { user } = useAuthStore();

  const getCollectionRef = () => {
    return collection(db, 'artifacts', APP_ID, 'public', 'data', PUBLIC_COLLECTION);
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(getCollectionRef(), orderBy('houseNumber'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: PaymentData[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...(doc.data() as Omit<PaymentData, 'id'>) });
      });
      setDataList(data);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot Error:", error);
      setErrorMsg(`資料讀取失敗: ${error.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, setDataList, setLoading, setErrorMsg]);

  const submitPayment = async (houseNumber: number, opinion: string) => {
    if (!user) throw new Error("尚未登入");
    
    const docId = `house_${houseNumber}`;
    const docRef = doc(getCollectionRef(), docId);

    await setDoc(docRef, {
      houseNumber,
      opinion,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid
    });
  };

  const clearAllData = async () => {
    const q = getCollectionRef();
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  };

  const deleteRows = async (ids: string[]) => {
    const batch = writeBatch(db);
    ids.forEach(id => {
      const docRef = doc(getCollectionRef(), id);
      batch.delete(docRef);
    });
    await batch.commit();
  };

  return { dataList, isLoading, errorMsg, submitPayment, clearAllData, deleteRows };
};
