export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    watched: boolean;
    streaming?: {
      US: {
        flatrate?: {
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }[];
      };
    };
  }

export interface User {
  id: string;
  username: string;
}