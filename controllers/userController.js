import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

//logik och databas anrop

// Försöker skapa en användare – username, email och password krävs
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Kontrollera att rätt värden skickas med i body
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        message: "Username, email & password måste skickas med i body",
        success: false,
      });
  }
  try {
    //kontrollera om användaren redan finns med den e-postadressen
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          message: "Användare med den epost adressen finns redan",
          success: false,
        });
    }
    //krypterar lösenordet, hash samt saltar med 10
    const hashedPassword = await bcrypt.hash(password, 10);

    //skapar den nya användaren
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });
    // försöker spara användar objektet i databasen
    await newUser.save();
    //returnera användardata (utan lösenord)
    res.status(201).json({
      message: "Användaren skapad!",
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Något gick fel på servern", success: false });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username & password krävs", success: false });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({
          message: "Felaktigt användarnamn eller lösen",
          success: false,
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({
          message: "Felaktigt användarnamn eller lösen",
          success: false,
        });
    }
    // signar jwt token med JWT secret
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      message: "Inloggning lyckades",
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Serverfel vid inloggning", success: false });
  }
};
