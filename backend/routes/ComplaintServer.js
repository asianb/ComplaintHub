//complaintSrever.s
const nodemailer = require('nodemailer');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const jwt = require('jsonwebtoken');
// Basic settings
app.use(cors());
app.use(express.json());

const JWT_SECRET = "ejrbhjlsbsihgbrwhgsbdbgf";
// טוען את קובץ .env
require('dotenv').config();

// בדיקה שהמפתח נטען
console.log('DeepSeek API Key:', process.env.DEEPSEEK_API_KEY ? 'Loaded ✓' : 'Missing ✗');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Loaded ✓' : 'Missing ✗');
app.get('/test-deepseek-connection', async (req, res) => {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'user', content: 'בדיקה - איך קוראים לך?' }
                ],
                max_tokens: 50
            })
        });

        const data = await response.json();
        
        if (data.choices) {
            res.json({
                success: true,
                message: 'DeepSeek connection successful!',
                response: data.choices[0].message.content,
                model: 'deepseek-chat'
            });
        } else {
            res.json({
                success: false,
                error: 'API key might be invalid',
                details: data
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});
// MongoDB connection
// const mongoUrl = "mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoUrl = "mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 3 // Maximum 3 files
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Updated Complaint Schema
// const ComplaintSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true
//       },
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     images: [{
//         data: String, // Base64 string
//         contentType: String
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     location: {
//         latitude: {
//             type: Number,
//             required: true
//         },
//         longitude: {
//             type: Number,
//             required: true
//         }
//     }
    
// });

// const ComplaintSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     images: [{
//         data: String,
//         contentType: String
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     location: {
//         latitude: Number,
//         longitude: Number
//     },
//     status: {
//         type: String,
//         enum: ['open', 'in_progress', 'resolved', 'closed'],
//         default: 'open'
//     },
//     assignedTo: {
//         type: String, // Employee ID
//         default: null
//     },
//     responses: [{
//         message: String,
//         fromEmployee: Boolean,
//         createdAt: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     feedback: {
//       rating: {
//           type: Number,
//           min: 1,
//           max: 5
//       },
//       comment: String,
//       submittedAt: {
//           type: Date
//       }
//   }
// });
// הוסף את העדכון הזה לסכמת Complaint ב-ComplaintServer.js שלך

const ComplaintSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    images: [{
        data: String,
        contentType: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    assignedTo: {
        type: String, // Employee ID
        default: null
    },
    responses: [{
        message: String,
        fromEmployee: Boolean,
        systemGenerated: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: {
            type: Date
        }
    },
    
    // 🆕 תמיכה בבקשות המשך טיפול
    followUpRequests: [{
        type: {
            type: String,
            enum: ['not_satisfied', 'new_issue', 'chat_request'],
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        requestedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'needs_more_info'],
            default: 'pending'
        },
        employeeResponse: String,
        respondedAt: Date,
        respondedBy: String, // Employee ID who responded
        
        // מטא-דאטה נוספת
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        tags: [String], // תגיות לסיווג נוסף
        internalNotes: String // הערות פנימיות לעובדים
    }],
    
    // 🆕 מעקב אחר פעילות המשתמש
    lastViewedByUser: {
        type: Date,
        default: null
    },
    lastViewedByEmployee: {
        type: Date,
        default: null
    },
    
    // 🆕 דירוג שביעות רצון מהמשך הטיפול
    followUpSatisfaction: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    },
    
    // 🆕 מטא-דאטה נוספת
    metadata: {
        source: {
            type: String,
            enum: ['mobile_app', 'web', 'phone', 'email'],
            default: 'mobile_app'
        },
        isUrgent: {
            type: Boolean,
            default: false
        },
        estimatedResolutionTime: Number, // בימים
        actualResolutionTime: Number, // בימים
        reopenCount: {
            type: Number,
            default: 0
        },
        lastReopenedAt: Date,
        relatedComplaints: [String], // מזהי תלונות קשורות
        attachmentCount: {
            type: Number,
            default: 0
        }
    },
    
    // 🆕 נתוני צ'אט
    chatSession: {
        isActive: {
            type: Boolean,
            default: false
        },
        startedAt: Date,
        endedAt: Date,
        participantCount: {
            type: Number,
            default: 0
        },
        lastMessageAt: Date
    },
    
    // 🆕 אבטחה ופרטיות
    privacy: {
        isAnonymous: {
            type: Boolean,
            default: false
        },
        consentToShare: {
            type: Boolean,
            default: false
        },
        dataRetentionDays: {
            type: Number,
            default: 1095 // 3 שנים
        }
    }
});

// 🆕 אינדקסים לביצועים טובים יותר
ComplaintSchema.index({ userId: 1, status: 1 });
ComplaintSchema.index({ category: 1, assignedTo: 1 });
ComplaintSchema.index({ 'followUpRequests.status': 1 });
ComplaintSchema.index({ createdAt: -1 });
ComplaintSchema.index({ 'metadata.isUrgent': 1, status: 1 });

// 🆕 Middleware לעדכון אוטומטי של מטא-דאטה
ComplaintSchema.pre('save', function(next) {
    // עדכון מספר קבצים מצורפים
    if (this.images) {
        this.metadata.attachmentCount = this.images.length;
    }
    
    // עדכון זמן הודעה אחרונה בצ'אט
    if (this.responses && this.responses.length > 0) {
        this.chatSession.lastMessageAt = this.responses[this.responses.length - 1].createdAt;
    }
    
    // ספירת פתיחות מחדש
    if (this.isModified('status')) {
        const currentStatus = this.status;
        const previousStatus = this.get('status'); // הסטטוס הקודם
        
        if (previousStatus === 'closed' && currentStatus === 'open') {
            this.metadata.reopenCount += 1;
            this.metadata.lastReopenedAt = new Date();
        }
    }
    
    next();
});

// 🆕 Methods שימושיים
ComplaintSchema.methods.addFollowUpRequest = function(requestData) {
    this.followUpRequests.push(requestData);
    return this.save();
};

ComplaintSchema.methods.getActiveChatSession = function() {
    return this.chatSession.isActive;
};

ComplaintSchema.methods.calculateResponseTime = function() {
    if (!this.responses || this.responses.length === 0) return null;
    
    const firstResponse = this.responses.find(r => r.fromEmployee);
    if (!firstResponse) return null;
    
    const responseTime = new Date(firstResponse.createdAt) - new Date(this.createdAt);
    return Math.floor(responseTime / (1000 * 60 * 60)); // בשעות
};

ComplaintSchema.methods.hasUnreadResponses = function(userType = 'citizen') {
    if (!this.responses || this.responses.length === 0) return false;
    
    const lastViewField = userType === 'citizen' ? 'lastViewedByUser' : 'lastViewedByEmployee';
    const lastViewed = this[lastViewField];
    
    if (!lastViewed) return true;
    
    const lastResponse = this.responses[this.responses.length - 1];
    return new Date(lastResponse.createdAt) > new Date(lastViewed);
};

// 🆕 Static methods
ComplaintSchema.statics.findWithPendingFollowUps = function(employeeCategories) {
    return this.find({
        category: { $in: employeeCategories },
        'followUpRequests': {
            $elemMatch: { status: 'pending' }
        }
    });
};

ComplaintSchema.statics.getStatsByCategory = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$category',
                total: { $sum: 1 },
                open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                avgResponseTime: { $avg: '$metadata.actualResolutionTime' },
                withFollowUp: { 
                    $sum: { 
                        $cond: [
                            { $gt: [{ $size: { $ifNull: ['$followUpRequests', []] } }, 0] }, 
                            1, 
                            0
                        ] 
                    } 
                }
            }
        },
        { $sort: { total: -1 } }
    ]);
};

// Virtual fields
ComplaintSchema.virtual('daysOpen').get(function() {
    return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

ComplaintSchema.virtual('hasActiveFollowUp').get(function() {
    return this.followUpRequests && 
           this.followUpRequests.some(req => req.status === 'pending');
});

ComplaintSchema.virtual('satisfactionScore').get(function() {
    if (this.feedback && this.feedback.rating) {
        return this.feedback.rating;
    }
    if (this.followUpSatisfaction && this.followUpSatisfaction.rating) {
        return this.followUpSatisfaction.rating;
    }
    return null;
});

// הוסף toJSON כדי לכלול virtual fields
ComplaintSchema.set('toJSON', { virtuals: true });

const Complaint = mongoose.model("ANFAAALComplaints", ComplaintSchema);

module.exports = Complaint;
// const Complaint = mongoose.model("ANFAAALComplaints", ComplaintSchema);

// Test endpoint
app.get("/test", (req, res) => {
    res.json({ status: "ok" });
});

// Timing middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${duration}ms`);
    });
    next();
});

// GET all complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({})
            .sort({ createdAt: -1 });

        console.log(`Found ${complaints.length} complaints`);
        res.json({
            status: 'success',
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST new complaint with images
app.post('/api/complaints', upload.array('images', 3), async (req, res) => {
    try {
        console.log('Received new request:', req.body);

            // Parse the location data
            let locationData;
            try {
                locationData = typeof req.body.location === 'string' 
                    ? JSON.parse(req.body.location)
                    : req.body.location;
            } catch (error) {
                console.error('Error parsing location:', error);
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid location data format'
                });
            }


        // Process images if they exist
        const processedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const base64Data = file.buffer.toString('base64');
                processedImages.push({
                    data: `data:${file.mimetype};base64,${base64Data}`,
                    contentType: file.mimetype
                });
            }
        }

        // Create new complaint with images
        const complaint = new Complaint({
            ...req.body,
            images: processedImages,
            location: {
                latitude: locationData.latitude,
                longitude: locationData.longitude
            }
        });

        await complaint.save();
        console.log('Successfully saved complaint with location:', complaint.location);

        // Quick response
        res.status(200).json({ status: "success" });

        // Log after sending response
        console.log('Successfully saved:', complaint._id);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
});


// Admin login route
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    // This is a simple example - in production, use proper authentication
    if (username === 'admin' && password === 'admin123') {
        res.json({
            status: 'success',
            token: 'admin-token' // In production, use JWT
        });
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid credentials'
        });
    }
});

// // Get complaints with pagination and filters
// app.get('/api/admin/complaints', async (req, res) => {
//     try {
//         const { page = 1, limit = 10, category, status } = req.query;
        
//         let query = {};
//         if (category) query.category = category;
//         if (status) query.status = status;

//         const complaints = await Complaint.find(query)
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));

//         const total = await Complaint.countDocuments(query);

//         res.json({
//             status: 'success',
//             data: complaints,
//             pagination: {
//                 total,
//                 pages: Math.ceil(total / limit),
//                 currentPage: parseInt(page),
//                 limit: parseInt(limit)
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });
// POST new complaint with images


// Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     return res.status(401).json({ status: "error", message: "טוקן לא תקין" });
//   }
// };

//هذا كان زابط
// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(' ')[1];
    
//     if (!token) {
//         return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
//     }

//     try {
//         // Log the secret being used for verification
//         console.log('Verifying token with secret:', JWT_SECRET);
//         const decoded = jwt.verify(token, JWT_SECRET);
//         req.userId = decoded.id;
//         next();
//     } catch (error) {
//         console.log('Token verification failed:', error.message);
//         return res.status(401).json({ status: "error", message: "טוקן לא תקין" });
//     }
// };
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;

      console.log("asiaaaa"+req.userId);
      req.userRole = decoded.role;
      req.userCategories = decoded.categories || [];
      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      return res.status(401).json({ status: "error", message: "טוקן לא תקין" });
    }
  };  

// Modified POST endpoint to include user verification
app.post('/api/complaints', verifyToken, upload.array('images', 3), async (req, res) => {
    try {
        console.log('Received new complaint from user:', req.userId);

        let locationData;
        try {
            locationData = typeof req.body.location === 'string' 
                ? JSON.parse(req.body.location)
                : req.body.location;
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid location data format'
            });
        }

        const processedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const base64Data = file.buffer.toString('base64');
                processedImages.push({
                    data: `data:${file.mimetype};base64,${base64Data}`,
                    contentType: file.mimetype
                });
            }
        }

        const complaint = new Complaint({
            ...req.body,
            userId: req.userId, // Add the user ID to the complaint
            images: processedImages,
            location: {
                latitude: locationData.latitude,
                longitude: locationData.longitude
            }
        });

        await complaint.save();
        res.status(200).json({ status: "success" });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
});

// New endpoint to get complaints for specific user
// app.get('/api/my-complaints', verifyToken, async (req, res) => {
//     try {
//         const complaints = await Complaint.find({ userId: req.userId })
//             .sort({ createdAt: -1 });

//         res.json({
//             status: 'success',
//             count: complaints.length,
//             data: complaints
//         });
//     } catch (error) {
//         console.error('Error fetching user complaints:', error);
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });
// New endpoint to get complaints for a specific user
// app.get('/my-complaints', verifyToken, async (req, res) => {
//     try {
//       const { userId } = req;
//       const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
  
//       res.json(complaints); // simplified response
//     } catch (error) {
//       console.error('Error fetching user complaints:', error);
//       res.status(500).json({
//         status: 'error',
//         message: 'לא ניתן לטעון תלונות, נסה מאוחר יותר'
//       });
//     }
//   });

app.get('/my-complaints', verifyToken, async (req, res) => {
    try {
        const { userId } = req;
        
        // First let's see ALL complaints in the database
        const allComplaints = await Complaint.find({});
        console.log('All complaints in database:', allComplaints);
        
        // Now let's see the query we're trying to make
        console.log('Searching for complaints with userId:', userId);
        
        const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
        console.log('Found complaints for user:', complaints);

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching user complaints:', error);
        res.status(500).json({
            status: 'error',
            message: 'לא ניתן לטעון תלונות, נסה מאוחר יותר'
        });
    }
});
  

// app.post('/api/complaints', upload.array('images', 3), async (req, res) => {
//     try {
//         console.log('Received new request:', req.body);

//         // Parse the location string into an object
//         let locationData = req.body.location;
//         if (typeof locationData === 'string') {
//             locationData = JSON.parse(locationData);
//         }

//         // Process images if they exist
//         const processedImages = [];
//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const base64Data = file.buffer.toString('base64');
//                 processedImages.push({
//                     data: `data:${file.mimetype};base64,${base64Data}`,
//                     contentType: file.mimetype
//                 });
//             }
//         }

//         // Create new complaint with parsed location
//         const complaint = new Complaint({
//             title: req.body.title,
//             description: req.body.description,
//             category: req.body.category,
//             address: req.body.address,
//             location: locationData,  // Use the parsed location object
//             images: processedImages
//         });

//         await complaint.save();

//         // Quick response
//         res.status(200).json({ status: "success" });

//         // Log after sending response
//         console.log('Successfully saved:', complaint._id);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ 
//             status: "error", 
//             message: error.message 
//         });
//     }
// });

// Update complaint status
app.patch('/api/admin/complaints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { 
                status,
                adminComment,
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.json({
            status: 'success',
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});


// GET all complaints
app.get('/api/viewcomplaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({})
            .sort({ createdAt: -1 });

            console.log(complaints);
        console.log(`Found ${complaints.length} complaints`);
        res.json({
            status: 'success',
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});


// // Get complaints filtered by employee's categories
// app.get('/api/employee-complaints', verifyToken, async (req, res) => {
//     try {
//         // Only employees should access this endpoint
//         if (req.userRole !== 'employee') {
//             console.log('Decoded User:', req.userRole, req.userCategories);

//             return res.status(403).json({
//                 status: 'error',
//                 message: 'Access denied - employee only'
//             });
//         }

//         // Get complaints that match the employee's categories
//         const complaints = await Complaint.find({
//             category: { $in: req.userCategories }
//         }).sort({ createdAt: -1 });

//         res.json({
//             status: 'success',
//             count: complaints.length,
//             data: complaints
//         });
//     } catch (error) {
//         console.error('Error fetching employee complaints:', error);
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });
// Get complaints filtered by employee's categories
app.get('/api/employee-complaints', verifyToken, async (req, res) => {
    try {
        console.log('=== Employee Complaints Debug ===');
        console.log('User ID:', req.userId);
        console.log('User Role:', req.userRole);
        console.log('User Categories:', req.userCategories);
        
        // Only employees should access this endpoint
        if (req.userRole !== 'employee') {
            console.log('Access denied - not an employee. Role:', req.userRole);
            return res.status(403).json({
                status: 'error',
                message: 'Access denied - employee only'
            });
        }

        // בדוק אם יש קטגוריות לעובד
        if (!req.userCategories || req.userCategories.length === 0) {
            console.log('No categories assigned to employee');
            return res.json({
                status: 'success',
                count: 0,
                data: [],
                message: 'No categories assigned to this employee'
            });
        }

        console.log('Searching for complaints with categories:', req.userCategories);

        // קבל את כל התלונות שמתאימות לקטגוריות של העובד
        const complaints = await Complaint.find({
            category: { $in: req.userCategories }
        }).sort({ createdAt: -1 });

        console.log(`Found ${complaints.length} complaints matching categories`);
        
        // לוג של כל התלונות עם הקטגוריות שלהן
        if (complaints.length > 0) {
            console.log('Complaints found:');
            complaints.forEach(complaint => {
                console.log(`- ID: ${complaint._id}, Category: ${complaint.category}, Title: ${complaint.title}, Assigned: ${complaint.assignedTo || 'unassigned'}`);
            });
        } else {
            // אם אין תלונות, בואו נבדוק מה יש בכלל במסד הנתונים
            const allComplaints = await Complaint.find({}).select('category title');
            console.log('All complaints in database:');
            allComplaints.forEach(complaint => {
                console.log(`- Category: ${complaint.category}, Title: ${complaint.title}`);
            });
            
            // ובדוק אילו קטגוריות יש בכלל
            const allCategories = await Complaint.distinct('category');
            console.log('All categories in database:', allCategories);
        }

        res.json({
            status: 'success',
            count: complaints.length,
            data: complaints,
            userCategories: req.userCategories // כדי שנראה מה הקטגוריות של העובד
        });
    } catch (error) {
        console.error('Error fetching employee complaints:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
// // Update complaint status (in_progress/resolved)
// app.patch('/api/complaints/:id/process', verifyToken, async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;
  
//       // Verify the employee has permission for this complaint
//       const complaint = await Complaint.findOne({ _id: id, category: { $in: req.userCategories } });
      
//       if (!complaint) {
//         return res.status(403).json({ status: 'error', message: 'Not authorized for this complaint' });
//       }
  
//       const updatedComplaint = await Complaint.findByIdAndUpdate(
//         id,
//         { status },
//         { new: true }
//       );
  
//       res.json({
//         status: 'success',
//         data: updatedComplaint
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   });


// // Add response to complaint
// app.post('/api/complaints/:id/response', verifyToken, async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { message, employeeId } = req.body;
  
//       // Verify the employee has permission for this complaint
//       const complaint = await Complaint.findOne({ _id: id, category: { $in: req.userCategories } });
      
//       if (!complaint) {
//         return res.status(403).json({ status: 'error', message: 'Not authorized for this complaint' });
//       }
  
//       const response = {
//         message,
//         fromEmployee: true,
//         createdAt: new Date()
//       };
  
//       const updatedComplaint = await Complaint.findByIdAndUpdate(
//         id,
//         { $push: { responses: response } },
//         { new: true }
//       );
  
//       res.json({
//         status: 'success',
//         data: updatedComplaint
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   });


