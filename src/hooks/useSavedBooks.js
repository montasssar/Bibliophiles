// src/hooks/useSavedBooks.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

const useSavedBooks = (currentUser) => {
  const [savedBookIds, setSavedBookIds] = useState([]);

  const fetchSavedBooks = async () => {
    if (!currentUser) return;
    const ref = collection(db, 'users', currentUser.uid, 'savedBooks');
    const snapshot = await getDocs(ref);
    setSavedBookIds(snapshot.docs.map(doc => doc.id));
  };

  useEffect(() => {
    fetchSavedBooks();
  }, [currentUser]);

  const isBookSaved = (id) => savedBookIds.includes(id);

  const toggleSaveBook = async (book) => {
    if (!currentUser) return alert('Please sign in to save books.');

    const bookRef = doc(db, 'users', currentUser.uid, 'savedBooks', book.id);

    if (isBookSaved(book.id)) {
      await deleteDoc(bookRef);
      setSavedBookIds((prev) => prev.filter((id) => id !== book.id));
    } else {
      await setDoc(bookRef, {
        id: book.id,
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        previewLink: book.volumeInfo.previewLink,
      });
      setSavedBookIds((prev) => [...prev, book.id]);
    }
  };

  return { savedBookIds, isBookSaved, toggleSaveBook };
};

export default useSavedBooks;
