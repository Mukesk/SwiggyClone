import mongoose from 'mongoose';
import User from '../model/user_model.js';
import Item from '../model/item_model.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS);
        console.log('Connected to MongoDB for initialization');

        // Create indexes for better query performance
        console.log('Creating database indexes...');

        // User collection indexes
        await User.collection.createIndex({ username: 1 }, { unique: true });
        await User.collection.createIndex({ phoneno: 1 });
        await User.collection.createIndex({ 'address.city': 1 });
        console.log('User indexes created');

        // Item collection indexes
        await Item.collection.createIndex({ itemname: 1 });
        await Item.collection.createIndex({ category: 1 });
        await Item.collection.createIndex({ hotelName: 1 });
        await Item.collection.createIndex({ hotelCity: 1 });
        await Item.collection.createIndex({ price: 1 });
        await Item.collection.createIndex({ rating: -1 }); // Descending for better sorting
        await Item.collection.createIndex({ 
            itemname: 'text', 
            description: 'text', 
            hotelName: 'text' 
        }, { 
            name: 'item_search_index' 
        });
        console.log('Item indexes created');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    initializeDatabase();
}

export default initializeDatabase;