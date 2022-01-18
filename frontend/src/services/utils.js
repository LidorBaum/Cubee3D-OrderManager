function isValidPassword(password) {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return password.match(passRegex);
}

const emptyFilamentObj = {
    color: '',
    vendor: '',
    store: '',
    price: '',
    weight: 1000,
};

const emptyVaseObj = {
    name: '',
    type: '',
    sizes: {
        small: {
            height: 0,
            diameter: 0,
            weight: 0,
            printTime: 0,
        },
        medium: {
            height: 0,
            diameter: 0,
            weight: 0,
            printTime: 0,
        },
        large: {
            height: 0,
            diameter: 0,
            weight: 0,
            printTime: 0,
        },
    },
    image: '',
};

const welcomeStores = {
    agua: 'https://res.cloudinary.com/echoshare/image/upload/v1642465658/Cubee3D/61995740_2245317985550489_7473695634269143040_n_pr2m2w.jpg',
};

module.exports = {
    isValidPassword,
    emptyVaseObj,
    emptyFilamentObj,
    welcomeStores,
};
