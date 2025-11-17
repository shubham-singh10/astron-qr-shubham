export interface ILink {
  _id?: string;
  shortCode: string;
  destinationUrl: string;
  qrImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLinkRequest {
  destinationUrl: string;
}

export interface UpdateLinkRequest {
  destinationUrl: string;
}

export interface LinkResponse {
  success: boolean;
  link: ILink;
}

export interface LinksResponse {
  links: ILink[];
}

export interface ErrorResponse {
  error: string;
}