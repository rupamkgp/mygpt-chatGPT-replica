import "dotenv/config";

// get response from the nvidia-openai  
const getOpenAIAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${process.env.NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
            model:"openai/gpt-oss-20b",
            messages:[
                {
                    role:"user",
                    content:message
                }
            ]
            
        })
    }


    

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", options);
        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`NVIDIA API returned status ${response.status}: ${errBody}`);
        }
        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid response format received from NVIDIA API");
        }
        return data.choices[0].message.content || "No response content."; 
    } catch(err) {
        console.error("Error in getOpenAIAPIResponse:", err);
        return "Sorry, I am having trouble connecting to the service. Please check the backend logs.";
    }
}

export default getOpenAIAPIResponse;