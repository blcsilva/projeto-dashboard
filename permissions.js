const ADMIN_PROFILE = '3';

function isAdmin(profile){
    return profile === ADMIN_PROFILE;
}

module.exports = (request) => {

    const user = request.user;
    if(!user) return false;

    const profile = user.profile;
    const originalUrl = request.originalUrl;
    const method = request.method;//GET, POST, DELETE, etc

    switch(originalUrl){
        case '/': return true;
        case '/users/login': return false;
        case '/users/register': return false;
        case '/admin': return isAdmin(profile);
        default: return false;
        
    }

}