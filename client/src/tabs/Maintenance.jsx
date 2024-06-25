import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Maintenance = () => {
   const [backups, setBackups] = useState([]);
   const [selectedBackup, setSelectedBackup] = useState(null);
   const [userLogs, setUserLogs] = useState([]);

   useEffect(() => {
      fetchUserLogs();
      fetchBackups();
   }, []);

   const fetchUserLogs = async () => {
      try {
         const response = await axios.get(`${API_BASE_URL}/maintenance/userlogs`);
         setUserLogs(response.data.logs);
      } catch (error) {
         console.error('Error fetching user logs:', error);
      }
   };

   const fetchBackups = async () => {
      try {
         const response = await axios.get(`${API_BASE_URL}/maintenance/backups`);
         setBackups(response.data.backups);
      } catch (error) {
         console.error('Error fetching backups:', error);
      }
   };

   const handleBackup = async () => {
      try {
         const response = await axios.post(`${API_BASE_URL}/maintenance/backup`);
         alert(`Backup created: ${response.data.backupCollectionName}`);
         fetchBackups();
         fetchUserLogs();
      } catch (error) {
         console.error('Error creating backup:', error);
         alert('Error creating backup');
      }
   };

   const handleRestore = async () => {
      if (!selectedBackup) {
         alert('No backup selected');
         return;
      }

      try {
         await axios.post(`${API_BASE_URL}/maintenance/restore`, { backupName: selectedBackup });
         alert('Backup restored successfully');
         fetchUserLogs();
      } catch (error) {
         console.error('Error restoring backup:', error);
         alert('Error restoring backup');
      }
   };

   return (
      <div>
         <h1 className="text-lg font-bold">Backup and Restore System</h1>
         <div className="grid md:grid-cols-3 gap-6 bg-white text-center font-medium rounded-md mt-2 p-6 shadow-md">
            <div className="bg-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
               <h1>Backup Collections</h1>
               <div className="text-gray-600">
                  <select
                     className="mt-3 p-2 w-full outline-none rounded-md text-sm"
                     onChange={(e) => setSelectedBackup(e.target.value)}
                     value={selectedBackup || ''}
                  >
                     <option value="">Select a backup</option>
                     {backups.map((backup) => (
                        <option key={backup} value={backup}>{backup}</option>
                     ))}
                  </select>
               </div>
            </div>
            <div className="bg-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
               <h1>Create New Backup</h1>
               <button className="bg-gray-600 px-4 py-1 text-sm rounded-md text-white mt-2" onClick={handleBackup}>Create Backup</button>
            </div>
            <div className="bg-gray-300 rounded-md p-4">
               <h1>Restore</h1>
               <div className="text-gray-600">
                  <h1 className="my-2">{selectedBackup || 'No backup selected'}</h1>
               </div>
               <button className="bg-gray-600 px-4 py-1 text-sm rounded-md text-white mt-2" onClick={handleRestore}>Restore</button>
            </div>
         </div>
         <h1 className="text-lg font-bold mt-4">User Logs</h1>
         <div className="bg-white rounded-md shadow-md mt-2 p-4 overflow-auto h-[calc(100vh-390px)]">
            <ul className="list-disc pl-5">
               {userLogs.map((log, index) => (
                  <li key={index} className="mb-2">
                     <span className="font-semibold">{new Date(log.timestamp).toLocaleString()}</span> -
                     <span className="ml-2">Admin</span>
                     <span className="ml-2 font-medium">{log.action}</span>
                     {log.details && <span className="ml-2 text-gray-600">({log.details})</span>}
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default Maintenance;