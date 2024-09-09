
const getSelectProfile = (req, res) => {
    const user = req.user;
    res.render("selectProfile", { profiles: user.profiles });
}

const postSelectProfile = (req, res) => {
    const selectedProfileId = req.body.selectedProfile;
    req.session.selectedProfile = selectedProfileId;
    res.redirect("/api/v1/profile");
}

export {getSelectProfile, postSelectProfile};