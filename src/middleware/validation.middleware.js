import joi from "joi"
import { Types } from "mongoose"



export const validateObjectId = (value , helper) => {
  return Types.ObjectId.isValid(value)? true :helper.message("invalid object id")
};


export const generalFields={
     username:joi.string().alphanum().min(2).max(20),
     email:joi.string().email({minDomainSegments:2, maxDomainSegments:3,tlds:{allow:["com",'net','edu']}}),
     password:joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/)),
     confirmationPassword:joi.string().valid(joi.ref('password')),
     phone:joi.string().pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/)),
     id:joi.string().custom(validateObjectId)
}


export const validation = (schema) => {
    return (req, res, next) => {
      const validationErrors = [];
  
      for (const key of Object.keys(schema)) {
        const validationResult = schema[key].validate(req[key], { abortEarly: false });
  
        if (validationResult.error) {
          validationErrors.push({ key, err: validationResult.error.details });
        }
      }
  
      if (validationErrors.length > 0) {
        return res.status(400).json({ message: "Validation Error", validationErrors });
      }
  
      return next();
    };
  };
  
  
     
