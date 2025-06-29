// __tests__/ComplaintFormLogic.test.js
// בדיקות לוגיקה בלי JSX

describe('ComplaintForm Logic Tests', () => {
  // פונקציית ולידציה שאפשר לחלץ מהקומפוננט
  const validateComplaintForm = (data) => {
    const errors = {};

    if (!data.title || !data.title.trim()) {
      errors.title = 'אנא הכנס כותרת';
    }

    if (!data.description || !data.description.trim()) {
      errors.description = 'אנא הכנס תיאור';
    }

    if (!data.category) {
      errors.category = 'אנא בחר קטגוריה';
    }

    if (!data.address || !data.address.trim()) {
      errors.address = 'אנא הכנס כתובת';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  describe('Form Validation', () => {
    test('should pass validation with valid data', () => {
      const validData = {
        title: 'בעיה בתאורה',
        description: 'התאורה לא עובדת ברחוב',
        category: 'חשמל',
        address: 'רחוב הרצל 10'
      };

      const result = validateComplaintForm(validData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('should fail validation when title is empty', () => {
      const invalidData = {
        title: '',
        description: 'תיאור תקין',
        category: 'חשמל',
        address: 'כתובת תקינה'
      };

      const result = validateComplaintForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('אנא הכנס כותרת');
    });

    test('should fail validation when description is empty', () => {
      const invalidData = {
        title: 'כותרת תקינה',
        description: '',
        category: 'חשמל',
        address: 'כתובת תקינה'
      };

      const result = validateComplaintForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('אנא הכנס תיאור');
    });

    test('should fail validation when category is not selected', () => {
      const invalidData = {
        title: 'כותרת תקינה',
        description: 'תיאור תקין',
        category: null,
        address: 'כתובת תקינה'
      };

      const result = validateComplaintForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('אנא בחר קטגוריה');
    });

    test('should fail validation when address is empty', () => {
      const invalidData = {
        title: 'כותרת תקינה',
        description: 'תיאור תקין',
        category: 'חשמל',
        address: ''
      };

      const result = validateComplaintForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.address).toBe('אנא הכנס כתובת');
    });

    test('should handle multiple validation errors', () => {
      const invalidData = {
        title: '',
        description: '',
        category: null,
        address: ''
      };

      const result = validateComplaintForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(4);
    });
  });

  describe('Image Validation', () => {
    const validateImages = (images) => {
      if (!images || !Array.isArray(images)) {
        return { isValid: false, error: 'רשימת תמונות לא תקינה' };
      }

      if (images.length > 3) {
        return { isValid: false, error: 'ניתן להעלות עד 3 תמונות' };
      }

      return { isValid: true };
    };

    test('should accept valid image array', () => {
      const images = ['image1.jpg', 'image2.jpg'];
      const result = validateImages(images);
      expect(result.isValid).toBe(true);
    });

    test('should reject more than 3 images', () => {
      const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'];
      const result = validateImages(images);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ניתן להעלות עד 3 תמונות');
    });

    test('should accept empty image array', () => {
      const images = [];
      const result = validateImages(images);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Category Validation', () => {
    const validCategories = ['תשתית', 'חשמל', 'רעש', 'נקיון', 'מים וביוב'];

    const validateCategory = (category) => {
      if (!category) {
        return { isValid: false, error: 'נא לבחור קטגוריה' };
      }

      if (!validCategories.includes(category)) {
        return { isValid: false, error: 'קטגוריה לא תקינה' };
      }

      return { isValid: true };
    };

    test('should accept valid categories', () => {
      validCategories.forEach(category => {
        const result = validateCategory(category);
        expect(result.isValid).toBe(true);
      });
    });

    test('should reject invalid category', () => {
      const result = validateCategory('קטגוריה לא קיימת');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('קטגוריה לא תקינה');
    });

    test('should reject empty category', () => {
      const result = validateCategory('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('נא לבחור קטגוריה');
    });
  });

  describe('Location Validation', () => {
    const validateLocation = (location) => {
      if (!location) {
        return { isValid: false, error: 'מיקום נדרש' };
      }

      if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        return { isValid: false, error: 'קואורדינטות לא תקינות' };
      }

      if (location.latitude < -90 || location.latitude > 90) {
        return { isValid: false, error: 'קו רוחב לא תקין' };
      }

      if (location.longitude < -180 || location.longitude > 180) {
        return { isValid: false, error: 'קו אורך לא תקין' };
      }

      return { isValid: true };
    };

    test('should accept valid location', () => {
      const location = { latitude: 31.7683, longitude: 35.2137 };
      const result = validateLocation(location);
      expect(result.isValid).toBe(true);
    });

    test('should reject invalid latitude', () => {
      const location = { latitude: 100, longitude: 35.2137 };
      const result = validateLocation(location);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('קו רוחב לא תקין');
    });

    test('should reject invalid longitude', () => {
      const location = { latitude: 31.7683, longitude: 200 };
      const result = validateLocation(location);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('קו אורך לא תקין');
    });
  });
});

// פונקציות עזר שיכולות לשמש גם בקוד האמיתי
export { validateComplaintForm };