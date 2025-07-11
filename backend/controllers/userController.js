import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
     console.log(req.body);
     
    try {
        const user = await userModel.findOne({ email });
   
        if (!user) {
            return res.status(404).json({
                success: false,
                field: 'email',
                message: 'The email address you entered is not registered.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                field: 'password',
                message: 'The password you entered is incorrect.'
            });
        }

        const token = createToken(user._id);
        return res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred. Please try again later.'
        });
    }
};


const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, res) =>{

    console.log(req.body);
    const {name,password,email} = req.body;
    try {

        // checking is user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:'User already exists'})
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:'Please enter a valid email'})
        }

        if(password.length<8){
            return res.json({success:false, message:'Please enter a strong password'})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

      const user =  await newUser.save()
      const token = createToken(user._id)
      res.json({success:true, token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

export {loginUser, registerUser}