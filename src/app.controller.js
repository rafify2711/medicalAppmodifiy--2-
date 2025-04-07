import express from 'express'
import connectDB from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import reservationController from './modules/reservation/reservation.controller.js'
import doctorController from './modules/doctor/doctor.controller.js'
import cors from "cors"
import covid19Module from "./modules/covid19/covid19.controller.js";
import braintumorModule from './modules/brain-tumor/brain-tumor.controller.js';
import kidneystoneModule from './modules/kidney-stone/kidney-stone.controller.js';
import skincancerModule from './modules/skin-cancer/skin-cancer.controller.js';
import tuberculosisModule from './modules/tuberculosis/tuberculosis.controller.js';
import bonefractureModule from './modules/bone-fracture/bonefracture.controller.js';
import drugInteractions from "./modules/drug-interactions/drugInteractions.controller.js";
import alzheimerModule from './modules/alzheimer/alzheimer.controller.js';
import eye_diseasesModule from './modules/eye_diseases/eye_diseases.controller.js';
import chatModule from './modules/chat/chat.module.js';
// import messageController from './modules/message/message.controller.js'
// import chatbotController from './chatbot/chatbot.controller.js'


const app = express();
const bootstrap = (app, express) => {

app.use(cors())
app.use(express.json())


//let var whitelist = ['http://example1.com', 'http://example2.com']
// let corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
//   }


    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/reservation", reservationController)
    app.use("/doctor", doctorController)
    
    app.use("/api/covid19", covid19Module);
    app.use('/api/braintumor', braintumorModule);
    app.use('/api/kidneystone', kidneystoneModule);
    app.use('/api/skincancer', skincancerModule);
    app.use('/api/tuberculosis', tuberculosisModule);
    app.use('/api/bonefracture', bonefractureModule);
    app.use("/api/drug-interactions", drugInteractions);
    app.use("/api/alzheimer", alzheimerModule);
    app.use("/api/eye-diseases", eye_diseasesModule);
    app.use("/api/chat", chatModule);

    
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing"  })
    })
    
    connectDB()

}

export default bootstrap