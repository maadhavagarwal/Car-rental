const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(
  "mongodb+srv://amaadhav938:5rc3UFqyzvsqyEqT@cluster0.ovydhlv.mongodb.net/car-rental",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB connected"))
.catch((error) => console.error("MongoDB connection error:", error));

// Express root route
app.get("/", (req, res) => {
  res.send("Express app is running");
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}_${Date.now()}`);
  },
});
const upload = multer({ storage: storage });

// Product Model
const Product = mongoose.model("Product", {
  name: { type: String, required: true },
  color: { type: String, required: true },
  new_price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  image: { type: String }, // Add this line
  status: { type: String, default: "Available" },
});

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  days: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

// Signup Endpoint
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, isAdmin } = req.body;

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isAdmin,
    });

    // Save the user to the database
    await user.save();

    // Prepare the payload for the JWT
    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };

    // Sign the JWT with the secret key
    const token = jwt.sign(data, "secret_ecom", { expiresIn: "1h" });

    // Respond with the token
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passcompare = await bcrypt.compare(req.body.password, user.password);
      if (passcompare) {
        const data = {
          user: {
            id: user._id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token });
      } else {
        res.json({ success: false, errors: "Wrong password" });
      }
    } else {
      res.json({ success: false, errors: "No user with this email" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Fetch all products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Remove Product
app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Middleware to fetch user from token
const fetchUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
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

// Get user endpoint
app.get("/getUser", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Place a rental order
app.post("/rent", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
      days: req.body.days,
    };
    const order = new Order(data);
    await order.save();
    res.send("Order placed");
    Product.findById(req.body.id, function (err, product) {
      product.status ="booked";
      product.save()
    })
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get orders
app.get("/getorder",  async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add product
// Add product with image upload
app.use("/images", express.static("./upload/images"));

// Upload image
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

app.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    const { name, color, new_price, category, description } = req.body;

    // Validate required fields
    if (!name || !color || !new_price || !category) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // Create a new product instance
    const product = new Product({
      name,
      color,
      new_price,
      category,
      description,
      image: req.file ? req.file.filename : undefined, // Store image filename if provided
    });

    // Save the product to the database
    await product.save();

    // Respond with success
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
// Serve static images

// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running");
  } else {
    console.error(error);
  }
});
