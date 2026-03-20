const axios = require("axios");

async function testSearch() {
    console.log("--- Testing Mentorship Search API ---");
    const testSkills = ["Advanced AI Ethics", "System Resilience", "NonExistentSkill"];

    for (const skill of testSkills) {
        try {
            const res = await axios.get(`http://localhost:5000/api/mentorships?skill=${encodeURIComponent(skill)}`);
            console.log(`Searching for "${skill}": Found ${res.data.data.length} providers.`);
            if (res.data.data.length > 0) {
                console.log(`First Match: "${res.data.data[0].title}" by ${res.data.data[0].providerName}`);
            }
        } catch (err) {
            console.error(`Search failed for "${skill}":`, err.message);
        }
        console.log("");
    }
}

testSearch();
