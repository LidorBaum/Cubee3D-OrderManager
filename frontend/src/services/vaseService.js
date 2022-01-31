import httpService from './httpService';

async function addVase(vaseObj) {
    return await httpService.post('vase', vaseObj);
}
function updateVase(vaseObj) {
    return httpService.put(`vase/edit/${vaseObj._id}`, vaseObj);
}

function getVaseById(vaseId) {
    return httpService.get(`vase/${vaseId}`);
}

function removeVase(vaseId) {
    return httpService.delete(`vase/${vaseId}`);
}

function getAllVases() {
    return httpService.get('vase');
}

export default {
    addVase,
    updateVase,
    getVaseById,
    removeVase,
    getAllVases,
};
