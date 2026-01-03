import { generateFileName } from "../config/aws.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

class S3Service {
  constructor() {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET environment variable is not defined");
    }
    this.bucket = process.env.AWS_S3_BUCKET;
    this.region = process.env.AWS_REGION;
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendWithRegionRetry(makeCommand) {
    try {
      return await this.client.send(makeCommand());
    } catch (e) {
      if (e?.Code === "PermanentRedirect" && typeof e?.Endpoint === "string") {
        const match = e.Endpoint.match(/s3\.([a-z0-9-]+)\.amazonaws\.com/i);
        const newRegion = match?.[1];
        if (newRegion && newRegion !== this.region) {
          this.region = newRegion;
          this.client = new S3Client({
            region: this.region,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          });
          return await this.client.send(makeCommand());
        }
      }
      throw e;
    }
  }

  async uploadFile(file, folder = "uploads") {
    if (!file || file.size > 1 * 1024 * 1024) {
      throw new ApplicationError("File too large. Max 1MB", 413);
    }
    const fileName = generateFileName(file.originalname);
    const key = `${folder}/${fileName}`;
    try {
      await this.sendWithRegionRetry(() => new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));
    } catch (e) {
      const msg = `S3 upload failed: ${e?.Code || e?.name || "Unknown error"}; bucket=${this.bucket}; region=${this.region}`;
      throw new ApplicationError(msg, 502);
    }
    const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    return {
      url,
      key,
      bucket: this.bucket,
    };
  }

  async deleteFile(key) {
    try {
      await this.sendWithRegionRetry(() => new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
    } catch (e) {
      const msg = `S3 delete failed: ${e?.Code || e?.name || "Unknown error"}; bucket=${this.bucket}; region=${this.region}`;
      throw new ApplicationError(msg, 502);
    }
  }
}
 
const s3Service = new S3Service();
export default s3Service;
