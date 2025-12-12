const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3001;
const SECRET = "my_super_secret_key";

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

let products = [
  {
    id: 1,
    title: "Filankesov Filankes",
    price: 1300,
    description: "The best enginer in the world!",
    image: "http://localhost:3001/uploads/1755286990636-489792391.jpg",
    isDeletable: false,
    curr: "₼",
  },
  {
    id: 2,
    title: "Beard trimming set",
    price: 30,
    description: "The best set in the world!",
    image: "http://localhost:3001/uploads/1755287014629-108896857.jpg",
    isDeletable: false,
    curr: "₼",
  },
  {
    id: 3,
    title: "Rogmax Robin 4 White And Black 7Fan ARGB + Controll",
    price: 600,
    description: "The best case in the world!",
    image: "http://localhost:3001/uploads/1755287054074-156278289.jpg",
    isDeletable: false,
    curr: "₼",
  },
  {
    id: 4,
    title: "ZotagGaming RTX 5090",
    price: 5000,
    description: "The best graphiccard in the world!",
    image: "http://localhost:3001/uploads/1755287082527-668644023.jpg",
    isDeletable: false,
    curr: "₼",
  },
];
let nextProductId = 5;

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", upload.single("image"), (req, res) => {
  const { title, price, description, isDeletable, curr } = req.body;
  if (!title || price === undefined)
    return res.status(400).json({ error: "Invalid data" });

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice))
    return res.status(400).json({ error: "Price must be a number" });

  const imageUrl = req.file
    ? `http://localhost:${PORT}/uploads/${req.file.filename}`
    : "";

  const newProduct = {
    id: nextProductId++,
    title,
    price: parsedPrice,
    description: description || "",
    image: imageUrl,
    isDeletable:
      isDeletable === "true" || isDeletable === true
        ? true
        : isDeletable === "false" || isDeletable === false
        ? false
        : true,
    curr: curr,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/products/:id", upload.single("image"), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const { title, price, description, isDeletable, curr } = req.body;
  if (!title || price === undefined)
    return res.status(400).json({ error: "Invalid data" });

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice))
    return res.status(400).json({ error: "Price must be a number" });

  const imageUrl = req.file
    ? `http://localhost:${PORT}/uploads/${req.file.filename}`
    : products[index].image;

  products[index] = {
    ...products[index],
    title,
    price: parsedPrice,
    description: description || "",
    image: imageUrl,
    curr: curr,
    isDeletable:
      isDeletable === undefined
        ? products[index].isDeletable
        : isDeletable === "true" || isDeletable === true
        ? true
        : isDeletable === "false" || isDeletable === false
        ? false
        : products[index].isDeletable,
  };

  res.json(products[index]);
});

app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.isDeletable === false)
    return res.status(403).json({ error: "This product cannot be deleted" });

  products = products.filter((p) => p.id !== id);
  res.sendStatus(204);
});

let inCarts = [];
let nextCartId = 1;

app.get("/inCarts", (req, res) => {
  res.json(inCarts);
});

app.post("/inCarts", (req, res) => {
  const { title, price, description, image } = req.body;
  if (!title || price === undefined)
    return res.status(400).json({ error: "Title and Price is required" });

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice))
    return res.status(400).json({ error: "Price must be a number" });

  const newItem = {
    id: nextCartId++,
    title,
    price: parsedPrice,
    description: description || "",
    image: image || "",
  };
  inCarts.push(newItem);
  res.status(201).json(newItem);
});

app.delete("/inCarts/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = inCarts.length;
  inCarts = inCarts.filter((item) => item.id !== id);

  if (inCarts.length === initialLength)
    return res.status(404).json({ error: "Item not found" });
  res.sendStatus(204);
});

let users = [];
let lastUserId = 1;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token not found" });

  jwt.verify(token, SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Token is invalid" });
    req.user = payload;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Running merged server!");
});

app.get("/users", (req, res) => {
  const safe = users.map(({ password, ...rest }) => rest);
  res.json(safe);
});

app.get("/profile", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password, ...safeUser } = user;
  res.json({ message: "Welcome!", user: safeUser });
});

app.post("/users", async (req, res) => {
  const { first_name, password, last_name, companyName, mobile, email } =
    req.body;
  if (!first_name || !password)
    return res.status(400).json({ error: "Name and Password is required" });

  const email_exists = users.find((u) => u.email === email);
  if (email_exists) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: lastUserId++,
    first_name,
    last_name: last_name || "",
    companyName: companyName || "",
    mobile: mobile || "",
    email: email || "",
    password: hashedPassword,
  };

  users.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = users.length;
  users = users.filter((item) => item.id !== id);

  if (users.length === initialLength)
    return res.status(404).json({ error: "Item not found" });
  res.sendStatus(204);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Password is incorrect" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ message: "Login successful", token });
});

app.listen(PORT, () => {
  console.log(`Merged server running at http://localhost:${PORT}`);
});
