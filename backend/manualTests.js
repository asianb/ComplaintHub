// manualTests.js
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m"
  };
  
  class TestSuite {
    constructor(name) {
      this.name = name;
      this.tests = [];
      this.passed = 0;
      this.failed = 0;
    }
  
    test(description, testFn) {
      this.tests.push({ description, testFn });
    }
  
    async run() {
      console.log(`\n${colors.blue}SUITE${colors.reset}: ${colors.cyan}${this.name}${colors.reset}`);
      
      for (const test of this.tests) {
        try {
          await test.testFn();
          console.log(`  ${colors.green}✓${colors.reset} ${test.description}`);
          this.passed++;
        } catch (error) {
          console.log(`  ${colors.red}✗${colors.reset} ${test.description}`);
          console.log(`    ${colors.red}${error.message}${colors.reset}`);
          this.failed++;
        }
      }
  
      const total = this.passed + this.failed;
      console.log(`\n${colors.blue}Results for ${this.name}${colors.reset}:`);
      console.log(`  Total: ${total}`);
      console.log(`  ${colors.green}Passed: ${this.passed}${colors.reset}`);
      if (this.failed > 0) {
        console.log(`  ${colors.red}Failed: ${this.failed}${colors.reset}`);
      } else {
        console.log(`  Failed: 0`);
      }
      
      return { passed: this.passed, failed: this.failed };
    }
  }
  
  // פונקציות שמדמות את הבסיס של המודל שלך
  const mockComplaint = (overrides = {}) => {
    return {
      _id: `complaint_${Math.floor(Math.random() * 1000)}`,
      userId: 'user123',
      title: 'תלונה לדוגמה',
      description: 'תיאור של תלונה לדוגמה',
      category: 'תחזוקה',
      address: 'כתובת לדוגמה',
      status: 'open',
      images: [],
      location: {
        latitude: 31.25,
        longitude: 34.79
      },
      responses: [],
      createdAt: new Date(),
      ...overrides
    };
  };
  
  // פונקציות בדיקה
  function expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`צפיתי ל-${expected}, אבל קיבלתי ${actual}`);
        }
      },
      toEqual(expected) {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
          throw new Error(`צפיתי ל-${expectedStr}, אבל קיבלתי ${actualStr}`);
        }
      },
      toContain(item) {
        if (!actual.includes(item)) {
          throw new Error(`צפיתי ש-${actual} יכיל את ${item}`);
        }
      },
      toHaveProperty(prop) {
        if (!(prop in actual)) {
          throw new Error(`צפיתי שהאובייקט יכיל את המאפיין '${prop}'`);
        }
        return {
          withValue(value) {
            if (actual[prop] !== value) {
              throw new Error(`צפיתי שהמאפיין '${prop}' יכיל את הערך ${value}, אבל קיבלתי ${actual[prop]}`);
            }
          }
        };
      },
      toBeDefined() {
        if (actual === undefined) {
          throw new Error('צפיתי שהערך יהיה מוגדר');
        }
      },
      toBeUndefined() {
        if (actual !== undefined) {
          throw new Error(`צפיתי שהערך יהיה לא מוגדר, אבל קיבלתי ${actual}`);
        }
      },
      toBeNull() {
        if (actual !== null) {
          throw new Error(`צפיתי שהערך יהיה null, אבל קיבלתי ${actual}`);
        }
      },
      toBeGreaterThan(expected) {
        if (!(actual > expected)) {
          throw new Error(`צפיתי ש-${actual} יהיה גדול מ-${expected}`);
        }
      },
      toBeLessThan(expected) {
        if (!(actual < expected)) {
          throw new Error(`צפיתי ש-${actual} יהיה קטן מ-${expected}`);
        }
      },
      toBeTypeOf(type) {
        if (typeof actual !== type) {
          throw new Error(`צפיתי שהטיפוס יהיה ${type}, אבל קיבלתי ${typeof actual}`);
        }
      },
      toHaveLength(length) {
        if (actual.length !== length) {
          throw new Error(`צפיתי שהאורך יהיה ${length}, אבל קיבלתי ${actual.length}`);
        }
      }
    };
  }
  
  // מדמה בקשת JWT
  function createMockToken(userId = 'user123', role = 'citizen', categories = []) {
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
      JSON.stringify({ id: userId, role, categories })
    ).toString('base64')}.dummy-signature`;
  }
  
  // פונקציה מדמה של Express Request/Response
  function createMockRequestResponse() {
    const req = {
      body: {},
      params: {},
      query: {},
      headers: {
        authorization: `Bearer ${createMockToken()}`
      },
      userId: 'user123',
      userRole: 'citizen',
      userCategories: []
    };
    
    const res = {
      statusCode: 200,
      json: function(data) {
        this.body = data;
        return this;
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      }
    };
    
    return { req, res };
  }
  
  // פונקציה להרצת כל הבדיקות
  async function runTests() {
    console.log(`\n${colors.magenta}╔════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.magenta}║ ${colors.cyan}בדיקות ליחידת שרת התלונות${colors.magenta}                      ║${colors.reset}`);
    console.log(`${colors.magenta}╚════════════════════════════════════════════════════╝${colors.reset}\n`);
    
    const startTime = Date.now();
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    // בדיקות למודל התלונות
    const complaintModelSuite = new TestSuite('מודל התלונות');
    
    complaintModelSuite.test('בדיקת יצירת מודל עם ערכים תקינים', () => {
      const complaint = mockComplaint();
      
      expect(complaint).toHaveProperty('title');
      expect(complaint.userId).toBe('user123');
      expect(complaint.status).toBe('open');
      expect(complaint.category).toBe('תחזוקה');
      expect(complaint.responses).toHaveLength(0);
    });
    
    complaintModelSuite.test('בדיקת פרטי מיקום', () => {
      const complaint = mockComplaint();
      
      expect(complaint.location).toHaveProperty('latitude');
      expect(complaint.location).toHaveProperty('longitude');
      expect(complaint.location.latitude).toBe(31.25);
      expect(complaint.location.longitude).toBe(34.79);
    });
    
    complaintModelSuite.test('בדיקת עדכון סטטוס', () => {
      const complaint = mockComplaint();
      complaint.status = 'in_progress';
      
      expect(complaint.status).toBe('in_progress');
    });
    
    complaintModelSuite.test('בדיקת הוספת תגובה', () => {
      const complaint = mockComplaint();
      
      const response = {
        message: 'תגובה לדוגמה',
        fromEmployee: true,
        createdAt: new Date()
      };
      
      complaint.responses.push(response);
      
      expect(complaint.responses).toHaveLength(1);
      expect(complaint.responses[0].message).toBe('תגובה לדוגמה');
      expect(complaint.responses[0].fromEmployee).toBe(true);
    });
    
    complaintModelSuite.test('בדיקת הוספת תגובת משתמש', () => {
      const complaint = mockComplaint();
      
      const response = {
        message: 'תגובה מהמשתמש',
        fromEmployee: false,
        createdAt: new Date()
      };
      
      complaint.responses.push(response);
      
      expect(complaint.responses).toHaveLength(1);
      expect(complaint.responses[0].message).toBe('תגובה מהמשתמש');
      expect(complaint.responses[0].fromEmployee).toBe(false);
    });
    
    // בדיקת פונקציות עזר
    const helperFunctionsSuite = new TestSuite('פונקציות עזר');
    
    helperFunctionsSuite.test('בדיקת המרת סטטוס לעברית', () => {
      // מדמה את הפונקציה getStatusHebrew
      function getStatusHebrew(status) {
        const statusLabels = {
          open: 'ממתין לטיפול',
          in_progress: 'בטיפול',
          resolved: 'טופל',
          closed: 'סגור'
        };
        
        return statusLabels[status] || 'לא ידוע';
      }
      
      expect(getStatusHebrew('open')).toBe('ממתין לטיפול');
      expect(getStatusHebrew('in_progress')).toBe('בטיפול');
      expect(getStatusHebrew('resolved')).toBe('טופל');
      expect(getStatusHebrew('closed')).toBe('סגור');
      expect(getStatusHebrew('unknown')).toBe('לא ידוע');
    });
    
    helperFunctionsSuite.test('בדיקת הודעות שינוי סטטוס', () => {
      // מדמה את הפונקציה getStatusChangeMessage
      function getStatusChangeMessage(oldStatus, newStatus) {
        function getStatusHebrew(status) {
          const statusLabels = {
            open: 'ממתין לטיפול',
            in_progress: 'בטיפול',
            resolved: 'טופל',
            closed: 'סגור'
          };
          
          return statusLabels[status] || 'לא ידוע';
        }
        
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
      
      expect(getStatusChangeMessage('open', 'in_progress')).toBe('התלונה התחילה להיות מטופלת');
      expect(getStatusChangeMessage('in_progress', 'resolved')).toBe('הטיפול בתלונה הושלם');
      expect(getStatusChangeMessage('resolved', 'closed')).toBe('התלונה נסגרה');
      expect(getStatusChangeMessage('open', 'resolved')).toBe('סטטוס התלונה עודכן מממתין לטיפול לטופל');
    });
    
    helperFunctionsSuite.test('בדיקת הערכת זמן טיפול לפי קטגוריה', () => {
      // מדמה את הפונקציה getEstimatedTime
      function getEstimatedTime(category, status) {
        const timeEstimates = {
          'תחזוקה': 7,
          'תברואה': 3,
          'תשתיות': 14,
          'חניה': 5,
          'גינון': 10,
          'תאורה': 5,
          'אחר': 7
        };
        
        let daysLeft = timeEstimates[category] || 7;
        
        if (status === 'in_progress') {
          daysLeft = Math.max(Math.floor(daysLeft / 2), 1);
        } else if (status === 'resolved' || status === 'closed') {
          daysLeft = 0;
        }
        
        return daysLeft;
      }
      
      expect(getEstimatedTime('תחזוקה', 'open')).toBe(7);
      expect(getEstimatedTime('תחזוקה', 'in_progress')).toBe(3);
      expect(getEstimatedTime('תחזוקה', 'resolved')).toBe(0);
      expect(getEstimatedTime('תברואה', 'open')).toBe(3);
      expect(getEstimatedTime('תברואה', 'in_progress')).toBe(1);
      expect(getEstimatedTime('קטגוריה לא קיימת', 'open')).toBe(7); // ברירת מחדל
    });
    
    // בדיקת Endpoints
    const endpointsSuite = new TestSuite('נקודות קצה של השרת');
    
    endpointsSuite.test('בדיקת GET /test', () => {
      const { req, res } = createMockRequestResponse();
      
      // מדמה את הבקשה
      const testEndpoint = (req, res) => {
        res.json({ status: "ok" });
      };
      
      testEndpoint(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
    
    endpointsSuite.test('בדיקת GET /api/viewcomplaints', async () => {
      const { req, res } = createMockRequestResponse();
      
      // מדמה את הבקשה עם מספר תלונות
      const complaints = [
        mockComplaint({ _id: 'comp1' }),
        mockComplaint({ _id: 'comp2', status: 'in_progress' })
      ];
      
      const getComplaints = async (req, res) => {
        res.json({
          status: 'success',
          count: complaints.length,
          data: complaints
        });
      };
      
      await getComplaints(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });
    
    endpointsSuite.test('בדיקת POST /api/complaints - יצירת תלונה חדשה', async () => {
      const { req, res } = createMockRequestResponse();
      
      req.body = {
        title: 'תלונה חדשה',
        description: 'תיאור של תלונה חדשה',
        category: 'תחזוקה',
        address: 'כתובת לדוגמה',
        location: JSON.stringify({
          latitude: 31.25,
          longitude: 34.79
        })
      };
      
      req.files = [{
        buffer: Buffer.from('תמונה לדוגמה'),
        mimetype: 'image/jpeg'
      }];
      
      const createComplaint = async (req, res) => {
        try {
          const locationData = typeof req.body.location === 'string' 
            ? JSON.parse(req.body.location)
            : req.body.location;
          
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
          
          // מדמה יצירת תלונה חדשה
          const newComplaint = {
            ...req.body,
            userId: req.userId,
            images: processedImages,
            status: 'open',
            responses: [],
            createdAt: new Date(),
            location: {
              latitude: locationData.latitude,
              longitude: locationData.longitude
            }
          };
          
          // מדמה שמירה
          
          res.status(200).json({ status: "success" });
        } catch (error) {
          res.status(500).json({ 
            status: "error", 
            message: error.message 
          });
        }
      };
      
      await createComplaint(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
    
    endpointsSuite.test('בדיקת PATCH /api/complaints/:id/process - עדכון סטטוס', async () => {
      const { req, res } = createMockRequestResponse();
      
      req.params = { id: 'comp123' };
      req.body = { status: 'in_progress' };
      req.userId = 'employee123';
      req.userRole = 'employee';
      req.userCategories = ['תחזוקה'];
      
      // מדמה את הבקשה
      const updateStatus = async (req, res) => {
        try {
          const { id } = req.params;
          const { status } = req.body;
          
          // מדמה את בדיקת התקינות והקיום של התלונה
          if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({ 
              status: 'error', 
              message: 'Invalid status value' 
            });
          }
          
          // מדמה עדכון
          const updatedComplaint = mockComplaint({
            _id: id,
            status: status,
            responses: [{
              message: `הסטטוס שונה ל${status === 'in_progress' ? 'בטיפול' : 
                        status === 'resolved' ? 'טופל' : 
                        status === 'closed' ? 'סגור' : 'ממתין לטיפול'}`,
              fromEmployee: true,
              createdAt: new Date()
            }]
          });
          
          res.json({
            status: 'success',
            data: updatedComplaint
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: error.message
          });
        }
      };
      
      await updateStatus(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.status).toBe('in_progress');
      expect(res.body.data.responses).toHaveLength(1);
    });
    
    endpointsSuite.test('בדיקת POST /api/complaints/:id/respond - הוספת תגובה', async () => {
      const { req, res } = createMockRequestResponse();
      
      req.params = { id: 'comp123' };
      req.body = { message: 'תגובה חדשה' };
      req.userId = 'employee123';
      req.userRole = 'employee';
      req.userCategories = ['תחזוקה'];
      
      const addResponse = async (req, res) => {
        try {
          const { id } = req.params;
          const { message } = req.body;
          
          if (!message || message.trim() === '') {
            return res.status(400).json({
              status: 'error',
              message: 'Message cannot be empty'
            });
          }
          
          // מדמה עדכון התלונה עם התגובה החדשה
          const updatedComplaint = mockComplaint({
            _id: id,
            responses: [{
              message,
              fromEmployee: true,
              createdAt: new Date()
            }]
          });
          
          res.json({
            status: 'success',
            data: updatedComplaint
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: error.message
          });
        }
      };
      
      await addResponse(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.responses).toHaveLength(1);
      expect(res.body.data.responses[0].message).toBe('תגובה חדשה');
    });
    
    endpointsSuite.test('בדיקת GET /my-complaints - קבלת תלונות של המשתמש', async () => {
      const { req, res } = createMockRequestResponse();
      
      // מדמה תלונות של המשתמש
      const userComplaints = [
        mockComplaint({ _id: 'comp1', userId: 'user123' }),
        mockComplaint({ _id: 'comp2', userId: 'user123', status: 'in_progress' })
      ];
      
      const getMyComplaints = async (req, res) => {
        try {
          const { userId } = req;
          
          // מדמה חיפוש במסד הנתונים
          const complaints = userComplaints.filter(c => c.userId === userId);
          
          res.json(complaints);
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'לא ניתן לטעון תלונות, נסה מאוחר יותר'
          });
        }
      };
      
      await getMyComplaints(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].userId).toBe('user123');
      expect(res.body[1].userId).toBe('user123');
    });
    
    endpointsSuite.test('בדיקת POST /api/complaints/:id/feedback - הוספת משוב', async () => {
      const { req, res } = createMockRequestResponse();
      
      req.params = { id: 'comp123' };
      req.body = { 
        rating: 4,
        comment: 'שירות מצוין!' 
      };
      
      const addFeedback = async (req, res) => {
        try {
          const { id } = req.params;
          const { rating, comment } = req.body;
          const { userId } = req;
          
          // בדיקת תקינות הדירוג
          if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
              status: 'error',
              message: 'דירוג חייב להיות מספר בין 1 ל-5 כוכבים'
            });
          }
          
          // מדמה מציאת התלונה
          const complaint = mockComplaint({
            _id: id,
            userId,
            status: 'resolved'
          });
          
          // בדיקת הרשאות
          if (complaint.userId !== userId) {
            return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לשלוח חוות דעת לתלונה זו'
            });
          }
          
          // עדכון התלונה עם המשוב
          complaint.feedback = {
            rating: Number(rating),
            comment: comment || '',
            submittedAt: new Date()
          };
          
          // אם התלונה מסוג resolved, סגור אותה
          if (complaint.status === 'resolved') {
            complaint.status = 'closed';
            complaint.closedAt = new Date();
            
            complaint.responses.push({
              message: 'התלונה נסגרה בעקבות חוות הדעת של התושב',
              fromEmployee: false,
              systemGenerated: true,
              createdAt: new Date()
            });
          }
          
          // מדמה שמירה במסד הנתונים
          
          res.json({
            status: 'success',
            message: 'חוות הדעת נשמרה בהצלחה',
            data: complaint
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'שגיאת שרת בשליחת חוות דעת'
          });
        }
      };
      
      await addFeedback(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.feedback.rating).toBe(4);
      expect(res.body.data.feedback.comment).toBe('שירות מצוין!');
      expect(res.body.data.status).toBe('closed');
    });
    
    // בדיקת מידלוור
    const middlewareSuite = new TestSuite('פונקציות ביניים (Middleware)');
    
    middlewareSuite.test('בדיקת מידלוור אימות JWT', () => {
      const { req, res } = createMockRequestResponse();
      
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      
      // מדמה את המידלוור verifyToken
      const verifyToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
          return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
        }
        
        try {
          // מדמה פענוח של הטוקן
          const decoded = { id: 'user123', role: 'citizen' };
          
          req.userId = decoded.id;
          req.userRole = decoded.role;
          req.userCategories = decoded.categories || [];
          
          next();
        } catch (error) {
          return res.status(401).json({ status: "error", message: "טוקן לא תקין" });
        }
      };
      
      verifyToken(req, res, next);
      
      expect(nextCalled).toBe(true);
      expect(req.userId).toBe('user123');
      expect(req.userRole).toBe('citizen');
    });
    
    middlewareSuite.test('בדיקת מידלוור אימות JWT - נכשל ללא טוקן', () => {
      const { req, res } = createMockRequestResponse();
      req.headers.authorization = null;
      
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      
      // מדמה את המידלוור verifyToken
      const verifyToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
          return res.status(401).json({ status: "error", message: "אין הרשאת גישה" });
        }
        
        try {
          // מדמה פענוח של הטוקן
          const decoded = { id: 'user123', role: 'citizen' };
          
          req.userId = decoded.id;
          req.userRole = decoded.role;
          req.userCategories = decoded.categories || [];
          
          next();
        } catch (error) {
          return res.status(401).json({ status: "error", message: "טוקן לא תקין" });
        }
      };
      
      verifyToken(req, res, next);
      
      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });
    
    // בדיקת לוגיקה של התראות
    const notificationsSuite = new TestSuite('מערכת התראות');
    
    notificationsSuite.test('בדיקת יצירת התראה חדשה', async () => {
      // מדמה פונקציה ליצירת התראה
      const createNotification = async (notificationData) => {
        try {
          // מדמה שמירה במסד נתונים
          const notification = {
            _id: `notification_${Math.floor(Math.random() * 1000)}`,
            ...notificationData,
            createdAt: new Date()
          };
          
          return notification;
        } catch (error) {
          throw error;
        }
      };// המשך הבדיקה של יצירת התראה חדשה
      const notificationData = {
        userId: 'user123',
        type: 'status_update',
        title: 'סטטוס התלונה שלך השתנה',
        message: 'התלונה עברה לסטטוס "בטיפול"',
        complaintId: 'comp123',
        complaintTitle: 'תלונה לדוגמה',
        read: false
      };
      
      const notification = await createNotification(notificationData);
      
      expect(notification).toHaveProperty('_id');
      expect(notification.userId).toBe('user123');
      expect(notification.type).toBe('status_update');
      expect(notification.read).toBe(false);
      expect(notification.title).toBe('סטטוס התלונה שלך השתנה');
    });
    
    notificationsSuite.test('בדיקת קבלת התראות למשתמש', async () => {
      const { req, res } = createMockRequestResponse();
      
      // מדמה התראות במסד הנתונים
      const mockNotifications = [
        {
          _id: 'notif1',
          userId: 'user123',
          type: 'status_update',
          title: 'סטטוס התלונה שלך השתנה',
          message: 'התלונה עברה לסטטוס "בטיפול"',
          complaintId: 'comp123',
          complaintTitle: 'תלונה לדוגמה',
          read: false,
          createdAt: new Date()
        },
        {
          _id: 'notif2',
          userId: 'user123',
          type: 'new_response',
          title: 'תגובה חדשה לתלונה שלך',
          message: 'התקבלה תגובה חדשה מצוות העירייה',
          complaintId: 'comp123',
          complaintTitle: 'תלונה לדוגמה',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // יום לפני
        }
      ];
      
      const getUserNotifications = async (req, res) => {
        try {
          const { userId } = req;
          
          // מדמה שליפת התראות ממסד הנתונים
          const notifications = mockNotifications.filter(n => n.userId === userId);
          
          res.json({
            status: 'success',
            data: notifications
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'שגיאת שרת בקבלת התראות'
          });
        }
      };
      
      await getUserNotifications(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].userId).toBe('user123');
      expect(res.body.data[0].read).toBe(false);
      expect(res.body.data[1].read).toBe(true);
    });
    
    notificationsSuite.test('בדיקת סימון התראה כנקראה', async () => {
      const { req, res } = createMockRequestResponse();
      
      req.params = { id: 'notif1' };
      
      const mockNotification = {
        _id: 'notif1',
        userId: 'user123',
        type: 'status_update',
        title: 'סטטוס התלונה שלך השתנה',
        message: 'התלונה עברה לסטטוס "בטיפול"',
        complaintId: 'comp123',
        complaintTitle: 'תלונה לדוגמה',
        read: false,
        createdAt: new Date()
      };
      
      const markNotificationAsRead = async (req, res) => {
        try {
          const { id } = req.params;
          const { userId } = req;
          
          // מדמה עדכון במסד הנתונים
          mockNotification.read = true;
          
          res.json({
            status: 'success',
            data: mockNotification
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'שגיאת שרת בסימון התראה כנקראה'
          });
        }
      };
      
      await markNotificationAsRead(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.read).toBe(true);
    });
    
    // בדיקת הצגת נתונים סטטיסטיים
    const statsSuite = new TestSuite('נתונים סטטיסטיים');
    
    statsSuite.test('בדיקת סטטיסטיקות תלונות לפי קטגוריה', async () => {
      const { req, res } = createMockRequestResponse();
      
      // שינוי התפקיד למנהל
      req.userRole = 'manager';
      
      // מדמה נתונים סטטיסטיים
      const mockCategoryStats = [
        {
          _id: 'תחזוקה',
          averageRating: 4.2,
          count: 15,
          ratingDistribution: {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5
          }
        },
        {
          _id: 'תברואה',
          averageRating: 3.8,
          count: 10,
          ratingDistribution: {
            1: 0,
            2: 2,
            3: 3,
            4: 3,
            5: 2
          }
        }
      ];
      
      const mockOverallStats = {
        averageRating: 4.0,
        count: 25,
        ratingDistribution: {
          1: 1,
          2: 4,
          3: 6,
          4: 7,
          5: 7
        }
      };
      
      const getFeedbackStats = async (req, res) => {
        try {
          // בדיקת הרשאות
          if (req.userRole !== 'manager' && req.userRole !== 'admin') {
            return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לצפות בסטטיסטיקות'
            });
          }
          
          res.json({
            status: 'success',
            data: {
              overall: mockOverallStats,
              byCategory: mockCategoryStats
            }
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'שגיאת שרת בקבלת סטטיסטיקות חוות דעת'
          });
        }
      };
      
      await getFeedbackStats(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.overall.averageRating).toBe(4.0);
      expect(res.body.data.byCategory).toHaveLength(2);
      expect(res.body.data.byCategory[0]._id).toBe('תחזוקה');
      expect(res.body.data.byCategory[1]._id).toBe('תברואה');
    });
    
    statsSuite.test('בדיקת מגמות בחוות דעת לאורך זמן', async () => {
      const { req, res } = createMockRequestResponse();
      
      // שינוי התפקיד למנהל
      req.userRole = 'admin';
      
      // מדמה נתוני מגמות
      const mockTrends = [
        {
          month: '2024-01',
          averageRating: 3.8,
          count: 12
        },
        {
          month: '2024-02',
          averageRating: 4.0,
          count: 15
        },
        {
          month: '2024-03',
          averageRating: 4.2,
          count: 20
        }
      ];
      
      const getFeedbackTrends = async (req, res) => {
        try {
          // בדיקת הרשאות
          if (req.userRole !== 'admin') {
            return res.status(403).json({
              status: 'error',
              message: 'אין הרשאה לצפות במגמות'
            });
          }
          
          res.json({
            status: 'success',
            data: {
              trends: mockTrends
            }
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'שגיאת שרת בקבלת מגמות חוות דעת'
          });
        }
      };
      
      await getFeedbackTrends(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.trends).toHaveLength(3);
      expect(res.body.data.trends[0].month).toBe('2024-01');
      expect(res.body.data.trends[2].averageRating).toBe(4.2);
      // בדיקה שהמגמה חיובית
      expect(res.body.data.trends[2].averageRating).toBeGreaterThan(res.body.data.trends[0].averageRating);
    });
    
    // בדיקת הרשאות עובדים
    const employeeSuite = new TestSuite('הרשאות לעובדים');
    
    employeeSuite.test('בדיקת עובד יכול לצפות רק בתלונות בקטגוריות שלו', async () => {
      const { req, res } = createMockRequestResponse();
      
      // מגדיר את המשתמש כעובד
      req.userId = 'employee123';
      req.userRole = 'employee';
      req.userCategories = ['תחזוקה', 'תאורה'];
      
      // מדמה תלונות במסד הנתונים
      const allComplaints = [
        mockComplaint({ _id: 'comp1', category: 'תחזוקה' }),
        mockComplaint({ _id: 'comp2', category: 'תאורה' }),
        mockComplaint({ _id: 'comp3', category: 'תברואה' })
      ];
      
      const getEmployeeComplaints = async (req, res) => {
        try {
          // בדיקת הרשאות
          if (req.userRole !== 'employee') {
            return res.status(403).json({
              status: 'error',
              message: 'Access denied - employee only'
            });
          }
          
          // מדמה סינון תלונות לפי קטגוריות העובד
          const filteredComplaints = allComplaints.filter(
            complaint => req.userCategories.includes(complaint.category)
          );
          
          res.json({
            status: 'success',
            count: filteredComplaints.length,
            data: filteredComplaints
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: error.message
          });
        }
      };
      
      await getEmployeeComplaints(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.count).toBe(2);
      expect(res.body.data[0].category).toBe('תחזוקה');
      expect(res.body.data[1].category).toBe('תאורה');
    });
    
    employeeSuite.test('בדיקת עובד לא יכול לעדכן תלונה שלא בקטגוריה שלו', async () => {
      const { req, res } = createMockRequestResponse();
      
      // מגדיר את המשתמש כעובד
      req.userId = 'employee123';
      req.userRole = 'employee';
      req.userCategories = ['תחזוקה', 'תאורה'];
      
      req.params = { id: 'comp3' };
      req.body = { status: 'in_progress' };
      
      // מדמה תלונה בקטגוריה שאינה של העובד
      const complaint = mockComplaint({
        _id: 'comp3',
        category: 'תברואה'
      });
      
      const updateComplaintStatus = async (req, res) => {
        try {
          const { id } = req.params;
          const { status } = req.body;
          
          // וידוא שהסטטוס תקין
          if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({ 
              status: 'error', 
              message: 'Invalid status value' 
            });
          }
          
          // בדיקת הרשאות
          if (!req.userCategories.includes(complaint.category)) {
            return res.status(403).json({ 
              status: 'error', 
              message: 'Not authorized for this complaint' 
            });
          }
          
          // עדכון הסטטוס...
          
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
      };
      
      await updateComplaintStatus(req, res);
      
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Not authorized for this complaint');
    });
    
    // סיכום כל הבדיקות
    const results = {
      model: await complaintModelSuite.run(),
      helpers: await helperFunctionsSuite.run(),
      endpoints: await endpointsSuite.run(),
      middleware: await middlewareSuite.run(),
      notifications: await notificationsSuite.run(),
      stats: await statsSuite.run(),
      employee: await employeeSuite.run()
    };
    
    const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
    const totalTests = totalPassed + totalFailed;
    
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    console.log(`\n${colors.magenta}╔════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.magenta}║ ${colors.cyan}סיכום בדיקות${colors.magenta}                                   ║${colors.reset}`);
    console.log(`${colors.magenta}╚════════════════════════════════════════════════════╝${colors.reset}\n`);
    
    console.log(`${colors.blue}סך הכל נבדקות:${colors.reset} ${totalTests}`);
    console.log(`${colors.green}עברו בהצלחה:${colors.reset} ${totalPassed}`);
    if (totalFailed > 0) {
      console.log(`${colors.red}נכשלו:${colors.reset} ${totalFailed}`);
    } else {
      console.log(`${colors.green}נכשלו:${colors.reset} 0`);
    }
    console.log(`${colors.blue}זמן ריצה:${colors.reset} ${totalTime.toFixed(3)} שניות\n`);
    
    if (totalFailed === 0) {
      console.log(`${colors.green}●${colors.reset} ${colors.green}כל הבדיקות עברו בהצלחה!${colors.reset}\n`);
    } else {
      console.log(`${colors.red}●${colors.reset} ${colors.red}יש לתקן ${totalFailed} בדיקות.${colors.reset}\n`);
    }
    
    // טיפים לשיפור הבדיקות
    console.log(`${colors.cyan}טיפים לשיפור הבדיקות:${colors.reset}`);
    console.log(`1. התאם את הבדיקות לצרכים הספציפיים של המערכת שלך.`);
    console.log(`2. הוסף בדיקות נוספות עבור תרחישי קצה.`);
    console.log(`3. השתמש במאגר נתונים אמיתי או מדומה למבדקי אינטגרציה.`);
    console.log(`4. הוסף בדיקות ביצועים למערכת.`);
    console.log(`5. בדוק תרחישי שגיאה והתאוששות.`);
  }
  
  // הרץ את הבדיקות
  runTests().catch(console.error);