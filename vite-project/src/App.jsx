import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';

import Login from './components/Login';
import CourseList from './components/CourseList';
import PurchaseCourse from './components/PurchaseCourse';
import './index.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path='/login' element={<Login />}></Route>
        <Route path='/courses' element={<CourseList/>}></Route>
        <Route path="/mycourses" element={<PurchaseCourse />} />

       
      </Routes>
    </Router>
  );
}

export default App;
