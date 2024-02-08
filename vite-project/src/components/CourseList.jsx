
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './course.css';

function CourseList() {
  const [courses, setCourses] = useState([]);
const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/courses');
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
  }, []);

 

  const handlePurchase = async (courseId) => {
    try {
      const webtoken = localStorage.getItem('token');
      const tokenres = await axios.post('http://localhost:3000/users/decode', {
        token: webtoken
      });
      const decodedToken = tokenres.data;
      console.log("Decoded token:", decodedToken); 
      const userName = decodedToken.username;
      console.log("Username:", userName); 
      const response = await axios.post(`http://localhost:3000/users/courses/${courseId}`, {
        username: userName
        
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  };
  return (
    <div>
      <h2 className='course-title'>Available Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <img src={course.imageLink} className='course-image'></img>
            <p className='course-title'>{course.title}</p>
            <p className='course-description'>{course.description}</p>
            
            <button className='course-button' onClick={() => handlePurchase(course._id)}>Buy</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/mycourses')}>My courses</button>
    </div>
  );
}

export default CourseList;
