import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  DoSpacesServiceLib,
  DoSpacesServiceProvider,
  UploadedMulterFileI,
} from './index';

// Typical nestJs service
@Injectable()
export class DoSpacesService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  async uploadFile(file: UploadedMulterFileI, shopId, folderName: string = '') {
    // Precaution to avoid having 2 files with the same name
    const fileName = `${Date.now()}-${file.originalname}`;

    const filePath = `${folderName}/${shopId}/${fileName}`;

    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: 'ccldo-rtcu',
          Key: filePath,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve({
              url: `https://ccldo-rtcu.sgp1.digitaloceanspaces.com/${filePath}`,
              fileName: fileName,
            });
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async removeFile(fileName: string) {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: 'ccldo-rtcu',
          Key: fileName,
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(`File ${fileName} deleted successfully`);
          } else {
            console.log(error);
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async renameFolder(folderName, oldFolderName, newFolderName, fileName) {
    const oldFilePath = `${folderName}/${oldFolderName}/${fileName}`;
    const newFilePath = `${folderName}/${newFolderName}/${fileName}`;

    return new Promise((resolve, reject) => {
      // List the objects in the old folder
      this.s3.listObjectsV2(
        {
          Bucket: 'ccldo-rtcu',
          Prefix: `${folderName}/${oldFolderName}/`,
        },
        (error, data) => {
          if (error) {
            console.log(error);
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
            return;
          }

          try {
            // Move a file from the old folder to the new folder
            this.s3
              .copyObject({
                Bucket: 'ccldo-rtcu',
                CopySource: `ccldo-rtcu/${oldFilePath}`,
                Key: newFilePath,
                ACL: 'public-read',
              })
              .promise();

            this.s3
              .deleteObject({
                Bucket: 'ccldo-rtcu',
                Key: oldFilePath,
              })
              .promise();

            return resolve({
              url: `https://ccldo-rtcu.sgp1.digitaloceanspaces.com/${newFilePath}`,
              fileName: fileName,
            });
          } catch (error) {
            console.error(error);
            throw new Error(
              `DoSpacesService_ERROR: ${
                error.message || 'Something went wrong'
              }`,
            );
          }
        },
      );
    });
  }
}
