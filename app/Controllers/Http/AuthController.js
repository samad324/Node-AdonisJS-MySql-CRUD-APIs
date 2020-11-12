"use strict";

const Database = use("Database");
const { validate } = use("Validator");
const User = use("App/Models/User");
class AuthController {
  async register({ request, response }) {
    try {
      const rules = {
        email: "required | email",
        password: "required",
        username: "required",
      };
      const data = request.only(["email", "password", "username"]);
      const validation = await validate(data, rules);
      if (validation.fails()) {
        return response.status(400).send({ error: validation.messages() });
      }
      await User.create(data);
      return { message: "Registered successfully" };
    } catch (error) {
      console.log("AuthController -> register -> error", error);
      return response
        .status(500)
        .send({ error: error.sqlMessage || "something went wrong!" });
    }
  }

  async login({ request, response, auth }) {
    try {
      const data = request.only(["email", "password"]);
      console.log("AuthController -> login -> data", data);
      const { token } = await auth.attempt(data.email, data.password);
      return response.status(200).send({
        message: "Logged in successfuslly!",
        token,
        ...data,
      });
    } catch (error) {
      console.log("AuthController -> login -> error", error);
      return response
        .status(500)
        .send({ error: error.sqlMessage || "something went wrong!" });
    }
  }
}

module.exports = AuthController;
