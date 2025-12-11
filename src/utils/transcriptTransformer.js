/**
 * Utility function to transform transcript data from API response format
 * to a standardized format used throughout the application.
 * 
 * API Response Format:
 * {
 *   transcriptionSegments: [
 *     {
 *       start_time: number,
 *       end_time: number,
 *       transcript: string
 *     }
 *   ]
 * }
 * 
 * Transformed Format:
 * [
 *   {
 *     id: number,
 *     start: number,
 *     end_time: number,
 *     text: string
 *   }
 * ]
 */

/**
 * Transforms transcript data from API format to application format
 * @param {Object|Array} transcriptData - Raw transcript data from API
 * @returns {Array|null} - Transformed transcript array or null if invalid
 */
export const transformTranscript = (transcriptData) => {
  if (!transcriptData) return null;
  
  // Handle case where transcript is already the transcription array
  if (Array.isArray(transcriptData)) {
    return transcriptData.map((segment, index) => ({
      id: index,
      start: segment.start_time,
      text: segment.transcript,
      end_time: segment.end_time
    }));
  }
  
  // Handle API response format with transcriptionSegments property
  if (transcriptData.transcriptionSegments && Array.isArray(transcriptData.transcriptionSegments)) {
    return transcriptData.transcriptionSegments.map((segment, index) => ({
      id: index,
      start: segment.start_time,
      text: segment.transcript,
      end_time: segment.end_time
    }));
  }
  
  return null;
};

/**
 * Finds the active transcript segment for a given time
 * @param {Array} transcriptSegments - Array of transcript segments
 * @param {number} currentTime - Current time in seconds
 * @returns {Object|null} - Active segment or null if not found
 */
export const findActiveSegment = (transcriptSegments, currentTime) => {
  if (!transcriptSegments || !Array.isArray(transcriptSegments)) return null;
  
  return transcriptSegments.find(segment => {
    // Handle transformed transcript format
    if (segment.id !== undefined && segment.start !== undefined && segment.end_time !== undefined) {
      return currentTime >= segment.start && currentTime <= segment.end_time;
    }
    
    // Handle raw transcript format
    if (segment.start_time !== undefined && segment.end_time !== undefined) {
      return currentTime >= segment.start_time && currentTime <= segment.end_time;
    }
    
    return false;
  });
};