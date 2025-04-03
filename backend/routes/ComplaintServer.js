//complaintSrever.s

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

// MongoDB connection
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
        data: String, // Base64 string
        contentType: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
    
});

const Complaint = mongoose.model("Complaints", ComplaintSchema);

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
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
    }

    try {
        // Log the secret being used for verification
        console.log('Verifying token with secret:', JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
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

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available at:');
    require('os').networkInterfaces()['Wi-Fi']
        ?.filter(details => details.family === 'IPv4')
        .forEach(details => console.log(`http://${details.address}:${PORT}`));
});