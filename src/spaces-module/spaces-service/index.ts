import * as AWS from 'aws-sdk';
import { Provider } from '@nestjs/common';

// Unique identifier of the service in the dependency injection layer
export const DoSpacesServiceLib = 'lib:do-spaces-service';

// Creation of the value that the provider will always be returning.
// An actual AWS.S3 instance
const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');

const S3 = new AWS.S3({
  endpoint: spacesEndpoint.href,
  credentials: new AWS.Credentials({
    accessKeyId: 'DO00VEU6UGLF9N9DEWMW',
    secretAccessKey: 'HBgpKmKOZToagrXKauxuItJbmG+X+vlKSSoW7tb/LoQ',
  }),
});

// Now comes the provider
export const DoSpacesServiceProvider: Provider<AWS.S3> = {
  provide: DoSpacesServiceLib,
  useValue: S3,
};

// This is just a simple interface that represents an uploaded file object
export interface UploadedMulterFileI {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
