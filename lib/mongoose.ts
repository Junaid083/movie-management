import mongoose from "mongoose"

let isConnected = false

export const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
  }

  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
  }
}

