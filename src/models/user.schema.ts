import mongo from 'mongoose';

const userSchema = new mongo.Schema({
    nxpid: { type: String, required: true },
    nxppw: { type: String, required: true }, // bcrypt 이용한 암호화 필요
    nickname: { type: String, required: true },
    description: { type: String, default: "" },
    associated: { type: String, default: "" },
    mailaddr: { type: String, required: true },
    profilePhoto: { type: String, default: "default.png" }, // 저장된 파일명
    refreshToken: { type: String, default: "" },
});

export default mongo.model('user_data', userSchema);