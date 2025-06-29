// //userServer.js 
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());

// const jwt_secret = "ejrbhjlsbsihgbrwhgsbdbgf";

// mongoose.connect('mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // // Updated User Schema
// // const userSchema = new mongoose.Schema({
// //   idNumber: { 
// //     type: String, 
// //     required: true, 
// //     unique: true,
// //     validate: {
// //       validator: function(v) {
// //         return /^\d{9}$/.test(v); // Validates Israeli ID number format
// //       },
// //       message: 'מספר זהות חייב להכיל 9 ספרות'
// //     }
// //   },
// //   firstName: { type: String, required: true },
// //   lastName: { type: String, required: true },
// //   email: { 
// //     type: String, 
// //     required: true, 
// //     unique: true,
// //     validate: {
// //       validator: function(v) {
// //         return /\S+@\S+\.\S+/.test(v);
// //       },
// //       message: 'כתובת אימייל לא תקינה'
// //     }
// //   },
// //   phoneNumber: { 
// //     type: String, 
// //     required: true, 
// //     unique: true,
// //     validate: {
// //       validator: function(v) {
// //         return /^05\d{8}$/.test(v); // Israeli mobile phone format
// //       },
// //       message: 'מספר טלפון לא תקין'
// //     }
// //   },
// //   role: { type: String, enum: ['manager', 'employee'], required: true },
// //   categories: {
// //     type: [String],
// //     enum: ['Infrastructure', 'Lighting', 'Noise', 'Cleaning'],
// //     default: [],
// //     validate: {
// //       validator: function(categories) {
// //         // אם זה עובד - חייב להיות לפחות קטגוריה אחת
// //         if (this.role === 'employee') {
// //           return categories && categories.length > 0;
// //         }
// //         return true; // למנהלים מותר מערך ריק
// //       },
// //       message: 'Employee must have at least one assigned category'
// //     }
// //   },
// //   password: { type: String, required: true }
// // });
// const userSchema = new mongoose.Schema({
//   idNumber: { type: String, required: true, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phoneNumber: { type: String, required: true, unique: true },
//   role: { type: String, enum: ['manager', 'employee'], required: true },
//   categories: {
//     type: [String],
//     enum: ['תשתית', 'חשמל', 'רעש', 'נקיון','מים וביוב'],
//     default: [],
//     required: function() { return this.role === 'employee'; }
//   },
//   password: { type: String, required: true }
// });

// // הוסף וולידציה נוספת לפני השמירה
// userSchema.pre('save', function(next) {
//   if (this.role === 'employee' && (!this.categories || this.categories.length === 0)) {
//     const err = new Error('Employee must have at least one category');
//     err.name = 'ValidationError';
//     return next(err);
//   }
//   next();
// });
// const User = mongoose.model('User', userSchema);


// app.post('/api/register', async (req, res) => {
//   try {
//     const { idNumber, firstName, lastName, email, phoneNumber, role, password, categories } = req.body;
//     console.log('Received data:', req.body)
    
//     // בדיקת חובה לקטגוריות לעובדים
//     if (role === 'employee' && (!categories || categories.length === 0)) {
//       return res.status(400).json({ 
//         error: 'Employees must have at least one assigned category' 
//       });
//     }
    
//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [
//         { idNumber },
//         { email },
//         { phoneNumber }
//       ]
//     });  
    
//     if (existingUser) {
//       let field = '';
//       if (existingUser.idNumber === idNumber) field = 'מספר זהות';
//       else if (existingUser.email === email) field = 'אימייל';
//       else if (existingUser.phoneNumber === phoneNumber) field = 'מספר טלפון';
      
//       return res.status(400).json({
//         error: `${field} כבר קיים במערכת`
//       });
//     }

//     const user = new User({
//       idNumber,
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       role,
//       password: await bcrypt.hash(password, 10),
//       categories: role === 'employee' ? categories : []
//     });

//     await user.save();
//     res.status(201).json({ message: 'משתמש נרשם בהצלחה' });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       res.status(400).json({ error: Object.values(error.errors)[0].message });
//     } else {
//       console.log({ error: error.message }); // Log before sending the response
//       res.status(400).json({ error: 'שגיאה בהרשמה: ' + error.message });
//     }
//   }
// });

