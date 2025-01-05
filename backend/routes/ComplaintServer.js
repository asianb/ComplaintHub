// const express = require('express');
// const mongoose = require('mongoose');
// mongoUrl="mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// const multer = require('multer');
// const path = require('path');
// require('dotenv').config();

// const app = express();

// const cors = require('cors');

// app.use(cors({
//     origin: '*', // מאפשר גישה מכל מקור
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));

// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB ya anfal');
// }).catch((err) => {
//     console.error('MongoDB connection error:', err);
// });



// require('./ComplaintSchema');
// const Complaint = mongoose.model("Complaints");

// // Routes
// app.get("/",(req,res)=>{
//     res.send({status:"startedD"})
// })



// app.post('/api/complaints', async (req, res) => {
//     console.log('Received complaint:', req.body);

//     // Extract data from the request body
//     const { title, description, category, address } = req.body;

//     // Validate input
//     if (!title || !description || !category || !address) {
//         return res.status(400).json({
//             status: "error",
//             message: "All fields are required.",
//             missingFields: Object.entries({ title, description, category, address })
//                 .filter(([key, value]) => !value)
//                 .map(([key]) => key)
//         });
//     }

//     try {
//         const complaint = await Complaint.create({
//             title,
//             description,
//             category,
//             address,
//         });

//         res.status(201).json({
//             status: "okayy ya anfal",
//             message: "Complaint created successfully",
//             data: complaint
//         });
//     } catch (error) {
//         console.error('Error creating complaint:', error);
//         res.status(500).json({
//             status: "error",
//             message: "Failed to create complaint",
//             error: error.message
//         });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// // app.post('/api/complaints', async (req, res) => {
// //     console.log('Received complaint:', req.body); // לוג לבדיקה

// //  // Extract data from the request body
// //  const { title, description, category, address } = req.body;

// //  // Validate input
// //  if (!title || !description || !category || !address) {
// //      return res.status(400).json({ error: 'All fields are required.' });
// //  }

// //  try {
// //         // Create a new complaint
// //     await Complaint.create ({
// //         title :title,
// //         description :description,
// //         category:category,
// //         address :address,
// //     });
// //     res.send({status:"okayy ya anfal",data : "altlona created"})
// //  } catch (error) {
// //     res.send({status:"error",data : error})
// //     res.status(500).json({
// //         status: "error",
// //         message: "Failed to create complaint",
// //         error: error.message
// //     });
// //  }
 
// // });

// // app.listen(5000, () => {
// //     console.log(`Server is running on po`);
// // });




// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Expanded CORS configuration
// app.use(cors({
//     origin: true, // Allow all origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
//     credentials: true
// }));

// // Increased body size limit if needed
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Add request logging middleware
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//     next();
// });

// // MongoDB Connection
// mongoose.connect(mongoUrl)
//     .then(() => console.log('Connected to MongoDB ya anfal'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// require('./ComplaintSchema');
// const Complaint = mongoose.model("Complaints");

// // Health check endpoint
// app.get("/", (req, res) => {
//     res.json({ status: "Server is running", timestamp: new Date().toISOString() });
// });

// app.post('/api/complaints', async (req, res) => {
//     console.log('Received complaint data:', req.body);

//     try {
//         const { title, description, category, address } = req.body;

//         if (!title || !description || !category || !address) {
//             console.log('Validation failed:', { title, description, category, address });
//             return res.status(400).json({
//                 status: "error",
//                 message: "All fields are required"
//             });
//         }

//         const complaint = await Complaint.create({
//             title,
//             description,
//             category,
//             address
//         });

//         console.log('Created complaint:', complaint);
//         res.status(201).json({
//             status: "success",
//             message: "Complaint created successfully",
//             data: complaint
//         });
//     } catch (error) {
//         console.error('Error creating complaint:', error);
//         res.status(500).json({
//             status: "error",
//             message: error.message
//         });
//     }
// });

// const PORT = 5000;
// const HOST = '0.0.0.0'; // Listen on all network interfaces

// app.listen(PORT, HOST, () => {
//     console.log(`Server is running at http://${HOST}:${PORT}`);
//     // Log the local IP addresses
//     const { networkInterfaces } = require('os');
//     const nets = networkInterfaces();
//     console.log('\nAvailable network interfaces:');
//     for (const name of Object.keys(nets)) {
//         for (const net of nets[name]) {
//             if (net.family === 'IPv4' && !net.internal) {
//                 console.log(`- ${name}: ${net.address}`);
//             }
//         }
//     }
// });


/// shaghghaaaaalll
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// // mongoUrl="mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// mongoUrl="mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/DB?retryWrites=true&w=majority&appName=Cluster0"
// const app = express();

// // הגדרות בסיסיות
// app.use(cors());
// app.use(express.json());

// // חיבור למונגו
// mongoose.connect(mongoUrl+"DB")
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// require('./ComplaintSchema');
// const Complaint = mongoose.model("Complaints");

// // נקודת בדיקה פשוטה
// app.get("/test", (req, res) => {
//     res.json({ status: "ok" });
// });

// // הוספת טיימינג לבקשות
// app.use((req, res, next) => {
//     const start = Date.now();
//     res.on('finish', () => {
//         const duration = Date.now() - start;
//         console.log(`${req.method} ${req.url} - ${duration}ms`);
//     });
//     next();
// });



// // נקודת קצה חדשה להצגת כל התלונות
// app.get('/api/complaints', async (req, res) => {
//     try {
//         const complaints = await Complaint.find({})
//             .sort({ createdAt: -1 }); // מיון לפי זמן יצירה, החדש ביותר קודם
        
//         console.log(`נמצאו ${complaints.length} תלונות`);
//         res.json({
//             status: 'success',
//             count: complaints.length,
//             data: complaints
//         });
//     } catch (error) {
//         console.error('שגיאה בשליפת התלונות:', error);
//         res.status(500).json({ 
//             status: 'error', 
//             message: error.message 
//         });
//     }
// });
// app.post('/api/complaints', async (req, res) => {
//     try {
//         console.log('קיבלתי בקשה חדשה:', req.body);
        
//         const complaint = new Complaint(req.body);
//         await complaint.save();
        
//         // תגובה מינימלית ומהירה
//         res.status(200).json({ status: "success" });
        
//         // לוג אחרי שליחת התגובה
//         console.log('נשמר בהצלחה:', complaint._id);
//     } catch (error) {
//         console.error('שגיאה:', error);
//         res.status(500).json({ status: "error", message: error.message });
//     }
// });

// const PORT = 5000;
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log('Available at:');
//     require('os').networkInterfaces()['Wi-Fi']
//         ?.filter(details => details.family === 'IPv4')
//         .forEach(details => console.log(`http://${details.address}:${PORT}`));
// });

// זה היה עובד
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Basic settings
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUrl = "mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/anfal?retryWrites=true&w=majority&appName=Cluster0";

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
app.post('/api/complaints', upload.array('images', 3), async (req, res) => {
    try {
        console.log('Received new request:', req.body);

        // Parse the location string into an object
        let locationData = req.body.location;
        if (typeof locationData === 'string') {
            locationData = JSON.parse(locationData);
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

        // Create new complaint with parsed location
        const complaint = new Complaint({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            address: req.body.address,
            location: locationData,  // Use the parsed location object
            images: processedImages
        });

        await complaint.save();

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

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available at:');
    require('os').networkInterfaces()['Wi-Fi']
        ?.filter(details => details.family === 'IPv4')
        .forEach(details => console.log(`http://${details.address}:${PORT}`));
});