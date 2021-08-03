// Agar file ini bisa
require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

// Middleware agar response/request bisa diterima sebagai JSON
app.use(express.json());

const posts = [
  {
    username: "Indra",
    title: "Posts 1",
  },
  {
    username: "Maulana",
    title: "Posts 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  // Mengembalikan data JSON posts diatas
  // res.json(posts);
  //   Mencaro data yang sesuai dengan user yang dimasukkan
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  // Mendapatkan nama username dari data yang dikirimkan pada request
  const username = req.body.username;
  // Membuat object baru berisi key yang bernama 'name' yang disi oleh username yang dikirimkan
  const user = { name: username };

  // Membuat signature dari JWT dari data user.name
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  // Mengembalikan response berupa json yang berisi token JWT
  res.json({ accessToken: accessToken });
});

// Middleware untuk meng-authenticate token JWT
function authenticateToken(req, res, next) {
  // Penasaran isinya apaan xixixixi
  console.log(req.headers);
  // Mengambil Token yang dikirimkan dari header pada headers
  const authHeader = req.headers["authorization"];
  // Mengambil token dari Bearer. Karena authHeader berisi Bearer jzdjkbdchjbsdkjsdaa/TOKEN
  const token = authHeader.split(" ")[1];
  // Jika tidak ada token maka kembalikan status 401
  if (token == null) return res.sendStatus(401);

  // Memverifikasi token yang diterima denngan ACCESS_TOKEN_SECRET yang ada di .env
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Jika error karena expired (misalnya) maka akan mengembalikan 403
    if (err) return res.sendStatus(403);
    // user yang dikirimkan akan diganti dengan user yang sudah disign diatas. in my assumption
    req.user = user;
    // Berhenti mengeksekusi middleware
    next();
  });
}

app.listen(3000);