// // Updated Login route
// app.post('/api/login', async (req, res) => {
//   try {
//     const { idNumber, password } = req.body;
    
//     if (!idNumber || !password) {
//       return res.status(400).json({ 
//         error: 'יש להזין מספר זהות וסיסמה',
//         field: !idNumber ? 'idNumber' : 'password'
//       });
//     }

//     const user = await User.findOne({ idNumber }).select('+password').lean();

//     if (!user) {
//       return res.status(401).json({ 
//         error: 'פרטי התחברות שגויים'
//       });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(401).json({ 
//         error: 'פרטי התחברות שגויים'
//       });
//     }

//     const token = jwt.sign(
//       { 
//         userId: user._id,
//         role: user.role,
//         categories: user.role === 'employee' ? user.categories : []

//       }, 
//       jwt_secret, 
//       { expiresIn: '24h' }
//     );

//     res.json({ 
//       token,
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role,
//         idNumber: user.idNumber,
//         categories: user.categories

//       }
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ 
//       error: 'שגיאה בהתחברות, אנא נסו שוב'
//     });
//   }
// });



    
// // נתיב להצגת רשימת העובדים
// app.get('/api/employees', async (req, res) => {
//     try {
//       const employees = await User.find({ role: 'employee' }).select('-password');
//       res.json(employees);
//     } catch (error) {
//       res.status(500).json({ error: 'שגיאה בטעינת רשימת העובדים' });
//     }
//   });
  
//   // נתיב למחיקת עובד
//   app.delete('/api/employees/:id', async (req, res) => {
//     try {
//       const employee = await User.findOneAndDelete({ _id: req.params.id, role: 'employee' });
//       if (!employee) {
//         return res.status(404).json({ error: 'העובד לא נמצא' });
//       }
//       res.json({ message: 'העובד נמחק בהצלחה' });
//     } catch (error) {
//       res.status(500).json({ error: 'שגיאה במחיקת העובד' });
//     }
//   });
  
// // // Add these routes to userServer.js

// // Get user profile
// // app.get('/api/profile/:userId', async (req, res) => {
// //     try {
// //       const user = await User.findById(req.params.userId).select('-password');
// //       if (!user) {
// //         return res.status(404).json({ error: 'משתמש לא נמצא' });
// //       }
// //       res.json(user);
// //     } catch (error) {
// //       res.status(500).json({ error: 'שגיאה בטעינת פרטי המשתמש' });
// //     }
// //   });
// app.get('/api/profile/:userId', async (req, res) => {
//     try {
//         console.log(`Fetching profile for user ID: ${req.params.userId}`);
//         const user = await User.findById(req.params.userId).select('-password');
//         if (!user) {
//             console.log('User not found');
//             return res.status(404).json({ error: 'משתמש לא נמצא' });
//         }
//         console.log('User found:', user);
//         res.json(user);
//     } catch (error) {
//         console.error('Error loading user profile:', error);
//         res.status(500).json({ error: 'שגיאה בטעינת פרטי המשתמש' });
//     }
// });

//   // Update user profile
//   app.put('/api/profile/:userId', async (req, res) => {
//     try {
//       const { firstName, lastName, email, phoneNumber } = req.body;
      
//       // Check if email or phone already exists for other users
//       const existingUser = await User.findOne({
//         $and: [
//           { _id: { $ne: req.params.userId } },
//           { $or: [{ email }, { phoneNumber }] }
//         ]
//       });
  
//       if (existingUser) {
//         let field = '';
//         if (existingUser.email === email) field = 'אימייל';
//         else if (existingUser.phoneNumber === phoneNumber) field = 'מספר טלפון';
        
//         return res.status(400).json({
//           error: `${field} כבר קיים במערכת`
//         });
//       }
  
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.userId,
//         {
//           firstName,
//           lastName,
//           email,
//           phoneNumber
//         },
//         { new: true, runValidators: true }
//       ).select('-password');
  
