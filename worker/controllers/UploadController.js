// Upload Controller - Handles R2 storage operations
// Uses Cloudflare R2 for file storage

export class UploadController {
  constructor(env) {
    this.r2 = env.R2_BUCKET;
  }

  // Upload single file to R2
  async uploadSingle(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return {
          success: false,
          error: 'No file provided'
        };
      }

      // Generate unique key
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const key = `uploads/${timestamp}-${random}-${file.name}`;

      // Upload to R2
      const object = await this.r2.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type
        },
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          size: file.size.toString()
        }
      });

      // Generate public URL
      const url = `https://assets.qatarpaint.com/${key}`;

      return {
        success: true,
        data: {
          key,
          url,
          size: object.size,
          contentType: object.httpMetadata?.contentType
        },
        message: 'File uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload multiple files to R2
  async uploadMultiple(request) {
    try {
      const formData = await request.formData();
      const files = formData.getAll('files');

      if (!files || files.length === 0) {
        return {
          success: false,
          error: 'No files provided'
        };
      }

      const uploadResults = [];

      for (const file of files) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const key = `uploads/${timestamp}-${random}-${file.name}`;

        const object = await this.r2.put(key, file.stream(), {
          httpMetadata: {
            contentType: file.type
          },
          customMetadata: {
            uploadedAt: new Date().toISOString(),
            originalName: file.name,
            size: file.size.toString()
          }
        });

        uploadResults.push({
          key,
          url: `https://assets.qatarpaint.com/${key}`,
          size: object.size,
          contentType: object.httpMetadata?.contentType
        });
      }

      return {
        success: true,
        data: uploadResults,
        message: `${uploadResults.length} files uploaded successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete file from R2
  async delete(key) {
    try {
      await this.r2.delete(key);

      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file metadata
  async getMetadata(key) {
    try {
      const object = await this.r2.head(key);

      if (!object) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      return {
        success: true,
        data: {
          key: object.key,
          size: object.size,
          uploaded: object.uploaded,
          httpMetadata: object.httpMetadata,
          customMetadata: object.customMetadata
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List files in a directory
  async listFiles(prefix = '', limit = 100) {
    try {
      const objects = await this.r2.list({
        prefix,
        limit
      });

      return {
        success: true,
        data: objects.objects.map(obj => ({
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded,
          httpMetadata: obj.httpMetadata
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get signed URL for private files (if needed in future)
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      // Note: R2 doesn't have native signed URLs yet
      // This would require implementing a custom solution
      // For now, return the public URL
      return {
        success: true,
        data: {
          url: `https://assets.qatarpaint.com/${key}`,
          expiresIn
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
