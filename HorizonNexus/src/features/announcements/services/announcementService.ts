import type { Announcement } from '../../../types';

// This is a mock function. Replace this with your actual Firestore query.
// Example Firestore query would look something like:
//
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { db } from '../../../config/firebase';
//
// export const getAnnouncements = async (): Promise<Announcement[]> => {
//   const announcementsCol = collection(db, 'announcements');
//   const q = query(announcementsCol, orderBy('createdAt', 'desc'));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
// };

export const getAnnouncements = async (): Promise<Announcement[]> => {
  console.log("Fetching announcements...");
  // Returning mock data for demonstration purposes
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Welcome to HorizonNexus!',
          content: 'This is the first announcement. The platform is now live.',
          author: 'Admin',
          createdAt: new Date('2025-10-21T09:00:00Z'),
        },
        {
          id: '2',
          title: 'Mid-Term Exam Schedule',
          content: 'The mid-term exam schedule has been posted in the resources section.',
          author: 'Admin',
          createdAt: new Date('2025-10-22T11:30:00Z'),
        },
      ]);
    }, 500); // Simulate network delay
  });
};