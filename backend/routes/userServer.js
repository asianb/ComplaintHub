//userServer.js 
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const jwt_secret = "ejrbhjlsbsihgbrwhgsbdbgf";

mongoose.connect('mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Updated User Schema
const userSchema = new mongoose.Schema({
  idNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v); // Validates Israeli ID number format
      },
      message: 'מספר זהות חייב להכיל 9 ספרות'
    }
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: 'כתובת אימייל לא תקינה'
    }
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^05\d{8}$/.test(v); // Israeli mobile phone format
      },
      message: 'מספר טלפון לא תקין'
    }
  },
  role: { type: String, enum: ['manager', 'employee'], required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Updated Registration route
app.post('/api/register', async (req, res) => {
  try {
    const { idNumber, firstName, lastName, email, phoneNumber, role, password } = req.body;
    
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

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      idNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json({ message: 'משתמש נרשם בהצלחה' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: Object.values(error.errors)[0].message });
    } else {
        console.log({ error: error.message }); // Log before sending the response

      res.status(400).json({ error: 'שגיאה בהרשמה' + error.message  });
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
        userId: user._id,
        role: user.role
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
        idNumber: user.idNumber
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
  
// // Add these routes to userServer.js

// Get user profile
// app.get('/api/profile/:userId', async (req, res) => {
//     try {
//       const user = await User.findById(req.params.userId).select('-password');
//       if (!user) {
//         return res.status(404).json({ error: 'משתמש לא נמצא' });
//       }
//       res.json(user);
//     } catch (error) {
//       res.status(500).json({ error: 'שגיאה בטעינת פרטי המשתמש' });
//     }
//   });
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
      console.log( bcrypt.hash('12345', salt))
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
  
 

  // Add this to your existing mongoose imports
// const mongoose = require('mongoose');

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
// app.get('/api/messages/:userId', async (req, res) => {
//   try {
//     const currentUserId = req.params.userId;
//     const otherUserId = req.query.otherUser;

//     const messages = await Message.find({
//       $or: [
//         { sender: currentUserId, recipient: otherUserId },
//         { sender: otherUserId, recipient: currentUserId }
//       ]
//     })
//     .sort({ timestamp: 1 })
//     .populate('sender', 'firstName lastName role')
//     .populate('recipient', 'firstName lastName role');

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: 'שגיאה בטעינת ההודעות' });
    
//   }
// });
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
          recipient: mongoose.Types.ObjectId(userId),
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
            const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
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


  
app.listen(3000, () => console.log('Server running on port 3000'));