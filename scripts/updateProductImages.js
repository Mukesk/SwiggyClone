import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Item model definition
const itemSchema = new mongoose.Schema({
  itemname: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
  hotelName: {
    type: String
  },
  hotelCity: {
    type: String
  },
  category: {
    type: String
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// High-quality food image URLs from Unsplash
const foodImagesByCategory = {
  'Biryani': [
    'https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ],
  'Pizza': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ],
  'Burger': [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1553979459-d2229ba7433a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ],
  'Non-Veg': [
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ],
  'Veg': [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ],
  'Beverage': [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ],
  'Bakery': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  ]
};

// Function to get random image for category
const getRandomImageForCategory = (category, index) => {
  const categoryImages = foodImagesByCategory[category] || foodImagesByCategory['Veg'];
  return categoryImages[index % categoryImages.length];
};

// Main function to update images
const updateProductImages = async () => {
  try {
    console.log('🚀 Starting product image updates...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biteme', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all items
    const items = await Item.find({});
    console.log(`📦 Found ${items.length} products to update`);

    if (items.length === 0) {
      console.log('No products found to update.');
      return;
    }

    let updatedCount = 0;
    
    // Update each item with a proper image
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Get new image URL based on category and index
      const newImageUrl = getRandomImageForCategory(item.category, i);
      
      // Update the item
      await Item.findByIdAndUpdate(item._id, {
        img: newImageUrl
      });
      
      updatedCount++;
      console.log(`✅ Updated ${updatedCount}/${items.length}: ${item.itemname} (${item.category})`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with high-quality images!`);
    
    // Show summary by category
    const categories = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Updated products by category:');
    categories.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} items`);
    });
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
};

// Run the script
updateProductImages();