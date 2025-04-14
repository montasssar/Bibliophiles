import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from 'firebase/firestore';

const useSavedBooks = (currentUser) => {
  const [savedBookIds, setSavedBookIds] = useState([]);

  // Fetch all saved book IDs for the logged-in user
  const fetchSavedBooks = async () => {
    if (!currentUser) return;

    try {
      const ref = collection(db, 'users', currentUser.uid, 'savedBooks');
      const snapshot = await getDocs(ref);
      const ids = snapshot.docs.map((doc) => doc.id);
      setSavedBookIds(ids);
    } catch (error) {
      console.error('Failed to fetch saved books:', error);
    }
  };

  useEffect(() => {
    fetchSavedBooks();
  }, [currentUser]);

  // Check if a book is currently saved
  const isBookSaved = (id) => savedBookIds.includes(id);

  // Save or unsave a book based on its current state
  const toggleSaveBook = async (book) => {
    if (!currentUser || !book?.id) return;

    const bookRef = doc(db, 'users', currentUser.uid, 'savedBooks', book.id);

    const title = book.title || book.volumeInfo?.title || 'Untitled';
    const image = book.thumbnail || book.volumeInfo?.imageLinks?.thumbnail || '';
    const previewLink = book.previewLink || book.volumeInfo?.previewLink || '';

    try {
      if (isBookSaved(book.id)) {
        await deleteDoc(bookRef);
        setSavedBookIds((prev) => prev.filter((id) => id !== book.id));
      } else {
        await setDoc(bookRef, {
          id: book.id,
          title,
          image,
          previewLink,
        });
        setSavedBookIds((prev) => [...prev, book.id]);
      }
    } catch (error) {
      console.error('Failed to toggle book save state:', error);
    }
  };

  return {
    savedBookIds,
    isBookSaved,
    toggleSaveBook,
  };
};

export default useSavedBooks;
