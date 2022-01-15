import httpService from './httpService';

export default {
    addFilament,
    updateFilament,
    getFilamentById,
    removeFilament,
    getAllFilaments,
};

async function addFilament(filamentObj) {
    return await httpService.post('filament', filamentObj);
}
function updateFilament(filamentObj) {
    return httpService.put(`filament/edit/${filamentObj._id}`, filamentObj);
}

function getFilamentById(filamentId) {
    return httpService.get(`filament/${filamentId}`);
}

function removeFilament(filamentId) {
    return httpService.delete(`filament/${filamentId}`);
}

function getAllFilaments() {
    return httpService.get('filament');
}
