const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_BASE_LINK = 'https://purrbot.site/api/img/nsfw/'
const RESPONSE_API_BASE_LINK ='https://purrbot.site/img/nsfw/'
const BASE_DOWNLOAD_DIRECTORY = path.join(__dirname, 'img', 'nsfw');

const axios_instance = axios.create({
    baseURL: API_BASE_LINK,
    method: 'get',
})

//returns a function which will send a get request based on the api_link.
// the api_link is not the full link, but rather the specific genre or type that gets appended to the base api link.
//refer to the purrbot api documentation to see the endpoints.
function get_request(api_link){
    let link = api_link
    return async function(){
        try{
            const response = await axios_instance({
                url: link
            });

            if(response.data.error)
                throw new Error(response.data.message)
            return response.data;
        }
        catch(err){
            console.log(err.message);
        }
    }
}

async function download_image(link){
    let file_name = path.basename(link)
    let generated_path = path.dirname(link.replace(RESPONSE_API_BASE_LINK, ''));

    console.log(generated_path);
    console.log(file_name);

    let download_path = path.join(BASE_DOWNLOAD_DIRECTORY, generated_path);

    fs.mkdirSync(download_path, {
        recursive: true
    });

    const response = await axios_instance({
        url: link,
        responseType: 'stream'
    });
    await write_file(response, download_path, file_name);
}

function write_file(response, download_path, file_name){
    return new Promise((resolve, reject) =>{
        let writeStream = fs.createWriteStream(path.join(download_path, file_name));
        response.data.pipe(writeStream);

        writeStream.on('close', ()=>{
            writeStream.close();
            resolve();
        })

        writeStream.on('error', (err) =>{
            reject(err);
        })
    })
}

async function handle_download(get_request){
    try {
        let data = await get_request();
        await download_image(data.link);
    } catch (error) {
        console.log(error.message)
    }
}

//axios get request functions for specific api endpoints
const fuck_gif = get_request('fuck/gif');
const blowjob_gif = get_request('blowjob/gif');
const nekos_gif = get_request('neko/gif');
const solo_female_gif = get_request('solo/gif')
const cum_gif = get_request('cum/gif')

setInterval(() =>{

    handle_download(fuck_gif);
    handle_download(blowjob_gif);
    handle_download(nekos_gif);
    handle_download(solo_female_gif);
    handle_download(cum_gif);

}, 3000)

