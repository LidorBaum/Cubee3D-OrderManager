function getTotalVases(selectedVases) {
    return selectedVases.reduce((total, selectedVase) => {
        return selectedVase.quantity + total;
    }, 0);
}

function getTotalPrintTime(selectedVases) {
    // return selectedVases.reduce((total, selectedVase) =>{
        // return selectedVase.printTime
    // })
}

module.exports = {
    getTotalVases,
};
