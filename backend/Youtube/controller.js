import fetch from 'node-fetch'
export const getVideo = async (req, res) => {
    let response;
    let data;
    try{
        // get api key
        const apiKey = process.env.YT_API_KEY
        // get video ids
        const videoIDs = [
            process.env.VIVA_LA_VIDA_ID,
            process.env.FLOWER_DANCE_ID,
            process.env.DISTANCE_ID,
            process.env.TANGO_ID,
            process.env.PATHETIQUE_2ND_ID,
            
        ].filter(Boolean)

        const idParam = videoIDs.join(',')
        const YT_URL = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${idParam}&part=snippet,statistics`
        // get response after fetching
        response = await fetch(YT_URL)
        // get json snippet from response
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

        let videos = []
        if (Array.isArray(data.items)) {
            videos = data.items.map((item) => {
                let videoId = item.id
                if (item && item.id && typeof item.id === 'object') {
                    if (typeof item.id.videoId === 'string') {
                        videoId = item.id.videoId
                    }
                }

                let title = 'Untitled performance'
                let description = ''
                let publishedAt = null
                let thumbnail = null

                if (item && item.snippet) {
                    if (typeof item.snippet.title === 'string') {
                        title = item.snippet.title
                    }

                    if (typeof item.snippet.description === 'string') {
                        description = item.snippet.description
                    }

                    if (typeof item.snippet.publishedAt === 'string') {
                        publishedAt = item.snippet.publishedAt
                    }

                    if (item.snippet.thumbnails) {
                        const priority = ['maxres', 'standard', 'high', 'medium', 'default']
                        for (const key of priority) {
                            if (
                                item.snippet.thumbnails[key] &&
                                typeof item.snippet.thumbnails[key].url === 'string'
                            ) {
                                thumbnail = item.snippet.thumbnails[key].url
                                break
                            }
                        }
                    }
                }

                return {
                    id: videoId,
                    title,
                    description,
                    publishedAt,
                    thumbnail,
                }
            })
        }

        res.json({ videos })
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
