function fixDirectory (output_dir_str) {
    
    // remove unnecessary items
    output_dir_str = output_dir_str.trim();
    output_dir_str = output_dir_str.replace(/\/+/g, "/");
    output_dir_str = output_dir_str.replace(/\/ *$/, "");

    // append 
    output_dir_str = (!/\.nyc_output *$/i.test(output_dir_str)) ? output_dir_str+'/.nyc_output' : output_dir_str;
    
    return output_dir_str;
}

function nowToDateTime()
{
    function pad2(n) {  // always returns a string
        return (n < 10 ? '0' : '') + n;
    }

    var date_obj = new Date();
    return date_obj.getFullYear() + '_' +
           pad2(date_obj.getMonth() + 1) + '_' + 
           pad2(date_obj.getDate()) + '_' +
           pad2(date_obj.getHours()) + '_' +
           pad2(date_obj.getMinutes()) + '_' +
           pad2(date_obj.getSeconds());
}

module.exports = {
    fixDir: fixDirectory,
    now: nowToDateTime
}