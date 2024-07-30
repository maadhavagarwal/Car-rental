const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(
  'mongodb+srv://amaadhav938:5rc3UFqyzvsqyEqT@cluster0.ovydhlv.mongodb.net/car-rental',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB connected'))
.catch(error => console.error('MongoDB connection error:', error));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}_${Date.now()}`);
  },
});
const upload = multer({ storage });

// Models
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  new_price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  image: { type: String },
  status: { type: Boolean, default: true },
}));

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Please authenticate" });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course:{type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  days: { type: String, required: true },
}));

// Middleware to fetch user from token

// Routes
app.get('/', (req, res) => {
  res.send('Express app is running');
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, isAdmin } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, phone, password: hashedPassword, isAdmin });
    await user.save();

    const data = { user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } };
    const token = jwt.sign(data, 'secret_ecom');
    const id =user._id
    res.json({ success: true, token,id });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const data = { user: { id: user._id } };
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/getUser', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.send({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/rent',async (req, res) => {
  try {
    const { name, email, phone, date, days, id,course,user } = req.body;
    const order = new Order({ name, email, phone, date, days,course,user });
    await order.save();

    // await Product.findByIdAndUpdate(id, { status: true });/
    res.send('Order placed');
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getorder',async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

app.post('/addproduct',upload.single('image'), async (req, res) => {
  try {
    const { name, color, new_price, category, description } = req.body;

    if (!name || !color || !new_price || !category) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const product = new Product({
      name,
      color,
      new_price,
      category,
      description,
      image: req.file ? req.file.filename : undefined,
    });

    await product.save();
    res.json({ success: true, name });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.use('/images', express.static('./upload/images'));

app.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {status}  = req.body;

    const product = await Product.findByIdAndUpdate(id, {status}, { new: true });
    res.status(200).json({product });

   
}
catch(err){
  console.log(err)
}
})
app.listen(port, (error) => {
  if (!error) {
    console.log('Server running');
  } else {
    console.error(error);
  }
});
