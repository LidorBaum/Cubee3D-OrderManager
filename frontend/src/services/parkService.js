import httpService from "./httpService";

export default {
  addPark,
  updatePark,
  getParkById,
  removePark,
  getAllParks,
};

async function addPark(parkObj) {
  return await httpService.post("park", parkObj);
}
function updatePark(parkObj) {
  return httpService.put(`park/edit/${parkObj._id}`, parkObj);
}

function getParkById(parkId) {
  return httpService.get(`park/${parkId}`);
}

function removePark(parkId) {
  return httpService.delete(`park/${parkId}`);
}

function getAllParks() {
  return httpService.get("park");
}
