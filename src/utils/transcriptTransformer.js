/**
 * Transform AWS Transcribe JSON format to the structure expected by VideoPlayerSidebar
 * @param {Object} rawTranscriptData - The raw AWS Transcribe JSON response
 * @param {number} mergeThresholdSeconds - The time gap threshold in seconds for merging segments (default: 1.0)
 * @returns {Array} - Transformed transcript data with segments
 */
export const transformTranscriptData = (rawTranscriptData, mergeThresholdSeconds = 1.0) => {
  try {
    // Check if raw transcript data exists
    if (!rawTranscriptData || !rawTranscriptData.results || !rawTranscriptData.results.items) {
      return [];
    }
    
    const items = rawTranscriptData.results.items;
    const segments = [];
    let currentSegment = null;
    let segmentId = 1;
    
    items.forEach(item => {
      // Handle punctuation items
      if (item.type === 'punctuation') {
        // If we have a current segment, append this punctuation to it
        if (currentSegment && item.alternatives && item.alternatives.length > 0) {
          currentSegment.text += item.alternatives[0].content;
        }
        return;
      }
      
      // Handle pronunciation items
      if (item.type === 'pronunciation') {
        // Build segments more intelligently by checking the time gap between consecutive items
        // Create a new segment if:
        // 1. There's no current segment (first item)
        // 2. The time gap between the current segment end and this item start is greater than the threshold
        if (!currentSegment ||
            (currentSegment && item.start_time &&
             (parseFloat(item.start_time) - currentSegment.end) > mergeThresholdSeconds)) {
          // Save the current segment if it exists
          if (currentSegment) {
            segments.push(currentSegment);
            segmentId++;
          }
          
          // Create a new segment
          currentSegment = {
            id: segmentId,
            start: parseFloat(item.start_time),
            end: item.end_time ? parseFloat(item.end_time) : parseFloat(item.start_time) + 1,
            text: item.alternatives && item.alternatives.length > 0 ? item.alternatives[0].content : ''
          };
        } else {
          // Append to current segment with a space
          currentSegment.text += ' ';
          if (item.alternatives && item.alternatives.length > 0) {
            currentSegment.text += item.alternatives[0].content;
          }
          
          // Update the end time of the current segment
          if (item.end_time) {
            currentSegment.end = parseFloat(item.end_time);
          }
        }
      }
    });
    
    // Don't forget to add the last segment
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    return segments;
  } catch (err) {
    console.error('Error transforming transcript data:', err);
    return [];
  }
};

export default transformTranscriptData;