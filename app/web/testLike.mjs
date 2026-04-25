import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testLike() {
    try {
        console.log('Authenticating...');
        const authData = await pb.collection('users').authWithPassword('test1777044294032@example.com', 'password123');
        
        console.log('Getting video...');
        const videos = await pb.collection('videos').getFullList();
        const video = videos[0];
        
        console.log('Updating video liked state...');
        const record = await pb.collection('videos').update(video.id, { liked: true });
        console.log('Success! Liked:', record.liked);
    } catch (e) {
        console.log('Error updating video:', e.response?.data || e.message);
    }
}

testLike();
