import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PurchaseCourse() {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const webtoken = localStorage.getItem('token');
        const tokenres = await axios.post('http://localhost:3000/users/decode', {
          token: webtoken
        });
        const decodedToken = tokenres.data;
        const userName = decodedToken.username;

        const purchased = await axios.get(`http://localhost:3000/users/purchasedCourses/${userName}`, {
          headers: {
            'Authorization': webtoken
          }
        });

        console.log('Purchased Courses:', purchased.data);
       
      setPurchasedCourses(purchased.data.purchasedCourses);
      } catch (error) {
        console.error('Error during fetching purchased courses:', error);
      }
    };

    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/courses');
        console.log('Available Courses:', response.data.courses);

        setAvailableCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchPurchasedCourses();
    fetchAvailableCourses();
  }, []);

  
  const getPurchasedCourseDetails = (courseId) => {
    console.log("courseid", courseId);
    const course = availableCourses.find(course => course._id === courseId);
    return course ? `${course.title} - ${course.description}` : '';
  };

  return (
    <div>
      <h2>Purchased Courses</h2>
      <ul>
        {purchasedCourses.map(courseId => (
          <li key={courseId}>
            {getPurchasedCourseDetails(courseId)}
          </li>
        ))}
      </ul>
    </div>
  );
        }  

export default PurchaseCourse;
