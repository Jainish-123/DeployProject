export interface DatabaseConfiguration {
  Id: string;
  userId: string;
  dbInstanceIdentifier: string;
  dbName: string;
  dbEndpoint: string;
  port: number;
  secretArn: string;
}
