import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PollyClient, SynthesizeSpeechCommand, VoiceId } from '@aws-sdk/client-polly';
import { PresignedUploadUrlResult } from '../types';

/**
 * ClearCase Media Service
 * Handles voice grievance audio persistence, presigned browser uploads, and
 * regional TTS settlement playback (Amazon Polly / Bedrock wrapper stub).
 */

const getRegion = (): string => process.env.AWS_REGION || 'ap-south-1';
const getBucket = (): string => process.env.AUDIO_BUCKET || 'clearcase-audio';

const isMock = (): boolean =>
  process.env.MOCK_MEDIA === 'true' ||
  process.env.AWS_SAM_LOCAL === 'true' ||
  !process.env.AUDIO_BUCKET;

const s3Client = new S3Client({ region: getRegion() });

const AUDIO_EXTENSIONS: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/wav': 'wav',
  'audio/wave': 'wav',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/flac': 'flac',
};

/**
 * Map an audio MIME type to its file extension for S3 object keys.
 */
export function getAudioExtension(contentType: string): string {
  return AUDIO_EXTENSIONS[contentType] || 'wav';
}

/**
 * Persist an inline base64 voice grievance to the S3 audio bucket.
 * Returns the canonical `s3://` URI stored on the case record.
 */
export async function uploadGrievanceAudio(
  caseId: string,
  base64Audio: string,
  contentType: string = 'audio/webm'
): Promise<string> {
  const cleanId = caseId.replace(/^CASE#/, '');
  const extension = getAudioExtension(contentType);
  const objectKey = `grievances/${cleanId}/original.${extension}`;

  if (isMock()) {
    console.log(
      `[S3 Mock] Grievance audio upload simulated -> s3://${getBucket()}/${objectKey}`
    );
    return `s3://${getBucket()}/${objectKey}`;
  }

  const audioBuffer = Buffer.from(base64Audio, 'base64');
  if (audioBuffer.length === 0) {
    throw new Error('EMPTY_AUDIO: The provided base64 audio payload is empty.');
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: objectKey,
      Body: audioBuffer,
      ContentType: contentType,
    })
  );

  console.log(`[S3] Uploaded grievance audio -> s3://${getBucket()}/${objectKey}`);
  return `s3://${getBucket()}/${objectKey}`;
}

/**
 * Generate a presigned PUT URL allowing the browser/PWA to stream-upload a
 * grievance recording directly to S3. The object key is persisted on the case
 * immediately so the AI pipeline can locate the audio later.
 */
export async function generatePresignedUploadUrl(
  caseId: string,
  contentType: string = 'audio/webm',
  customExtension?: string
): Promise<PresignedUploadUrlResult> {
  const cleanId = caseId.replace(/^CASE#/, '');
  const extension = customExtension || getAudioExtension(contentType);
  const objectKey = `grievances/${cleanId}/original.${extension}`;
  const s3Uri = `s3://${getBucket()}/${objectKey}`;

  if (isMock()) {
    const uploadUrl = `https://mock-presigned-upload.invalid/${encodeURIComponent(objectKey)}`;
    console.log(`[S3 Presign Mock] Upload URL simulated -> ${uploadUrl}`);
    console.log(`[S3 Presign Mock] Object key registered -> ${s3Uri}`);
    return { uploadUrl, objectKey, s3Uri, expiresIn: 3600 };
  }

  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log(`[S3 Presign] Generated presigned PUT URL for ${objectKey}`);

  return { uploadUrl, objectKey, s3Uri, expiresIn: 3600 };
}

const POLLY_VOICES: Record<string, VoiceId> = {
  hindi: 'Kajal',
  bhojpuri: 'Kajal',
  awadhi: 'Kajal',
  haryanvi: 'Aditi',
  maithili: 'Aditi',
  punjabi: 'Aditi',
  default: 'Kajal',
};

/**
 * Synthesize a regional-language settlement audio readback (TTS) and persist to
 * S3. Central stub for the "voice playback" literacy loop from legal.md.
 */
export async function generateSettlementAudio(
  caseId: string,
  settlementText: string,
  dialect: string = 'hindi'
): Promise<string> {
  const cleanId = caseId.replace(/^CASE#/, '');
  const objectKey = `settlements/${cleanId}/settlement.mp3`;
  const s3Uri = `s3://${getBucket()}/${objectKey}`;

  console.log(
    `[TTS: Polly/Bedrock] Synthesizing settlement audio in dialect "${dialect}": "${settlementText.slice(0, 80)}..."`
  );

  if (isMock()) {
    console.log(`[TTS Mock] Settlement audio simulated -> ${s3Uri}`);
    return s3Uri;
  }

  // Live Amazon Polly synthesis (neural female regional voices)
  try {
    const pollyClient = new PollyClient({ region: getRegion() });
    const voiceId = POLLY_VOICES[dialect.toLowerCase()] || POLLY_VOICES.default;

    const synthesis = await pollyClient.send(
      new SynthesizeSpeechCommand({
        OutputFormat: 'mp3',
        Text: settlementText,
        VoiceId: voiceId,
        Engine: 'neural',
      })
    );

    // Defensively consume the audio stream (Blob or Readable)
    const audioStream: any = synthesis.AudioStream;
    const audioBuffer: Buffer =
      typeof audioStream?.transformToByteArray === 'function'
        ? Buffer.from(await audioStream.transformToByteArray())
        : await collectStream(audioStream);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: getBucket(),
        Key: objectKey,
        Body: audioBuffer,
        ContentType: 'audio/mpeg',
      })
    );

    console.log(`[TTS] Settlement audio synthesized and stored -> ${s3Uri}`);
    return s3Uri;
  } catch (error: any) {
    console.warn(
      `[TTS] Live Polly synthesis failed (${error.message}). Falling back to mock S3 URI.`
    );
    return s3Uri;
  }
}

async function collectStream(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}