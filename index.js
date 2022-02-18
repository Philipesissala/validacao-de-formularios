const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "njk");
nunjucks.configure("views", {
  noCache: true,
  autoscape: false,
  express: app,
});

app.use(cookieParser("afhisu"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use(flash());

app.get("/", (req, res) => {
  let emailError = req.flash("emailError");
  let passwordError = req.flash("passwordError");

  let email = req.flash("email");
  let password = req.flash("password");

  emailErrorn =
    emailError == undefined || emailError.length == 0 ? undefined : emailError;
  passwordError =
    passwordError == undefined || passwordError.length == 0
      ? undefined
      : passwordError;

  res.render("index", { emailError, passwordError, email, password });
});

app.post("/form", (req, res) => {
  const { email, password } = req.body;

  let emailError;
  let passwordError;

  if (email == undefined || email == "") {
    emailError = "O email não pode ser vazia";
  }

  if (password == undefined || password == "") {
    passwordError = "A password não pode ser vazia";
  }

  if (password != "" && password.length < 8) {
    passwordError = "A password não pode ter menos de 8 caracteres";
  }

  if (emailError != undefined || passwordError != undefined) {
    req.flash("emailError", emailError);
    req.flash("passwordError", passwordError);

    req.flash("email", email);
    req.flash("password", password);
    res.redirect("/");
  } else {
    res.send("Tudo OK");
  }
});

app.listen(3333, () => {
  console.log("Running...");
});
