const bcrypt = require("bcryptjs");

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log(`Hashed Password: ${hashedPassword}`);
};

hashPassword("123456");
