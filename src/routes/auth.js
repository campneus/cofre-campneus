const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/AuthController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Validações
const loginValidation = [
    body("username")
        .notEmpty()
        .withMessage("Nome de usuário é obrigatório")
        .isLength({ min: 3 })
        .withMessage("Nome de usuário deve ter pelo menos 3 caracteres"),
    body("password")
        .notEmpty()
        .withMessage("Senha é obrigatória")
        .isLength({ min: 6 })
        .withMessage("Senha deve ter pelo menos 6 caracteres")
];

const registerValidation = [
    body("username")
        .notEmpty()
        .withMessage("Nome de usuário é obrigatório")
        .isLength({ min: 3, max: 50 })
        .withMessage("Nome de usuário deve ter entre 3 e 50 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Nome de usuário deve conter apenas letras, números e underscore"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Senha deve ter pelo menos 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"),
    body("role")
        .optional()
        .isIn(["administrador", "loja", "analista"])
        .withMessage("Papel deve ser: administrador, loja ou analista")
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Senha atual é obrigatória"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Nova senha deve ter pelo menos 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número")
];

// Rotas públicas
router.post("/login", loginValidation, AuthController.login);

// Rotas protegidas
router.get("/profile", authenticateToken, AuthController.getProfile);
router.post("/change-password", authenticateToken, changePasswordValidation, AuthController.changePassword);

// Rota apenas para administradores
router.post("/register", 
    authenticateToken, 
    authorizeRoles("administrador"), 
    registerValidation, 
    AuthController.register
);

module.exports = router;


