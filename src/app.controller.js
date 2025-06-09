import express from 'express'
import connectDB from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import reservationController from './modules/reservation/reservation.controller.js'
import doctorController from './modules/doctor/doctor.controller.js'
import cors from "cors"
import covid19Module from "./ai/illnessDetectionModel/covid19/covid19.controller.js";
import braintumorModule from './ai/illnessDetectionModel/brain-tumor/brain-tumor.controller.js';
import kidneystoneModule from './ai/illnessDetectionModel/kidney-stone/kidney-stone.controller.js';
import skincancerModule from './ai/illnessDetectionModel/skin-cancer/skin-cancer.controller.js';
import tuberculosisModule from './ai/illnessDetectionModel/tuberculosis/tuberculosis.controller.js';
import bonefractureModule from './ai/illnessDetectionModel/bone-fracture/bonefracture.controller.js';
import drugInteractions from "./ai/drugInteractionModel/drug-interactions/drugInteractions.controller.js";
import alzheimerModule from './ai/illnessDetectionModel/alzheimer/alzheimer.controller.js';
import eye_diseasesModule from './ai/illnessDetectionModel/eye_diseases/eye_diseases.controller.js';
import chatModule from './utils/chat/chat.module.js';
import path from 'path';
import { fileURLToPath } from 'url';
// import messageController from './modules/message/message.controller.js'
// import chatbotController from './chatbot/chatbot.controller.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Serve static files from the public directory
    app.use('/parse/files', express.static(path.join(__dirname, '../public/files')));
    app.use('/public', express.static(path.join(__dirname, '../public')));

    
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing"  })
    })
    
    connectDB()

}

export default bootstrap