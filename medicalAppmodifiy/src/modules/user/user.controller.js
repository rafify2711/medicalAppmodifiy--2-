import { Router } from "express";
import  * as userService from "./services/user.service.js";
import { authentication, authorization, roleTypes } from "../../middleware/auth.middleware.js";
// import { enc } from "crypto-js";
import { endpoint } from "./user.endpoint.js";
import {validation} from "../../middleware/validation.middleware.js"
import * as  validators from "./user.validation.js"


const router = Router()

router.get ('/profile/:userId',authentication(),authorization(endpoint.profile),userService.profile)

router.get ('/profile',validation(validators.shareProfile),authentication(),userService.shareProfile)

router.patch ('/profile',validation(validators.updateProfile),authentication(),authorization(endpoint.profile),userService.updateProfile)

router.patch ('/profile/password',validation(validators.updatePassword),authentication(),authorization(endpoint.profile)
,userService.updatePassword)

router.delete ('/profile',authentication(),authorization(endpoint.profile)
,userService.freezeProfile)




router.post("/", async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.get("/:userId/reservations", authentication(),authorization(endpoint.profile),userService.getAllUserReservations);


export  default  router

