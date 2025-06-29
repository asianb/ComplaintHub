// __tests__/ComplaintForm.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ComplaintForm from '../src/screens/ComplaintForm';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';

// Mock dependencies
jest.mock('expo-image-picker');
jest.mock('expo-location');
jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-av');

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

describe('ComplaintForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Location permissions
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'granted'
    });
    
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: {
        latitude: 31.7683,
        longitude: 35.2137
      }
    });
  });

  // בדיקת ולידציה בסיסית
  describe('Form Validation', () => {
    test('should show error when title is empty', async () => {
      const { getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const submitButton = getByText('שלח דיווח');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'שגיאת אימות',
          'אנא הכנס כותרת'
        );
      });
    });

    test('should show error when description is empty', async () => {
      const { getByPlaceholderText, getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      // מלא כותרת אבל לא תיאור
      const titleInput = getByPlaceholderText('כותרת התלונה');
      fireEvent.changeText(titleInput, 'בעיה בתאורה');

      const submitButton = getByText('שלח דיווח');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'שגיאת אימות',
          'אנא הכנס תיאור'
        );
      });
    });

    test('should show error when category is not selected', async () => {
      const { getByPlaceholderText, getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      // מלא כותרת ותיאור אבל לא קטגוריה
      const titleInput = getByPlaceholderText('כותרת התלונה');
      const descInput = getByPlaceholderText('תאר את הבעיה בפירוט');
      
      fireEvent.changeText(titleInput, 'בעיה בתאורה');
      fireEvent.changeText(descInput, 'התאורה לא עובדת ברחוב');

      const submitButton = getByText('שלח דיווח');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'שגיאת אימות',
          'אנא בחר קטגוריה'
        );
      });
    });

    test('should show error when address is empty', async () => {
      const { getByPlaceholderText, getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      // מלא הכל חוץ מכתובת
      const titleInput = getByPlaceholderText('כותרת התלונה');
      const descInput = getByPlaceholderText('תאר את הבעיה בפירוט');
      
      fireEvent.changeText(titleInput, 'בעיה בתאורה');
      fireEvent.changeText(descInput, 'התאורה לא עובדת ברחוב');

      // בחר קטגוריה
      const categoryButton = getByText('חשמל');
      fireEvent.press(categoryButton);

      const submitButton = getByText('שלח דיווח');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'שגיאת אימות',
          'אנא הכנס כתובת'
        );
      });
    });
  });

  // בדיקת בחירת קטגוריות
  describe('Category Selection', () => {
    test('should select category when pressed', () => {
      const { getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const categoryButton = getByText('תשתית');
      fireEvent.press(categoryButton);

      // בדוק שהקטגוריה נבחרה (יהיה style שונה)
      expect(categoryButton.parent).toHaveStyle({ backgroundColor: '#ede9fe' });
    });

    test('should change category when different one is selected', () => {
      const { getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      // בחר קטגוריה ראשונה
      const firstCategory = getByText('תשתית');
      fireEvent.press(firstCategory);

      // בחר קטגוריה שנייה
      const secondCategory = getByText('חשמל');
      fireEvent.press(secondCategory);

      // רק הקטגוריה השנייה צריכה להיות פעילה
      expect(secondCategory.parent).toHaveStyle({ backgroundColor: '#ede9fe' });
    });
  });

  // בדיקת הוספת תמונות
  describe('Image Upload', () => {
    test('should add image when picker succeeds', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        status: 'granted'
      });

      ImagePicker.launchImageLibraryAsync.mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'file://test-image.jpg' }]
      });

      const { getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const addImageButton = getByText('הוסף תמונה');
      fireEvent.press(addImageButton);

      await waitFor(() => {
        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      });
    });

    test('should show error when trying to add more than 3 images', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        status: 'granted'
      });

      ImagePicker.launchImageLibraryAsync.mockResolvedValue({
        canceled: false,
        assets: [
          { uri: 'file://test1.jpg' },
          { uri: 'file://test2.jpg' },
          { uri: 'file://test3.jpg' },
          { uri: 'file://test4.jpg' }
        ]
      });

      const { getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const addImageButton = getByText('הוסף תמונה');
      fireEvent.press(addImageButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'מקסימום תמונות',
          'ניתן להעלות עד 3 תמונות'
        );
      });
    });
  });

  // בדיקת חיפוש כתובת
  describe('Address Search', () => {
    test('should search address and update location', async () => {
      Location.geocodeAsync.mockResolvedValue([{
        latitude: 32.0853,
        longitude: 34.7818
      }]);

      Location.reverseGeocodeAsync.mockResolvedValue([{
        street: 'דיזנגוף',
        streetNumber: '50',
        city: 'תל אביב'
      }]);

      const { getByPlaceholderText, getByTestId } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const searchInput = getByPlaceholderText('חפש כתובת');
      const searchButton = getByTestId('search-button');

      fireEvent.changeText(searchInput, 'דיזנגוף 50 תל אביב');
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(Location.geocodeAsync).toHaveBeenCalledWith('דיזנגוף 50 תל אביב');
      });
    });

    test('should show error when address not found', async () => {
      Location.geocodeAsync.mockResolvedValue([]);

      const { getByPlaceholderText, getByTestId } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const searchInput = getByPlaceholderText('חפש כתובת');
      const searchButton = getByTestId('search-button');

      fireEvent.changeText(searchInput, 'כתובת לא קיימת');
      fireEvent.press(searchButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'לא נמצאה כתובת',
          'נסה לחפש כתובת אחרת'
        );
      });
    });
  });

  // בדיקת שליחת הטופס
  describe('Form Submission', () => {
    beforeEach(() => {
      // Mock successful server response
      axios.post.mockResolvedValue({
        data: { status: 'success' }
      });

      // Mock AsyncStorage
      require('@react-native-async-storage/async-storage').getItem
        .mockImplementation((key) => {
          if (key === 'userToken') return Promise.resolve('mock-token');
          if (key === 'userId') return Promise.resolve('user123');
          return Promise.resolve(null);
        });
    });

    test('should submit form successfully with valid data', async () => {
      const { getByPlaceholderText, getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      // מלא טופס תקין
      fireEvent.changeText(getByPlaceholderText('כותרת התלונה'), 'בעיה בתאורה');
      fireEvent.changeText(getByPlaceholderText('תאר את הבעיה בפירוט'), 'התאורה לא עובדת');
      fireEvent.changeText(getByPlaceholderText('מיקום הבעיה'), 'רחוב הרצל 10');
      
      fireEvent.press(getByText('חשמל'));
      fireEvent.press(getByText('שלח דיווח'));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('הצלחה', 'התלונה נשלחה בהצלחה');
      });
    });

    test('should handle server error gracefully', async () => {
      axios.post.mockRejectedValue({
        response: { data: { message: 'שגיאת שרת' } }
      });

      const { getByPlaceholderText, getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      // מלא טופס תקין
      fireEvent.changeText(getByPlaceholderText('כותרת התלונה'), 'בעיה בתאורה');
      fireEvent.changeText(getByPlaceholderText('תאר את הבעיה בפירוט'), 'התאורה לא עובדת');
      fireEvent.changeText(getByPlaceholderText('מיקום הבעיה'), 'רחוב הרצל 10');
      
      fireEvent.press(getByText('חשמל'));
      fireEvent.press(getByText('שלח דיווח'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('שגיאה', 'שגיאת שרת: שגיאת שרת');
      });
    });
  });

  // בדיקת הקלטת קול (אם קיימת)
  describe('Voice Recording', () => {
    test('should start recording when voice button pressed', async () => {
      const { getByText } = render(
        <ComplaintForm navigation={mockNavigation} />
      );

      const voiceButton = getByText('הקלט כותרת');
      fireEvent.press(voiceButton);

      // בדוק שהרכיב מציג מצב הקלטה
      await waitFor(() => {
        expect(getByText('סיים הקלטה')).toBeTruthy();
      });
    });
  });
});

// פונקציות עזר לבדיקות
export const createValidComplaintData = () => ({
  title: 'בעיה בתאורת רחוב',
  description: 'התאורה ברחוב הרצל לא עובדת כבר שבוע',
  category: 'חשמל',
  address: 'רחוב הרצל 10, תל אביב',
  location: {
    latitude: 32.0853,
    longitude: 34.7818
  }
});

export const createInvalidComplaintData = () => ({
  title: '', // חסר
  description: '',
  category: null,
  address: ''
});