// // Assign complaint to employee
// app.patch('/api/complaints/:id/assign', verifyToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { employeeId } = req.body;

//         // Verify the employee exists and has the right category
//         // (You'll need to implement this check based on your user system)

//         const updatedComplaint = await Complaint.findByIdAndUpdate(
//             id,
//             { 
//                 assignedTo: employeeId,
//                 status: 'in_progress'
//             },
//             { new: true }
//         );

//         res.json({
//             status: 'success',
//             data: updatedComplaint
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // Add citizen response
// app.post('/api/complaints/:id/citizen-response', verifyToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { message } = req.body;

//         // Verify the user is the one who created the complaint
//         const complaint = await Complaint.findOne({ _id: id, userId: req.userId });
        
//         if (!complaint) {
//             return res.status(403).json({ status: 'error', message: 'Not authorized for this complaint' });
//         }

//         const response = {
//             message,
//             fromEmployee: false,
//             createdAt: new Date()
//         };

//         const updatedComplaint = await Complaint.findByIdAndUpdate(
//             id,
//             { $push: { responses: response } },
//             { new: true }
//         );

//         res.json({
//             status: 'success',
//             data: updatedComplaint
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });


// Endpoint to assign complaint to an employee
app.patch('/api/complaints/:id/assign', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;
      
      // Verify user is an employee
      if (req.userRole !== 'employee') {
        return res.status(403).json({
          status: 'error',
          message: 'Only employees can be assigned to complaints'
        });
      }
      
      // Verify the employee has permission for this complaint (matches their categories)
      const complaint = await Complaint.findOne({ 
        _id: id, 
        category: { $in: req.userCategories } 
      });
      
      if (!complaint) {
        return res.status(403).json({ 
          status: 'error', 
          message: 'Not authorized for this complaint' 
        });
      }
      
      // Update the complaint with the employee ID
      const updatedComplaint = await Complaint.findByIdAndUpdate(
        id,
        { 
          assignedTo: employeeId,
          status: 'in_progress' // Automatically update status when assigned
        },
        { new: true }
      );
      
      res.json({
        status: 'success',
        data: updatedComplaint
      });
    } catch (error) {
      console.error('Error assigning complaint:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Endpoint to get complaints assigned to the current employee
app.get('/api/employee-assigned-complaints', verifyToken, async (req, res) => {
    try {
      // Verify user is an employee
      if (req.userRole !== 'employee') {
        return res.status(403).json({
          status: 'error',
          message: 'Only employees can access assigned complaints'
        });
      }
      
      // Get the employee's ID from the token
      const employeeId = req.userId;
      console.log("anfaaaaaaaaal"+employeeId);
      // Find all complaints assigned to this employee
      const complaints = await Complaint.find({ 
        assignedTo: employeeId 
      }).sort({ createdAt: -1 }); // Sort by newest first
      
      res.json({
        status: 'success',
        data: complaints
      });
    } catch (error) {
      console.error('Error fetching assigned complaints:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });
  // Add endpoint to get a single complaint detail with responses
  app.get('/api/complaints/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      const complaint = await Complaint.findById(id);
      
      if (!complaint) {
        return res.status(404).json({
          status: 'error',
          message: 'Complaint not found'
        });
      }
      
      // For citizens, only show their own complaints
      if (req.userRole === 'citizen' && complaint.userId !== req.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to view this complaint'
        });
      }
      
      // For employees, only show complaints in their categories
      if (req.userRole === 'employee' && !req.userCategories.includes(complaint.category)) {
        return res.status(403).json({
          status: 'error',
          message: 'This complaint is not in your assigned categories'
        });
      }
      
      res.json({
        status: 'success',
        data: complaint
      });
    } catch (error) {
      console.error('Error fetching complaint:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });
  
  // // Add endpoint for adding responses to complaints
  // app.post('/api/complaints/:id/respond', verifyToken, async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { message, fromEmployee } = req.body;
      
  //     // Verify message exists
  //     if (!message || message.trim().length === 0) {
  //       return res.status(400).json({
  //         status: 'error',
  //         message: 'Response message cannot be empty'
  //       });
  //     }
      
  //     // Find the complaint
  //     const complaint = await Complaint.findById(id);
      
  //     if (!complaint) {
  //       return res.status(404).json({
  //         status: 'error',
  //         message: 'Complaint not found'
  //       });
  //     }
      
  //     // For citizens, only allow them to respond to their own complaints
  //     if (!fromEmployee && complaint.userId !== req.userId) {
  //       return res.status(403).json({
  //         status: 'error',
  //         message: 'Not authorized to respond to this complaint'
  //       });
  //     }
      
  //     // For employees, verify they are assigned to this complaint or in the right category
  //     if (fromEmployee && 
  //         req.userRole === 'employee' && 
  //         !req.userCategories.includes(complaint.category)) {
  //       return res.status(403).json({
  //         status: 'error',
  //         message: 'This complaint is not in your assigned categories'
  //       });
  //     }
      
  //     // Add the response to the complaint
  //     complaint.responses.push({
  //       message,
  //       fromEmployee,
  //       createdAt: new Date()
  //     });
      
  //     await complaint.save();
      
  //     res.json({
  //       status: 'success',
  //       data: complaint
  //     });
  //   } catch (error) {
  //     console.error('Error adding response:', error);
  //     res.status(500).json({
  //       status: 'error',
  //       message: error.message
  //     });
  //   }
  // });
// Also add this endpoint for adding responses
// Add this endpoint to your ComplaintServer.js file
app.post('/api/complaints/:id/respond', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    console.log(`Adding response to complaint ${id}, message: ${message}`);
    console.log(`Request from userId: ${req.userId}, role: ${req.userRole}`);
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Message cannot be empty'
      });
    }

    // Find the complaint
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      console.log(`Complaint ${id} not found`);
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }
    
    console.log(`Found complaint: ${complaint._id}, category: ${complaint.category}, assignedTo: ${complaint.assignedTo}`);
    
    // Check permissions - either assigned to this employee or in their category
    const employeeId = req.userId;
    const employeeCategories = req.userCategories || [];
    
    const isAssigned = 
      complaint.assignedTo === employeeId || 
      complaint.assignedTo === String(employeeId);
      
    const hasPermission = isAssigned || employeeCategories.includes(complaint.category);
    
    console.log(`Permission check: isAssigned=${isAssigned}, hasPermission=${hasPermission}, employeeCategories=${employeeCategories}`);
    
    if (!hasPermission) {
      console.log(`Permission denied for user ${employeeId} on complaint ${id}`);
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized for this complaint'
      });
    }
    
    // Update the complaint with the new response
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { 
        $push: { 
          responses: {
            message,
            fromEmployee: true,
            createdAt: new Date()
          } 
        },
        // Auto-assign to this employee if not already assigned
        assignedTo: complaint.assignedTo || employeeId,
        // If status is open, update to in_progress
        ...(complaint.status === 'open' ? { status: 'in_progress' } : {})
      },
      { new: true }
    );
    
    console.log(`Response added successfully to complaint ${id}`);
    
    res.json({
      status: 'success',
      data: updatedComplaint
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update complaint status (in_progress/resolved/etc)
app.patch('/api/complaints/:id/process', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, employeeId: requestEmployeeId } = req.body;
    
    console.log(`Processing status update request:`, {
      complaintId: id,
      status,
      tokenUserId: req.userId,
      providedEmployeeId: requestEmployeeId
    });

    // Make sure the status is valid
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid status value' 
      });
    }
    
    // Verify the employee has permission for this complaint
    const currentEmployeeId = req.userId;
    console.log(`Verifying permission for employee ${currentEmployeeId} on complaint ${id}`);
    
    // First, log all complaints to check what's in the database
    const allComplaints = await Complaint.find({});
    console.log(`Total complaints in database: ${allComplaints.length}`);
    
    // Check if the complaint exists
    const complaintExists = await Complaint.findById(id);
    if (!complaintExists) {
      console.log(`Complaint ${id} not found in database`);
      return res.status(404).json({ 
        status: 'error', 
        message: 'Complaint not found' 
      });
    }
    
    console.log(`Complaint found: ${complaintExists._id}, assignedTo: ${complaintExists.assignedTo}`);
    
    // Check category permissions instead of strict assignment
    const employeeCategories = req.userCategories || [];
    const hasPermission = 
      // Either the complaint is assigned to this employee
      (complaintExists.assignedTo === currentEmployeeId || 
       complaintExists.assignedTo === String(currentEmployeeId)) || 
      // Or the complaint category is in employee's allowed categories
      (employeeCategories.includes(complaintExists.category));
    
    if (!hasPermission) {
      console.log(`Permission denied: Employee ${currentEmployeeId} not authorized for complaint ${id}`);
      return res.status(403).json({ 
        status: 'error', 
        message: 'Not authorized for this complaint' 
      });
    }
  
    // Update the complaint status
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { 
        status,
        // Add response when status changes
        $push: { 
          responses: {
            message: `הסטטוס שונה ל${status === 'in_progress' ? 'בטיפול' : 
                      status === 'resolved' ? 'טופל' : 
                      status === 'closed' ? 'סגור' : 'ממתין לטיפול'}`,
            fromEmployee: true,
            createdAt: new Date()
          } 
        }
      },
      { new: true }
    );
  
    res.json({
      status: 'success',
      data: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Added endpoint for updating any complaint in employee's category
app.patch('/api/complaints/:id/update-status', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Updating complaint ${id} status to ${status} by employee ${req.userId}`);
        
        // Make sure the status is valid
        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ 
            status: 'error', 
            message: 'Invalid status value' 
          });
        }
        
        // Find the complaint first
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({
                status: 'error',
                message: 'Complaint not found'
            });
        }
        
        // Check if employee has permission - either assigned to them or in their category
        const employeeCategories = req.userCategories || [];
        const currentUserId = req.userId;
        
        const isAssignedToEmployee = 
            complaint.assignedTo === currentUserId || 
            complaint.assignedTo === String(currentUserId);
            
        const isInEmployeeCategory = employeeCategories.includes(complaint.category);
        
        if (!isAssignedToEmployee && !isInEmployeeCategory) {
            console.log('Permission denied:', {
                complaintId: id,
                complaintCategory: complaint.category,
                employeeId: currentUserId,
                assignedTo: complaint.assignedTo,
                employeeCategories,
                isAssigned: isAssignedToEmployee,
                isInCategory: isInEmployeeCategory
            });
            
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized for this complaint'
            });
        }
        
        // Update status
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { 
                status,
                // Auto-assign to this employee if not already assigned
                assignedTo: complaint.assignedTo || currentUserId,
                // Add a response entry
                $push: { 
                    responses: {
                        message: `הסטטוס שונה ל${
                            status === 'in_progress' ? 'בטיפול' : 
                            status === 'resolved' ? 'טופל' : 
                            status === 'closed' ? 'סגור' : 'ממתין לטיפול'
                        }`,
                        fromEmployee: true,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        );
        
        res.json({
            status: 'success',
            data: updatedComplaint
        });
        
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
  
// // Endpoint to update the status of a complaint
// app.patch('/api/complaints/:id/process', verifyToken, async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;
      
//       console.log(`Updating complaint ${id} status to ${status}`);
      
//       // Verify user is an employee
//       if (req.userRole !== 'employee') {
//         return res.status(403).json({
//           status: 'error',
//           message: 'Only employees can update complaint status'
//         });
//       }
      
//       // Valid status transitions
//       const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
      
//       if (!validStatuses.includes(status)) {
//         return res.status(400).json({
//           status: 'error',
//           message: 'Invalid status value'
//         });
//       }
      
//       // Find the complaint
//       const complaint = await Complaint.findById(id);
//       console.log("ana"+complaint.assignedTo);
//       console.log('Comparing IDs:', {
//         assignedTo: complaint.assignedTo,
//         userId: req._id,
//         types: {
//           assignedTo: typeof complaint.assignedTo,
//           userId: typeof req.userId
//         },
//       });
//       if (!complaint) {
//         return res.status(404).json({
//           status: 'error',
//           message: 'Complaint not found'
//         });
//       }
      
//       // Check if the user ID matches the logged-in employee
//       // This is where the error occurred before - we need to check if assignedTo exists first
//       if (!complaint.assignedTo) {
//         // If no one is assigned yet, let's assign this employee
//         complaint.assignedTo = req.userId;
//         console.log(`No one was assigned, assigning to employee ${req.userId}`);
//       } else if (complaint.assignedTo.toString() !== req.userId) {
//         // If someone else is assigned
//         return res.status(403).json({
//           status: 'error',
//           message: 'You are not assigned to this complaint'
//         });
//       }
      
//       // Update the complaint status
//       complaint.status = status;
      
//       // If marking as closed, record the closure date
//       if (status === 'closed') {
//         complaint.closedAt = new Date();
//       }
      
//       // Save the updated complaint
//       await complaint.save();
      
//       console.log(`Successfully updated complaint status to ${status}`);
      
//       res.json({
//         status: 'success',
//         data: complaint
//       });
//     } catch (error) {
//       console.error('Error updating complaint status:', error);
//       res.status(500).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   });

// Enhanced my-complaints endpoint with filtering and pagination
app.get('/my-complaints', verifyToken, async (req, res) => {
  try {
      const { userId } = req;
      const { 
          status, 
          category, 
          sortBy = 'createdAt', 
          sortOrder = 'desc',
          page = 1, 
          limit = 10 
      } = req.query;
      
      console.log('Fetching complaints for user:', userId);
      console.log('Query parameters:', req.query);
      
      // Build query filter
      const filter = { userId };
      
      // Add status filter if provided
      if (status && status !== 'all') {
          filter.status = status;
      }
      
      // Add category filter if provided
      if (category) {
          filter.category = category;
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Determine sort direction
      const sortDirection = sortOrder === 'asc' ? 1 : -1;
      const sortOptions = {};
      sortOptions[sortBy] = sortDirection;
      
      // Get total count for pagination
      const totalComplaints = await Complaint.countDocuments(filter);
      
      // Execute query with filters, sort and pagination
      const complaints = await Complaint.find(filter)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit));
      
      // Get unique categories for filtering options
      const categories = await Complaint.distinct('category', { userId });
      
      // Count by status for summary statistics
      const statusCounts = await Complaint.aggregate([
          { $match: { userId } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      // Format status counts into a more usable object
      const stats = statusCounts.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
      }, { total: totalComplaints });
      
      console.log(`Found ${complaints.length} complaints for user`);
      
      // Return array directly as the previous code expected it 
      // instead of nested under data.complaints
      res.json(complaints);
  } catch (error) {
      console.error('Error fetching user complaints:', error);
      res.status(500).json({
          status: 'error',
          message: 'לא ניתן לטעון תלונות, נסה מאוחר יותר'
      });
  }
});





// Endpoint לקבלת פרטי תלונה בודדת עבור תושב
app.get('/api/citizen/complaints/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req; // מזהה המשתמש מהטוקן

    // מצא את התלונה לפי מזהה
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'התלונה לא נמצאה'
      });
    }
    
    // וודא שהתלונה שייכת לתושב הזה
    if (complaint.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'אין הרשאה לצפות בתלונה זו'
      });
    }

    // קבל את כל המידע הנלווה לתלונה
    // למשל, מידע על מי מטפל בתלונה (אם יש לך טבלת משתמשים)
    let assignedEmployeeDepartment = null;
    if (complaint.assignedTo) {
      try {
        // בהנחה שיש לך מודל User
        const assignedEmployee = await User.findById(complaint.assignedTo, 'department');
        if (assignedEmployee) {
          assignedEmployeeDepartment = assignedEmployee.department;
        }
      } catch (err) {
        console.error('שגיאה בקבלת מידע על עובד מטפל:', err);
      }
    }

    // ספור זמן טיפול וסטטיסטיקות נוספות
    const createdAt = new Date(complaint.createdAt);
    const now = new Date();
    const daysOpen = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    
    // מידע על התגובות האחרונות
    const lastResponse = complaint.responses && complaint.responses.length > 0 
      ? complaint.responses[complaint.responses.length - 1] 
      : null;
    
    // העשרה של המידע
    const enrichedComplaint = {
      ...complaint.toObject(),
      meta: {
        daysOpen,
        assignedEmployeeDepartment,
        lastResponse,
        hasImages: complaint.images && complaint.images.length > 0,
        statusHistory: getStatusHistory(complaint), // פונקציית עזר שצריך ליצור
        estimatedCompletionTime: getEstimatedTime(complaint.category, complaint.status) // פונקציית עזר שצריך ליצור
      }
    };
    
    // החזר תשובה
    res.json({
      status: 'success',
      data: enrichedComplaint
    });
  } catch (error) {
    console.error('שגיאה בקבלת פרטי תלונה:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת פרטי התלונה'
    });
  }
});

// פונקציית עזר לקבלת היסטוריית סטטוס
function getStatusHistory(complaint) {
  // אם יש לך שדה היסטוריית סטטוס במודל התלונה, השתמש בו
  // אחרת, בנה היסטוריה מינימלית מהתלונה עצמה
  if (complaint.statusHistory) {
    return complaint.statusHistory;
  }
  
  const history = [
    {
      status: 'open',
      timestamp: complaint.createdAt,
      message: 'התלונה התקבלה במערכת'
    }
  ];
  
  // הוסף מידע על סטטוס עדכני אם הוא שונה מ"פתוח"
  if (complaint.status !== 'open') {
    history.push({
      status: complaint.status,
      timestamp: complaint.updatedAt || new Date(),
      message: getStatusMessage(complaint.status)
    });
  }
  
  return history;
}

// פונקציית עזר לקבלת הודעת סטטוס מותאמת
function getStatusMessage(status) {
  switch (status) {
    case 'in_progress':
      return 'התלונה נמצאת בטיפול';
    case 'resolved':
      return 'הטיפול בתלונה הסתיים';
    case 'closed':
      return 'התלונה נסגרה';
    default:
      return 'סטטוס התלונה עודכן';
  }
}

// פונקציית עזר להערכת זמן טיפול
function getEstimatedTime(category, status) {
  // כאן אתה יכול לממש לוגיקה שמחזירה זמן טיפול משוער בהתאם לקטגוריה והסטטוס
  // למשל, זמן ממוצע לטיפול בקטגוריה מסוימת
  const timeEstimates = {
    'תחזוקה': 7, // ימים
    'תברואה': 3,
    'תשתיות': 14,
    'חניה': 5,
    'גינון': 10,
    'תאורה': 5,
    'אחר': 7
  };
  
  // מחושב לפי סטטוס
  let daysLeft = timeEstimates[category] || 7;
  
  if (status === 'in_progress') {
    daysLeft = Math.max(Math.floor(daysLeft / 2), 1); // חצי מהזמן הכולל
  } else if (status === 'resolved' || status === 'closed') {
    daysLeft = 0;
  }
  
  return daysLeft;
}

// Endpoint להוספת תגובה לתלונה על ידי תושב
app.post('/api/citizen/complaints/:id/respond', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const { userId } = req;
    
    // וודא שקיבלנו הודעה
    if (!message || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'הודעה ריקה אינה מתקבלת'
      });
    }
    
    // מצא את התלונה
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'התלונה לא נמצאה'
      });
    }
    
    // וודא שהתלונה שייכת לתושב הזה
    if (complaint.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'אין הרשאה להוסיף תגובה לתלונה זו'
      });
    }
    
    // וודא שהתלונה לא סגורה
    if (complaint.status === 'closed') {
      return res.status(400).json({
        status: 'error',
        message: 'לא ניתן להוסיף תגובות לתלונה סגורה'
      });
    }
    
    // הוסף את התגובה
    complaint.responses.push({
      message,
      fromEmployee: false,
      createdAt: new Date()
    });
    
    await complaint.save();
    
    res.json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    console.error('שגיאה בהוספת תגובה:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בהוספת תגובה'
    });
  }
});

// Endpoint לקבלת כל עדכוני סטטוס עבור תלונה מסוימת
app.get('/api/citizen/complaints/:id/status-history', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    
    // מצא את התלונה
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'התלונה לא נמצאה'
      });
    }
    
    // וודא שהתלונה שייכת לתושב הזה
    if (complaint.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'אין הרשאה לקבל מידע על תלונה זו'
      });
    }
    
    // הוצא היסטוריית סטטוס מפורטת יותר אם יש
    const statusHistory = getDetailedStatusHistory(complaint);
    
    res.json({
      status: 'success',
      data: statusHistory
    });
  } catch (error) {
    console.error('שגיאה בקבלת היסטוריית סטטוס:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת היסטוריית סטטוס'
    });
  }
});

// פונקציית עזר לקבלת היסטוריית סטטוס מפורטת יותר
function getDetailedStatusHistory(complaint) {
  // בנה היסטוריה מפורטת מהתלונה והתגובות שלה
  const history = [
    {
      status: 'open',
      timestamp: complaint.createdAt,
      message: 'התלונה התקבלה במערכת',
      type: 'status'
    }
  ];
  
  // הוסף ערכים מהתגובות
  if (complaint.responses && complaint.responses.length > 0) {
    complaint.responses.forEach(response => {
      if (response.systemGenerated) {
        // תגובות מערכת בדרך כלל מציינות שינויי סטטוס
        history.push({
          status: 'update',
          timestamp: response.createdAt,
          message: response.message,
          type: 'system'
        });
      } else if (response.fromEmployee) {
        // תגובות עובדים
        history.push({
          status: 'response',
          timestamp: response.createdAt,
          message: response.message,
          type: 'employee'
        });
      }
    });
  }
  
  // הוסף עדכון סטטוס אחרון
  if (complaint.status !== 'open' && complaint.updatedAt) {
    // בדוק שלא הוספנו כבר ערך זהה מהתגובות
    const lastUpdate = history.find(h => 
      h.status === complaint.status && 
      new Date(h.timestamp).getTime() === new Date(complaint.updatedAt).getTime()
    );
    
    if (!lastUpdate) {
      history.push({
        status: complaint.status,
        timestamp: complaint.updatedAt,
        message: getStatusMessage(complaint.status),
        type: 'status'
      });
    }
  }
  
  // מיין לפי זמן
  return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Endpoint לסגירת תלונה על ידי תושב (אם פתרנו את הבעיה)
app.post('/api/citizen/complaints/:id/mark-resolved', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body; // אופציונלי: לקבל משוב מהתושב
    const { userId } = req;
    
    // מצא את התלונה
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'התלונה לא נמצאה'
      });
    }
    
    // וודא שהתלונה שייכת לתושב הזה
    if (complaint.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'אין הרשאה לעדכן תלונה זו'
      });
    }
    
    // וודא שהתלונה לא סגורה
    if (complaint.status === 'closed') {
      return res.status(400).json({
        status: 'error',
        message: 'התלונה כבר סגורה'
      });
    }
    
    // עדכן את סטטוס התלונה ל"סגור"
    complaint.status = 'closed';
    complaint.citizenFeedback = feedback;
    complaint.closedAt = new Date();
    
    // הוסף תגובת מערכת
    complaint.responses.push({
      message: 'התלונה נסגרה על ידי התושב',
      fromEmployee: false,
      systemGenerated: true,
      createdAt: new Date()
    });
    
    await complaint.save();
    
    res.json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    console.error('שגיאה בסגירת תלונה:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בסגירת תלונה'
    });
  }
});

module.exports = {
  verifyToken
};





// נוסיף סכמה של התראות למונגו
const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['new_response', 'status_update', 'assigned', 'system'],
    default: 'system'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  complaintId: {
    type: String,
    required: false
  },
  complaintTitle: {
    type: String,
    required: false
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model("Notifications", NotificationSchema);

// פונקציה ליצירת התראה חדשה
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    console.log(`הודעה חדשה נוצרה למשתמש ${notificationData.userId}: ${notificationData.title}`);
    return notification;
  } catch (error) {
    console.error('שגיאה ביצירת התראה:', error);
    throw error;
  }
};

// עדכון ערך בסכמת תלונות כדי לעקוב אחרי תגובות חדשות
// תוסיף את זה בסכמת Complaint
// lastViewedByUser: {
//   type: Date,
//   default: null
// }

// Endpoint לקבלת כל ההתראות למשתמש
app.get('/api/citizen/notifications', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // קבל את כל ההתראות של המשתמש, מסודרות מהחדשה לישנה
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100); // הגבלת כמות התראות שנשלפות לביצועים טובים יותר
    
    res.json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    console.error('שגיאה בקבלת התראות:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת התראות'
    });
  }
});

// Endpoint לסימון התראה בודדת כנקראה
app.post('/api/citizen/notifications/:id/mark-read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    
    // מצא ועדכן את ההתראה
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId }, // וודא שההתראה שייכת למשתמש
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'ההתראה לא נמצאה'
      });
    }
    
    res.json({
      status: 'success',
      data: notification
    });
  } catch (error) {
    console.error('שגיאה בסימון התראה כנקראה:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בסימון התראה כנקראה'
    });
  }
});

// Endpoint לסימון כל ההתראות כנקראו
app.post('/api/citizen/notifications/mark-all-read', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // עדכן את כל ההתראות של המשתמש
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({
      status: 'success',
      data: {
        modifiedCount: result.nModified || result.modifiedCount
      }
    });
  } catch (error) {
    console.error('שגיאה בסימון כל ההתראות כנקראו:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בסימון התראות כנקראות'
    });
  }
});

// Endpoint לקבלת מספר ההתראות שלא נקראו
app.get('/api/citizen/notifications/unread-count', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // ספור כמה התראות לא נקראו
    const count = await Notification.countDocuments({ userId, read: false });
    
    res.json({
      status: 'success',
      data: { count }
    });
  } catch (error) {
    console.error('שגיאה בספירת התראות שלא נקראו:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בספירת התראות'
    });
  }
});

// Endpoint למחיקת התראה בודדת
app.delete('/api/citizen/notifications/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    
    // מחק את ההתראה אם היא שייכת למשתמש
    const result = await Notification.findOneAndDelete({ _id: id, userId });
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'ההתראה לא נמצאה'
      });
    }
    
    res.json({
      status: 'success',
      data: { deleted: true }
    });
  } catch (error) {
    console.error('שגיאה במחיקת התראה:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת במחיקת התראה'
    });
  }
});

// עדכון הendpoint להוספת תגובה כדי שייצור התראה
app.post('/api/complaints/:id/respond', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message, fromEmployee } = req.body;
    
    // וודא שקיבלנו הודעה
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Response message cannot be empty'
      });
    }
    
    // מצא את התלונה
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }
    
    // בדיקות הרשאה שונות לפי סוג משתמש
    if (!fromEmployee && complaint.userId !== req.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to respond to this complaint'
      });
    }
    
    if (fromEmployee && 
        req.userRole === 'employee' && 
        !req.userCategories.includes(complaint.category)) {
      return res.status(403).json({
        status: 'error',
        message: 'This complaint is not in your assigned categories'
      });
    }
    
    // הוסף את התגובה לתלונה
    complaint.responses.push({
      message,
      fromEmployee,
      createdAt: new Date()
    });
    
    await complaint.save();
    
    // אם זו תגובה מעובד ולא מהתושב עצמו, צור התראה
    if (fromEmployee) {
      // קבל את פרטי העובד
      const employee = await User.findById(req.userId, 'name');
      const employeeName = employee ? employee.name : 'צוות העירייה';
      
      // צור התראה לתושב
      await createNotification({
        userId: complaint.userId,
        type: 'new_response',
        title: 'תגובה חדשה לתלונה שלך',
        message: `התקבלה תגובה חדשה מ${employeeName}: "${message.length > 50 ? message.substring(0, 50) + '...' : message}"`,
        complaintId: id,
        complaintTitle: complaint.title
      });
    }
    
    res.json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// // עדכון הendpoint לשינוי סטטוס תלונה
// app.patch('/api/complaints/:id/process', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     console.log('Updating status for complaint:', req.params.id);
//     console.log('Request from user:', req.userId);
//     console.log('New status:', req.body.status);
    
//     // וידוא משתמש עובד
//     if (req.userRole !== 'employee') {
//       return res.status(403).json({
//         status: 'error',
//         message: 'Only employees can update complaint status'
//       });
//     }
    
//     // בדיקת תקינות הסטטוס
//     const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Invalid status value'
//       });
//     }
    
//     // מצא את התלונה
//     const complaint = await Complaint.findById(id);
    
//     if (!complaint) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Complaint not found'
//       });
//     }
    
//     // בדיקות הרשאה
//     if (!req.userCategories.includes(complaint.category)) {
//       return res.status(403).json({
//         status: 'error',
//         message: 'You do not have permission for this complaint category'
//       });
//     }
    
//     const oldStatus = complaint.status;
    
//     // עדכון התלונה
//     if (!complaint.assignedTo) {
//       complaint.assignedTo = req.userId;
//     } else if (complaint.assignedTo.toString() !== req.userId) {
//       return res.status(403).json({
//         status: 'error',
//         message: 'You are not assigned to this complaint'
//       });
//     }
    
//     // אם יש שינוי סטטוס, הוסף תגובת מערכת
//     if (oldStatus !== status) {
//       const statusMessage = getStatusChangeMessage(oldStatus, status);
      
//       complaint.responses.push({
//         message: statusMessage,
//         fromEmployee: true,
//         systemGenerated: true,
//         createdAt: new Date()
//       });
      
//       // יצירת התראה לתושב
//       await createNotification({
//         userId: complaint.userId,
//         type: 'status_update',
//         title: `הסטטוס של התלונה שלך עודכן ל${getStatusHebrew(status)}`,
//         message: statusMessage,
//         complaintId: id,
//         complaintTitle: complaint.title
//       });
//     }
    
//     // עדכון סטטוס
//     complaint.status = status;
    
//     // אם הסטטוס סגור, הוסף תאריך סגירה
//     if (status === 'closed') {
//       complaint.closedAt = new Date();
//     }
    
//     // שמירת התלונה המעודכנת
//     await complaint.save();
    
//     res.json({
//       status: 'success',
//       data: complaint
//     });
//   } catch (error) {
//     console.error('Error updating complaint status:', error);
//     res.status(500).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// });

// פונקציות עזר

// המרת סטטוס לעברית
function getStatusHebrew(status) {
  const statusLabels = {
    open: 'ממתין לטיפול',
    in_progress: 'בטיפול',
    resolved: 'טופל',
    closed: 'סגור'
  };
  
  return statusLabels[status] || 'לא ידוע';
}

// יצירת הודעת שינוי סטטוס
function getStatusChangeMessage(oldStatus, newStatus) {
  if (oldStatus === 'open' && newStatus === 'in_progress') {
    return 'התלונה התחילה להיות מטופלת';
  } else if (oldStatus === 'in_progress' && newStatus === 'resolved') {
    return 'הטיפול בתלונה הושלם';
  } else if (newStatus === 'closed') {
    return 'התלונה נסגרה';
  } else {
    return `סטטוס התלונה עודכן מ${getStatusHebrew(oldStatus)} ל${getStatusHebrew(newStatus)}`;
  }
}

// עדכון הendpoint לחיבור עובד לתלונה כדי שייצור התראה
app.post('/api/complaints/:id/assign', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // וידוא משתמש עובד
    if (req.userRole !== 'employee') {
      return res.status(403).json({
        status: 'error',
        message: 'Only employees can be assigned to complaints'
      });
    }
    
    // מצא את התלונה
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found'
      });
    }
    
    // בדיקות הרשאה
    if (!req.userCategories.includes(complaint.category)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission for this complaint category'
      });
    }
    
    // בדיקה אם התלונה כבר משויכת
    if (complaint.assignedTo) {
      return res.status(400).json({
        status: 'error',
        message: 'This complaint is already assigned to an employee'
      });
    }
    
    // חיבור התלונה לעובד
    complaint.assignedTo = req.userId;
    
    // עדכון סטטוס אם צריך
    if (complaint.status === 'open') {
      complaint.status = 'in_progress';
    }
    
    // הוספת תגובת מערכת
    complaint.responses.push({
      message: 'התלונה נלקחה לטיפול',
      fromEmployee: true,
      systemGenerated: true,
      createdAt: new Date()
    });
    
    // שמירת התלונה
    await complaint.save();
    
    // יצירת התראה לתושב
    const employee = await User.findById(req.userId, 'name');
    const employeeName = employee ? employee.name : 'צוות העירייה';
    
    await createNotification({
      userId: complaint.userId,
      type: 'assigned',
      title: 'התלונה שלך נלקחה לטיפול',
      message: `${employeeName} לקח/ה אחריות על הטיפול בתלונה שלך`,
      complaintId: id,
      complaintTitle: complaint.title
    });
    
    res.json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    console.error('Error assigning complaint:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// הוספת Endpoint לקבלת סטטיסטיקות תלונות לתושב
app.get('/api/citizen/complaint-stats', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // קבל את כל התלונות של התושב
    const complaints = await Complaint.find({ userId });
    
    // חישוב סטטיסטיקות
    const stats = {
      total: complaints.length,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };
    
    // ספירת תלונות לפי סטטוס
    complaints.forEach(complaint => {
      const status = complaint.status || 'open';
      if (stats[status] !== undefined) {
        stats[status]++;
      }
    });
    
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת סטטיסטיקות תלונה'
    });
  }
});

// Endpoint לקבלת התלונות האחרונות של התושב
app.get('/api/citizen/complaints/recent', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // קבל את 5 התלונות האחרונות של התושב
    const complaints = await Complaint.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // קבל את ההתראות הלא נקראות
    const notifications = await Notification.find({ 
      userId, 
      read: false,
      type: 'new_response'
    });
    
    // מיפוי התלונות כולל מידע אם יש תגובות חדשות
    const enrichedComplaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject();
      
      // בדוק אם יש התראות חדשות לתלונה זו
      const hasNewResponses = notifications.some(notification => 
        notification.complaintId === complaint._id.toString()
      );
      
      // הוסף נתונים נוספים לתלונה
      return {
        ...complaintObj,
        meta: {
          ...(complaintObj.meta || {}),
          hasNewResponses
        }
      };
    });
    
    res.json({
      status: 'success',
      data: enrichedComplaints
    });
  } catch (error) {
    console.error('Error fetching recent complaints:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת תלונות אחרונות'
    });
  }
});

// Endpoint לסימון כל התראות התגובות כנקראו עבור תלונה מסוימת
app.post('/api/citizen/complaints/:id/mark-updates-read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    
    // וודא שהתלונה שייכת למשתמש
    const complaint = await Complaint.findOne({ _id: id, userId });
    
    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'התלונה לא נמצאה או שאין הרשאה'
      });
    }
    
    // עדכן את כל ההתראות הקשורות לתלונה זו
    await Notification.updateMany(
      { 
        userId,
        complaintId: id,
        read: false 
      },
      { read: true }
    );
    
    // עדכן את זמן הצפייה האחרון בתלונה
    complaint.lastViewedByUser = new Date();
    await complaint.save();
    
    res.json({
      status: 'success',
      data: { updated: true }
    });
  } catch (error) {
    console.error('Error marking updates as read:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בסימון עדכונים כנקראו'
    });
  }
});

// Endpoint לקבלת סיכום התראות לדשבורד
app.get('/api/citizen/dashboard-summary', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // ביצוע מספר שאילתות במקביל לשיפור ביצועים
    const [complaints, unreadNotifications, recentNotifications] = await Promise.all([
      // קבלת סטטיסטיקות תלונות
      Complaint.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // ספירת התראות שלא נקראו
      Notification.countDocuments({ userId, read: false }),
      
      // קבלת שלוש ההתראות האחרונות
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3)
    ]);
    
    // עיבוד סטטיסטיקות התלונות
    const statsMap = {
      total: 0,
      open: 0, 
      in_progress: 0, 
      resolved: 0, 
      closed: 0
    };
    
    complaints.forEach(item => {
      if (item._id) {
        statsMap[item._id] = item.count;
        statsMap.total += item.count;
      }
    });
    
    res.json({
      status: 'success',
      data: {
        stats: statsMap,
        notifications: {
          unreadCount: unreadNotifications,
          recent: recentNotifications
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת נתוני דשבורד'
    });
  }
});

// הוספת webhook או טריגר שיוצר התראות כאשר מתעדכן סטטוס תלונה
// לדוגמה, אפשר להוסיף ל-mongo middleware או להשתמש בפונקציה נפרדת שתקרא מכל endpoint שמעדכן תלונות

// דוגמה ל-middleware בסכמת Complaint
ComplaintSchema.pre('save', async function(next) {
  // בדוק אם זה מסמך חדש או עדכון
  if (!this.isNew) {
    try {
      // קבל את הגרסה הקודמת של התלונה
      const oldComplaint = await Complaint.findById(this._id);
      
      // אם הסטטוס השתנה
      if (oldComplaint && this.status !== oldComplaint.status) {
        console.log(`סטטוס תלונה השתנה מ-${oldComplaint.status} ל-${this.status}`);
        
        // צור התראה רק אם לא נקראה כבר על ידי endpoint עדכון סטטוס
        const notificationExists = await Notification.findOne({
          userId: this.userId,
          complaintId: this._id,
          type: 'status_update',
          // בדוק שנוצר לפני פחות משעה (למנוע כפילות)
          createdAt: { $gte: new Date(Date.now() - 3600000) }
        });
        
        if (!notificationExists) {
          // צור התראה
          const statusMessage = getStatusChangeMessage(oldComplaint.status, this.status);
          
          await createNotification({
            userId: this.userId,
            type: 'status_update',
            title: `הסטטוס של התלונה שלך עודכן ל${getStatusHebrew(this.status)}`,
            message: statusMessage,
            complaintId: this._id,
            complaintTitle: this.title
          });
        }
      }
    } catch (error) {
      console.error('שגיאה ביצירת התראת שינוי סטטוס:', error);
      // אל תעצור את השמירה אם יש שגיאה ביצירת ההתראה
    }
  }
  
  next();
});

// Endpoint לקבלת נתוני משתמש בסיסיים לדשבורד
app.get('/api/citizen/profile', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // קבל פרטי משתמש מהמסד נתונים
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'המשתמש לא נמצא'
      });
    }
    
    // ספור כמה התראות שלא נקראו יש למשתמש
    const notificationsCount = await Notification.countDocuments({ userId, read: false });
    
    // החזר מידע בסיסי על המשתמש
    res.json({
      status: 'success',
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        notifications: notificationsCount
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת בקבלת פרטי משתמש'
    });
  }
});







// הוספת endpoint לשליחת חוות דעת
app.post('/api/complaints/:id/feedback', verifyToken, async (req, res) => {
  try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const { userId } = req;

      console.log('======= FEEDBACK DEBUG =======');
      console.log('Complaint ID:', id);
      console.log('User ID:', userId);
      console.log('Full Request Body:', JSON.stringify(req.body));
      console.log('Rating:', rating);
      console.log('Comment:', comment);
      console.log('Request Headers:', JSON.stringify(req.headers));
      console.log('============================');

      // וידוא קלט תקין
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
          console.log('ERROR: Invalid rating value:', rating, 'Type:', typeof rating);
          return res.status(400).json({
              status: 'error',
              message: 'דירוג חייב להיות מספר בין 1 ל-5 כוכבים'
          });
      }

      // המרה מפורשת למספר (למקרה שהגיע כמחרוזת)
      const numericRating = Number(rating);

      // מצא את התלונה
      const complaint = await Complaint.findById(id);
      
      if (!complaint) {
          console.log('ERROR: Complaint not found with ID:', id);
          return res.status(404).json({
              status: 'error',
              message: 'התלונה לא נמצאה'
          });
      }

      console.log('Complaint found:', {
          id: complaint._id,
          status: complaint.status,
          userId: complaint.userId,
          hasFeedback: !!complaint.feedback
      });
      
      // וודא שהתלונה שייכת לתושב
      if (complaint.userId !== userId) {
          console.log('ERROR: User ID mismatch. Complaint belongs to:', complaint.userId, 'but request from:', userId);
          return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לשלוח חוות דעת לתלונה זו'
          });
      }
      
      // וודא שהתלונה במצב שניתן לתת עליה חוות דעת
      if (complaint.status !== 'resolved' && complaint.status !== 'closed') {
          console.log('ERROR: Invalid complaint status for feedback:', complaint.status);
          return res.status(400).json({
              status: 'error',
              message: 'ניתן לשלוח חוות דעת רק לתלונות שטופלו או נסגרו'
          });
      }
      
      // וודא שאין עדיין חוות דעת
      if (complaint.feedback && complaint.feedback.rating) {
          console.log('ERROR: Feedback already exists:', complaint.feedback);
          return res.status(400).json({
              status: 'error',
              message: 'כבר נשלחה חוות דעת לתלונה זו'
          });
      }
      
      console.log('All checks passed, proceeding to add feedback');

      // הוסף את חוות הדעת לתלונה
      complaint.feedback = {
          rating: numericRating,
          comment: comment || '',
          submittedAt: new Date()
      };
      
      // אם לא נסגרה עדיין התלונה, סגור אותה
      if (complaint.status === 'resolved') {
          console.log('Closing complaint due to feedback');
          complaint.status = 'closed';
          complaint.closedAt = new Date();
          
          // הוסף תגובה מערכתית על סגירת התלונה
          complaint.responses.push({
              message: 'התלונה נסגרה בעקבות חוות הדעת של התושב',
              fromEmployee: false,
              systemGenerated: true,
              createdAt: new Date()
          });
      }
      
      // שמור את העדכונים
      try {
          await complaint.save();
          console.log('Feedback saved successfully:', complaint.feedback);
      } catch (saveError) {
          console.log('ERROR saving complaint:', saveError);
          return res.status(500).json({
              status: 'error',
              message: 'שגיאה בשמירת חוות הדעת',
              details: saveError.message
          });
      }
      
      // החזר תשובה עם התלונה המעודכנת
      res.json({
          status: 'success',
          message: 'חוות הדעת נשמרה בהצלחה',
          data: complaint
      });
  } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({
          status: 'error',
          message: 'שגיאת שרת בשליחת חוות דעת'
      });
  }
});

// Endpoint לקבלת סטטיסטיקות חוות דעת לפי קטגוריה
app.get('/api/admin/feedback-stats', verifyToken, async (req, res) => {
  try {
      // וודא שהמשתמש הוא מנהל
      // if (req.userRole !== 'admin') {
      if (req.userRole !== 'manager') {
          return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לצפות בסטטיסטיקות'
          });
      }
      
      // אסוף סטטיסטיקות לפי קטגוריות
      const categoryStats = await Complaint.aggregate([
          // רק תלונות עם חוות דעת
          { $match: { 'feedback': { $exists: true, $ne: null } } },
          // קבץ לפי קטגוריה וחשב ממוצעים
          { 
              $group: { 
                  _id: '$category', 
                  averageRating: { $avg: '$feedback.rating' },
                  count: { $sum: 1 },
                  ratings: { 
                      $push: '$feedback.rating' 
                  }
              } 
          },
          // הוסף חלוקה של הדירוגים
          { 
              $addFields: {
                  ratingDistribution: {
                      1: { 
                          $size: { 
                              $filter: { 
                                  input: '$ratings', 
                                  as: 'rating', 
                                  cond: { $eq: ['$$rating', 1] } 
                              } 
                          } 
                      },
                      2: { 
                          $size: { 
                              $filter: { 
                                  input: '$ratings', 
                                  as: 'rating', 
                                  cond: { $eq: ['$$rating', 2] } 
                              } 
                          } 
                      },
                      3: { 
                          $size: { 
                              $filter: { 
                                  input: '$ratings', 
                                  as: 'rating', 
                                  cond: { $eq: ['$$rating', 3] } 
                              } 
                          } 
                      },
                      4: { 
                          $size: { 
                              $filter: { 
                                  input: '$ratings', 
                                  as: 'rating', 
                                  cond: { $eq: ['$$rating', 4] } 
                              } 
                          } 
                      },
                      5: { 
                          $size: { 
                              $filter: { 
                                  input: '$ratings', 
                                  as: 'rating', 
                                  cond: { $eq: ['$$rating', 5] } 
                              } 
                          } 
                      }
                  }
              }
          },
          // הסר את רשימת הדירוגים המלאה שלא נחוצה יותר
          {
              $project: {
                  ratings: 0
              }
          },
          // מיון לפי ממוצע דירוג
          { $sort: { averageRating: -1 } }
      ]);
      
      // חשב סטטיסטיקות כלליות
      const overallStats = await Complaint.aggregate([
          { $match: { 'feedback': { $exists: true, $ne: null } } },
          { 
              $group: { 
                  _id: null, 
                  averageRating: { $avg: '$feedback.rating' },
                  count: { $sum: 1 },
                  ratingDistribution: {
                      $push: '$feedback.rating'
                  }
              } 
          }
      ]);
      
      // אם יש סטטיסטיקות כלליות, חשב את התפלגות הדירוגים
      let overallData = null;
      if (overallStats.length > 0) {
          const ratings = overallStats[0].ratingDistribution;
          overallData = {
              averageRating: overallStats[0].averageRating,
              count: overallStats[0].count,
              ratingDistribution: {
                  1: ratings.filter(r => r === 1).length,
                  2: ratings.filter(r => r === 2).length,
                  3: ratings.filter(r => r === 3).length,
                  4: ratings.filter(r => r === 4).length,
                  5: ratings.filter(r => r === 5).length
              }
          };
      }
      
      res.json({
          status: 'success',
          data: {
              overall: overallData,
              byCategory: categoryStats
          }
      });
  } catch (error) {
      console.error('Error fetching feedback stats:', error);
      res.status(500).json({
          status: 'error',
          message: 'שגיאת שרת בקבלת סטטיסטיקות חוות דעת'
      });
  }
});

// Endpoint לקבלת התגובות המילוליות האחרונות של התושבים (להצגה בדשבורד)
app.get('/api/admin/recent-feedback', verifyToken, async (req, res) => {
  try {
      // וודא שהמשתמש הוא מנהל
      if (req.userRole !== 'manager' && req.userRole !== 'employee') {
          return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לצפות בחוות דעת'
          });
      }

      // הגבלה לקטגוריות אם המשתמש הוא עובד
      const categoryFilter = req.userRole === 'employee' ? 
          { category: { $in: req.userCategories } } : {};
      
      // קח רק את חוות הדעת האחרונות ורק כאלה עם הערות מילוליות
      const recentFeedback = await Complaint.find({
          ...categoryFilter,
          'feedback': { $exists: true, $ne: null },
          'feedback.comment': { $exists: true, $ne: '' }
      })
      .select('title category feedback createdAt status')
      .sort({ 'feedback.submittedAt': -1 })
      .limit(10);
      
      res.json({
          status: 'success',
          data: recentFeedback
      });
  } catch (error) {
      console.error('Error fetching recent feedback:', error);
      res.status(500).json({
          status: 'error',
          message: 'שגיאת שרת בקבלת חוות דעת אחרונות'
      });
  }
});

// Endpoint לקבלת מידע על שיפור השירות לאורך זמן
app.get('/api/admin/feedback-trends', verifyToken, async (req, res) => {
  try {
      // וודא שהמשתמש הוא מנהל
      if (req.userRole !== 'admin') {
          return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לצפות במגמות'
          });
      }
      
      // קבל נתוני חוות דעת עם זמנים
      const allFeedback = await Complaint.find({
          'feedback': { $exists: true, $ne: null }
      })
      .select('feedback.rating feedback.submittedAt')
      .sort({ 'feedback.submittedAt': 1 });
      
      // ארגן את הנתונים לפי חודשים
      const monthlyTrends = {};
      
      allFeedback.forEach(complaint => {
          if (complaint.feedback && complaint.feedback.submittedAt) {
              const date = new Date(complaint.feedback.submittedAt);
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              
              if (!monthlyTrends[monthKey]) {
                  monthlyTrends[monthKey] = {
                      count: 0,
                      sum: 0
                  };
              }
              
              monthlyTrends[monthKey].count++;
              monthlyTrends[monthKey].sum += complaint.feedback.rating;
          }
      });
      
      // חשב ממוצעים חודשיים
      const trends = Object.keys(monthlyTrends).map(month => {
          const data = monthlyTrends[month];
          return {
              month,
              averageRating: data.sum / data.count,
              count: data.count
          };
      });
      
      res.json({
          status: 'success',
          data: {
              trends
          }
      });
  } catch (error) {
      console.error('Error fetching feedback trends:', error);
      res.status(500).json({
          status: 'error',
          message: 'שגיאת שרת בקבלת מגמות חוות דעת'
      });
  }
});















// // פונקציות AI אמיתיות עם DeepSeek
// class AIAnalysisService {
//     static async makeDeepSeekRequest(prompt, maxTokens = 100) {
//         try {
//             const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
//                 },
//                 body: JSON.stringify({
//                     model: 'deepseek-chat',
//                     messages: [{ role: 'user', content: prompt }],
//                     max_tokens: maxTokens,
//                     temperature: 0.1
//                 })
//             });

//             const data = await response.json();
//             return data.choices[0].message.content.trim();
//         } catch (error) {
//             console.error('DeepSeek API error:', error);
//             return null;
//         }
//     }

//     // ניתוח סנטימנט
//     static async analyzeSentiment(text) {
//         const prompt = `נתח את הסנטימנט של התלונה הבאה. השב במילה אחת בלבד: positive, negative, neutral, או urgent.

// תלונה: "${text}"

// סנטימנט:`;

//         const result = await this.makeDeepSeekRequest(prompt, 10);
//         return result?.toLowerCase() || 'neutral';
//     }

//     // קטגוריזציה
//     static async categorizeComplaint(text) {
//         const prompt = `סווג את התלונה הבאה לאחת מהקטגוריות הבאות. השב רק בשם הקטגוריה באנגלית:
// - infrastructure (תשתיות)
// - sanitation (ניקיון) 
// - transportation (תחבורה)
// - lighting (תאורה)
// - parks (גנים)
// - safety (ביטחון)
// - other (אחר)

// תלונה: "${text}"

// קטגוריה:`;

//         const result = await this.makeDeepSeekRequest(prompt, 20);
//         return result?.toLowerCase() || 'other';
//     }

//     // הערכת דחיפות
//     static async assessUrgency(text) {
//         const prompt = `הערך את רמת הדחיפות של התלונה הבאה. השב במילה אחת בלבד:
// - low (נמוכה)
// - medium (בינונית)  
// - high (גבוהה)
// - critical (קריטית)

// תלונה: "${text}"

// דחיפות:`;

//         const result = await this.makeDeepSeekRequest(prompt, 10);
//         return result?.toLowerCase() || 'medium';
//     }
// }

// // endpoint לבדיקת ניתוח אמיתי
// app.get('/test-real-ai-analysis', async (req, res) => {
//     try {
//         const testText = "אני מאוד כועס על הבור בכביש שכבר שבוע לא מתקנים אותו! זה מסוכן ונוצרות פקקים!";
        
//         console.log('🤖 Starting real AI analysis...');
        
//         const [sentiment, category, urgency] = await Promise.all([
//             AIAnalysisService.analyzeSentiment(testText),
//             AIAnalysisService.categorizeComplaint(testText), 
//             AIAnalysisService.assessUrgency(testText)
//         ]);

//         const riskScore = calculateRiskScore(sentiment, urgency);

//         res.json({
//             success: true,
//             input: testText,
//             analysis: {
//                 sentiment,
//                 category, 
//                 urgency,
//                 riskScore,
//                 riskLevel: riskScore >= 0.7 ? 'high' : riskScore >= 0.4 ? 'medium' : 'low'
//             },
//             provider: "DeepSeek AI",
//             timestamp: new Date().toISOString()
//         });

//     } catch (error) {
//         res.json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // פונקציית עזר לחישוב ציון סיכון
// function calculateRiskScore(sentiment, urgency) {
//     let score = 0.5;
    
//     if (sentiment === 'negative') score += 0.2;
//     if (sentiment === 'urgent') score += 0.4;
//     if (sentiment === 'positive') score -= 0.1;
    
//     if (urgency === 'critical') score += 0.4;
//     if (urgency === 'high') score += 0.3;
//     if (urgency === 'medium') score += 0.1;
//     if (urgency === 'low') score -= 0.1;
    
//     return Math.min(Math.max(score, 0), 1);
// }

// console.log('🎯 Real AI Analysis endpoints added!');





// הוספות לשרת התלונות - ניתוח AI למנהל עם DeepSeek
// צריך להוסיף את הקוד הזה ל-complaintServer.js שלך

// הגדרת DeepSeek (הוסף את זה בראש הקובץ)
require('dotenv').config();

// פונקציות עזר לניתוח AI עם DeepSeek
class AIAnalysisService {
    // פונקציה בסיסית לקריאה ל-DeepSeek API
    static async makeDeepSeekRequest(prompt, maxTokens = 100) {
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: maxTokens,
                    temperature: 0.1
                })
            });

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('DeepSeek API error:', error);
            return null;
        }
    }

    // ניתוח סנטימנט
    static async analyzeSentiment(text) {
        try {
            const prompt = `נתח את הסנטימנט של התלונה הבאה בעברית. השב במילה אחת בלבד: positive, negative, neutral, או urgent.

תלונה: "${text}"

סנטימנט:`;

            const result = await this.makeDeepSeekRequest(prompt, 10);
            return result?.toLowerCase() || 'neutral';
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return 'neutral';
        }
    }

    // קטגוריזציה אוטומטית
    static async categorizeComplaint(text) {
        try {
            const prompt = `סווג את התלונה הבאה לאחת מהקטגוריות:
- infrastructure (תשתיות)
- sanitation (ניקיון)
- transportation (תחבורה)
- lighting (תאורה)
- parks (גנים)
- safety (ביטחון)
- other (אחר)

השב רק בשם הקטגוריה באנגלית.

תלונה: "${text}"

קטגוריה:`;

            const result = await this.makeDeepSeekRequest(prompt, 20);
            return result?.toLowerCase() || 'other';
        } catch (error) {
            console.error('Categorization error:', error);
            return 'other';
        }
    }

    // הערכת דחיפות
    static async assessUrgency(text) {
        try {
            const prompt = `הערך את רמת הדחיפות של התלונה הבאה:
- low: תחזוקה שגרתית, בעיות קלות
- medium: בעיות המשפיעות על החיים היומיומיים
- high: חששות בטיחות, הפרעות משמעותיות
- critical: סכנה מיידית, מצב חירום

השב במילה אחת בלבד.

תלונה: "${text}"

דחיפות:`;

            const result = await this.makeDeepSeekRequest(prompt, 10);
            return result?.toLowerCase() || 'medium';
        } catch (error) {
            console.error('Urgency assessment error:', error);
            return 'medium';
        }
    }

    // זיהוי מילות מפתח
    static async extractKeywords(text) {
        try {
            const prompt = `חלץ 3-5 מילות מפתח חשובות מהתלונה הבאה בעברית. השב כרשימה מופרדת בפסיקים.

תלונה: "${text}"

מילות מפתח:`;

            const result = await this.makeDeepSeekRequest(prompt, 50);
            return result ? result.split(',').map(kw => kw.trim()) : [];
        } catch (error) {
            console.error('Keyword extraction error:', error);
            return [];
        }
    }

    // יצירת דוח מגמות
    static async generateTrendsReport(complaints) {
        try {
            const complaintsText = complaints
                .slice(0, 10)
                .map(c => `${c.title}: ${c.description}`)
                .join('\n---\n');

            const prompt = `נתח את התלונות הבאות והכן דוח מגמות בעברית הכולל:
1. בעיות חוזרות עיקריות
2. אזורים/נושאים בעייתיים ביותר
3. המלצות מעשיות לממשל העיר

השב בעברית בצורה קצרה ומעשית.

התלונות:
${complaintsText}

דוח מגמות:`;

            const result = await this.makeDeepSeekRequest(prompt, 300);
            return result || 'לא ניתן היה לבצע ניתוח מגמות כרגע';
        } catch (error) {
            console.error('Trends analysis error:', error);
            return 'לא ניתן היה לבצע ניתוח מגמות כרגע';
        }
    }
}

