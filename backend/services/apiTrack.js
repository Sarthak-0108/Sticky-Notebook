import { requestMadeByUser } from "../models/ApiRequest.js";

export const trakcApiRequest = async (
  userId,
  timeStamp,
  userName,
  email,
  password,
  confirmPassword
) => {
  try {
    const log = new requestMadeByUser({
      userId: userId,
      timeStamp: timeStamp,
      userName: userName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    await log.save();
    console.log("successfully user made request counted");
  } catch (error) {
    console.log("fail to count request made by user" + error);
  }
};
