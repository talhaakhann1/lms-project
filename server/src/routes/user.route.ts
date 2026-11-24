import { Router } from "express";
import { verifyJWT, verifyRoles,getLoggedInUserOrIgnore } from "../middlewares/auth.middleware.js";
import { loginUser, 
    logoutUser,
     refreshAccessToken,
      registerUser,
      changeUserAvatar,
      getCurrentUser,
      getUsers,
      assignRole,
    getAllInstructors,
    updateUserProfile,
    loginWithGoogle,
    loginWithGithub,
     } from "../controllers/user.controller.js";
import { signInSchema, signUpSchema, updateUserProfileSchema } from "../Schemas/user.schema.js";
import { validate } from "../Schemas/validate.js";
import { avatarUpload } from "../middlewares/multer.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router=Router();

router.route('/sign-up').post(authRateLimiter, validate(signUpSchema), registerUser);
router.route('/sign-in').post(authRateLimiter, validate(signInSchema), loginUser);
router.route('/register/google').post(authRateLimiter, loginWithGoogle);
router.route('/register/github').post(authRateLimiter, loginWithGithub);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token')
  .post(authRateLimiter, refreshAccessToken)
  .get(authRateLimiter, refreshAccessToken);
router.route('/change-avatar').patch(verifyJWT, avatarUpload.single("avatar"), changeUserAvatar);
router.route('/get-user').get(getLoggedInUserOrIgnore, getCurrentUser);
router.route('/get-users').get(verifyJWT, verifyRoles(["admin"]), getUsers);
router.route('/get-instructors').get(verifyJWT, verifyRoles(["admin"]), getAllInstructors);
router.route('/update-role/:userId').patch(verifyJWT, verifyRoles(["admin"]), assignRole);
router
  .route("/update-profile")
  .patch(
    verifyJWT,
    avatarUpload.single("avatar"),
    validate(updateUserProfileSchema),
    updateUserProfile
  );

export default router