import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './course.css';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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
      const userName = decodedToken.username;
      const response = await axios.post(`http://localhost:3000/users/courses/${courseId}`, {
        username: userName
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  };

  return (
    <div className='course-container'>
      <h2 className='course-title'>Available Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
           <div className='course-image' style={{ textAlign: 'center' }}>
    <img src={course.imageLink} alt={course.title} style={{ display: 'block', margin: 'auto' }} />
</div>

            <div className='course-details'>
              <p className='course-title'>{course.title}-{course.description}</p>
             
              <button className='course-button' onClick={() => handlePurchase(course._id)}>Buy</button>
            </div>
          </li>
        ))}
      </ul>
      <button style={{ position: 'absolute',
                 top: '10px',
                 right: '10px',
                 backgroundColor: '#007bff',
                 color: 'white',
                 border: 'none',
                 borderRadius: '5px',
                 cursor: 'pointer' }} onClick={() => navigate('/mycourses')}>My courses</button>


    </div>
  );
}

export default CourseList;
