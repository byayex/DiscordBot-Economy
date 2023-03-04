module.exports = {loadConfig,setConfig}

function loadConfig()
{
    const fs = require('fs');
    var file_content = fs.readFileSync('./config.json');
    return JSON.parse(file_content);
}
function setConfig(new_config)
{
    const fs = require('fs');
    fs.writeFile('./config.json', JSON.stringify(new_config), function writeJSON(err) {
        if (err) return console.log(err);
    });
}