// ======= Endpoints חדשים למנהל =======

// 1. ניתוח AI כללי של כל התלונות
app.get('/api/admin/ai-analysis', verifyToken, async (req, res) => {
    try {
        // וודא שהמשתמש הוא מנהל
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בניתוח AI'
            });
        }

        // קבל את כל התלונות
        const complaints = await Complaint.find({})
            .select('title description category status createdAt')
            .sort({ createdAt: -1 })
            .limit(50); // הגבל ל-50 תלונות אחרונות לביצועים

        console.log(`Starting DeepSeek AI analysis for ${complaints.length} complaints`);

        const analysisResults = [];

        // בצע ניתוח AI על כל תלונה (בבאצ'ים כדי לא לחרוג מגבולות API)
        for (let i = 0; i < complaints.length; i++) {
            const complaint = complaints[i];
            const fullText = `${complaint.title} ${complaint.description}`;
            
            try {
                const [sentiment, aiCategory, urgency, keywords] = await Promise.all([
                    AIAnalysisService.analyzeSentiment(fullText),
                    AIAnalysisService.categorizeComplaint(fullText),
                    AIAnalysisService.assessUrgency(fullText),
                    AIAnalysisService.extractKeywords(fullText)
                ]);

                const riskScore = calculateRiskScore(sentiment, urgency);

                analysisResults.push({
                    id: complaint._id,
                    title: complaint.title,
                    originalCategory: complaint.category,
                    aiAnalysis: {
                        sentiment,
                        aiCategory,
                        urgency,
                        keywords,
                        categoryMatch: complaint.category.toLowerCase() === aiCategory,
                        riskScore
                    },
                    status: complaint.status,
                    createdAt: complaint.createdAt
                });

            } catch (error) {
                console.error(`Error analyzing complaint ${complaint._id}:`, error);
                // הוסף תוצאה ברירת מחדל במקרה של שגיאה
                analysisResults.push({
                    id: complaint._id,
                    title: complaint.title,
                    originalCategory: complaint.category,
                    aiAnalysis: {
                        sentiment: 'neutral',
                        aiCategory: 'other',
                        urgency: 'medium',
                        keywords: [],
                        categoryMatch: true,
                        riskScore: 0.5
                    },
                    status: complaint.status,
                    createdAt: complaint.createdAt
                });
            }

            // השהייה קצרה בין בקשות כדי לא לעמוס על API
            if (i < complaints.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`DeepSeek AI analysis completed for ${analysisResults.length} complaints`);

        res.json({
            status: 'success',
            data: {
                totalAnalyzed: analysisResults.length,
                complaints: analysisResults,
                summary: generateAnalysisSummary(analysisResults)
            }
        });

    } catch (error) {
        console.error('Error in AI analysis:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בביצוע ניתוח AI'
        });
    }
});

