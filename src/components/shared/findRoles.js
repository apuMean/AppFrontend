
export function isServiceTech() {
    const user = JSON.parse(localStorage.getItem('user'));
    let userRole = [];
    if (user && user.roles.length !== 0) {
        user.roles.map(function (role, index) {
            userRole.push(role.roleName);
        });
    }
    if (userRole.indexOf('Service Tech') > -1 && userRole.indexOf('Admin') > -1) {
        return false;
    }
    else if (userRole.indexOf('Service Tech') > -1) {
        return true;
    }
}




