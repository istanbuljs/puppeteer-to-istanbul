
function generatePath (output_dir_str) {
    var output_path_str,
        path_obj = {}
    ;

    // remove unnecessary items
    output_dir_str = output_dir_str.trim()
    output_dir_str = output_dir_str.replace(/\/+/g, "/")
    output_dir_str = output_dir_str.replace(/\/ *$/, "")

    // append 
    output_dir_str = (/\.nyc_output *$/i.test(output_dir_str)) ? output_dir_str+'/.nyc_output' : output_dir_str

    // create output path
    output_path_str = output_dir_str+'/out.json'
    
    // create output path object
    path_obj['dir'] = output_dir_str
    path_obj['path'] = output_path_str

    return path_obj
  }

  module.exports = {
      genPath: generatePath
  }
  