interface User {
    nxpid: String;
    nxppw?: String;
    nickname?: String;
    description?: String;
    associated?: String;
    mailaddr?: String;
    profilePhoto?: String;
    refreshToken: String;
};

export default User;