// 2. דוח מגמות מבוסס AI
app.get('/api/admin/ai-trends-report', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בדוח מגמות'
            });
        }

        // קבל תלונות אחרונות
        const recentComplaints = await Complaint.find({})
            .select('title description category status createdAt')
            .sort({ createdAt: -1 })
            .limit(20);

        // יצר דוח מגמות
        const trendsReport = await AIAnalysisService.generateTrendsReport(recentComplaints);

        // ניתוח סטטיסטי בסיסי
        const categoryStats = {};
        const statusStats = {};
        const monthlyStats = {};

        recentComplaints.forEach(complaint => {
            // ספירה לפי קטגוריה
            categoryStats[complaint.category] = (categoryStats[complaint.category] || 0) + 1;
            
            // ספירה לפי סטטוס
            statusStats[complaint.status] = (statusStats[complaint.status] || 0) + 1;
            
            // ספירה לפי חודש
            const month = new Date(complaint.createdAt).toISOString().substring(0, 7);
            monthlyStats[month] = (monthlyStats[month] || 0) + 1;
        });

        res.json({
            status: 'success',
            data: {
                aiReport: trendsReport,
                statistics: {
                    byCategory: categoryStats,
                    byStatus: statusStats,
                    byMonth: monthlyStats
                },
                totalComplaints: recentComplaints.length,
                generatedAt: new Date()
            }
        });

    } catch (error) {
        console.error('Error generating trends report:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה ביצירת דוח מגמות'
        });
    }
});

