let btn = document.querySelector('.record-btn');

btn.addEventListener('click', async function () {
    let stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
    });
    const mimeType = 'video/webm';
    let mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
    });
    let chunks = [];
    mediaRecorder.addEventListener('dataavailable', function (e) {
        chunks.push(e.data);
    });
    mediaRecorder.addEventListener('stop', async function () {
        let blob = new Blob(chunks, {
            type: chunks[0].type
        });
        let recoderData = new Uint8Array(await (blob).arrayBuffer());
        const { createFFmpeg } = FFmpeg;
        let ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'video.webm', recoderData);
        await ffmpeg.run('-i', 'video.webm','-codec', 'copy', 'video.mp4');
        let data = ffmpeg.FS('readFile', 'video.mp4');
        let url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        let video = document.querySelector('video');
        video.src = url;
        let a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        a.click();
    });
    // ! We have to start the recorder manually
    mediaRecorder.start();
});