//       if (!updatedUser) {
//         return res.status(404).json({ error: 'משתמש לא נמצא' });
//       }
  
//       res.json({ 
//         message: 'הפרופיל עודכן בהצלחה',
//         user: updatedUser
//       });
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         res.status(400).json({ error: Object.values(error.errors)[0].message });
//       } else {
//         res.status(500).json({ error: 'שגיאה בעדכון הפרופיל' });
//       }
//     }
//   });

//  // שינוי סיסמה
// app.put('/api/profile/:userId/change-password', async (req, res) => {
//     const { userId } = req.params;
//     const { currentPassword, newPassword } = req.body;
  
//     try {
//       // חיפוש המשתמש במסד הנתונים
//       const user = await User.findById(userId).select('+password');
//       if (!user) {
//         return res.status(404).json({ error: 'משתמש לא נמצא' });
//       }
//       console.log( bcrypt.hash('12345', salt))
//       // בדיקת הסיסמה הנוכחית
//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ error: 'הסיסמה הנוכחית אינה נכונה' });
//       }
  
//       // הצפנת הסיסמה החדשה
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(newPassword, salt);
      
//       // עדכון הסיסמה במסד הנתונים
//       user.password = hashedPassword;
//       await user.save();
  
//       res.json({ message: 'הסיסמה שונתה בהצלחה' });
//     } catch (error) {
//       console.error('Error changing password:', error);
//       res.status(500).json({ error: 'שגיאה בשינוי הסיסמה' });
//     }
//   });
  


//   // Add this to your existing mongoose imports
// // const mongoose = require('mongoose');

// // Chat Message Schema
// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   recipient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   },
//   read: {
//     type: Boolean,
//     default: false
//   }
// });

// const Message = mongoose.model('Message', messageSchema);

// // Get chat history between two users
// // app.get('/api/messages/:userId', async (req, res) => {
// //   try {
// //     const currentUserId = req.params.userId;
// //     const otherUserId = req.query.otherUser;

// //     const messages = await Message.find({
// //       $or: [
// //         { sender: currentUserId, recipient: otherUserId },
// //         { sender: otherUserId, recipient: currentUserId }
// //       ]
// //     })
// //     .sort({ timestamp: 1 })
// //     .populate('sender', 'firstName lastName role')
// //     .populate('recipient', 'firstName lastName role');

// //     res.json(messages);
// //   } catch (error) {
// //     res.status(500).json({ error: 'שגיאה בטעינת ההודעות' });
    
// //   }
// // });
// app.get('/api/messages/:userId', async (req, res) => {
//     try {
//       const currentUserId = req.params.userId;
//       const otherUserId = req.query.otherUser;
  
//       // המרת idNumbers ל ObjectId (לא בהכרח חובה אם אתם משתמשים ב MongoDB _id)
//       const currentUser = await User.findOne({ idNumber: currentUserId });
//       const otherUser = await User.findOne({ idNumber: otherUserId });
  
//       if (!currentUser || !otherUser) {
//         return res.status(404).json({ error: 'אחד מהמשתמשים לא נמצא' });
//       }
  
//       const messages = await Message.find({
//         $or: [
//           { sender: currentUser._id, recipient: otherUser._id },
//           { sender: otherUser._id, recipient: currentUser._id }
//         ]
//       })
//       .sort({ timestamp: 1 })
//       .populate('sender', 'firstName lastName role')
//       .populate('recipient', 'firstName lastName role');
  
//       res.json(messages);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       res.status(500).json({ error: 'שגיאה בטעינת ההודעות' });
//     }
//   });
  
  
  
// // Send a new message
// app.post('/api/messages', async (req, res) => {
//   try {
//     const { senderId, recipientId, content } = req.body;

//     const message = new Message({
//       sender: senderId,
//       recipient: recipientId,
//       content
//     });

//     await message.save();
    
//     const populatedMessage = await Message.findById(message._id)
//       .populate('sender', 'firstName lastName role')
//       .populate('recipient', 'firstName lastName role');

//     res.status(201).json(populatedMessage);
//   } catch (error) {
//     res.status(500).json({ error: 'שגיאה בשליחת ההודעה' });
//   }
// });

