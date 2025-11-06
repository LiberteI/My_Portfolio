import fetch from 'node-fetch'
export const getVideo = async (req, res) => {
    let response;
    let data;
    try{
        // get api key
        const apiKey = process.env.YT_API_KEY
        // get video id
        const videoID = process.env.VIVA_LA_VIDA_ID
        // get video path
        const YT_URL = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoID}&part=snippet,statistics`
        // get response after fetching
        response = await fetch(YT_URL)
        // get data from response
        data = await response.json()
        
        if(!response.ok){
            // if data exists
            if(data.error){
                throw new Error(data.error.message)
            }
            else{
                throw new Error("YouTube error")
            }
        }

        // const videos = data.items.map((item) => (
        //     {
        //         title: 
        //         date:
        //         thumbnail:
        //         description:
        //     }
        // ))

        // print the whole json string
        res.json({data})
    } catch (error){
        console.error('yt fetch failed: ', error.message, {
            apiKeyPresent: Boolean(process.env.YT_API_KEY),
            videoID: process.env.VIVA_LA_VIDA_ID,
            status: response?.status,
            body: data,
        });
        res.status(500).json({error: 'fail to fetch youtube videos'})
    }
}
