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
     } from "../controllers/user.controller.js";
import { signInSchema, signUpSchema, updateUserProfileSchema } from "../Schemas/user.schema.js";
import { validate } from "../Schemas/validate.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route('/sign-up').post(validate(signUpSchema),registerUser)
router.route('/sign-in').post(validate(signInSchema),loginUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').get(refreshAccessToken)
router.route('/change-avatar').patch(verifyJWT,upload.single("avatar"),changeUserAvatar)
router.route('/get-user').get(getLoggedInUserOrIgnore,getCurrentUser)
router.route('/get-users').get(verifyJWT,verifyRoles(["admin"]),getUsers)
router.route('/get-instructors').get(verifyJWT,verifyRoles(["admin"]),getAllInstructors)
router.route('/update-role/:userId').patch(verifyJWT,verifyRoles(["admin"]),assignRole)
router
  .route("/update-profile")
  .patch(
    verifyJWT,
    upload.single("avatar"),
    validate(updateUserProfileSchema),
    updateUserProfile
  );

export default router