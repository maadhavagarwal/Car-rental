const port=4000;
const express=require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const app=express();
const mongoose =require('mongoose');
const jwt=require('jsonwebtoken');
const multer =require("multer");
const cors =require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

//Data Base Connection with mongodb
mongoose.connect("mongodb+srv://amaadhav938:5rc3UFqyzvsqyEqT@cluster0.ovydhlv.mongodb.net/car-rental");
app.get(("/",(req,res)=>{
    res.send("exprees app is runing")
}))
const storage=multer.diskStorage({destination:"./upload/images",
filename:(req,file,cb)=>{
    return cb(null,`${file.originalname}_${Date.now()}`)
}
})
const upload=multer({storage:storage})

//
const Product =mongoose.model("Product",{
    id:{type:Number,required:true},
    name:{type:String,required:true},
    image:{type:String},
color:{type:String,required:true},
new_price:{type:Number,required:true},
description:{type:String},

date:{
    type:Date,
    default:Date.now
},
avilable:{
    type:Boolean,
    default:true,
}
    }
)
//user
const user = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', user);

// Define the Orders schema
// Define the Order schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Change 'user' to 'User' to match the model name
  name: { type: String, required: true },
  image: { type: String, required: true },
  new_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Sample Express endpoint to fetch all products
app.post('/signup',async(req,res)=>{
   
        let cart={};
    for (let i = 0; i < 300; i++) 
        {
            cart[i]=0;
            
        }
        const salt = await bcrypt.genSalt(10);
        hassPassword = await bcrypt.hash(req.body.password, salt);
      
        const user=new User({
            name:req.body.username,
            email:req.body.email,
            password:hassPassword,
            cartData:cart,
        })
      
   
    await user.save();
    const data ={
        user:{
            id:User.id
        }
    }
    const token =jwt.sign(data,'secert_ecom');
    res.json({success:true,token})
})
app.post('/login',async(req,res)=>{
    let user =await User.findOne({email:req.body.email});
    if (user){
        const passcompare= req.body.password === User.password;
        if (passcompare){
            const data ={
                user:{
                    id:User.id
                }
            }
            const token =jwt.sign(data,'secert_ecom');
    res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"no user with this email"});
    }
})
app.get('/allproducts', async (req, res) => {
    try {
      // Await the Product.find() call to get the actual data
      const products = await Product.find({}); // Fetch the list of products
      
      console.log("All products fetched");
  
      // Return the products as a plain array/object, not the Mongoose query itself
      res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  //endpoint
  
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed")
    res.json({
        success:true,

    })
})
//middlerewereconst 
//const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Please authenticate" });
  }

  try {
   
    const data = jwt.verify(token,'secert_ecom'); // Use the secret key for verification
    req.user = data.user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
//
app.get(
    "/getUser",
    fetchUser,
    async (req, res) => {
      try {
        const user = await User.findById(req.user.id)
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.send(user);
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error");
      }
    }
  );
  
app.post('/addtocart',fetchUser,async(req,res)=>{
let userData=await User.findOne({_id:req.user.id});
userData.cartData[req.body.itemId]+=1;
await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
res.send("Added")
})
app.post('/orderdetails', fetchUser, async (req, res) => {
    const { name, image, new_price, quantity, total } = req.body;
  
    try {
      const order = new Order({
        user: req.user.id,
        name,
        image,
        new_price,
        quantity,
        total,
      });
  
      await order.save();
      res.send(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 
   app.get('/orderr',async(req,res)=>{
    let products =await Order.find({});
    res.send(products)
      })
      app.get('/getorder', fetchUser, async (req, res) => {
        try {
          // Fetch orders for the authenticated user
          const orders = await Order.find({ user: req.user.id });
      
          res.json(orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      //
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userData=await User.findOne({_id:req.user.id});
    if( userData.cartData[req.body.itemId]>0)
    {
    userData.cartData[req.body.itemId]-=1;
    await user.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("delete")
    }
})
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData=await User.findOne({_id:req.user.id});
    res.json(userData.cartData)
})
app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({})
   // let id;
    let last_product_array = products.length > 0 ? products.slice(-1) : [];
    let last_product = last_product_array.length > 0 ? last_product_array[0] : null;
    let id = last_product ? last_product.id + 1 : 1;
    
  
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        color:req.body.color,
        new_price:req.body.new_price,
        description:req.body.description,
    });
   
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
    name:req.body.name,
    })
})
app.use('/images',express.static('./upload/images'))
//
app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })

})
app.listen(port,(error)=>{
    if(!error){
        console.log("server running")
    }
    else{
        console.log(error);
    }
}
)