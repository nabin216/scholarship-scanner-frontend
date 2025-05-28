// "use client";

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../Authentication/context/AuthContext';
// import Link from 'next/link';

// interface Scholarship {
//   id: number;
//   title: string;
//   provider: string;
//   amount: number;
//   deadline: string;
// }

// interface SavedScholarship {
//   id: number;
//   scholarship: Scholarship;
//   date_saved: string;
// }

// const UserDashboard = () => {
//   const { user } = useAuth();
//   const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
//   const [recentApplications, setRecentApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) return;
        
//         // Fetch saved scholarships
//         const savedResponse = await fetch('http://localhost:8000/api/user/saved-scholarships/', {
//           headers: {
//             'Authorization': `Token ${token}`,
//           }
//         });
        
//         if (savedResponse.ok) {
//           const savedData = await savedResponse.json();
//           setSavedScholarships(savedData);
//         }
        
//         // Fetch recent applications
//         // This would be implemented when the backend endpoint is available
        
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load user data');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchUserData();
//   }, []);
  
//   // Sample data for visual display
//   const sampleSavedScholarships = [
//     {
//       id: 1,
//       scholarship: {
//         id: 101,
//         title: "Merit Scholarship",
//         provider: "Global Education Fund",
//         amount: 5000,
//         deadline: "2025-06-30"
//       },
//       date_saved: "2025-05-10"
//     },
//     {
//       id: 2,
//       scholarship: {
//         id: 102,
//         title: "STEM Excellence Award",
//         provider: "Tech Innovators Foundation",
//         amount: 7500,
//         deadline: "2025-07-15"
//       },
//       date_saved: "2025-05-15"
//     },
//     {
//       id: 3,
//       scholarship: {
//         id: 103,
//         title: "Future Leaders Scholarship",
//         provider: "Leadership Academy",
//         amount: 3000,
//         deadline: "2025-08-01"
//       },
//       date_saved: "2025-05-20"
//     }
//   ];
  
//   const deadlineSoon = sampleSavedScholarships.filter(item => {
//     const deadline = new Date(item.scholarship.deadline);
//     const today = new Date();
//     const diffTime = deadline.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= 30 && diffDays > 0;
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      
//       {error && (
//         <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       )}
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-blue-50 p-6 rounded-lg">
//           <h3 className="text-lg font-medium text-blue-800 mb-2">Saved Scholarships</h3>
//           <div className="text-3xl font-bold text-blue-600">{sampleSavedScholarships.length}</div>
//           <p className="mt-2 text-sm text-blue-700">Scholarships you've saved for later</p>
//         </div>
        
//         <div className="bg-green-50 p-6 rounded-lg">
//           <h3 className="text-lg font-medium text-green-800 mb-2">Applications</h3>
//           <div className="text-3xl font-bold text-green-600">3</div>
//           <p className="mt-2 text-sm text-green-700">Scholarships you've applied for</p>
//         </div>
//       </div>
      
//       <div className="mb-8">
//         <h3 className="text-lg font-medium text-gray-800 mb-4">Upcoming Deadlines</h3>
        
//         {deadlineSoon.length > 0 ? (
//           <div className="space-y-4">
//             {deadlineSoon.map((item) => (
//               <div key={item.id} className="flex items-center border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
//                 <div className="flex-1">
//                   <p className="font-medium text-yellow-800">{item.scholarship.title}</p>
//                   <p className="text-sm text-yellow-600">
//                     Deadline: {new Date(item.scholarship.deadline).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <Link 
//                   href={`/scholarships/scholarshipdetails?id=${item.scholarship.id}`}
//                   className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
//                 >
//                   View
//                 </Link>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No upcoming deadlines within 30 days.</p>
//         )}
//       </div>
      
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium text-gray-800">Recently Saved</h3>
//           <Link
//             href="/profile?tab=saved"
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             View all
//           </Link>
//         </div>
        
//         <div className="space-y-3">
//           {sampleSavedScholarships.slice(0, 3).map((item) => (
//             <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//               <Link href={`/scholarships/scholarshipdetails?id=${item.scholarship.id}`}>
//                 <h4 className="font-medium text-gray-800 mb-1">{item.scholarship.title}</h4>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {item.scholarship.provider} · ${item.scholarship.amount}
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-500">
//                     Saved on {new Date(item.date_saved).toLocaleDateString()}
//                   </span>
//                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                     Deadline: {new Date(item.scholarship.deadline).toLocaleDateString()}
//                   </span>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="text-center">
//         <Link
//           href="/scholarships/search"
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Find More Scholarships
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
