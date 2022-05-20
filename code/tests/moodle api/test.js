var moodle_client = require("moodle-client");

moodle_client.init({
    wwwroot: "https://celene.univ-tours.fr/",
    token: "deca1dc21b0fd5fd67592438a1cbbd00"

}).then(function(client) {
    console.log(client);
    do_something(client);
}).catch(function(err) {
    console.log(err);
});

function do_something(client) {
    return client.call({
        wsfunction: "core_course_get_recent_courses",
        method: "POST",
        args: {}
    }).then(function(info) {
        console.log(info);
        return;
    });
}