// 3. זיהוי תלונות בסיכון גבוה
app.get('/api/admin/high-risk-complaints', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בתלונות בסיכון גבוה'
            });
        }

        // קבל תלונות פתוחות
        const openComplaints = await Complaint.find({
            status: { $in: ['open', 'in_progress'] }
        })
        .select('title description category status createdAt')
        .sort({ createdAt: -1 });

        // נתח כל תלונה ומצא את אלה עם סיכון גבוה
        const highRiskComplaints = [];

        for (const complaint of openComplaints.slice(0, 15)) { // הגבל ל-15 הראשונות
            const fullText = `${complaint.title} ${complaint.description}`;
            
            try {
                const [sentiment, urgency] = await Promise.all([
                    AIAnalysisService.analyzeSentiment(fullText),
                    AIAnalysisService.assessUrgency(fullText)
                ]);

                const riskScore = calculateRiskScore(sentiment, urgency);
                const daysOpen = Math.floor((new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));

                // סיכון גבוה: ציון סיכון גבוה או תלונה פתוחה זמן רב
                if (riskScore >= 0.6 || daysOpen > 5 || urgency === 'critical' || urgency === 'high') {
                    highRiskComplaints.push({
                        ...complaint.toObject(),
                        aiAnalysis: {
                            sentiment,
                            urgency,
                            riskScore,
                            daysOpen,
                            riskFactors: getRiskFactors(sentiment, urgency, daysOpen)
                        }
                    });
                }

                // השהייה קצרה
                await new Promise(resolve => setTimeout(resolve, 400));

            } catch (error) {
                console.error(`Error analyzing complaint ${complaint._id}:`, error);
            }
        }

        // מיין לפי רמת סיכון
        highRiskComplaints.sort((a, b) => b.aiAnalysis.riskScore - a.aiAnalysis.riskScore);

        res.json({
            status: 'success',
            data: {
                highRiskComplaints,
                totalAnalyzed: Math.min(openComplaints.length, 15),
                riskLevel: highRiskComplaints.length > 8 ? 'high' : 
                           highRiskComplaints.length > 4 ? 'medium' : 'low'
            }
        });

    } catch (error) {
        console.error('Error identifying high-risk complaints:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בזיהוי תלונות בסיכון גבוה'
        });
    }
});

// 4. דשבורד AI מקיף למנהל
app.get('/api/admin/ai-dashboard', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בדשבורד AI'
            });
        }

        // ביצוע מספר שאילתות במקביל
        const [
            totalComplaints,
            recentComplaints,
            openComplaints,
            feedbackStats
        ] = await Promise.all([
            Complaint.countDocuments({}),
            Complaint.find({}).sort({ createdAt: -1 }).limit(10),
            Complaint.find({ status: { $in: ['open', 'in_progress'] } }).limit(5),
            Complaint.aggregate([
                { $match: { 'feedback.rating': { $exists: true } } },
                { $group: { 
                    _id: null, 
                    avgRating: { $avg: '$feedback.rating' },
                    count: { $sum: 1 }
                }}
            ])
        ]);

        // ניתוח מהיר של תלונות אחרונות
        let sentimentSummary = { positive: 0, negative: 0, neutral: 0, urgent: 0 };
        let urgencySummary = { low: 0, medium: 0, high: 0, critical: 0 };

        for (const complaint of recentComplaints.slice(0, 6)) {
            try {
                const fullText = `${complaint.title} ${complaint.description}`;
                const [sentiment, urgency] = await Promise.all([
                    AIAnalysisService.analyzeSentiment(fullText),
                    AIAnalysisService.assessUrgency(fullText)
                ]);

                sentimentSummary[sentiment] = (sentimentSummary[sentiment] || 0) + 1;
                urgencySummary[urgency] = (urgencySummary[urgency] || 0) + 1;

                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.error('Error in dashboard analysis:', error);
            }
        }

        res.json({
            status: 'success',
            data: {
                overview: {
                    totalComplaints,
                    openComplaints: openComplaints.length,
                    averageRating: feedbackStats[0]?.avgRating || 0,
                    totalWithFeedback: feedbackStats[0]?.count || 0
                },
                aiInsights: {
                    sentimentDistribution: sentimentSummary,
                    urgencyDistribution: urgencySummary,
                    analyzedComplaints: Math.min(recentComplaints.length, 6)
                },
                alerts: generateDashboardAlerts(sentimentSummary, urgencySummary),
                lastUpdated: new Date()
            }
        });

    } catch (error) {
        console.error('Error loading AI dashboard:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בטעינת דשבורד AI'
        });
    }
});

// ======= פונקציות עזר =======

// חישוב ציון סיכון
function calculateRiskScore(sentiment, urgency) {
    let score = 0.5; // בסיס
    
    // השפעת סנטימנט
    switch (sentiment) {
        case 'negative': score += 0.2; break;
        case 'urgent': score += 0.4; break;
        case 'positive': score -= 0.1; break;
    }
    
    // השפעת דחיפות
    switch (urgency) {
        case 'critical': score += 0.4; break;
        case 'high': score += 0.3; break;
        case 'medium': score += 0.1; break;
        case 'low': score -= 0.1; break;
    }
    
    return Math.min(Math.max(score, 0), 1);
}

// זיהוי גורמי סיכון
function getRiskFactors(sentiment, urgency, daysOpen) {
    const factors = [];
    
    if (sentiment === 'urgent' || sentiment === 'negative') {
        factors.push('סנטימנט שלילי');
    }
    if (urgency === 'critical' || urgency === 'high') {
        factors.push('דחיפות גבוהה');
    }
    if (daysOpen > 5) {
        factors.push('תלונה פתוחה זמן רב');
    }
    if (daysOpen > 10) {
        factors.push('עיכוב משמעותי בטיפול');
    }
    
    return factors;
}

// יצירת סיכום ניתוח
function generateAnalysisSummary(results) {
    const summary = {
        sentimentStats: { positive: 0, negative: 0, neutral: 0, urgent: 0 },
        urgencyStats: { low: 0, medium: 0, high: 0, critical: 0 },
        categoryMismatches: 0,
        highRiskCount: 0
    };
    
    results.forEach(result => {
        const { sentiment, urgency, categoryMatch, riskScore } = result.aiAnalysis;
        
        summary.sentimentStats[sentiment] = (summary.sentimentStats[sentiment] || 0) + 1;
        summary.urgencyStats[urgency] = (summary.urgencyStats[urgency] || 0) + 1;
        
        if (!categoryMatch) summary.categoryMismatches++;
        if (riskScore >= 0.7) summary.highRiskCount++;
    });
    
    return summary;
}

// יצירת התראות לדשבורד
function generateDashboardAlerts(sentimentSummary, urgencySummary) {
    const alerts = [];
    
    if (urgencySummary.critical > 0) {
        alerts.push({
            type: 'critical',
            message: `יש ${urgencySummary.critical} תלונות קריטיות הדורשות טיפול מיידי`,
            action: 'view-critical-complaints'
        });
    }
    
    if (sentimentSummary.urgent > sentimentSummary.positive) {
        alerts.push({
            type: 'warning',
            message: 'ישנה עלייה בתלונות עם טון דחוף',
            action: 'review-urgent-complaints'
        });
    }
    
    if (urgencySummary.high + urgencySummary.critical > 3) {
        alerts.push({
            type: 'warning',
            message: 'מספר גבוה של תלונות בדחיפות גבוהה',
            action: 'allocate-resources'
        });
    }
    
    return alerts;
}

console.log('🤖 DeepSeek AI Analysis endpoints added for admin dashboard');
console.log('📊 Available endpoints:');
console.log('  - GET /api/admin/ai-analysis');
console.log('  - GET /api/admin/ai-trends-report');
console.log('  - GET /api/admin/high-risk-complaints');
console.log('  - GET /api/admin/ai-dashboard');



// ======= Endpoint לייצוא דוח תלונות בסיכון גבוה =======
// הוסיפי בראש הקובץ אחרי require('dotenv').config()
// const nodemailer = require('nodemailer');

// יצירת transporter למייל
let emailTransporter = null;

const initEmailService = () => {
  try {
emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('📧 Email service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
  }
};

initEmailService();

// החלף את הendpoint הישן בזה:
app.post('/api/admin/export-risk-report', verifyToken, async (req, res) => {
    try {
        const { reportContent, filterType, complaintsCount, format = 'text' } = req.body;

        console.log(`📊 Exporting report: ${complaintsCount} complaints`);
        console.log(`📧 Sending to: ${process.env.ADMIN_EMAIL}`);

        const reportId = `RISK-${Date.now()}`;
        
        // שלח מייל אמיתי
        const emailResult = await sendReportByEmail({
            content: reportContent,
            filterType,
            complaintsCount,
            format,
            id: reportId,
            generatedAt: new Date()
        });

        if (emailResult.success) {
            console.log(`✅ Email sent successfully to: ${emailResult.recipient}`);
            
            res.json({
                status: 'success',
                message: `הדוח נשלח בהצלחה למייל: ${emailResult.recipient}`,
                data: {
                    reportId,
                    emailSent: true,
                    emailId: emailResult.messageId,
                    recipient: emailResult.recipient
                }
            });
        } else {
            console.log(`❌ Email failed: ${emailResult.error}`);
            
            res.json({
                status: 'error',
                message: `שגיאה בשליחת מייל: ${emailResult.error}`,
                data: {
                    reportId,
                    emailSent: false,
                    error: emailResult.error
                }
            });
        }

    } catch (error) {
        console.error('❌ Export error:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בייצוא הדוח'
        });
    }
});

