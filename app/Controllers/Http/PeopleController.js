"use strict";

const Database = use("Database");
const { validate } = use("Validator");

class PeopleController {
  async get({ params, response }) {
    console.log("PeopleController -> getAll -> params", params);
    if (params.id) {
      const res = await Database.table("people").where("id", params.id).first();
      if (!res) return response.status(404).send({ error: "no data found" });
      return res;
    }
    return await Database.table("people").select("*");
  }

  async add({ request, response }) {
    try {
      const rules = {
        name: "required",
        age: "required",
      };
      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.status(400).send({ error: "invalid data" });
      }
      await Database.table("people").insert(request.all());
      return { message: "successfuly added!" };
    } catch (error) {
      console.log("PeopleController -> add -> error", error);
      return response.status(500).send({ error: "something went wrong!" });
    }
  }

  async delete({ request, response }) {
    try {
      const rules = {
        id: "required",
      };
      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.status(400).send({ error: "id required" });
      }
      await Database.table("people").where("id", request.all().id).delete();
      return { message: "successfuly deleted!" };
    } catch (error) {
      console.log("PeopleController -> add -> error", error);
      return response.status(500).send({ error: "something went wrong!" });
    }
  }
}

module.exports = PeopleController;
