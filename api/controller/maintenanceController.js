const mongoose = require('mongoose');
const UserLog = require('../model/UserLog');

const createBackup = async (req, res) => {
   try {
      console.log('Starting backup process...');
      const collections = mongoose.connection.collections;
      const backupData = {};

      // Create a new backup collection name with date and time
      const now = new Date();
      const dateTime = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: YYYY-MM-DDTHH-mm
      const backupCollectionName = `backup_${dateTime}`;

      // Create the new backup collection
      const backupCollection = await mongoose.connection.createCollection(backupCollectionName);

      for (const [name, collection] of Object.entries(collections)) {
         // Skip the userlogs collection
         if (name === 'userlogs') {
            console.log(`Skipping collection: ${name}`);
            continue;
         }

         console.log(`Backing up collection: ${name}`);
         const data = await collection.find({}).toArray();

         // Insert the data into the backup collection
         await backupCollection.insertOne({
            collectionName: name,
            data: data
         });

         backupData[name] = data.length; // Just store the count for the response
      }

      // Log the backup action
      await UserLog.create({
         user: req.user ? req.user.username : 'System',
         action: 'Created Backup',
         details: `Backup created: ${backupCollectionName}`,
      });

      console.log('Backup completed successfully');
      res.json({
         success: true,
         backupCollectionName: backupCollectionName,
         collectionsCounts: backupData
      });
   } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ success: false, error: error.message, stack: error.stack });
   }
};

const listBackups = async (req, res) => {
   try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const backups = collections
         .filter(col => col.name.startsWith('backup_'))
         .map(col => col.name);

      res.json({ success: true, backups });
   } catch (error) {
      console.error('List backups error:', error);
      res.status(500).json({ success: false, error: error.message });
   }
};

const restoreBackup = async (req, res) => {
   try {
      const { backupName } = req.body;
      if (!backupName) {
         return res.status(400).json({ success: false, error: 'Backup name is required' });
      }

      const backupCollection = mongoose.connection.collection(backupName);
      const backupData = await backupCollection.find({}).toArray();

      for (const backup of backupData) {
         const { collectionName, data } = backup;

         // Skip restoring the userlogs collection
         if (collectionName === 'userlogs') {
            console.log(`Skipping restoration of collection: ${collectionName}`);
            continue;
         }

         const collection = mongoose.connection.collection(collectionName);

         // Clear existing data
         await collection.deleteMany({});

         // Insert backup data
         if (data.length > 0) {
            await collection.insertMany(data);
         }

         console.log(`Restored collection: ${collectionName}`);
      }

      // Log the restore action
      await UserLog.create({
         user: req.user ? req.user.username : 'System',
         action: 'Restored Backup',
         details: `Restored from backup: ${backupName}`,
      });

      res.json({ success: true, message: 'Backup restored successfully' });
   } catch (error) {
      console.error('Restore backup error:', error);
      res.status(500).json({ success: false, error: error.message });
   }
};

const getUserLogs = async (req, res) => {
   try {
      const logs = await UserLog.find().sort({ timestamp: -1 }).limit(100);
      res.json({ success: true, logs });
   } catch (error) {
      console.error('Error fetching user logs:', error);
      res.status(500).json({ success: false, error: error.message });
   }
};

module.exports = {
   listBackups,
   createBackup,
   restoreBackup,
   getUserLogs,
};