declare module "youtube-transcript" {
  export type TranscriptResponse = {
    text: string;
    duration: number;
    offset: number;
  };

  export class YoutubeTranscript {
    static fetchTranscript(
      videoId: string,
      config?: {
        lang?: string;
        country?: string;
      }
    ): Promise<TranscriptResponse[]>;
  }
}