// פונקציה לשליחת מייל
async function sendReportByEmail(report) {
    try {
        if (!emailTransporter) {
            throw new Error('Email service not initialized');
        }

        const { content, filterType, complaintsCount, id, generatedAt } = report;
        
        const subject = `🚨 דוח תלונות בסיכון גבוה (${complaintsCount} תלונות)`;
        
        const emailHTML = `
        <div style="direction: rtl; font-family: Arial; padding: 20px;">
            <h2 style="color: #F44336;">🚨 דוח תלונות בסיכון גבוה</h2>
            <p><strong>מספר תלונות:</strong> ${complaintsCount}</p>
            <p><strong>סוג סינון:</strong> ${filterType}</p>
            <p><strong>תאריך:</strong> ${new Date(generatedAt).toLocaleString('he-IL')}</p>
            <hr>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${content}</pre>
        </div>`;

        const mailOptions = {
            from: `"מערכת תלונות עירייה" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: subject,
            html: emailHTML,
            text: content
        };

        console.log(`📧 Sending email from: ${mailOptions.from}`);
        console.log(`📧 Sending email to: ${mailOptions.to}`);

        const result = await emailTransporter.sendMail(mailOptions);
        
        return { 
            success: true, 
            messageId: result.messageId,
            recipient: mailOptions.to
        };

    } catch (error) {
        console.error('❌ Email send failed:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}
























// // 1. Endpoint לקבלת סטטיסטיקות מקיפות למנהל
// app.get('/api/admin/dashboard-stats', verifyToken, async (req, res) => {
//     try {
//         // וודא שהמשתמש הוא מנהל
//         if (req.userRole !== 'manager' && req.userRole !== 'admin') {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'אין הרשאה לצפות בסטטיסטיקות'
//             });
//         }

//         // ביצוע מספר שאילתות במקביל לביצועים טובים יותר
//         const [
//             totalComplaints,
//             statusStats,
//             categoryStats,
//             employeeCount,
//             citizenCount,
//             feedbackStats,
//             monthlyTrends,
//             responseTimeStats
//         ] = await Promise.all([
//             // סה"כ תלונות
//             Complaint.countDocuments({}),
            
//             // סטטיסטיקות לפי סטטוס
//             Complaint.aggregate([
//                 { $group: { 
//                     _id: '$status', 
//                     count: { $sum: 1 } 
//                 }}
//             ]),
            
//             // סטטיסטיקות לפי קטגוריה
//             Complaint.aggregate([
//                 { $group: { 
//                     _id: '$category', 
//                     count: { $sum: 1 } 
//                 }}
//             ]),
            
//             // ספירת עובדים (אם יש טבלת משתמשים)
//             // User.countDocuments({ role: 'employee' }) || Promise.resolve(12),
//             Promise.resolve(12), // ערך ברירת מחדל כרגע
            
//             // ספירת אזרחים
//             // User.countDocuments({ role: 'citizen' }) || Promise.resolve(158),
//             Promise.resolve(158), // ערך ברירת מחדל כרגע
            
//             // סטטיסטיקות חוות דעת
//             Complaint.aggregate([
//                 { $match: { 'feedback.rating': { $exists: true, $ne: null } } },
//                 { $group: { 
//                     _id: null, 
//                     averageRating: { $avg: '$feedback.rating' },
//                     count: { $sum: 1 },
//                     ratingDistribution: { $push: '$feedback.rating' }
//                 }}
//             ]),
            
//             // מגמות חודשיות
//             Complaint.aggregate([
//                 {
//                     $group: {
//                         _id: {
//                             year: { $year: '$createdAt' },
//                             month: { $month: '$createdAt' }
//                         },
//                         count: { $sum: 1 }
//                     }
//                 },
//                 { $sort: { '_id.year': 1, '_id.month': 1 } },
//                 { $limit: 12 } // 12 חודשים אחרונים
//             ]),
            
//             // זמני תגובה ממוצעים
//             Complaint.aggregate([
//                 {
//                     $match: {
//                         status: { $in: ['resolved', 'closed'] },
//                         responses: { $exists: true, $ne: [] }
//                     }
//                 },
//                 {
//                     $addFields: {
//                         firstResponseTime: {
//                             $subtract: [
//                                 { $arrayElemAt: ['$responses.createdAt', 0] },
//                                 '$createdAt'
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         avgResponseTime: { $avg: '$firstResponseTime' }
//                     }
//                 }
//             ])
//         ]);

//         // עיבוד נתוני סטטוס
//         const statusData = {
//             open: 0,
//             in_progress: 0,
//             resolved: 0,
//             closed: 0
//         };
//         statusStats.forEach(stat => {
//             if (stat._id && statusData.hasOwnProperty(stat._id)) {
//                 statusData[stat._id] = stat.count;
//             }
//         });

//         // עיבוד נתוני קטגוריות
//         const categoryData = {};
//         categoryStats.forEach(stat => {
//             if (stat._id) {
//                 categoryData[stat._id] = stat.count;
//             }
//         });

//         // עיבוד נתוני חוות דעת
//         let feedbackData = {
//             averageRating: 0,
//             count: 0,
//             distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
//         };

//         if (feedbackStats.length > 0) {
//             const feedback = feedbackStats[0];
//             feedbackData.averageRating = feedback.averageRating;
//             feedbackData.count = feedback.count;
            
//             // חישוב התפלגות דירוגים
//             if (feedback.ratingDistribution) {
//                 feedback.ratingDistribution.forEach(rating => {
//                     if (rating >= 1 && rating <= 5) {
//                         feedbackData.distribution[rating]++;
//                     }
//                 });
//             }
//         }

//         // עיבוד מגמות חודשיות
//         const trendsData = monthlyTrends.map(trend => ({
//             month: `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`,
//             count: trend.count
//         }));

//         // חישוב זמן תגובה ממוצע (בשעות)
//         const avgResponseHours = responseTimeStats.length > 0 
//             ? Math.round(responseTimeStats[0].avgResponseTime / (1000 * 60 * 60)) 
//             : 0;

//         res.json({
//             status: 'success',
//             data: {
//                 overview: {
//                     totalComplaints,
//                     totalEmployees: employeeCount,
//                     totalCitizens: citizenCount,
//                     averageRating: feedbackData.averageRating,
//                     feedbackCount: feedbackData.count,
//                     avgResponseHours
//                 },
//                 complaints: {
//                     byStatus: statusData,
//                     byCategory: categoryData,
//                     total: totalComplaints
//                 },
//                 feedback: feedbackData,
//                 trends: trendsData,
//                 generatedAt: new Date()
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching dashboard stats:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'שגיאה בקבלת סטטיסטיקות דשבורד'
//         });
//     }
// });

// // 2. Endpoint משופר לקבלת תלונות עם פרמטרים מתקדמים
// app.get('/api/admin/complaints-advanced', verifyToken, async (req, res) => {
//     try {
//         if (req.userRole !== 'manager' && req.userRole !== 'admin') {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'אין הרשאה לצפות בתלונות'
//             });
//         }

//         const {
//             status,
//             category,
//             priority,
//             dateFrom,
//             dateTo,
//             limit = 20,
//             page = 1,
//             sortBy = 'createdAt',
//             sortOrder = 'desc',
//             includeAI = false
//         } = req.query;

//         // בניית שאילתת סינון
//         const filter = {};
        
//         if (status) filter.status = status;
//         if (category) filter.category = category;
//         if (dateFrom || dateTo) {
//             filter.createdAt = {};
//             if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
//             if (dateTo) filter.createdAt.$lte = new Date(dateTo);
//         }

//         // חישוב pagination
//         const skip = (parseInt(page) - 1) * parseInt(limit);
//         const sortOptions = {};
//         sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

//         // ביצוע השאילתה
//         const [complaints, totalCount] = await Promise.all([
//             Complaint.find(filter)
//                 .sort(sortOptions)
//                 .skip(skip)
//                 .limit(parseInt(limit))
//                 .select('title description category status createdAt assignedTo feedback responses'),
            
//             Complaint.countDocuments(filter)
//         ]);

//         // אם נדרש ניתוח AI, הוסף אותו
//         let enrichedComplaints = complaints;
//         if (includeAI === 'true' && complaints.length <= 10) {
//             // ניתוח AI רק למספר מוגבל של תלונות כדי לא לעמוס על API
//             enrichedComplaints = await Promise.all(
//                 complaints.map(async (complaint) => {
//                     try {
//                         const fullText = `${complaint.title} ${complaint.description}`;
//                         const [sentiment, urgency] = await Promise.all([
//                             AIAnalysisService.analyzeSentiment(fullText),
//                             AIAnalysisService.assessUrgency(fullText)
//                         ]);

//                         return {
//                             ...complaint.toObject(),
//                             aiAnalysis: {
//                                 sentiment,
//                                 urgency,
//                                 riskScore: calculateRiskScore(sentiment, urgency)
//                             }
//                         };
//                     } catch (error) {
//                         return complaint.toObject();
//                     }
//                 })
//             );
//         }

//         res.json({
//             status: 'success',
//             data: {
//                 complaints: enrichedComplaints,
//                 pagination: {
//                     total: totalCount,
//                     pages: Math.ceil(totalCount / parseInt(limit)),
//                     currentPage: parseInt(page),
//                     limit: parseInt(limit),
//                     hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
//                     hasPrev: parseInt(page) > 1
//                 },
//                 filters: { status, category, priority, dateFrom, dateTo },
//                 aiAnalysisIncluded: includeAI === 'true'
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching advanced complaints:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'שגיאה בקבלת תלונות מתקדמות'
//         });
//     }
// });

// // 3. Endpoint לקבלת התראות מערכת בזמן אמת
// app.get('/api/admin/system-alerts', verifyToken, async (req, res) => {
//     try {
//         if (req.userRole !== 'manager' && req.userRole !== 'admin') {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'אין הרשאה לצפות בהתראות'
//             });
//         }

//         const alerts = [];
        
//         // בדיקת תלונות קריטיות (פתוחות יותר מ-7 ימים)
//         const criticalComplaints = await Complaint.countDocuments({
//             status: 'open',
//             createdAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//         });

//         if (criticalComplaints > 0) {
//             alerts.push({
//                 type: 'critical',
//                 title: 'תלונות ללא טיפול',
//                 message: `יש ${criticalComplaints} תלונות פתוחות יותר מ-7 ימים`,
//                 action: 'view-old-complaints',
//                 count: criticalComplaints
//             });
//         }

//         // בדיקת תלונות עם דירוג נמוך
//         const lowRatedComplaints = await Complaint.countDocuments({
//             'feedback.rating': { $lte: 2 },
//             status: { $in: ['resolved', 'closed'] }
//         });

//         if (lowRatedComplaints > 3) {
//             alerts.push({
//                 type: 'warning',
//                 title: 'דירוגים נמוכים',
//                 message: `יש ${lowRatedComplaints} תלונות עם דירוג נמוך (1-2 כוכבים)`,
//                 action: 'review-low-ratings',
//                 count: lowRatedComplaints
//             });
//         }

//         // בדיקת עומס על עובדים
//         const overloadedEmployees = await Complaint.aggregate([
//             { $match: { status: 'in_progress', assignedTo: { $ne: null } } },
//             { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
//             { $match: { count: { $gt: 5 } } }
//         ]);

//         if (overloadedEmployees.length > 0) {
//             alerts.push({
//                 type: 'warning',
//                 title: 'עומס על עובדים',
//                 message: `יש ${overloadedEmployees.length} עובדים עם יותר מ-5 תלונות בטיפול`,
//                 action: 'balance-workload',
//                 count: overloadedEmployees.length
//             });
//         }

//         // בדיקת מגמת עלייה בתלונות
//         const thisMonth = new Date();
//         thisMonth.setDate(1);
//         const lastMonth = new Date(thisMonth);
//         lastMonth.setMonth(lastMonth.getMonth() - 1);

//         const [thisMonthCount, lastMonthCount] = await Promise.all([
//             Complaint.countDocuments({ createdAt: { $gte: thisMonth } }),
//             Complaint.countDocuments({ 
//                 createdAt: { 
//                     $gte: lastMonth, 
//                     $lt: thisMonth 
//                 } 
//             })
//         ]);

//         if (thisMonthCount > lastMonthCount * 1.2) {
//             alerts.push({
//                 type: 'info',
//                 title: 'עלייה בתלונות',
//                 message: `עלייה של ${Math.round((thisMonthCount - lastMonthCount) / lastMonthCount * 100)}% בתלונות החודש`,
//                 action: 'analyze-trends',
//                 count: thisMonthCount - lastMonthCount
//             });
//         }

//         res.json({
//             status: 'success',
//             data: {
//                 alerts,
//                 totalAlerts: alerts.length,
//                 severity: alerts.some(a => a.type === 'critical') ? 'critical' : 
//                          alerts.some(a => a.type === 'warning') ? 'warning' : 'info',
//                 generatedAt: new Date()
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching system alerts:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'שגיאה בקבלת התראות מערכת'
//         });
//     }
// });

// // 4. Endpoint לקבלת ביצועי מחלקות/קטגוריות
// app.get('/api/admin/department-performance', verifyToken, async (req, res) => {
//     try {
//         if (req.userRole !== 'manager' && req.userRole !== 'admin') {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'אין הרשאה לצפות בביצועי מחלקות'
//             });
//         }

//         // ניתוח ביצועים לפי קטגוריה
//         const performanceData = await Complaint.aggregate([
//             {
//                 $group: {
//                     _id: '$category',
//                     totalComplaints: { $sum: 1 },
//                     openComplaints: {
//                         $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
//                     },
//                     resolvedComplaints: {
//                         $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] }
//                     },
//                     avgRating: {
//                         $avg: {
//                             $cond: [
//                                 { $ne: ['$feedback.rating', null] },
//                                 '$feedback.rating',
//                                 null
//                             ]
//                         }
//                     },
//                     feedbackCount: {
//                         $sum: { $cond: [{ $ne: ['$feedback.rating', null] }, 1, 0] }
//                     }
//                 }
//             },
//             {
//                 $addFields: {
//                     resolutionRate: {
//                         $multiply: [
//                             { $divide: ['$resolvedComplaints', '$totalComplaints'] },
//                             100
//                         ]
//                     },
//                     responseTime: { $literal: null } // יש להוסיף חישוב זמן תגובה אמיתי
//                 }
//             },
//             { $sort: { totalComplaints: -1 } }
//         ]);

//         // חישוב ציונים ודירוגים
//         const enrichedPerformance = performanceData.map(dept => {
//             let score = 0;
            
//             // ציון על פי אחוז פתרון (40% מהציון)
//             if (dept.resolutionRate) score += (dept.resolutionRate / 100) * 40;
            
//             // ציון על פי דירוג ממוצע (35% מהציון)
//             if (dept.avgRating) score += (dept.avgRating / 5) * 35;
            
//             // ציון על פי כמות משוב (25% מהציון)
//             const feedbackRatio = dept.feedbackCount / dept.totalComplaints;
//             score += feedbackRatio * 25;

//             return {
//                 ...dept,
//                 performanceScore: Math.round(score),
//                 grade: score >= 80 ? 'מצוין' : 
//                        score >= 60 ? 'טוב' : 
//                        score >= 40 ? 'בינוני' : 'זקוק לשיפור'
//             };
//         });

//         res.json({
//             status: 'success',
//             data: {
//                 departments: enrichedPerformance,
//                 summary: {
//                     totalDepartments: enrichedPerformance.length,
//                     excellentDepartments: enrichedPerformance.filter(d => d.performanceScore >= 80).length,
//                     needImprovementDepartments: enrichedPerformance.filter(d => d.performanceScore < 40).length
//                 },
//                 generatedAt: new Date()
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching department performance:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'שגיאה בקבלת ביצועי מחלקות'
//         });
//     }
// });

// // 5. Endpoint לייצוא נתונים למנהל
// app.post('/api/admin/export-data', verifyToken, async (req, res) => {
//     try {
//         if (req.userRole !== 'manager' && req.userRole !== 'admin') {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'אין הרשאה לייצא נתונים'
//             });
//         }

//         const { 
//             type, // 'complaints', 'stats', 'feedback'
//             format = 'json', // 'json', 'csv', 'excel'
//             dateFrom,
//             dateTo,
//             categories,
//             statuses
//         } = req.body;

//         let exportData = {};
//         const filter = {};

//         // בניית פילטר תאריכים
//         if (dateFrom || dateTo) {
//             filter.createdAt = {};
//             if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
//             if (dateTo) filter.createdAt.$lte = new Date(dateTo);
//         }

//         // בניית פילטר קטגוריות
//         if (categories && categories.length > 0) {
//             filter.category = { $in: categories };
//         }

//         // בניית פילטר סטטוסים
//         if (statuses && statuses.length > 0) {
//             filter.status = { $in: statuses };
//         }

//         switch (type) {
//             case 'complaints':
//                 exportData = await Complaint.find(filter)
//                     .select('title description category status createdAt assignedTo feedback')
//                     .sort({ createdAt: -1 });
//                 break;

//             case 'stats':
//                 exportData = {
//                     summary: await Complaint.aggregate([
//                         { $match: filter },
//                         { $group: { 
//                             _id: null, 
//                             total: { $sum: 1 },
//                             byStatus: {
//                                 $push: {
//                                     status: '$status',
//                                     category: '$category'
//                                 }
//                             }
//                         }}
//                     ]),
//                     byCategory: await Complaint.aggregate([
//                         { $match: filter },
//                         { $group: { _id: '$category', count: { $sum: 1 } } }
//                     ])
//                 };
//                 break;

//             case 'feedback':
//                 exportData = await Complaint.find({
//                     ...filter,
//                     'feedback.rating': { $exists: true }
//                 })
//                 .select('title category feedback createdAt')
//                 .sort({ 'feedback.submittedAt': -1 });
//                 break;

//             default:
//                 return res.status(400).json({
//                     status: 'error',
//                     message: 'סוג ייצוא לא תקין'
//                 });
//         }

//         // יצירת קובץ לייצוא
//         const exportId = `export_${Date.now()}`;
//         const fileName = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;

//         // כאן אפשר להוסיף לוגיקה לשמירת הקובץ או שליחתו במייל
//         console.log(`Exporting ${type} data:`, {
//             recordCount: Array.isArray(exportData) ? exportData.length : 'summary',
//             format,
//             fileName
//         });

//         res.json({
//             status: 'success',
//             data: {
//                 exportId,
//                 fileName,
//                 recordCount: Array.isArray(exportData) ? exportData.length : 1,
//                 downloadUrl: `/api/admin/download-export/${exportId}`, // endpoint נוסף לדאוגראד
//                 expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 שעות
//             }
//         });

//     } catch (error) {
//         console.error('Error exporting data:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'שגיאה בייצוא נתונים'
//         });
//     }
// });

// // הוסף את הפונקציות האלה אם הן לא קיימות
// if (typeof calculateRiskScore === 'undefined') {
//     function calculateRiskScore(sentiment, urgency) {
//         let score = 0.5;
        
//         switch (sentiment) {
//             case 'negative': score += 0.2; break;
//             case 'urgent': score += 0.4; break;
//             case 'positive': score -= 0.1; break;
//         }
        
//         switch (urgency) {
//             case 'critical': score += 0.4; break;
//             case 'high': score += 0.3; break;
//             case 'medium': score += 0.1; break;
//             case 'low': score -= 0.1; break;
//         }
        
//         return Math.min(Math.max(score, 0), 1);
//     }
// }

// console.log('✅ Enhanced dashboard endpoints added:');
// console.log('  - GET /api/admin/dashboard-stats');
// console.log('  - GET /api/admin/complaints-advanced');
// console.log('  - GET /api/admin/system-alerts');
// console.log('  - GET /api/admin/department-performance');
// console.log('  - POST /api/admin/export-data');



// הוסף את הקוד הזה ל-ComplaintServer.js שלך

// ======= Endpoint מרוכז לדשבורד המנהל =======
app.get('/api/manager/dashboard-data', verifyToken, async (req, res) => {
    try {
        // וודא שהמשתמש הוא מנהל
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בדשבורד מנהל'
            });
        }

        console.log('🏢 Loading manager dashboard data...');

        // ביצוע כל השאילתות במקביל לביצועים מיטביים
        const [
            complaints,
            employeeCount,
            citizenCount,
            feedbackStats,
            aiInsights,
            highRiskComplaints
        ] = await Promise.all([
            // קבלת כל התלונות
            Complaint.find({}).sort({ createdAt: -1 }),
            
            // ספירת עובדים (אם יש לך טבלת users)
            // User.countDocuments({ role: 'employee' }),
            Promise.resolve(12), // ערך זמני עד שתוסיף טבלת users
            
            // ספירת אזרחים (אם יש לך טבלת users)  
            // User.countDocuments({ role: 'citizen' }),
            Promise.resolve(158), // ערך זמני עד שתוסיף טבלת users
            
            // סטטיסטיקות חוות דעת
            Complaint.aggregate([
                { $match: { 'feedback.rating': { $exists: true } } },
                { 
                    $group: { 
                        _id: null, 
                        avgRating: { $avg: '$feedback.rating' },
                        count: { $sum: 1 },
                        ratings: { $push: '$feedback.rating' }
                    } 
                }
            ]),
            
            // תובנות AI בסיסיות
            getBasicAIInsights(req.userId),
            
            // תלונות בסיכון גבוה
            getHighRiskComplaintsData()
        ]);

        // חישוב סטטיסטיקות תלונות
        const stats = calculateDetailedStats(complaints);
        
        // חישוב פעילות אחרונה
        const recentActivity = generateRecentActivity(complaints);
        
        // עיבוד סטטיסטיקות חוות דעת
        const processedFeedbackStats = processFeedbackStats(feedbackStats[0]);

        // הכנת התשובה המרוכזת
        const dashboardData = {
            overview: {
                totalComplaints: complaints.length,
                totalEmployees: employeeCount,
                totalCitizens: citizenCount,
                openComplaints: stats.open,
                inProgressComplaints: stats.inProgress,
                resolvedComplaints: stats.resolved,
                closedComplaints: stats.closed,
                resolutionRate: stats.resolutionRate,
                averageRating: processedFeedbackStats.avgRating,
                complaintsThisWeek: stats.thisWeek
            },
            
            complaints: {
                byStatus: {
                    open: stats.open,
                    in_progress: stats.inProgress,
                    resolved: stats.resolved,
                    closed: stats.closed
                },
                byCategory: stats.categories,
                recent: complaints.slice(0, 5).map(complaint => ({
                    _id: complaint._id,
                    title: complaint.title,
                    category: complaint.category,
                    status: complaint.status,
                    createdAt: complaint.createdAt
                }))
            },
            
            feedback: processedFeedbackStats,
            
            aiInsights: {
                sentimentDistribution: aiInsights.sentimentDistribution,
                urgencyDistribution: aiInsights.urgencyDistribution,
                alerts: aiInsights.alerts,
                analyzedComplaints: aiInsights.analyzedCount
            },
            
            highRiskComplaints: {
                count: highRiskComplaints.length,
                complaints: highRiskComplaints.slice(0, 3), // רק 3 הראשונות לדשבורד
                riskLevel: highRiskComplaints.length > 8 ? 'high' : 
                          highRiskComplaints.length > 4 ? 'medium' : 'low'
            },
            
            recentActivity,
            
            lastUpdated: new Date()
        };

        console.log(`✅ Dashboard data loaded: ${complaints.length} complaints processed`);

        res.json({
            status: 'success',
            data: dashboardData
        });

    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בטעינת נתוני דשבורד'
        });
    }
});

// ======= פונקציות עזר לדשבורד =======

function calculateDetailedStats(complaints) {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === 'open').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const closed = complaints.filter(c => c.status === 'closed').length;

    // ספירה לפי קטגוריה
    const categories = {};
    complaints.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + 1;
    });

    // תלונות השבוע
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = complaints.filter(c => new Date(c.createdAt) >= weekAgo).length;

    // תלונות עם משוב
    const withFeedback = complaints.filter(c => c.feedback && c.feedback.rating).length;
    const avgRating = withFeedback > 0 ? 
        complaints
            .filter(c => c.feedback && c.feedback.rating)
            .reduce((sum, c) => sum + c.feedback.rating, 0) / withFeedback 
        : 0;

    return {
        total,
        open,
        inProgress,
        resolved,
        closed,
        categories,
        thisWeek,
        withFeedback,
        avgRating,
        resolutionRate: total > 0 ? ((resolved + closed) / total * 100).toFixed(1) : 0
    };
}

function processFeedbackStats(feedbackData) {
    if (!feedbackData) {
        return {
            avgRating: 0,
            count: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }

    const { avgRating, count, ratings } = feedbackData;
    
    const ratingDistribution = {
        1: ratings.filter(r => r === 1).length,
        2: ratings.filter(r => r === 2).length,
        3: ratings.filter(r => r === 3).length,
        4: ratings.filter(r => r === 4).length,
        5: ratings.filter(r => r === 5).length
    };

    return {
        avgRating: avgRating || 0,
        count: count || 0,
        ratingDistribution
    };
}

async function getBasicAIInsights(userId) {
    try {
        // ניתוח AI בסיסי - ללא קריאות רבות ל-API חיצוני
        const recentComplaints = await Complaint.find({})
            .sort({ createdAt: -1 })
            .limit(10);

        // ניתוח פשוט מבוסס מילות מפתח במקום API
        const sentimentDistribution = { positive: 0, negative: 0, neutral: 0, urgent: 0 };
        const urgencyDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
        const alerts = [];

        recentComplaints.forEach(complaint => {
            const text = `${complaint.title} ${complaint.description}`.toLowerCase();
            
            // ניתוח סנטימנט פשוט
            let sentiment = 'neutral';
            if (text.includes('דחוף') || text.includes('מיידי') || text.includes('חירום')) {
                sentiment = 'urgent';
            } else if (text.includes('כועס') || text.includes('זועם') || text.includes('נורא') || 
                      text.includes('איום') || text.includes('סכנה')) {
                sentiment = 'negative';
            } else if (text.includes('תודה') || text.includes('מעולה') || text.includes('מצוין')) {
                sentiment = 'positive';
            }
            
            sentimentDistribution[sentiment]++;

            // ניתוח דחיפות פשוט
            let urgency = 'medium';
            if (text.includes('חירום') || text.includes('סכנת חיים') || text.includes('דליפה')) {
                urgency = 'critical';
            } else if (text.includes('דחוף') || text.includes('מסוכן') || text.includes('חסום')) {
                urgency = 'high';
            } else if (text.includes('שגרתי') || text.includes('כאשר תוכלו')) {
                urgency = 'low';
            }
            
            urgencyDistribution[urgency]++;
        });

        // יצירת התראות בהתאם לניתוח
        if (urgencyDistribution.critical > 0) {
            alerts.push({
                type: 'critical',
                message: `${urgencyDistribution.critical} תלונות קריטיות דורשות טיפול מיידי`,
                action: 'view-critical-complaints'
            });
        }

        if (sentimentDistribution.urgent + sentimentDistribution.negative > 6) {
            alerts.push({
                type: 'warning',
                message: 'זוהתה עלייה בתלונות דחופות ושליליות',
                action: 'review-urgent-complaints'
            });
        }

        return {
            sentimentDistribution,
            urgencyDistribution,
            alerts,
            analyzedCount: recentComplaints.length
        };

    } catch (error) {
        console.error('Error in basic AI insights:', error);
        return {
            sentimentDistribution: { positive: 0, negative: 0, neutral: 0, urgent: 0 },
            urgencyDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
            alerts: [],
            analyzedCount: 0
        };
    }
}

async function getHighRiskComplaintsData() {
    try {
        const openComplaints = await Complaint.find({
            status: { $in: ['open', 'in_progress'] }
        }).sort({ createdAt: 1 }); // הישנות ראשונות

        const highRiskComplaints = [];

        openComplaints.forEach(complaint => {
            const text = `${complaint.title} ${complaint.description}`.toLowerCase();
            const daysOpen = Math.floor((new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));
            
            let riskScore = 0.3; // בסיס
            
            // הוסף ציון לפי מילות מפתח
            if (text.includes('דחוף') || text.includes('מיידי')) riskScore += 0.3;
            if (text.includes('סכנה') || text.includes('מסוכן')) riskScore += 0.4;
            if (text.includes('כועס') || text.includes('זועם')) riskScore += 0.2;
            if (daysOpen > 7) riskScore += 0.3;
            if (daysOpen > 14) riskScore += 0.4;

            // סיכון גבוה אם הציון מעל 0.6 או פתוח יותר מ-5 ימים
            if (riskScore >= 0.6 || daysOpen > 5) {
                highRiskComplaints.push({
                    ...complaint.toObject(),
                    riskScore: Math.min(riskScore, 1),
                    daysOpen,
                    riskFactors: getRiskFactors(text, daysOpen)
                });
            }
        });

        // מיין לפי ציון סיכון
        return highRiskComplaints.sort((a, b) => b.riskScore - a.riskScore);

    } catch (error) {
        console.error('Error getting high risk complaints:', error);
        return [];
    }
}

function getRiskFactors(text, daysOpen) {
    const factors = [];
    
    if (text.includes('דחוף') || text.includes('מיידי')) {
        factors.push('מסומן כדחוף');
    }
    if (text.includes('סכנה') || text.includes('מסוכן')) {
        factors.push('חשש לבטיחות');
    }
    if (text.includes('כועס') || text.includes('זועם')) {
        factors.push('תושב זועם');
    }
    if (daysOpen > 7) {
        factors.push('פתוח מעל שבוע');
    }
    if (daysOpen > 14) {
        factors.push('עיכוב משמעותי');
    }
    
    return factors;
}

function generateRecentActivity(complaints) {
    const activity = [];
    
    // תלונות חדשות היום
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayComplaints = complaints.filter(c => new Date(c.createdAt) >= today);
    
    if (todayComplaints.length > 0) {
        activity.push({
            id: 'today-complaints',
            type: 'new_complaint',
            icon: 'alert-circle',
            color: '#F44336',
            title: 'תלונות חדשות היום',
            description: `התקבלו ${todayComplaints.length} תלונות חדשות`,
            time: 'היום'
        });
    }

    // תלונות שטופלו השבוע
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const resolvedThisWeek = complaints.filter(c => 
        (c.status === 'resolved' || c.status === 'closed') && 
        new Date(c.createdAt) >= weekAgo
    );

    if (resolvedThisWeek.length > 0) {
        activity.push({
            id: 'week-resolved',
            type: 'complaint_resolved',
            icon: 'check-circle',
            color: '#4CAF50',
            title: 'תלונות שטופלו השבוע',
            description: `${resolvedThisWeek.length} תלונות טופלו בהצלחה`,
            time: 'השבוע'
        });
    }

    // תלונות עם חוות דעת חיובית
    const recentPositiveFeedback = complaints.filter(c => 
        c.feedback && c.feedback.rating >= 4
    ).length;

    if (recentPositiveFeedback > 0) {
        activity.push({
            id: 'positive-feedback',
            type: 'feedback',
            icon: 'star',
            color: '#FFC107',
            title: 'חוות דעת חיוביות',
            description: `${recentPositiveFeedback} דירוגים של 4+ כוכבים`,
            time: 'השבוע'
        });
    }

    return activity.slice(0, 3); // רק 3 פעילויות אחרונות
}

// ======= Endpoint לסטטיסטיקות מהירות =======
app.get('/api/manager/quick-stats', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה'
            });
        }

        const [totalComplaints, openComplaints, todayComplaints] = await Promise.all([
            Complaint.countDocuments({}),
            Complaint.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
            Complaint.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            })
        ]);

        res.json({
            status: 'success',
            data: {
                total: totalComplaints,
                open: openComplaints,
                today: todayComplaints
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת סטטיסטיקות'
        });
    }
});

console.log('🏢 Manager dashboard endpoints added:');
console.log('  - GET /api/manager/dashboard-data');
console.log('  - GET /api/manager/quick-stats');




























// ======= Endpoints לתמיכה בהמשך טיפול בתלונות =======

// Endpoint לבקשת המשך טיפול
app.post('/api/complaints/:id/follow-up', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { type, message, reason } = req.body;
        const { userId } = req;

        console.log(`Follow-up request for complaint ${id} by user ${userId}`);

        // בדיקות תקינות
        if (!message || !message.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'הודעה ריקה אינה מתקבלת'
            });
        }

        if (!['not_satisfied', 'new_issue', 'chat_request'].includes(type)) {
            return res.status(400).json({
                status: 'error',
                message: 'סוג בקשה לא תקין'
            });
        }

        // מצא את התלונה
        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                status: 'error',
                message: 'התלונה לא נמצאה'
            });
        }
        
        // וודא שהתלונה שייכת למשתמש
        if (complaint.userId !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לבקש המשך טיפול לתלונה זו'
            });
        }
        
        // וודא שהתלונה במצב מתאים לבקשת המשך טיפול
        if (!['resolved', 'closed'].includes(complaint.status)) {
            return res.status(400).json({
                status: 'error',
                message: 'ניתן לבקש המשך טיפול רק לתלונות שטופלו או נסגרו'
            });
        }

        // עדכן את סטטוס התלונה בהתאם לסוג הבקשה
        let newStatus = complaint.status;
        let systemMessage = '';

        switch (type) {
            case 'not_satisfied':
                newStatus = 'in_progress';
                systemMessage = `האזרח ביקש המשך טיפול - ${reason}: ${message}`;
                break;
            case 'new_issue':
                newStatus = 'open';
                systemMessage = `דיווח על בעיה חדשה או קשורה - ${reason}: ${message}`;
                break;
            case 'chat_request':
                systemMessage = `בקשה לתקשורת עם הצוות - ${reason}: ${message}`;
                break;
        }

        // הוסף תגובה מהמשתמש
        complaint.responses.push({
            message: `בקשת המשך טיפול: ${message}`,
            fromEmployee: false,
            createdAt: new Date()
        });

        // הוסף תגובת מערכת
        complaint.responses.push({
            message: systemMessage,
            fromEmployee: false,
            systemGenerated: true,
            createdAt: new Date()
        });

        // עדכן סטטוס אם נדרש
        if (newStatus !== complaint.status) {
            complaint.status = newStatus;
        }

        // הוסף מטא-דאטה על בקשת ההמשך
        if (!complaint.followUpRequests) {
            complaint.followUpRequests = [];
        }
        
        complaint.followUpRequests.push({
            type,
            reason,
            message,
            requestedAt: new Date(),
            status: 'pending'
        });

        await complaint.save();

        // צור התראה לעובדים הרלוונטיים
        try {
            await createNotification({
                userId: complaint.assignedTo || 'all_employees',
                type: 'follow_up_request',
                title: 'בקשת המשך טיפול',
                message: `התקבלה בקשת המשך טיפול לתלונה: ${complaint.title}`,
                complaintId: id,
                complaintTitle: complaint.title
            });
        } catch (notificationError) {
            console.error('Error creating follow-up notification:', notificationError);
        }

        console.log(`Follow-up request processed successfully for complaint ${id}`);

        res.json({
            status: 'success',
            message: 'בקשת המשך טיפול נשלחה בהצלחה',
            data: complaint
        });

    } catch (error) {
        console.error('Error processing follow-up request:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בעיבוד בקשת המשך טיפול'
        });
    }
});

// Endpoint לקבלת היסטוריית בקשות המשך טיפול של תלונה
app.get('/api/complaints/:id/follow-up-history', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req;

        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                status: 'error',
                message: 'התלונה לא נמצאה'
            });
        }

        // בדיקת הרשאות
        if (userRole === 'citizen' && complaint.userId !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בהיסטוריה זו'
            });
        }

        if (userRole === 'employee' && !req.userCategories.includes(complaint.category)) {
            return res.status(403).json({
                status: 'error',
                message: 'התלונה אינה בקטגוריה שלך'
            });
        }

        res.json({
            status: 'success',
            data: {
                complaintId: id,
                followUpRequests: complaint.followUpRequests || [],
                totalRequests: complaint.followUpRequests ? complaint.followUpRequests.length : 0
            }
        });

    } catch (error) {
        console.error('Error fetching follow-up history:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת היסטוריית בקשות המשך טיפול'
        });
    }
});

// Endpoint לעובדים לטיפול בבקשות המשך טיפול
app.patch('/api/complaints/:id/follow-up/:followUpIndex/respond', verifyToken, async (req, res) => {
    try {
        const { id, followUpIndex } = req.params;
        const { response, status } = req.body; // status: 'approved', 'rejected', 'needs_more_info'
        const { userId, userRole } = req;

        if (userRole !== 'employee') {
            return res.status(403).json({
                status: 'error',
                message: 'רק עובדים יכולים להגיב לבקשות המשך טיפול'
            });
        }

        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                status: 'error',
                message: 'התלונה לא נמצאה'
            });
        }

        if (!req.userCategories.includes(complaint.category)) {
            return res.status(403).json({
                status: 'error',
                message: 'התלונה אינה בקטגוריה שלך'
            });
        }

        const followUpIndex_int = parseInt(followUpIndex);
        if (!complaint.followUpRequests || !complaint.followUpRequests[followUpIndex_int]) {
            return res.status(404).json({
                status: 'error',
                message: 'בקשת המשך טיפול לא נמצאה'
            });
        }

        // עדכן את סטטוס בקשת ההמשך
        complaint.followUpRequests[followUpIndex_int].status = status;
        complaint.followUpRequests[followUpIndex_int].employeeResponse = response;
        complaint.followUpRequests[followUpIndex_int].respondedAt = new Date();
        complaint.followUpRequests[followUpIndex_int].respondedBy = userId;

        // הוסף תגובה לתלונה
        let responseMessage = '';
        switch (status) {
            case 'approved':
                responseMessage = `בקשת המשך הטיפול אושרה. ${response}`;
                break;
            case 'rejected':
                responseMessage = `בקשת המשך הטיפול נדחתה. ${response}`;
                break;
            case 'needs_more_info':
                responseMessage = `נדרש מידע נוסף לגבי בקשת המשך הטיפול. ${response}`;
                break;
        }

        complaint.responses.push({
            message: responseMessage,
            fromEmployee: true,
            createdAt: new Date()
        });

        await complaint.save();

        // צור התראה לאזרח
        try {
            await createNotification({
                userId: complaint.userId,
                type: 'follow_up_response',
                title: 'תגובה לבקשת המשך טיפול',
                message: responseMessage,
                complaintId: id,
                complaintTitle: complaint.title
            });
        } catch (notificationError) {
            console.error('Error creating follow-up response notification:', notificationError);
        }

        res.json({
            status: 'success',
            message: 'התגובה לבקשת המשך טיפול נשלחה בהצלחה',
            data: complaint
        });

    } catch (error) {
        console.error('Error responding to follow-up request:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בתגובה לבקשת המשך טיפול'
        });
    }
});

// Endpoint לקבלת סטטיסטיקות בקשות המשך טיפול
app.get('/api/admin/follow-up-stats', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בסטטיסטיקות'
            });
        }

        // ספור בקשות המשך טיפול
        const complaintsWithFollowUp = await Complaint.find({
            'followUpRequests': { $exists: true, $ne: [] }
        });

        let totalRequests = 0;
        let pendingRequests = 0;
        let approvedRequests = 0;
        let rejectedRequests = 0;
        let byType = { not_satisfied: 0, new_issue: 0, chat_request: 0 };

        complaintsWithFollowUp.forEach(complaint => {
            if (complaint.followUpRequests) {
                complaint.followUpRequests.forEach(request => {
                    totalRequests++;
                    
                    switch (request.status) {
                        case 'pending':
                            pendingRequests++;
                            break;
                        case 'approved':
                            approvedRequests++;
                            break;
                        case 'rejected':
                            rejectedRequests++;
                            break;
                    }

                    if (byType[request.type] !== undefined) {
                        byType[request.type]++;
                    }
                });
            }
        });

        res.json({
            status: 'success',
            data: {
                totalRequests,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
                byType,
                complaintsWithFollowUp: complaintsWithFollowUp.length
            }
        });

    } catch (error) {
        console.error('Error fetching follow-up stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת סטטיסטיקות בקשות המשך טיפול'
        });
    }
});

// Endpoint לקבלת תלונות עם בקשות המשך טיפול ממתינות
app.get('/api/employee/pending-follow-ups', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'employee') {
            return res.status(403).json({
                status: 'error',
                message: 'רק עובדים יכולים לצפות בבקשות המשך טיפול'
            });
        }

        // מצא תלונות עם בקשות המשך טיפול ממתינות בקטגוריות של העובד
        const complaints = await Complaint.find({
            category: { $in: req.userCategories },
            'followUpRequests': {
                $elemMatch: { status: 'pending' }
            }
        }).sort({ createdAt: -1 });

        // סנן רק בקשות ממתינות
        const pendingFollowUps = complaints.map(complaint => {
            const pendingRequests = complaint.followUpRequests.filter(req => req.status === 'pending');
            return {
                complaint: {
                    _id: complaint._id,
                    title: complaint.title,
                    category: complaint.category,
                    status: complaint.status,
                    createdAt: complaint.createdAt
                },
                pendingRequests
            };
        }).filter(item => item.pendingRequests.length > 0);

        res.json({
            status: 'success',
            data: pendingFollowUps,
            count: pendingFollowUps.length
        });

    } catch (error) {
        console.error('Error fetching pending follow-ups:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת בקשות המשך טיפול ממתינות'
        });
    }
});

// Endpoint משופר לקבלת פרטי תלונה עם מידע על בקשות המשך טיפול
app.get('/api/complaints/:id/detailed', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req;

        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                status: 'error',
                message: 'התלונה לא נמצאה'
            });
        }

        // בדיקת הרשאות
        if (userRole === 'citizen' && complaint.userId !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'אין הרשאה לצפות בתלונה זו'
            });
        }

        if (userRole === 'employee' && !req.userCategories.includes(complaint.category)) {
            return res.status(403).json({
                status: 'error',
                message: 'התלונה אינה בקטגוריה שלך'
            });
        }

        // הוסף מידע מורחב
        const enrichedComplaint = {
            ...complaint.toObject(),
            meta: {
                daysOpen: Math.floor((new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24)),
                hasFollowUpRequests: complaint.followUpRequests && complaint.followUpRequests.length > 0,
                pendingFollowUps: complaint.followUpRequests ? 
                    complaint.followUpRequests.filter(req => req.status === 'pending').length : 0,
                lastActivity: getLastActivity(complaint),
                canRequestFollowUp: ['resolved', 'closed'].includes(complaint.status),
                canSendMessage: ['open', 'in_progress'].includes(complaint.status)
            }
        };

        res.json({
            status: 'success',
            data: enrichedComplaint
        });

    } catch (error) {
        console.error('Error fetching detailed complaint:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בקבלת פרטי תלונה מפורטים'
        });
    }
});

// פונקציית עזר לקבלת פעילות אחרונה
function getLastActivity(complaint) {
    let lastActivity = complaint.createdAt;
    
    if (complaint.responses && complaint.responses.length > 0) {
        const lastResponse = complaint.responses[complaint.responses.length - 1];
        if (new Date(lastResponse.createdAt) > new Date(lastActivity)) {
            lastActivity = lastResponse.createdAt;
        }
    }
    
    if (complaint.followUpRequests && complaint.followUpRequests.length > 0) {
        const lastFollowUp = complaint.followUpRequests[complaint.followUpRequests.length - 1];
        if (new Date(lastFollowUp.requestedAt) > new Date(lastActivity)) {
            lastActivity = lastFollowUp.requestedAt;
        }
    }
    
    if (complaint.feedback && complaint.feedback.submittedAt) {
        if (new Date(complaint.feedback.submittedAt) > new Date(lastActivity)) {
            lastActivity = complaint.feedback.submittedAt;
        }
    }
    
    return lastActivity;
}

// עדכון הסכמה של Complaint להוספת שדה followUpRequests
// הוסף את זה לסכמת Complaint הקיימת:
/*
followUpRequests: [{
    type: {
        type: String,
        enum: ['not_satisfied', 'new_issue', 'chat_request'],
        required: true
    },
    reason: String,
    message: {
        type: String,
        required: true
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'needs_more_info'],
        default: 'pending'
    },
    employeeResponse: String,
    respondedAt: Date,
    respondedBy: String
}]
*/

console.log('✅ Follow-up endpoints added:');
console.log('  - POST /api/complaints/:id/follow-up');
console.log('  - GET /api/complaints/:id/follow-up-history');
console.log('  - PATCH /api/complaints/:id/follow-up/:followUpIndex/respond');
console.log('  - GET /api/admin/follow-up-stats');
console.log('  - GET /api/employee/pending-follow-ups');
console.log('  - GET /api/complaints/:id/detailed');

















// // הוסף את זה ל-ComplaintServer.js - הגשת תלונת אורח פשוטה ללא מעקב

// // Endpoint פשוט להגשת תלונת אורח (ללא אימות כלל)
// app.post('/api/guest-complaint', upload.array('images', 3), async (req, res) => {
//     try {
//         console.log('Received guest complaint:', req.body);

//         const { 
//             guestName, 
//             guestEmail, 
//             guestPhone, 
//             title, 
//             description, 
//             category, 
//             address 
//         } = req.body;

//         // בדיקת שדות חובה
//         if (!guestName || !guestEmail || !title || !description || !category) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'נא למלא את השדות החובה: שם, אימייל, כותרת, תיאור וקטגוריה'
//             });
//         }

//         // בדיקת תקינות אימייל פשוטה
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(guestEmail)) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'כתובת אימייל לא תקינה'
//             });
//         }

//         // עיבוד מיקום אם קיים
//         let locationData = null;
//         if (req.body.location) {
//             try {
//                 locationData = typeof req.body.location === 'string' 
//                     ? JSON.parse(req.body.location)
//                     : req.body.location;
//             } catch (error) {
//                 console.error('Error parsing location:', error);
//             }
//         }

//         // עיבוד תמונות
//         const processedImages = [];
//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const base64Data = file.buffer.toString('base64');
//                 processedImages.push({
//                     data: `data:${file.mimetype};base64,${base64Data}`,
//                     contentType: file.mimetype
//                 });
//             }
//         }

//         // יצירת התלונה - משתמשים באותה סכמה רגילה עם userId מיוחד לאורחים
//         const guestComplaint = new Complaint({
//             userId: `guest_${Date.now()}_${Math.random().toString(36).substring(2)}`, // מזהה אורח ייחודי
//             title,
//             description,
//             category,
//             address: address || 'לא צוין',
//             location: locationData,
//             images: processedImages,
            
//             // מידע נוסף על האורח (נוסיף בתגובה הראשונה)
//             responses: [{
//                 message: `פרטי הפונה: ${guestName}, אימייל: ${guestEmail}${guestPhone ? `, טלפון: ${guestPhone}` : ''}`,
//                 fromEmployee: false,
//                 systemGenerated: true,
//                 createdAt: new Date()
//             }]
//         });

//         await guestComplaint.save();

//         console.log('Guest complaint saved successfully:', guestComplaint._id);

//         // תשובה פשוטה ללא מספר מעקב או דרך לחזור לתלונה
//         res.status(200).json({
//             status: 'success',
//             message: 'התלונה נשלחה בהצלחה! תקבל עדכון באימייל כאשר יטפלו בתלונה.'
//         });

//     } catch (error) {
//         console.error('Error submitting guest complaint:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'שגיאה בשליחת התלונה. אנא נסה שוב'
//         });
//     }
// });

// console.log('🔓 Simple guest complaint endpoint added: POST /api/guest-complaint');




// פונקציה לשליחת אימייל אישור לאורח
async function sendGuestConfirmationEmail(guestData) {
    try {
        if (!emailTransporter) {
            console.log('Email service not available');
            return { success: false, error: 'Email service not configured' };
        }

        const { guestName, guestEmail, title, category, complaintId } = guestData;
        
        // יצירת מספר תיק קצר לתצוגה
        const ticketNumber = complaintId.toString().slice(-8).toUpperCase();

        const emailHTML = `
        <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px;">✅ תלונתך התקבלה</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">מערכת תלונות הציבור</p>
            </div>

            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
                <h2 style="color: #1e293b; margin-top: 0;">שלום ${guestName},</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    תלונתך התקבלה במערכת בהצלחה ותועבר לטיפול הגורמים המתאימים בעירייה.
                </p>
            </div>

            <div style="background: white; border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
                    📋 פרטי התלונה
                </h3>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 5px 0; color: #334155;">
                        <strong>נושא:</strong> ${title}
                    </p>
                    <p style="margin: 5px 0; color: #334155;">
                        <strong>קטגוריה:</strong> ${category}
                    </p>
                    <p style="margin: 5px 0; color: #334155;">
                        <strong>מספר תיק:</strong> <span style="background: #ddd6fe; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${ticketNumber}</span>
                    </p>
                    <p style="margin: 5px 0; color: #334155;">
                        <strong>תאריך הגשה:</strong> ${new Date().toLocaleDateString('he-IL')}
                    </p>
                </div>
            </div>

            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #92400e; margin-top: 0;">⏰ מה קורה עכשיו?</h3>
                <ol style="color: #92400e; margin: 0; padding-right: 20px;">
                    <li style="margin-bottom: 8px;">התלונה נבדקת ומסווגת על ידי צוותנו</li>
                    <li style="margin-bottom: 8px;">היא תועבר למחלקה הרלוונטית לטיפול</li>
                    <li style="margin-bottom: 8px;">תקבל עדכון כאשר הטיפול יושלם</li>
                </ol>
            </div>

            <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #065f46; margin-top: 0;">📞 צריך להוסיף משהו?</h3>
                <p style="color: #065f46; margin: 0;">
                    אם יש לך מידע נוסף או תמונות נוספות, אתה יכול ליצור איתנו קשר:
                </p>
                <p style="color: #065f46; margin: 10px 0 0 0;">
                    📧 <strong>municipality@city.gov.il</strong> | 📞 <strong>03-1234567</strong>
                </p>
                <p style="color: #065f46; margin: 5px 0 0 0; font-size: 14px;">
                    (ציין במייל את מספר התיק: ${ticketNumber})
                </p>
            </div>

            <div style="text-align: center; padding: 20px; border-top: 2px solid #e2e8f0; margin-top: 30px;">
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                    תודה על פנייתך ועל עזרתך בשיפור השירותים בעיר
                </p>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 12px;">
                    מערכת תלונות הציבור | עירייה | ${new Date().getFullYear()}
                </p>
            </div>
        </div>`;

        const mailOptions = {
            from: `"מערכת תלונות עירייה" <${process.env.EMAIL_USER}>`,
            to: guestEmail,
            subject: `✅ תלונתך התקבלה - מספר תיק ${ticketNumber}`,
            html: emailHTML,
            text: `
שלום ${guestName},

תלונתך התקבלה במערכת בהצלחה!

פרטי התלונה:
- נושא: ${title}
- קטגוריה: ${category}  
- מספר תיק: ${ticketNumber}
- תאריך: ${new Date().toLocaleDateString('he-IL')}

תקבל עדכון כאשר הטיפול יושלם.

תודה,
מערכת תלונות העירייה
            `
        };

        console.log(`📧 Sending confirmation email to: ${guestEmail}`);
        const result = await emailTransporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);
        return { 
            success: true, 
            messageId: result.messageId,
            ticketNumber 
        };

    } catch (error) {
        console.error('❌ Email send failed:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// פונקציה לשליחת עדכון סטטוס לאורח (כשעובד מעדכן את התלונה)
async function sendGuestStatusUpdate(guestEmail, updateData) {
    try {
        if (!emailTransporter) {
            return { success: false, error: 'Email service not configured' };
        }

        const { title, newStatus, ticketNumber, message } = updateData;
        
        // מיפוי סטטוס לעברית
        const statusLabels = {
            'in_progress': 'בטיפול',
            'resolved': 'טופל',
            'closed': 'סגור'
        };

        const statusLabel = statusLabels[newStatus] || newStatus;
        const statusColor = newStatus === 'resolved' ? '#10b981' : 
                           newStatus === 'in_progress' ? '#3b82f6' : '#6b7280';

        const emailHTML = `
        <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, ${statusColor}, #7c3aed); color: white; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
                <h1 style="margin: 0; font-size: 24px;">📢 עדכון סטטוס תלונה</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">מספר תיק: ${ticketNumber}</p>
            </div>

            <div style="background: white; border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px;">
                <h2 style="color: #1e293b; margin-top: 0;">עדכון לגבי התלונה שלך</h2>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 5px 0; color: #334155;">
                        <strong>נושא:</strong> ${title}
                    </p>
                    <p style="margin: 5px 0; color: #334155;">
                        <strong>סטטוס חדש:</strong> 
                        <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 15px; font-weight: bold;">
                            ${statusLabel}
                        </span>
                    </p>
                </div>

                ${message ? `
                <div style="background: #f0f9ff; border-right: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4 style="color: #1e40af; margin-top: 0;">הודעה מהצוות:</h4>
                    <p style="color: #1e40af; margin: 0;">${message}</p>
                </div>
                ` : ''}

                <div style="text-align: center; padding: 20px; border-top: 2px solid #e2e8f0; margin-top: 20px;">
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                        תודה על הסבלנות ועל עזרתך בשיפור השירותים בעיר
                    </p>
                </div>
            </div>
        </div>`;

        const mailOptions = {
            from: `"מערכת תלונות עירייה" <${process.env.EMAIL_USER}>`,
            to: guestEmail,
            subject: `📢 עדכון תלונה ${ticketNumber} - ${statusLabel}`,
            html: emailHTML
        };

        const result = await emailTransporter.sendMail(mailOptions);
        
        console.log(`✅ Status update email sent to: ${guestEmail}`);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('❌ Status update email failed:', error);
        return { success: false, error: error.message };
    }
}

// עדכון ה-endpoint של תלונת אורח לכלול שליחת אימייל
app.post('/api/guest-complaint', upload.array('images', 3), async (req, res) => {
    try {
        console.log('Received guest complaint:', req.body);

        const { 
            guestName, 
            guestEmail, 
            guestPhone, 
            title, 
            description, 
            category, 
            address 
        } = req.body;

        // בדיקות תקינות כמו קודם...
        if (!guestName || !guestEmail || !title || !description || !category) {
            return res.status(400).json({
                status: 'error',
                message: 'נא למלא את השדות החובה: שם, אימייל, כותרת, תיאור וקטגוריה'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'כתובת אימייל לא תקינה'
            });
        }

        // עיבוד מיקום ותמונות כמו קודם...
        let locationData = null;
        if (req.body.location) {
            try {
                locationData = typeof req.body.location === 'string' 
                    ? JSON.parse(req.body.location)
                    : req.body.location;
            } catch (error) {
                console.error('Error parsing location:', error);
            }
        }

        const processedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const base64Data = file.buffer.toString('base64');
                processedImages.push({
                    data: `data:${file.mimetype};base64,${base64Data}`,
                    contentType: file.mimetype
                });
            }
        }

        // יצירת התלונה
        const guestComplaint = new Complaint({
            userId: `guest_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            title,
            description,
            category,
            address: address || 'לא צוין',
            location: locationData,
            images: processedImages,
            responses: [{
                message: `פרטי הפונה: ${guestName}, אימייל: ${guestEmail}${guestPhone ? `, טלפון: ${guestPhone}` : ''}`,
                fromEmployee: false,
                systemGenerated: true,
                createdAt: new Date()
            }]
        });

        await guestComplaint.save();

        console.log('Guest complaint saved successfully:', guestComplaint._id);

        // שליחת אימייל אישור
        try {
            const emailResult = await sendGuestConfirmationEmail({
                guestName,
                guestEmail,
                title,
                category,
                complaintId: guestComplaint._id
            });

            if (emailResult.success) {
                console.log(`✅ Confirmation email sent successfully to ${guestEmail}`);
                
                res.status(200).json({
                    status: 'success',
                    message: 'התלונה נשלחה בהצלחה! אישור נשלח לאימייל שלך.',
                    data: {
                        complaintId: guestComplaint._id,
                        ticketNumber: emailResult.ticketNumber,
                        emailSent: true
                    }
                });
            } else {
                console.log(`⚠️ Email failed: ${emailResult.error}`);
                
                res.status(200).json({
                    status: 'success',
                    message: 'התלונה נשלחה בהצלחה! (לא ניתן לשלוח אישור במייל כרגע)',
                    data: {
                        complaintId: guestComplaint._id,
                        emailSent: false
                    }
                });
            }
        } catch (emailError) {
            console.error('Email error:', emailError);
            
            res.status(200).json({
                status: 'success', 
                message: 'התלונה נשלחה בהצלחה! (בעיה בשליחת אישור במייל)',
                data: {
                    complaintId: guestComplaint._id,
                    emailSent: false
                }
            });
        }

    } catch (error) {
        console.error('Error submitting guest complaint:', error);
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בשליחת התלונה. אנא נסה שוב'
        });
    }
});

console.log('📧 Email functionality added for guest complaints!');

const PORT = 5000;
// if (require.main === module) {

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log('Available at:');
//     require('os').networkInterfaces()['Wi-Fi']
//         ?.filter(details => details.family === 'IPv4')
//         .forEach(details => console.log(`http://${details.address}:${PORT}`));
// });
// }

// Only connect if the file is run directly, not when imported
if (require.main === module) {
  mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
  
  const PORT = 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    // Other console logs...
  });
}

module.exports = app;
module.exports.Complaint = Complaint; // Export the model for testing
module.exports = { verifyToken };  // מייצא את הפונקציה