// // Get list of users with unread messages count
// app.get('/api/messages/unread/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
    
//     const unreadMessages = await Message.aggregate([
//       {
//         $match: {
//           recipient: mongoose.Types.ObjectId(userId),
//           read: false
//         }
//       },
//       {
//         $group: {
//           _id: '$sender',
//           unreadCount: { $sum: 1 }
//         }
//       }
//     ]);

//     res.json(unreadMessages);
//   } catch (error) {
//     res.status(500).json({ error: 'שגיאה בטעינת הודעות שלא נקראו' });
//   }
// });

// // Mark messages as read
// app.put('/api/messages/read', async (req, res) => {
//   try {
//     const { senderId, recipientId } = req.body;
    
//     await Message.updateMany(
//       {
//         sender: senderId,
//         recipient: recipientId,
//         read: false
//       },
//       {
//         $set: { read: true }
//       }
//     );

//     res.json({ message: 'ההודעות סומנו כנקראו' });
//   } catch (error) {
//     res.status(500).json({ error: 'שגיאה בעדכון סטטוס ההודעות' });
//   }
// });
// app.get('/api/users/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         // בדוק אם המזהה הוא פורמט חוקי של ObjectId
//         if (mongoose.Types.ObjectId.isValid(id)) {
//             const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
//             if (!user) {
//                 return res.status(404).send('User not found');
//             }
//             res.json(user);
//         } else {
//             // אם המזהה לא תקין, חפש לפי idNumber
//             const user = await User.findOne({ idNumber: id });
//             if (!user) {
//                 return res.status(404).send('User not found');
//             }
//             res.json(user);
//         }
//     } catch (error) {
//         console.error('Error retrieving user:', error);
//         res.status(500).send('Error retrieving user');
//     }
// })




// ///////////////////////////////////////////////////////////////////////////////////////////////
//                                //////CalendarWithTasks/////

                             
// const taskSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   time: { type: String, required: true },
//   day: { type: Number, required: true },
//   month: { type: String, required: true },
//   year: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });                             
// const Task = mongoose.model('Task', taskSchema);

// // נתיבים
// // קבלת כל המשימות
// app.get('/api/tasks', async (req, res) => {
//   try {
//     const tasks = await Task.find().sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // קבלת משימות ליום ספציפי
// app.get('/api/tasks/:day/:month/:year', async (req, res) => {
//   try {
//     const { day, month, year } = req.params;
//     const tasks = await Task.find({ 
//       day: parseInt(day), 
//       month, 
//       year: parseInt(year) 
//     }).sort({ time: 1 });
    
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // הוספת משימה חדשה
// app.post('/api/tasks', async (req, res) => {
//   const { text, time, day, month, year } = req.body;
  
//   if (!text || !time || !day || !month || !year) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   const task = new Task({
//     text,
//     time,
//     day,
//     month,
//     year
//   });

//   try {
//     const newTask = await task.save();
//     res.status(201).json(newTask);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // עדכון משימה
// app.put('/api/tasks/:id', async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     if (req.body.text) task.text = req.body.text;
//     if (req.body.time) task.time = req.body.time;
//     if (req.body.day) task.day = req.body.day;
//     if (req.body.month) task.month = req.body.month;
//     if (req.body.year) task.year = req.body.year;

//     const updatedTask = await task.save();
//     res.json(updatedTask);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // מחיקת משימה
// app.delete('/api/tasks/:id', async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     await task.remove();
//     res.json({ message: 'Task deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// // app.listen(3000, () => console.log('Server running on port 3000'));
// // Only connect and start server if run directly
// if (require.main === module) {
//   mongoose.connect(mongoUrl)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('MongoDB connection error:', err));
  
//   app.listen(3000, () => console.log('Server running on port 3000'));
// }

// module.exports = app;
// // Export any models needed for testing
// module.exports = app;


//userServer.js - מתוקן
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const jwt_secret = "ejrbhjlsbsihgbrwhgsbdbgf";

