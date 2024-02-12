export const arrangeFixTranscriptData = (
    transcriptData: any, item: any
) => {
    
    return {
        podcast_id: item.podcast_id,
        episode_id: item.id,
        transcript: transcriptData.transcriptInfo.transcript,
        paragraphs:  JSON.stringify(transcriptData.transcriptInfo.paragraphs),
        words: JSON.stringify(transcriptData.transcriptInfo.words)
    }
}