import httpService from "./httpService";

export default {
  getAllDogs,
  addDog,
  updateDog,
  getDogById,
  removeDog,
  getUserDogs,
};

function getAllDogs() {
  return httpService.get("dog");
}

async function addDog(dogObj) {
  return await httpService.post("dog", dogObj);
}

function updateDog(dogObj) {
  return httpService.put(`dog/edit/${dogObj._id}`, dogObj);
}

function getDogById(dogId) {
  return httpService.get(`dog/${dogId}`);
}

function removeDog(dogId) {
  return httpService.delete(`dog/${dogId}`);
}

function getUserDogs(userId) {
  return httpService.get(`dog/user/${userId}`);
}
