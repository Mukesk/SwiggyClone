import jwt from "jsonwebtoken";

const generateCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "15d" });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true, // Prevents client-side access (security measure)
    secure: process.env.NODE_ENV === "production", 
    sameSite: "Strict", // Ensures strict cookie usage
  });
};

export default generateCookie;
