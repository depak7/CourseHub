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
    return course ? (
      <div>
        <img src={course.imageLink} alt={course.title} />
        <p >{course.title}-{course.description}</p>
      </div>
    ) : null;
  };
  
  return (
    <div>
      <h2>Purchased Courses</h2>
      <ul className='course-list'>
        {purchasedCourses.map(courseId => (
          <div className='course-item'>
            {getPurchasedCourseDetails(courseId)}
          </div>
        ))}
      </ul>
    </div>
  );
};
export default PurchaseCourse;
