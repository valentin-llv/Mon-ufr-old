var moodle_client = require("moodle-client");

moodle_client.init({
    wwwroot: "https://celene.univ-tours.fr/",
    token: "deca1dc21b0fd5fd67592438a1cbbd00"
}).then(function(client) {
    //console.log(client);
    //getClasses(client);
    getClassInfos(client);
}).catch(function(err) {
    console.log(err);
});

function getClasses(client) {
    return client.call({
        wsfunction: "core_course_get_recent_courses",
        method: "POST",
        args: {}
    }).then(function(info) {
        console.log(info);
    });
}

function getClassInfos(client) {
    return client.call({
        wsfunction: "core_course_get_contents",
        method: "POST",
        args: {
            courseid: 11695,
        }
    }).then(function(info) {
        console.log(info);
        //console.log(info[info.length - 2].modules)

        for(let i = 0; i < info.length; i++) {
            if(info[i].name == "") {

            }
        }
    });
}