// תיקון: הגדרת mongoUrl
const mongoUrl = 'mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Updated User Schema
const userSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ['manager', 'employee'], required: true },
  categories: {
    type: [String],
    enum: ['תשתית', 'חשמל', 'רעש', 'נקיון','מים וביוב'],
    default: [],
    required: function() { return this.role === 'employee'; }
  },
  password: { type: String, required: true }
});

// הוסף וולידציה נוספת לפני השמירה
userSchema.pre('save', function(next) {
  if (this.role === 'employee' && (!this.categories || this.categories.length === 0)) {
    const err = new Error('Employee must have at least one category');
    err.name = 'ValidationError';
    return next(err);
  }
  next();
});
const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { idNumber, firstName, lastName, email, phoneNumber, role, password, categories } = req.body;
    console.log('Received data:', req.body)
    
    // בדיקת חובה לקטגוריות לעובדים
    if (role === 'employee' && (!categories || categories.length === 0)) {
      return res.status(400).json({ 
        error: 'Employees must have at least one assigned category' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { idNumber },
        { email },
        { phoneNumber }
      ]
    });  
    
    if (existingUser) {
      let field = '';
      if (existingUser.idNumber === idNumber) field = 'מספר זהות';
      else if (existingUser.email === email) field = 'אימייל';
      else if (existingUser.phoneNumber === phoneNumber) field = 'מספר טלפון';
      
      return res.status(400).json({
        error: `${field} כבר קיים במערכת`
      });
    }

    const user = new User({
      idNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password: await bcrypt.hash(password, 10),
      categories: role === 'employee' ? categories : []
    });

    await user.save();
    res.status(201).json({ message: 'משתמש נרשם בהצלחה' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: Object.values(error.errors)[0].message });
    } else {
      console.log({ error: error.message }); // Log before sending the response
      res.status(400).json({ error: 'שגיאה בהרשמה: ' + error.message });
    }
  }
});

// Updated Login route
app.post('/api/login', async (req, res) => {
  try {
    const { idNumber, password } = req.body;
    
    if (!idNumber || !password) {
      return res.status(400).json({ 
        error: 'יש להזין מספר זהות וסיסמה',
        field: !idNumber ? 'idNumber' : 'password'
      });
    }

    const user = await User.findOne({ idNumber }).select('+password').lean();

    if (!user) {
      return res.status(401).json({ 
        error: 'פרטי התחברות שגויים'
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'פרטי התחברות שגויים'
      });
    }

    const token = jwt.sign(
      { 
        id: user._id, // תיקון: הוספת id
        userId: user._id,
        role: user.role,
        categories: user.role === 'employee' ? user.categories : []
      }, 
      jwt_secret, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        idNumber: user.idNumber,
        categories: user.categories
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'שגיאה בהתחברות, אנא נסו שוב'
    });
  }
});

// נתיב להצגת רשימת העובדים
app.get('/api/employees', async (req, res) => {
    try {
      const employees = await User.find({ role: 'employee' }).select('-password');
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'שגיאה בטעינת רשימת העובדים' });
    }
  });
  
// נתיב למחיקת עובד
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({ _id: req.params.id, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ error: 'העובד לא נמצא' });
    }
    res.json({ message: 'העובד נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה במחיקת העובד' });
  }
});

// Get user profile
app.get('/api/profile/:userId', async (req, res) => {
    try {
        console.log(`Fetching profile for user ID: ${req.params.userId}`);
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }
        console.log('User found:', user);
        res.json(user);
    } catch (error) {
        console.error('Error loading user profile:', error);
        res.status(500).json({ error: 'שגיאה בטעינת פרטי המשתמש' });
    }
});

// Update user profile
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    
    // Check if email or phone already exists for other users
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.params.userId } },
        { $or: [{ email }, { phoneNumber }] }
      ]
    });

    if (existingUser) {
      let field = '';
      if (existingUser.email === email) field = 'אימייל';
      else if (existingUser.phoneNumber === phoneNumber) field = 'מספר טלפון';
      
      return res.status(400).json({
        error: `${field} כבר קיים במערכת`
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        firstName,
        lastName,
        email,
        phoneNumber
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'משתמש לא נמצא' });
    }

    res.json({ 
      message: 'הפרופיל עודכן בהצלחה',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: Object.values(error.errors)[0].message });
    } else {
      res.status(500).json({ error: 'שגיאה בעדכון הפרופיל' });
    }
  }
});

