
// // Server-side (Express)
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors"); // Add CORS middleware
// const jwt=require('jsonwebtoken');
// const bcrypt=require("bcryptjs");
// // Enable CORS
// app.use(cors());
// app.use(express.json());

// const mongoUrl = "mongodb+srv://asia123aq:admin@cluster0.x5kst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const JWT_SECRET="hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]pou89ywe";

// // Improved MongoDB connection with retry logic
// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
//     });
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     // Retry connection after 5 seconds
//     setTimeout(connectDB, 5000);
//   }
// };

// connectDB();
// require('../UserDetails')
// const User=mongoose.model("UserInfo");
// // 

// // Add connection test endpoint
// app.get("/test", (req, res) => {
//   console.log("Test endpoint hit");

//   res.status(200).json({ status: "Server is running" });
// });

// // Updated registration endpoint with better error handling
// app.post('/Register', async (req, res) => {
//   try {
//     console.log('Request body:', req.body);
//     const { name, id, email, phone, password, confirmPassword } = req.body;

//     if (!name || !id || !email || !phone || !password || !confirmPassword) {
//       return res.status(400).json({ status: "error", message: "All fields are required" });
//     }

//     const oldUser = await User.findOne({ id: id });
//     if (oldUser) {
//       return res.status(409).json({ status: "error", message: "User already exists!" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       id,
//       email,
//       phone,
//       password: hashedPassword,
//       confirmPassword
//     });

//     res.status(201).json({ status: "success", message: "User created successfully" });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ status: "error", message: "Server error" });
//   }
// });



// app.post('/login-user', async(req, res) => {
//   try {
//     const {id, password} = req.body;
//     console.log("Login attempt for ID:", id);
    
//     const user = await User.findOne({id: id});
//     console.log("User found in DB:", user ? "Yes" : "No");
    
//     if (!user) {
//       console.log("User not found in database");
//       return res.status(404).json({
//         status: "error",
//         message: "משתמש לא קיים במערכת"
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log("Password valid:", isPasswordValid);

//     if (isPasswordValid) {
//       const token = jwt.sign({id: user.id}, JWT_SECRET);
//       return res.status(200).json({
//         status: "ok",
//         data: token,
//         message: "התחברת בהצלחה"
//       });
//     } else {
//       console.log("Invalid password for user:", id);
//       return res.status(401).json({
//         status: "error",
//         message: "סיסמה שגויה"
//       });
//     }
//     // if (isPasswordValid) {
//     //   const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: '24h' });
//     //   return res.status(200).json({
//     //     status: "ok",
//     //     data: token,
//     //     user: {
//     //       id: user.id,
//     //       name: user.name,
//     //       email: user.email
//     //     },
//     //     message: "התחברת בהצלחה"
//     //   });
//     // } else {
//     //   return res.status(401).json({
//     //     status: "error",
//     //     message: "סיסמה שגויה"
//     //   });
//     // }
//   } catch (error) {
//     console.error("Server error during login:", error);
//     return res.status(500).json({
//       status: "error",
//       message: "שגיאת שרת"
//     });
//   }
// });

// // Add these routes to your existing server.js

// // // Middleware to verify JWT token
// // const verifyToken = (req, res, next) => {
// //   const token = req.headers.authorization?.split(' ')[1];
  
// //   if (!token) {
// //     return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, JWT_SECRET);
// //     req.userId = decoded.id;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({ status: "error", message: "טוקן לא תקין" });
// //   }
// // };
// const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       return res.status(401).json({ 
//         status: "error", 
//         message: "לא נמצא טוקן" 
//       });
//     }

//     const token = authHeader.split(' ')[1];
//     console.log("Received token:", token); // לבדיקה
    
//     if (!token) {
//       return res.status(401).json({ 
//         status: "error", 
//         message: "פורמט טוקן לא תקין" 
//       });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     console.log("Decoded token:", decoded); // לבדיקה
    
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return res.status(401).json({ 
//       status: "error", 
//       message: "טוקן לא תקין" 
//     });
//   }
// };

// // Get user profile
// app.get('/api/profile/:id', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findOne({ id: req.params.id });
//     if (!user) {
//       return res.status(404).json({ status: "error", message: "משתמש לא נמצא" });
//     }
    
//     res.json({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       id: user.id
//     });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: "שגיאת שרת" });
//   }
// });

// // Update user profile
// app.put('/api/profile/:id', verifyToken, async (req, res) => {
//   try {
//     const { email, phone } = req.body;
    
//     const user = await User.findOneAndUpdate(
//       { id: req.params.id },
//       { email, phone },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ status: "error", message: "משתמש לא נמצא" });
//     }

//     res.json({
//       status: "success",
//       user: {
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         id: user.id
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: "שגיאת שרת" });
//   }
// });

// // Change password
// app.put('/api/profile/:id/change-password', verifyToken, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const user = await User.findOne({ id: req.params.id });

//     if (!user) {
//       return res.status(404).json({ status: "error", message: "משתמש לא נמצא" });
//     }

//     const isValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isValid) {
//       return res.status(401).json({ status: "error", message: "סיסמה נוכחית שגויה" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.json({ status: "success", message: "הסיסמה שונתה בהצלחה" });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: "שגיאת שרת" });
//   }
// });




// app.use(cors({
//   origin: '*',  // בפיתוח בלבד! בproduction צריך להגדיר את הדומיין הספציפי
//   methods: ['GET', 'POST']
// }));
// app.listen(5001, () => {
//   console.log("Server running on port 5001");
// });

//////////////////////////////////////////////////////////


// Server-side (Express)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// Enable CORS
app.use(cors());
app.use(express.json());

const mongoUrl = "mongodb+srv://asia123aq:admin@cluster0.x5kst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET="hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]pou89ywe";


// MongoDB connection
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log("Database connected successfully");
}).catch((error) => {
  console.error("Database connection failed:", error);
});

require('../UserDetails'); // Import your User model
const User = mongoose.model("UserInfo");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ status: "error", message: "No token provided" });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Invalid token" });
  }
};

// Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, id, email, phone, password } = req.body;
    if (await User.findOne({ id })) return res.status(409).json({ status: "error", message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, id, email, phone, password: hashedPassword });
    res.status(201).json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Login Endpoint
app.post('/login-user', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ status: "error", message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.status(200).json({ status: "success", data: token });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Get User Profile
app.get('/api/profile/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    res.json({ name: user.name, email: user.email, phone: user.phone, id: user.id });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Update User Profile
app.put('/api/profile/:id', verifyToken, async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOneAndUpdate({ id: req.params.id }, { email, phone }, { new: true });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    res.json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Change Password
app.put('/api/profile/:id/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ status: "error", message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
