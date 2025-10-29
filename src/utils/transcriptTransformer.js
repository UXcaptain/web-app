/**
 * Transform AWS Transcribe JSON format to the structure expected by VideoPlayerSidebar
 * @param {Object} rawTranscriptData - The raw AWS Transcribe JSON response
 * @returns {Array} - Transformed transcript data with segments
 */
export const transformTranscriptData = (rawTranscriptData) => {
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
        // For this implementation, we'll create a new segment for each pronunciation item
        // and then merge segments that are close together to form meaningful sentences
        if (!currentSegment || item.start_time) {
          // If we have a current segment, save it before creating a new one
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
        }
        
        // Update the end time of the current segment
        if (item.end_time) {
          currentSegment.end = parseFloat(item.end_time);
        }
      }
    });
    
    // Don't forget to add the last segment
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    // Post-process segments to group related items together
    // This is a simple approach that groups items within 1 second of each other
    const mergedSegments = [];
    let currentMergedSegment = null;
    
    segments.forEach(segment => {
      if (!currentMergedSegment) {
        currentMergedSegment = { ...segment };
      } else if (segment.start - currentMergedSegment.end <= 1.0) {
        // If this segment starts within 1 second of the previous segment ending, merge them
        currentMergedSegment.text += ' ' + segment.text;
        currentMergedSegment.end = segment.end;
      } else {
        // Otherwise, save the current merged segment and start a new one
        mergedSegments.push(currentMergedSegment);
        currentMergedSegment = { ...segment };
      }
    });
    
    // Add the final merged segment
    if (currentMergedSegment) {
      mergedSegments.push(currentMergedSegment);
    }
    
    return mergedSegments;
  } catch (err) {
    console.error('Error transforming transcript data:', err);
    return [];
  }
};

export default transformTranscriptData;