// שינוי סיסמה
app.put('/api/profile/:userId/change-password', async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
  
    try {
      // חיפוש המשתמש במסד הנתונים
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({ error: 'משתמש לא נמצא' });
      }
      
      // בדיקת הסיסמה הנוכחית
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'הסיסמה הנוכחית אינה נכונה' });
      }
  
      // הצפנת הסיסמה החדשה
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // עדכון הסיסמה במסד הנתונים
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: 'הסיסמה שונתה בהצלחה' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'שגיאה בשינוי הסיסמה' });
    }
});

// Chat Message Schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model('Message', messageSchema);

// Get chat history between two users
app.get('/api/messages/:userId', async (req, res) => {
    try {
      const currentUserId = req.params.userId;
      const otherUserId = req.query.otherUser;
  
      // המרת idNumbers ל ObjectId (לא בהכרח חובה אם אתם משתמשים ב MongoDB _id)
      const currentUser = await User.findOne({ idNumber: currentUserId });
      const otherUser = await User.findOne({ idNumber: otherUserId });
  
      if (!currentUser || !otherUser) {
        return res.status(404).json({ error: 'אחד מהמשתמשים לא נמצא' });
      }
  
      const messages = await Message.find({
        $or: [
          { sender: currentUser._id, recipient: otherUser._id },
          { sender: otherUser._id, recipient: currentUser._id }
        ]
      })
      .sort({ timestamp: 1 })
      .populate('sender', 'firstName lastName role')
      .populate('recipient', 'firstName lastName role');
  
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'שגיאה בטעינת ההודעות' });
    }
});

// Send a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { senderId, recipientId, content } = req.body;

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    });

    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName role')
      .populate('recipient', 'firstName lastName role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליחת ההודעה' });
  }
});

// Get list of users with unread messages count
app.get('/api/messages/unread/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const unreadMessages = await Message.aggregate([
      {
        $match: {
          recipient: new mongoose.Types.ObjectId(userId), // תיקון
          read: false
        }
      },
      {
        $group: {
          _id: '$sender',
          unreadCount: { $sum: 1 }
        }
      }
    ]);

    res.json(unreadMessages);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בטעינת הודעות שלא נקראו' });
  }
});

// Mark messages as read
app.put('/api/messages/read', async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;
    
    await Message.updateMany(
      {
        sender: senderId,
        recipient: recipientId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.json({ message: 'ההודעות סומנו כנקראו' });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בעדכון סטטוס ההודעות' });
  }
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // בדוק אם המזהה הוא פורמט חוקי של ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) }); // תיקון
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.json(user);
        } else {
            // אם המזהה לא תקין, חפש לפי idNumber
            const user = await User.findOne({ idNumber: id });
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.json(user);
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).send('Error retrieving user');
    }
});

// CalendarWithTasks
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  time: { type: String, required: true },
  day: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});                             
const Task = mongoose.model('Task', taskSchema);

// קבלת כל המשימות
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// קבלת משימות ליום ספציפי
app.get('/api/tasks/:day/:month/:year', async (req, res) => {
  try {
    const { day, month, year } = req.params;
    const tasks = await Task.find({ 
      day: parseInt(day), 
      month, 
      year: parseInt(year) 
    }).sort({ time: 1 });
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת משימה חדשה
app.post('/api/tasks', async (req, res) => {
  const { text, time, day, month, year } = req.body;
  
  if (!text || !time || !day || !month || !year) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const task = new Task({
    text,
    time,
    day,
    month,
    year
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// עדכון משימה
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.text) task.text = req.body.text;
    if (req.body.time) task.time = req.body.time;
    if (req.body.day) task.day = req.body.day;
    if (req.body.month) task.month = req.body.month;
    if (req.body.year) task.year = req.body.year;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// מחיקת משימה
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id); // תיקון: שימוש ב findByIdAndDelete
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// הוסף את החבילות הנדרשות בתחילת userServer.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// יצירת transporter למייל
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // add here the mail         
  }
});

// בדיקת חיבור המייל
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email connection error:', error);
  } else {
    console.log('Email server is ready!');
  }
});

