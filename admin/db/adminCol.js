import mongoDb, { MongoClient } from 'mongodb'
const adminData=async()=>{
    try {
      const client = await  MongoClient.connect(process.env.MONGODB_ADDRES)
        const db= client.db("test")
        const admin = db.collection("admin") 
         


        
    } catch (error) {
        
    }
}