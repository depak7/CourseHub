const express = require('express');
const app = express();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
app.use(express.json());
const cors=require('cors');
const secret='itsasecretkey';
app.use(cors());
const userschema=new mongoose.Schema({
  username:String,
  password:String,
  purchasedcourse:[{
    type:mongoose.Schema.Types.ObjectId,ref:'course'
  }]
})
const Adminschema=new mongoose.Schema({
  username:String,
  password:String
})
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});
const Admin=mongoose.model('Admin',Adminschema);
const User=mongoose.model('User',userschema);
const Course=mongoose.model('Course',courseSchema);

function authenticate(req,res,next)
{
  const headers=req.headers.authorization;
  console.log(headers);
  if(headers){
  jwt.verify(headers,secret,(err,user)=>
  {
    if(err)
    {
       return res.send("user failed authentication");
    }
    req.user=user;
    next();
  })
}
else{
  res.send("sorry you have no access");
}
}

mongoose.connect("mongodb+srv://deepak:123@cluster0.cxhznrt.mongodb.net/courses");
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    console.log(admin);

    if (admin) {
      return res.status(400).json({
        username: username,
        message: "Already exists"
      });
    } else {
      const newAdmin = new Admin({
        username: username,
        password: password
      });

      await newAdmin.save();

      return res.json({
        message: 'Admin created successfully'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
});


app.post('/admin/login', async (req, res) => {

  const{username,password}=req.body;
  const validation= await Admin.findOne({username:username,password:password});
  if(validation)
  {
    const token=jwt.sign({
      username,role:'admin'
    },secret,{expiresIn:'1h'})
    res.json({
      message:'your token',token
    });
  }
  else
  {
    res.send("No admin present with the username and password");
  }

});

app.post('/admin/courses',authenticate,async (req, res) => {

  const curse=new Course(req.body);
  await curse.save();
  res.send("Course send successfully")
});

app.put('/admin/courses/:courseId', authenticate, async (req, res) => {
  console.log(req.body);
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });

    if (course) {
      res.send("Course updated successfully");
    } else {
      res.status(404).send("Course not found");n
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/users/decode', (req, res) => {
  const token = req.body.token; // Access token from request body
  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  try {
    const decodedToken = jwt.decode(token);
    const username=decodedToken.username;
    console.log(username);
    res.send({ username});
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/admin/courses', authenticate,async (req, res) => {
  const courses=await Course.find({});
  res.json({courses});
});


app.post('/users/signup', (req, res) => {
  const{ username,password}=req.body;
  User.findOne({
    username:username
  }).then(userexists);
  function userexists(user)
  {
    if(user)
    {
      res.send("user already exists")
    }
    else{
      const u={
        username:username,
        password:password
      }
      const saveuser=new User(u);
      saveuser.save();
      res.send("user saved");
    }
  }
});

app.post('/users/login', (req, res) => {
  const{username,password}=req.body;
  const finduser=User.findOne({
    username:username,password:password
  })
  if(finduser)
  {
    const token=jwt.sign({
      username,role:'user'
    },secret,{expiresIn:'1h'});
    res.json({
      message:'your token',token
    });
  }
  else{
    res.send("Something went wrong");
  }

});

app.get('/users/courses',async (req, res) => {
  const courses=await Course.find({});
  res.json({courses});
});


app.post('/users/courses/:courseId', async (req, res) => {
  const courseid=req.params.courseId;

  const course=await Course.findById(courseid);
  
  const user=await User.findOne({username:req.body.username});

  if(user)
  {
    user.purchasedcourse.push(course);
    await user.save();
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.get('/users/purchasedCourses/:user', authenticate, async (req, res) => {
  console.log(req.params.user);
  const user = await User.findOne({ username: req.params.user })
  console.log(user);
  if (user) {
    res.json({ purchasedCourses: user.purchasedcourse || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});
app.listen(3000,()=>
{
    console.log("server started")
})