// סכמה לקודי איפוס סיסמה למנהלים ועובדים
const AdminResetCodeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 דקות
});

const AdminResetCode = mongoose.model('AdminResetCode', AdminResetCodeSchema);

// נתיב לשליחת קוד לאיפוס סיסמה למנהל/עובד
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { idNumber } = req.body;
    
    if (!idNumber) {
      return res.status(400).json({ 
        status: "error", 
        message: "נא להכניס תעודת זהות" 
      });
    }

    // חיפוש המשתמש (מנהל או עובד)
    const user = await User.findOne({ idNumber: idNumber });
    if (!user) {
      return res.status(404).json({ 
        status: "error", 
        message: "משתמש לא נמצא במערכת" 
      });
    }

    // יצירת קוד אקראי של 6 ספרות
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // שמירת הקוד במסד הנתונים
    await AdminResetCode.findOneAndDelete({ userId: idNumber }); // מחיקת קוד קודם אם קיים
    await AdminResetCode.create({
      userId: idNumber,
      code: resetCode
    });

    // שליחת המייל
    const mailOptions = {
      from: 'your-email@gmail.com', // החלף במייל שלך
      to: user.email,
      subject: 'איפוס סיסמה - מערכת ניהול תלונות',
      html: `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; text-align: center;">איפוס סיסמה</h2>
          </div>
          <div style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">שלום ${user.firstName} ${user.lastName},</p>
            
            <p style="margin-bottom: 20px;">קיבלנו בקשה לאיפוס סיסמה עבור החשבון שלך במערכת ניהול התלונות.</p>
            
            <p style="margin-bottom: 30px;">קוד האימות שלך הוא:</p>
            
            <div style="background-color: #ffffff; border: 2px solid #4f46e5; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 8px; margin: 0; font-family: monospace;">
                ${resetCode}
              </h1>
            </div>
            
            <p style="margin-bottom: 10px;"><strong>חשוב לדעת:</strong></p>
            <ul style="margin-bottom: 20px; padding-right: 20px;">
              <li>הקוד תקף למשך 10 דקות בלבד</li>
              <li>אל תשתף את הקוד עם אחרים</li>
              <li>אם לא ביקשת איפוס סיסמה, התעלם ממייל זה</li>
            </ul>
            
            <div style="background-color: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>אבטחה:</strong> אם לא ביקשת איפוס סיסמה, אנא צור קשר עם מנהל המערכת.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      status: "success",
      message: "קוד אימות נשלח למייל שלך"
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      status: "error", 
      message: "שגיאה בשליחת קוד האימות" 
    });
  }
});

// נתיב לאימות קוד ואיפוס סיסמה למנהל/עובד
app.post('/api/reset-password', async (req, res) => {
  try {
    const { idNumber, code, newPassword } = req.body;

    if (!idNumber || !code || !newPassword) {
      return res.status(400).json({ 
        status: "error", 
        message: "נא למלא את כל השדות" 
      });
    }

    // בדיקת הקוד
    const resetCode = await AdminResetCode.findOne({ userId: idNumber, code: code });
    if (!resetCode) {
      return res.status(400).json({ 
        status: "error", 
        message: "קוד אימות שגוי או פג תוקף" 
      });
    }

    // עדכון הסיסמה
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { idNumber: idNumber },
      { password: hashedPassword }
    );

    // מחיקת הקוד לאחר שימוש
    await AdminResetCode.findByIdAndDelete(resetCode._id);

    res.json({
      status: "success",
      message: "הסיסמה אופסה בהצלחה"
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      status: "error", 
      message: "שגיאה באיפוס הסיסמה" 
    });
  }
});

// הוסף את זה לCORS אם עדיין לא מוגדר
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


// Only connect and start server if run directly
if (require.main === module) {
  mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
  
  app.listen(3000, () => console.log('Server running on port 3000'));
}

module.exports = app;